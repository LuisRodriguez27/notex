const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Notebooks
  getAllNotebooks: () => ipcRenderer.invoke('notebooks:getAll'),
  getNotebookById: (id) => ipcRenderer.invoke('notebooks:getById', id),
  createNotebook: (notebookData) => ipcRenderer.invoke('notebooks:create', notebookData),
  updateNotebook: (id, notebookData) => ipcRenderer.invoke('notebooks:update', id, notebookData),
  deleteNotebook: (id) => ipcRenderer.invoke('notebooks:delete', id),
  
  // Notes
  getNoteById: (id) => ipcRenderer.invoke('notes:getById', id),
  createNote: (noteData) => ipcRenderer.invoke('notes:create', noteData),
  updateNote: (id, noteData) => ipcRenderer.invoke('notes:update', id, noteData),
  deleteNote: (id) => ipcRenderer.invoke('notes:delete', id)
});
