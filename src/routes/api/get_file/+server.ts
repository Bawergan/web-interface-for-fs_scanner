import { getDatabase, dbName } from '$lib/db.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

type Row = {
	id: number;
	name: string;
	created_at: Date;
	tags: string[];
};
type DbStats = {
	maxId: number;
	minId: number;
};
export async function POST(req) {
	const reqJson = await req.request.json();
	const id = reqJson.id as number;
	const count = reqJson.count as number;

	if (count == 0) {
		const dbData = await getDataFromDb();

		const formData = new FormData();
		formData.append('minId', dbData.minId.toString());
		formData.append('maxId', dbData.maxId.toString());

		return new Response(formData, { status: 201 });
	}

	const paths = await getPathsFromDb(id, count);

	const formData = await assembleFormData(paths);

	return new Response(formData, { status: 201 });
}

async function getDataFromDb() {
	const db = getDatabase();
	let stats: DbStats = { maxId: 0, minId: 0 };
	await new Promise<void>((resolve, reject) => {
		db.serialize(() => {
			db.get(`select MAX(id) as maxId, MIN(id) as minId FROM ${dbName};`, [], (err, row) => {
				if (err) {
					console.error(err.message);
					reject(err);
				} else {
					stats = row as DbStats;
					resolve();
				}
			});
		});
	});
	return stats;
}

async function getPathsFromDb(id: number, count: number) {
	// Open the database
	const db = getDatabase();

	const paths: Row[] = [];
	// Query the database
	await new Promise<void>((resolve, reject) => {
		db.serialize(() => {
			db.each(
				`SELECT * FROM ${dbName} WHERE id >= ${id} LIMIT ${count};`,
				(err, row) => {
					if (err) {
						console.error(err.message);
						reject(err);
					} else {
						const file = row as Row;
						paths.push(file);
					}
				},
				() => {
					// This callback is called after all rows have been processed
					resolve();
				}
			);
		});
	});
	return paths;
}

async function assembleFormData(paths: Row[]) {
	var formData = new FormData();

	const promises = paths.map(async (row) => {
		try {
			console.log(row.created_at)
			const fileFormat = path.extname(row.name);
			const data = await provideBlob(row.name, fileFormat);
			formData.append('file_id', row.id.toString());
			formData.append(row.id.toString() + 'file_name', row.name);
			formData.append(row.id.toString() + 'file_blob', new Blob([data]));
			formData.append(row.id.toString + 'file_format', fileFormat);
		} catch (err) {
			console.error('Error reading file:', err);
		}
	});

	await Promise.all(promises);

	return formData;
}

function provideBlob(filePath: string, fileFormat: string): Promise<Buffer> {
	const FORMATS_FOR_SHARP = ['.jpeg', '.png', '.webp', '.avif', '.gif', '.svg', '.tiff'];

	if (FORMATS_FOR_SHARP.includes(fileFormat)) {
		return sharpImage(filePath);
	} else {
		return readFile(filePath);
	}
}

function sharpImage(filePath: string): Promise<Buffer> {
	return sharp(filePath)
		.resize(80)
		.webp({ quality: 80 })
		.toFormat(sharp.format.webp)
		.toBuffer();
}

async function readFile(filePath: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
