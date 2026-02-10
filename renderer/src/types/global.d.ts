import type { Notebook, Note } from "@/shared/types";


declare global {
	interface Window {
		api: {
			// Notebooks
			getAllNotebooks: () => Promise<Notebook[]>;
			getNotebookById: (id: string) => Promise<Notebook>;
			createNotebook: (notebookData: { title: string }) => Promise<Notebook>;
			updateNotebook: (id: string, notebookData: Partial<{ title: string }>) => Promise<Notebook>;
			deleteNotebook: (id: string) => Promise<{ success: boolean; id: string }>;

			// Notes
			getNoteById: (id: string) => Promise<Note>;
			createNote: (noteData: { notebookId: string; title: string; content?: any }) => Promise<Note>;
			updateNote: (id: string, noteData: Partial<{ title: string; content: any }>) => Promise<Note>;
			deleteNote: (id: string) => Promise<{ success: boolean; id: string }>;
		};
	}
}

export {};