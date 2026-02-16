const noteRepository = require('../repositories/noteRepository');
const attachmentRepository = require('../repositories/attachmentRepository'); // Direct access to repo for findByNoteId
const attachmentService = require('./attachmentService'); // For deleteAttachment
const Note = require('../domain/note');
const { randomUUID } = require('crypto');
const path = require('path');

class NoteService {
	async getAllNotes() {
		try {
			const notes = noteRepository.findAll();
			return notes.map(note => note.toPlainObject());
		} catch (error) {
			console.error('Error fetching notes:', error);
			throw new Error('Failed to fetch notes');
		}
	};

	async getDeletedNotes() {
		try {
			const notes = noteRepository.findDeleted();
			return notes.map(note => note.toPlainObject());
		} catch (error) {
			console.error('Error fetching deleted notes:', error);
			throw new Error('Failed to fetch deleted notes');
		}
	};

	async getNoteById(id) {
		try {
			if (!id) {
				throw new Error('Note ID is required');
			}

			const note = noteRepository.findById(id);

			if (!note) {
				throw new Error('Note not found');
			}

			return note.toPlainObject();
		} catch (error) {
			console.error(`Error fetching note with ID ${id}:`, error);
			throw new Error('Failed to fetch note');
		}
	};

	async searchNotes(query) {
		try {
			const notes = noteRepository.search(query);
			return notes.map(note => note.toPlainObject());
		} catch (error) {
			console.error('Error searching notes:', error);
			throw new Error('Failed to search notes');
		}
	}

	async createNote(noteData) {
		try {
			if (!noteData || !noteData.title || !noteData.notebookId) {
				throw new Error('Note title and notebook ID are required');
			}

			const now = new Date().toISOString();	

			const newNote = new Note({
				id: randomUUID(),
				notebookId: noteData.notebookId,
				title: noteData.title,
				content: noteData.content || '',
				color: noteData.color,
				createdAt: now,
				updatedAt: now,
			});

			const createdNote = noteRepository.create(newNote);
			return createdNote.toPlainObject();

		} catch (error) {
			console.error('Error creating note:', error);
			throw new Error('Failed to create note');
		}
	};

	async updateNote(id, noteData) {
		try {
			if (!id) {
				throw new Error('Note ID is required');
			}

			const existingNote = noteRepository.findById(id);
			if (!existingNote) {
				throw new Error('Note not found');
			}

			const now = new Date().toISOString();

			const updatePayload = {
				title: noteData.title !== undefined ? noteData.title : existingNote.title,
				content: noteData.content !== undefined ? noteData.content : existingNote.content,
				color: noteData.color !== undefined ? noteData.color : existingNote.color,
				updatedAt: now,
			};

			const updatedNote = noteRepository.update(id, updatePayload);

			if (!updatedNote) {
				throw new Error('Failed to update note');
			}

			// Cleanup unreferenced attachments
			try {
				const storedAttachments = attachmentRepository.findByNoteId(id);
				if (storedAttachments && storedAttachments.length > 0) {
					// Use updated content
					let currentContent = updatePayload.content;
					let contentString = '';

					// Convert content to string if it's an object (Tiptap JSON)
					if (typeof currentContent === 'object') {
						contentString = JSON.stringify(currentContent);
					} else {
						contentString = String(currentContent || '');
					}
					
					// Identify referenced paths
					const referencedPaths = new Set();
					
					// Match src="local-resource://..."
					// Note: validation of regex against JSON stringified content need to handle escaped quotes if present
					// JSON: "src":"local-resource://...", or HTML: src="local-resource://..."
					// The simplest regex that catches the URL is usually sufficient
					const regex = /local-resource:\/\/([^"'\\]+)/g;
					let match;
					
					while ((match = regex.exec(contentString)) !== null) {
						try {
							// match[1] is the part after local-resource://
							// decodeURI handles spaces etc.
							let decodedPath = decodeURI(match[1]);
							
							// On Windows, the URL path might start with /C:/... but stored path is C:\...
							// Remove loading slash if present on Windows
							if (process.platform === 'win32' && (decodedPath.startsWith('/') || decodedPath.startsWith('\\'))) {
								// Check if the next char is volume separator (e.g. C:)
								decodedPath = decodedPath.substring(1);
							}
							
							referencedPaths.add(path.normalize(decodedPath));
						} catch (e) {
							console.error("Error parsing path from content", e);
						}
					}

					for (const attachment of storedAttachments) {
						// Normalize stored path to be safe
						const attachmentPath = path.normalize(attachment.path);
						
						// Check if the stored path is in the set of referenced paths
						let isReferenced = false;
						for (const refPath of referencedPaths) {
                            // On Windows, compare case-insensitive and allow for potential slash differences or absolute path variations
							if (process.platform === 'win32') {
								if (refPath.toLowerCase() === attachmentPath.toLowerCase()) {
									isReferenced = true;
									break;
								}
							} else {
								if (refPath === attachmentPath) {
									isReferenced = true;
									break;
								}
							}
						}
                        
                        // Safety check: Scan raw content for the filename. If the filename exists in the content, DO NOT delete.
                        // This prevents accidental deletion due to path parsing errors.
                        if (!isReferenced) {
                            const filename = path.basename(attachment.path);
                            // Search within the stringified content
                            if (contentString.includes(filename)) {
                                isReferenced = true; 
                            }
                        }

						if (!isReferenced) {
							await attachmentService.deleteAttachment(attachment.id);
						}
					}
				}
			} catch (cleanupError) {
				console.error('Error cleaning up attachments:', cleanupError);
				// Do not fail the update if cleanup fails
			}

			const result = updatedNote.toPlainObject();
			if (!result.id) {
				console.error('Updated note is missing ID:', result);
				throw new Error('Updated note is missing ID');
			}

			return result;

		} catch (error) {
			console.error(`Error updating note with ID ${id}:`, error);
			throw new Error('Failed to update note');
		}
	};

	async deleteNote(id) {
		try {
			if (!id) {
				throw new Error('Note ID is required');
			}
			const existingNote = noteRepository.findById(id);
			if (!existingNote) {
				throw new Error('Note not found');
			}

			noteRepository.delete(id);
			return { success: true, id };
		} catch (error) {
			console.error(`Error deleting note with ID ${id}:`, error);
			throw new Error('Failed to delete note');
		}
	}

	async restoreNote(id) {
		try {
			if (!id) {
				throw new Error('Note ID is required');
			}
			return noteRepository.restore(id);
		} catch (error) {
			console.error(`Error restoring note with ID ${id}:`, error);
			throw new Error('Failed to restore note');
		}
	}
}

module.exports = new NoteService();