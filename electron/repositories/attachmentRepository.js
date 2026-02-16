const db = require('../db');
const Atachment = require('../domain/atachment');

class AttachmentRepository {
	findByNoteId(noteId) {
		const stmt = db.prepare(`
			SELECT * FROM attachments
			WHERE noteId = ?
			ORDER BY createdAt DESC
		`);
		const attachments = stmt.all(noteId);
		return attachments.map(attachment => new Atachment(attachment));
	}

	findById(id) {
		const stmt = db.prepare('SELECT * FROM attachments WHERE id = ?');
		const attachment = stmt.get(id);
		return attachment ? new Atachment(attachment) : null;
	}

	create(attachmentData) {
		const stmt = db.prepare(`
			INSERT INTO attachments (id, noteId, type, path, createdAt)
			VALUES (?, ?, ?, ?, ?)
		`);

		stmt.run(
			attachmentData.id,
			attachmentData.noteId,
			attachmentData.type,
			attachmentData.path,
			attachmentData.createdAt
		);

		return new Atachment(attachmentData);
	}

	delete(id) {
		const stmt = db.prepare('DELETE FROM attachments WHERE id = ?');
		const result = stmt.run(id);
		return result.changes > 0;
	}
}

module.exports = new AttachmentRepository();
