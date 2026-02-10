const notebookRepository = require('../repositories/notebookRepository');
const Notebook = require('../domain/notebook');
const { randomUUID } = require('crypto');

class NotebookService {
	async getAllNotebooks() {
		try {
			const notebooks = notebookRepository.findAll();
			return notebooks.map(notebook => notebook.toPlainObject());
		} catch (error) {
			console.error('Error fetching notebooks:', error);
			throw new Error('Failed to fetch notebooks');
		}
	};

	async getNotebookById(id) {
		try {
			if (!id) {
				throw new Error('Notebook ID is required');
			}

			const notebook = notebookRepository.findById(id);

			if (!notebook) {
				throw new Error('Notebook not found');
			}

			return notebook.toPlainObject();
		} catch (error) {
			console.error(`Error fetching notebook with ID ${id}:`, error);
			throw new Error('Failed to fetch notebook');
		}
	};

	async createNotebook(notebookData) {
		try {
			if (!notebookData || !notebookData.title) {
				throw new Error('Notebook title is required');
			}

			const now = new Date().toLocaleString('en-CA', { 
				timeZone: 'America/Mexico_City', 
				hour12: false 
			}).replace(', ', 'T');
			
			const newNotebook = new Notebook({
				id: randomUUID(),
				name: notebookData.title,
				createdAt: now,
				updatedAt: now,
			});

			const createNotebook = notebookRepository.create(newNotebook);
			return createNotebook.toPlainObject();

		} catch (error) {
			console.error('Error creating notebook:', error);
			throw new Error('Failed to create notebook');
		}
	};
	
	async updateNotebook(id, notebookData) {
		try {
			if (!id) {
				throw new Error('Notebook ID is required');
			}

			const existingNotebook = notebookRepository.findById(id);
			if (!existingNotebook) {
				throw new Error('Notebook not found');
			}

			const now = new Date().toLocaleString('en-CA', { 
				timeZone: 'America/Mexico_City', 
				hour12: false 
			}).replace(', ', 'T');

			const updatePayload = {
				name: notebookData.title || existingNotebook.name,
				updatedAt: now
			};

			const updatedNotebook = notebookRepository.update(id, updatePayload);

			if (!updatedNotebook) {
				throw new Error('Failed to update notebook');
			}

			const result = updatedNotebook.toPlainObject();
			if (!result.id) {
				console.error('Updated notebook is missing ID:', result);
				throw new Error('Updated notebook is missing ID');
			}

			return result;

		} catch (error) {
			console.error(`Error updating notebook with ID ${id}:`, error);
			throw new Error('Failed to update notebook');
		}
	};
	
	async deleteNotebook(id) {
		try {
			if (!id) {
				throw new Error('Notebook ID is required');
			}
			const existingNotebook = notebookRepository.findById(id);
			if (!existingNotebook) {
				throw new Error('Notebook not found');
			}

			await notebookRepository.delete(id);
			return { success: true, id };
		} catch (error) {
			console.error(`Error deleting notebook with ID ${id}:`, error);
			throw new Error('Failed to delete notebook');
		}
	};

	async getNotesForNotebook(notebookId) {
		try {
			if (!notebookId) {
				throw new Error('Notebook ID is required');
			}
			const notes = notebookRepository.getNotesForNotebook(notebookId);
			return notes;
		} catch (error) {
			console.error(`Error fetching notes for notebook with ID ${notebookId}:`, error);
			throw new Error('Failed to fetch notes for notebook');
		}
	};
	
}

module.exports = new NotebookService();	
