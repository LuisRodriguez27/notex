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
		return notes.map(note => new Note({
			...note,
			content: this._parseContent(note.content)
		}));
	}

	findDeleted() {
		const stmt = db.prepare(`
			SELECT * FROM notes
			WHERE isDeleted = 1
			ORDER BY createdAt DESC
		`);
		
		const notes = stmt.all();
		return notes.map(note => new Note({
			...note,
			content: this._parseContent(note.content)
		}));
	}

	findById(id) {
		const stmt = db.prepare(`
			SELECT * FROM notes
			WHERE id = ? AND isDeleted = 0
		`).get(id);

		if (!stmt) return null;

		return new Note({
			...stmt,
			content: this._parseContent(stmt.content)
		});
	}

	create(noteData) {
		const transaction = db.transaction(() => {
			const noteStmt = db.prepare(`
				INSERT INTO notes (id, notebookId, title, content, color, createdAt, updatedAt)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`);

			noteStmt.run(
				noteData.id,
				noteData.notebookId,
				noteData.title,
				this._stringifyContent(noteData.content),
				noteData.color || null,
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
		if (noteData.content !== undefined) fieldsToUpdate.content = this._stringifyContent(noteData.content);
		if (noteData.color !== undefined) fieldsToUpdate.color = noteData.color;
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
		const stmt = db.prepare(`
			UPDATE notes
			SET isDeleted = 1
			WHERE id = ?
		`);
		stmt.run(id);
		return true;
	}

	restore(id) {
		const transaction = db.transaction(() => {
			// 1. Obtener la nota para saber a qué libreta pertenece
			const note = db.prepare('SELECT notebookId FROM notes WHERE id = ?').get(id);
			
			if (note) {
				// 2. Restaurar la libreta si está eliminada
				db.prepare(`
					UPDATE notebooks
					SET isDeleted = 0
					WHERE id = ? AND isDeleted = 1
				`).run(note.notebookId);

				// 3. Restaurar la nota
				db.prepare(`
					UPDATE notes
					SET isDeleted = 0
					WHERE id = ?
				`).run(id);
			}
		});

		transaction();
		return true;
	}

	_parseContent(content) {
		try {
			return typeof content === 'string' ? JSON.parse(content) : content;
		} catch (e) {
			console.error('Error parsing note content:', e);
			return {};
		}
	}

	_stringifyContent(content) {
		try {
			return typeof content === 'object' ? JSON.stringify(content) : content;
		} catch (e) {
			console.error('Error stringifying note content:', e);
			return '';
		}
	}

}

module.exports = new NoteRepository();