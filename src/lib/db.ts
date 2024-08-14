import sqlite3 from 'sqlite3';
import path from 'path';

const dbFilePath = `./../store`;
export const dbName = `files`;

let db: sqlite3.Database | null = null;
let lastConnectionTime: number | null = null;
let closeTimer: NodeJS.Timeout | null = null;
const CLOSE_DELAY = 5 * 1000;

export function getDatabase() {
	if (!db) {
		db = new sqlite3.Database(path.join(dbFilePath, dbName), (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.log('Connected to the database.');
			}
		});
	}

	resetCloseTimer();
	return db;
}

function resetCloseTimer() {
	lastConnectionTime = Date.now();

	if (closeTimer) {
		clearTimeout(closeTimer);
	}

	closeTimer = setTimeout(() => {
		closeDatabase();
	}, CLOSE_DELAY);
}

function closeDatabase() {
	if (db) {
		db.close((err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.log('Database connection closed.');
			}
		});
		db = null; // Reset the db variable
		lastConnectionTime = null; // Reset the last connection time
		closeTimer = null; // Reset the timer
	}
}
