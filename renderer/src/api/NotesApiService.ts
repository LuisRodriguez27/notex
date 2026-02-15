import type { Note } from "@/shared/types";

export const NotesApiService = {
	gelAllNotes: async (): Promise<Note[]> => {
		return window.api.getAllNotes();
	},

	getDeletedNotes: async (): Promise<Note[]> => {
		return window.api.getDeletedNotes();
	},

	getNoteById: async (id: string): Promise<Note> => {
		return window.api.getNoteById(id);
	},

	createNote: async (noteData: Partial<Note>): Promise<Note> => {
		return window.api.createNote(noteData);
	},

	updateNote: async (id: string, noteData: Partial<Note>): Promise<Note> => {
		return window.api.updateNote(id, noteData);
	},

	deleteNote: async (id: string): Promise<{ success: boolean; id: string }> => {
		return window.api.deleteNote(id);
	},

	restoreNote: async (id: string): Promise<boolean> => {
		return window.api.restoreNote(id);
	}
};
