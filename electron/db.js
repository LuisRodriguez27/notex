const path = require('path');
const { app, dialog } = require('electron');
const Database = require('better-sqlite3');
const fs = require('fs');
const { log } = require('console');

const dbPath = getDatabasePath();

// Asegurar que el directorio existe (userData ya debería existir, pero por precaución)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

function getDatabasePath() {
	// En modo desarrollo, guarda la base de datos en el directorio del proyecto
	if (!app.isPackaged) {
		const devPath = path.join(_Dirname, '../db/data.db');
		console.log('Database path (dev):', devPath);
		return devPath;
	}

	// En producción, guarda la base de datos en AppData (userData)
	const prodPath = path.join(app.getPath('userData'), 'data.db');
	console.log('Database path (prod):', prodPath);
	return prodPath;
}

db.exec(`
	CREATE TABLE IF NOT EXISTS notebooks (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		createdAt TEXT NOT NULL,
		updatedAt TEXT NOT NULL,
		isDeleted INTEGER NOT NULL DEFAULT 0,
		isSynced INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS notes (
		id TEXT PRIMARY KEY,
		notebookId TEXT NOT NULL,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		createdAt TEXT NOT NULL,
		updatedAt TEXT NOT NULL,
		isDeleted INTEGER NOT NULL DEFAULT 0,
		isSynced INTEGER NOT NULL DEFAULT 0,
		FOREIGN KEY (notebookId) REFERENCES notebooks(id) ON DELETE RESTRICT
	);
	
	CREATE TABLE IF NOT EXISTS note_versions (
		id TEXT PRIMARY KEY,
		noteId TEXT NOT NULL,
		content TEXT NOT NULL,
		createdAt TEXT NOT NULL,
		FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS attachments (
		id TEXT PRIMARY KEY,
		noteId TEXT NOT NULL,
		type TEXT NOT NULL,
		path TEXT NOT NULL,
		createdAt TEXT NOT NULL,
		FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS settings (
		key TEXT PRIMARY KEY,
		value TEXT NOT NULL
	);

	CREATE INDEX IF NOT EXISTS idx_notes_notebook
	ON notes (notebookId);

	CREATE INDEX IF NOT EXISTS idx_notes_updated
	ON notes (updatedAt);

	CREATE INDEX IF NOT EXISTS idx_versions_note 
	ON note_versions (noteId);

	CREATE INDEX IF NOT EXISTS idxAttachments_note 
	ON attachments (noteId);
`);

module.exports = db;