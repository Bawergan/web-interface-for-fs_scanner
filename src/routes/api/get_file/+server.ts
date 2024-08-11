import { getDatabase, dbName } from '$lib/db.js';
import sharp from 'sharp';

type Row = {
    id: number
    name: string
}
export async function POST(req) {
    const reqJson = await req.request.json();
    const id = reqJson.id as number;

    const paths = await getPathsFromDb(id);

    const formData = await assembleFormData(paths);

    return new Response(formData, { status: 201 })
}

async function getPathsFromDb(id: number) {
    // Open the database
    const db = getDatabase()

    const paths: Row[] = [];
    const maxFiles = 4
    // Query the database
    await new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.each(`SELECT * FROM ${dbName} WHERE id >= ${id} LIMIT ${maxFiles};`, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    const file = row as Row;
                    paths.push(file);
                }
            }, () => {
                // This callback is called after all rows have been processed
                resolve();
            });
        });
    });
    return paths
}

async function assembleFormData(paths: Row[]) {
    var formData = new FormData

    const promises = paths.map(async (row) => {
        try {
            const data = await readFileAsBlob(row.name);
            formData.append("file_id", row.id.toString());
            formData.append(row.id.toString() + "file_name", row.name);
            formData.append(row.id.toString() + "file_blob", new Blob([data]));
        } catch (err) {
            console.error('Error reading file:', err);
        }
    });

    await Promise.all(promises);

    return formData
}

function readFileAsBlob(filePath: string): Promise<Buffer> {
    return sharp(filePath)
        .resize(200)
        .webp({ quality: 80 }).toFormat(sharp.format.webp).toBuffer()
}