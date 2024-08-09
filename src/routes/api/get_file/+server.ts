import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbFilePath = `./../store`
const dbName = `files`

export async function POST(req) {
    const reqJson = await req.request.json();
    const id = reqJson.id as number;

    // Open the database
    const db = new sqlite3.Database(path.join(dbFilePath, dbName), (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the database.');
        }
    });
    type Row = {
        id: number
        name: string
    }
    const paths: Row[] = [];
    const maxFiles = 4
    // Query the database
    await new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.each(`SELECT * FROM ${dbName} WHERE id >= ${id} LIMIT ${maxFiles};`, (err, row) => {
                console.log("adasdasd");
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

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Closed the database connection.');
        }
    });

    var formData = new FormData
    paths.forEach(async (row) => {
        await readFileAsBlob(row.name)
            .then(data => {
                formData.append("file_id", row.id.toString())
                formData.append(row.id.toString() + "file_name", row.name)
                formData.append(row.id.toString() + "file_blob", new Blob([data]))
            })
            .catch(err => {
                console.error('Error reading file:', err);
            });
    })

    await new Promise((fulfil) => setTimeout(fulfil, 1000));

    return new Response(formData, { status: 201 })
}

function readFileAsBlob(filePath: string): Promise<Buffer> {
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
