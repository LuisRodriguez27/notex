import type { Notebook } from "@/shared/types";

export const NotebooksApiService = {
	// Notebooks
	getAllNotebooks: async (): Promise<Notebook[]> => {
		return window.api.getAllNotebooks();
	},

	getNotebookById: async (id: string): Promise<Notebook> => {
		return window.api.getNotebookById(id);
	},

	createNotebook: async (notebookData: Partial<Notebook>): Promise<Notebook> => {
		return window.api.createNotebook(notebookData);
	},

	updateNotebook: async (id: string, notebookData: Partial<Notebook>): Promise<Notebook> => {
		return window.api.updateNotebook(id, notebookData);
	},

	deleteNotebook: async (id: string): Promise<{ success: boolean; id: string }> => {
		return window.api.deleteNotebook(id);
	}
};	