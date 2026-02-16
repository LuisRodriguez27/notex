import type { Notebook, Note, Attachment } from "@/shared/types";

declare global {
	interface Window {
		api: {
			// Utilities
			getFilePath: (file: File) => string;

			// Notebooks
			getAllNotebooks: () => Promise<Notebook[]>;
			getDeletedNotebooks: () => Promise<Notebook[]>;
			getNotebookById: (id: string) => Promise<Notebook>;
			createNotebook: (notebookData: Partial<Notebook>) => Promise<Notebook>;
			updateNotebook: (id: string, notebookData: Partial<Notebook>) => Promise<Notebook>;
			deleteNotebook: (id: string) => Promise<{ success: boolean; id: string }>;
			restoreNotebook: (id: string) => Promise<boolean>;

			// Notes
			getAllNotes: () => Promise<Note[]>;
			searchNotes: (query: string) => Promise<Note[]>;
			getDeletedNotes: () => Promise<Note[]>;
			getNoteById: (id: string) => Promise<Note>;
			createNote: (noteData: Partial<Note>) => Promise<Note>;
			updateNote: (id: string, noteData: Partial<Note>) => Promise<Note>;
			deleteNote: (id: string) => Promise<{ success: boolean; id: string }>;
			restoreNote: (id: string) => Promise<boolean>;

			// Attachments
			saveAttachment: (noteId: string, filePath: string) => Promise<Attachment>;
			saveAttachmentFromBuffer: (noteId: string, buffer: ArrayBuffer, fileName: string) => Promise<Attachment>;
			getAttachments: (noteId: string) => Promise<Attachment[]>;
			deleteAttachment: (id: string) => Promise<boolean>;
		};
	}
}

export { };