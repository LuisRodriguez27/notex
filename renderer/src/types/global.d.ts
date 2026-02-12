import type { Notebook, Note } from "@/shared/types";


declare global {
	interface Window {
		api: {
			// Notebooks
			getAllNotebooks: () => Promise<Notebook[]>;
			getNotebookById: (id: string) => Promise<Notebook>;
			createNotebook: (notebookData: Partial<Notebook>) => Promise<Notebook>;
			updateNotebook: (id: string, notebookData: Partial<Notebook>) => Promise<Notebook>;
			deleteNotebook: (id: string) => Promise<{ success: boolean; id: string }>;

			// Notes
			getNoteById: (id: string) => Promise<Note>;
			createNote: (noteData: Partial<Note>) => Promise<Note>;
			updateNote: (id: string, noteData: Partial<Note>) => Promise<Note>;
			deleteNote: (id: string) => Promise<{ success: boolean; id: string }>;
		};
	}
}

export { };