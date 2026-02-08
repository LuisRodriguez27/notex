export interface Notebook {
  id: string;
  name: string;
  createdAt: string;
}

export interface NoteContent {
  type?: string;
  content?: any[];
}

export interface Note {
  id: string;
  notebookId: string; 
  title: string;
  content: NoteContent; 
  createdAt: string;
  updatedAt: string;
}
