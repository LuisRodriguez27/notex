const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Notebooks
  getAllNotebooks: () => ipcRenderer.invoke('notebooks:getAll'),
  getDeletedNotebooks: () => ipcRenderer.invoke('notebooks:getDeleted'),
  getNotebookById: (id) => ipcRenderer.invoke('notebooks:getById', id),
  createNotebook: (notebookData) => ipcRenderer.invoke('notebooks:create', notebookData),
  updateNotebook: (id, notebookData) => ipcRenderer.invoke('notebooks:update', id, notebookData),
  deleteNotebook: (id) => ipcRenderer.invoke('notebooks:delete', id),
  restoreNotebook: (id) => ipcRenderer.invoke('notebooks:restore', id),
  
  // Notes
  getAllNotes: () => ipcRenderer.invoke('notes:getAll'),
  getNoteById: (id) => ipcRenderer.invoke('notes:getById', id),
  getDeletedNotes: () => ipcRenderer.invoke('notes:getDeleted'),
  createNote: (noteData) => ipcRenderer.invoke('notes:create', noteData),
  updateNote: (id, noteData) => ipcRenderer.invoke('notes:update', id, noteData),
  deleteNote: (id) => ipcRenderer.invoke('notes:delete', id),
  restoreNote: (id) => ipcRenderer.invoke('notes:restore', id)
});
