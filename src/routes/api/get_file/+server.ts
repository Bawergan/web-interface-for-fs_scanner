import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbFilePath = `./../store`
const dbName = `files`

export async function GET() {
    // Open the database
    const db = new sqlite3.Database(path.join(dbFilePath, dbName), (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the database.');
        }
    });

    const paths: string[] = [];

    // Query the database
    await new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.each(`SELECT * FROM ${dbName}`, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    const file = row as { name: string }; // Adjust the type as needed
                    const name = file.name;
                    console.log(name);
                    paths.push(name);
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

    var buffer: Buffer
    var blob = new Blob()
    await readFileAsBlob(paths[0])
    .then(data => {
        buffer = data;
        blob = new Blob([buffer]);
    })
    .catch(err => {
        console.error('Error reading file:', err);
    });
    
    
    var formData = new FormData
    formData.append("file_name", paths[0])
    formData.append("file_blob", blob)

    await new Promise((fulfil) => setTimeout(fulfil, 1000));

    return new Response(formData, {status: 201})
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
