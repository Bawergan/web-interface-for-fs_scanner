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

async function fetchMessage(id: number, count: number) {
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
		files.push(file);
	});

	return files;
}

export async function getFiles(id: number, count: number) {
	const files = (await fetchMessage(id, count)) as FileCustom[];

	files.forEach((file) => {
		if (file.blob) {
			file.imageUrl = URL.createObjectURL(file.blob);
		}
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

var batchSize = 0;
export const dbSettings = writable({ batchSize: 10 } as DbSettings);
dbSettings.subscribe((v) => {
	batchSize = v.batchSize;
});

let filePromises: Promise<FileCustom[]>[] = Array(3).fill(Promise.resolve([]));
let page = 0;
var minId = 0;
var maxId = 0;

async function getNextBatch() {
	if ((page + 1) * batchSize + +minId > maxId) {
		return filePromises[1];
	}
	page += 1;

	filePromises[0] = filePromises[1];
	filePromises[1] = filePromises[2];

	if ((page + 1) * batchSize + +minId < maxId) {
		filePromises[2] = getFiles((page + 1) * batchSize + +minId, batchSize);
	}

	return filePromises[1];
}

async function getPrevBatch() {
	if (page <= 0) {
		return filePromises[1];
	}
	page -= 1;

	filePromises[2] = filePromises[1];
	filePromises[1] = filePromises[0];
	filePromises[0] = getFiles((page - 1) * batchSize + +minId, batchSize);

	return filePromises[1];
}

async function setFiles() {
	page = 0;

	filePromises[1] = getFiles(page * batchSize + +minId, batchSize);
	filePromises[2] = getFiles((page + 1) * batchSize + +minId, batchSize);

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
		init: async (newBatchSize: number) => {
			dbSettings.set({ batchSize: newBatchSize });

			set(setFiles());
		}
	};
}

export const files = createFiles();
