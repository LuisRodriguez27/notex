const db = require('../db');
const Notebook = require('../domain/notebook');

class NotebookRepository {
	findAll() {
		const stmt = db.prepare(`
			SELECT * FROM notebooks
			WHERE isDeleted = 0
			ORDER BY createdAt DESC
		`);

		const notebooks = stmt.all();
		return notebooks.map(notebook => {
			const notebookNotes = this.getNotesForNotebook(notebook.id);
			return new Notebook({
				...notebook,
				notebookNotes
			});
		});
	}

	findDeleted() {
		const stmt = db.prepare(`
			SELECT * FROM notebooks
			WHERE isDeleted = 1
			ORDER BY createdAt DESC
		`);

		const notebooks = stmt.all();
		return notebooks.map(notebook => {
			const notebookNotes = this.getNotesForNotebook(notebook.id);
			return new Notebook({
				...notebook,
				notebookNotes
			});
		});
	}

	findById(id) {
		const stmt = db.prepare(`
			SELECT * FROM notebooks
			WHERE id = ? AND isDeleted = 0
		`).get(id);
		
		if (!stmt) return null;

		const notebookNotes = this.getNotesForNotebook(id);

		return new Notebook({
			...stmt,
			notebookNotes
		});
	}	

	create(notebookData) {
		const transaction = db.transaction(() => {
			const notebookStmt = db.prepare(`
				INSERT INTO notebooks (id, name, color, createdAt, updatedAt)
				VALUES (?, ?, ?, ?, ?)
			`);

			notebookStmt.run(
				notebookData.id,
				notebookData.name,
				notebookData.color || null,
				notebookData.createdAt,
				notebookData.updatedAt
			);

			return notebookData.id;
		});	

		const notebookId = transaction();
		return this.findById(notebookId);
	}
	
	update(id, notebookData) {
		const existingNotebook = this.findById(id);
		if (!existingNotebook) {
			throw new Error('Notebook not found');
		}

		const fieldsToUpdate = {};
		if (notebookData.name !== undefined) fieldsToUpdate.name = notebookData.name;
		if (notebookData.color !== undefined) fieldsToUpdate.color = notebookData.color;
		if (notebookData.updatedAt !== undefined) fieldsToUpdate.updatedAt = notebookData.updatedAt;

		const fieldEntries = Object.entries(fieldsToUpdate);
		
		if (fieldEntries.length > 0) {
			const setClause = fieldEntries.map(([key]) => `${key} = ?`).join(', ');
			const values = fieldEntries.map(([, value]) => value);

			const stmt = db.prepare(`
				UPDATE notebooks
				SET ${setClause}
				WHERE id = ? AND isDeleted = 0
			`);
			
			stmt.run(...values, id);
		}	

		return this.findById(id);
	}	

	delete(id) {
		const transaction = db.transaction(() => {
			// Marcar la libreta como eliminada
			db.prepare(`
				UPDATE notebooks
				SET isDeleted = 1
				WHERE id = ?
			`).run(id);

			// Marcar todas sus notas como eliminadas
			db.prepare(`
				UPDATE notes
				SET isDeleted = 1
				WHERE notebookId = ?
			`).run(id);
		});

		transaction();
		return true;
	}

	restore(id) {
		const transaction = db.transaction(() => {
			// Restaurar la libreta
			db.prepare(`
				UPDATE notebooks
				SET isDeleted = 0
				WHERE id = ?
			`).run(id);

			// Restaurar todas sus notas
			db.prepare(`
				UPDATE notes
				SET isDeleted = 0
				WHERE notebookId = ?
			`).run(id);
		});

		transaction();
		return true;
	}

	getNotesForNotebook(notebookId) {
		const stmt = db.prepare(`
			SELECT * FROM notes
			WHERE notebookId = ? AND isDeleted = 0
			ORDER BY createdAt DESC
		`);

		const notes = stmt.all(notebookId);
		return notes.map(note => ({
			...note,
			content: this._parseContent(note.content)
		}));
	}
	
	_parseContent(content) {
		try {
			return typeof content === 'string' ? JSON.parse(content) : content;
		} catch (e) {
			return {};
		}
	}

}	

module.exports = new NotebookRepository();