const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const attachmentRepository = require('../repositories/attachmentRepository');
const Atachment = require('../domain/atachment');

class AttachmentService {
	constructor() {
		this.storagePath = this._getStoragePath();
		this._ensureStorageExists();
	}

	_getStoragePath() {
		if (!app.isPackaged) {
			// In development, __dirname is .../electron/services
			// We want to reach .../db/uploads (sibling to electron folder, assuming standard structure)
			// db.js uses path.join(__dirname, '../db/data.db') from electron/ folder
			// So from electron/services, we need ../../db/uploads
			return path.join(__dirname, '../../db/uploads');
		}
		return path.join(app.getPath('userData'), 'uploads');
	}

	_ensureStorageExists() {
		if (!fs.existsSync(this.storagePath)) {
			fs.mkdirSync(this.storagePath, { recursive: true });
		}
	}

	async saveImage(noteId, filePath) {
		if (!noteId || !filePath) {
			throw new Error('Note ID and file path are required');
		}

		if (!fs.existsSync(filePath)) {
			throw new Error('File does not exist');
		}

		const ext = path.extname(filePath);
		const filename = `${randomUUID()}${ext}`;
		const destinationPath = path.join(this.storagePath, filename);

		// Copy file to storage
		fs.copyFileSync(filePath, destinationPath);

		// Create attachment record
		const attachmentId = randomUUID();
		const now = new Date().toISOString();

		const attachmentData = {
			id: attachmentId,
			noteId: noteId,
			type: 'image',
			path: destinationPath,
			createdAt: now
		};

		const attachment = attachmentRepository.create(attachmentData);
		return attachment.toPlainObject();
	}

	async saveImageFromBuffer(noteId, buffer, originalName) {
		if (!noteId || !buffer) {
			throw new Error('Note ID and buffer are required');
		}

		// Determine extension from original name, default to .png if not provided
		let ext = '.png';
		if (originalName) {
			const parsedExt = path.extname(originalName);
			if (parsedExt) ext = parsedExt;
		}

		const filename = `${randomUUID()}${ext}`;
		const destinationPath = path.join(this.storagePath, filename);

		// Write buffer to storage
		fs.writeFileSync(destinationPath, Buffer.from(buffer));

		// Create attachment record
		const attachmentId = randomUUID();
		const now = new Date().toISOString();

		const attachmentData = {
			id: attachmentId,
			noteId: noteId,
			type: 'image',
			path: destinationPath,
			createdAt: now
		};

		const attachment = attachmentRepository.create(attachmentData);
		return attachment.toPlainObject();
	}

	async getAttachments(noteId) {
		if (!noteId) {
			throw new Error('Note ID is required');
		}
		const attachments = attachmentRepository.findByNoteId(noteId);
		return attachments.map(att => att.toPlainObject());
	}

	async deleteAttachment(id) {
		if (!id) {
			throw new Error('Attachment ID is required');
		}

		const attachment = attachmentRepository.findById(id);
		if (!attachment) {
			return false;
		}

		try {
			if (fs.existsSync(attachment.path)) {
				fs.unlinkSync(attachment.path);
			}
		} catch (error) {
			console.error(`Error deleting file for attachment ${id}:`, error);
			// Continue to delete the record even if file deletion fails
		}

		return attachmentRepository.delete(id);
	}
}

module.exports = new AttachmentService();
