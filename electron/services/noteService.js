const noteRepository = require('../repositories/noteRepository');
const Note = require('../domain/note');
const { randomUUID } = require('crypto');

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

	async createNote(noteData) {
		try {
			if (!noteData || !noteData.title || !noteData.notebookId) {
				throw new Error('Note title and notebook ID are required');
			}

			const now = new Date().toLocaleString('en-CA', { 
				timeZone: 'America/Mexico_City', 
				hour12: false 
			}).replace(', ', 'T');	

			const newNote = new Note({
				id: randomUUID(),
				notebookId: noteData.notebookId,
				title: noteData.title,
				content: noteData.content || '',
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

			const now = new Date().toLocaleString('en-CA', { 
				timeZone: 'America/Mexico_City', 
				hour12: false 
			}).replace(', ', 'T');

			const updatePayload = {
				title: noteData.title !== undefined ? noteData.title : existingNote.title,
				content: noteData.content !== undefined ? noteData.content : existingNote.content,
				updatedAt: now,
			};

			const updatedNote = noteRepository.update(id, updatePayload);

			if (!updatedNote) {
				throw new Error('Failed to update note');
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
		} catch (error) {
			console.error(`Error deleting note with ID ${id}:`, error);
			throw new Error('Failed to delete note');
		}
	}
}

module.exports = new NoteService();