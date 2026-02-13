export interface NoteContent {
  type?: string;
  content?: any[];
}

export interface Note {
  id: string;
  notebookId: string; 
  title: string;
  content: NoteContent; 
  color?: string | null;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: number;
  isSynced?: number;
}

export interface Notebook {
  id: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: number;
  isSynced?: number;
  notebookNotes?: Note[];
}
