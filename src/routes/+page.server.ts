import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbFilePath = `./../store`
const dbName = `files`


export async function load() {
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

    // Fetch image data
    const imageData = await Promise.all(paths.map(async (path) => {
        const filePath = path;
        try {
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');
            console.log(base64Image.length);

            return `data:image/jpeg;base64,${base64Image}`; // Adjust the MIME type as needed
        } catch (error) {
            console.error('Error reading image file:', error);
            return null; // Return null if there's an error
        }
    }));
    
    // Filter out any null values (in case of errors)
    const validImageData = imageData.filter((data) => data !== null);
    return {
        summaries: validImageData.map((data, index) => ({
            path: paths[index], // Keep the original path if needed
            imageData: data,
        }))
    };
}