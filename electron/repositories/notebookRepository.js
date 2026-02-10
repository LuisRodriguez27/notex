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
				INSERT INTO notebooks (id, name, createdAt, updatedAt)
				VALUES (?, ?, ?, ?)
			`);

			notebookStmt.run(
				notebookData.id,
				notebookData.name,
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
		const stmt = db.prepare(`
			UPDATE notebooks
			SET isDeleted = 1
			WHERE id = ?
		`);
		stmt.run(id);
		return true;
	}

	getNotesForNotebook(notebookId) {
		const stmt = db.prepare(`
			SELECT * FROM notes
			WHERE notebookId = ? AND isDeleted = 0
			ORDER BY createdAt DESC
		`);

		return stmt.all(notebookId);
	}	

}	

module.exports = new NotebookRepository();