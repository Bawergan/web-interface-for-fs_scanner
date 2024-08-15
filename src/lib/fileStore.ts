import { FORMATS_FOR_SHARP } from '$lib';
import { writable } from 'svelte/store';

export type FileCustom = {
	id: number;
	name: string;
	format: string;
	blob: Blob;
	imageUrl: string;
};
export type DbSettings = {
	batchSize: number;
};
async function getFiles(id: number, count: number) {
	const response = await fetch('/api/get_file', {
		method: 'POST',
		body: JSON.stringify({ id, count })
	});

	const data = await response.formData();
	const files: FileCustom[] = [];
	const fileIds = data.getAll('file_id');

	if (fileIds.length === 0) {
		return files;
	}

	fileIds.map((fileId) => {
		const id = fileId as unknown as number;
		const name = data.get(id + 'file_name') as string;
		const format = data.get(id + 'file_format') as string;
		const blob = data.get(id + 'file_blob') as Blob;

		const file: FileCustom = {
			id: fileId as unknown as number,
			name: name,
			blob: blob,
			format: format,
			imageUrl: ''
		};
		if (FORMATS_FOR_SHARP.includes(format) && blob) {
			file.imageUrl = URL.createObjectURL(blob);
		}
		files.push(file);
	});

	return files;
}

export async function getDbStat() {
	const id = -1;
	const count = 0;

	const response = await fetch('/api/get_file', {
		method: 'POST',
		body: JSON.stringify({ id, count })
	});

	const data = await response.formData();

	const sMinId = data.get('minId');
	const sMaxId = data.get('maxId');

	if (sMinId != null) {
		minId = sMinId as unknown as number;
	}
	if (sMaxId != null) {
		maxId = sMaxId as unknown as number;
	}
}
var currentMinIdSub = 0;
export const currentMinId = writable(0);
currentMinId.subscribe((v) => {
	currentMinIdSub = v;
});

var batchSize = 0;
var isInited = false;
export const dbSettings = writable({ batchSize: 10 } as DbSettings);
dbSettings.subscribe((v) => {
	batchSize = v.batchSize;
	if (isInited) {
		startingPoint = currentMinIdSub;
		filePromises[0] = getFiles((page - 1) * batchSize + +startingPoint, batchSize);
		filePromises[2] = getFiles((page + 1) * batchSize + +startingPoint, batchSize);
	}
});

let filePromises: Promise<FileCustom[]>[] = Array(3).fill(Promise.resolve([]));
let page = 0;
var minId = 0;
var maxId = 0;
var startingPoint = 0;

async function getNextBatch() {
	if ((page + 1) * batchSize + +startingPoint > maxId) {
		return filePromises[1];
	}
	page += 1;

	filePromises[0] = filePromises[1];
	filePromises[1] = filePromises[2];

	if ((page + 1) * batchSize + +startingPoint < maxId) {
		filePromises[2] = getFiles((page + 1) * batchSize + +startingPoint, batchSize);
	}

	return filePromises[1];
}

async function getPrevBatch() {
	if ((page - 1) * batchSize + +startingPoint < minId) {
		return filePromises[1];
	}
	page -= 1;

	filePromises[2] = filePromises[1];
	filePromises[1] = filePromises[0];
	
	if ((page - 1) * batchSize + +startingPoint >= minId) {
		filePromises[0] = getFiles((page - 1) * batchSize + +startingPoint, batchSize);
	}

	return filePromises[1];
}

async function setFiles() {
	isInited = true;
	startingPoint = minId;

	page = 0;

	filePromises[1] = getFiles(page * batchSize + +startingPoint, batchSize);
	filePromises[2] = getFiles((page + 1) * batchSize + +startingPoint, batchSize);

	return filePromises[1];
}

function createFiles() {
	const { subscribe, set } = writable();
	return {
		subscribe,
		next: async () => {
			set(getNextBatch());
		},
		prev: async () => {
			set(getPrevBatch());
		},
		init: async () => {
			set(setFiles());
		}
	};
}

export const files = createFiles();
