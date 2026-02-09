const db = require('../db');
const Note = require('../domain/note');

class NoteRepository {
	findAll() {
		const stmt = db.prepare(`
			SELECT * FROM notes
			WHERE isDeleted = 0
			ORDER BY createdAt DESC
		`);
		const notes = stmt.all();
		return notes.map(note => new Note(note));
	}

	findById(id) {
		const stmt = db.prepare(`
			SELECT * FROM notes
			WHERE id = ? AND isDeleted = 0
		`).get(id);

		if (!stmt) return null;

		return new Note(stmt);
	}

	create(noteData) {
		const transaction = db.transaction(() => {
			const noteStmt = db.prepare(`
				INSERT INTO notes (id, notebookId, title, content, createdAt, updatedAt)
				VALUES (?, ?, ?, ?, ?, ?)
			`);

			noteStmt.run(
				noteData.id,
				noteData.notebookId,
				noteData.title,
				noteData.content,
				noteData.createdAt,
				noteData.updatedAt
			);

			return noteData.id;
		});

		const noteId = transaction();
		return this.findById(noteId);
	}

	update(id, noteData) {
		const existingNote = this.findById(id);
		if (!existingNote) {
			throw new Error('Note not found');
		}

		const fieldsToUpdate = {};
		if (noteData.title !== undefined) fieldsToUpdate.title = noteData.title;
		if (noteData.content !== undefined) fieldsToUpdate.content = noteData.content;
		if (noteData.updatedAt !== undefined) fieldsToUpdate.updatedAt = noteData.updatedAt;

		const fieldEntries = Object.entries(fieldsToUpdate);

		if (fieldEntries.length > 0) {
			const setClause = fieldEntries.map(([key]) => `${key} = ?`).join(', ');
			const values = fieldEntries.map(([, value]) => value);

			const stmt = db.prepare(`
				UPDATE notes
				SET ${setClause}
				WHERE id = ? AND isDeleted = 0
			`);

			stmt.run(...values, id);
		}

		return this.findById(id);
	}

	delete(id) {

	}	

}

module.exports = NoteRepository;