import type { Note } from "@/shared/types";

export const NotesApiService = {
getNoteById: async (id: string): Promise<Note> => {
return window.api.getNoteById(id);
},

createNote: async (noteData: { notebookId: string; title: string; content?: any }): Promise<Note> => {
return window.api.createNote(noteData);
},

updateNote: async (id: string, noteData: Partial<{ title: string; content: any }>): Promise<Note> => {
return window.api.updateNote(id, noteData);
},

deleteNote: async (id: string): Promise<{ success: boolean; id: string }> => {
return window.api.deleteNote(id);
}
};
