const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Utilities
  getFilePath: (file) => {
    if (webUtils && webUtils.getPathForFile) {
        return webUtils.getPathForFile(file);
    }
    // Fallback for older electron versions or if webUtils is missing
    return file.path;
  },

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
  searchNotes: (query) => ipcRenderer.invoke('notes:search', query),
  getNoteById: (id) => ipcRenderer.invoke('notes:getById', id),
  getDeletedNotes: () => ipcRenderer.invoke('notes:getDeleted'),
  createNote: (noteData) => ipcRenderer.invoke('notes:create', noteData),
  updateNote: (id, noteData) => ipcRenderer.invoke('notes:update', id, noteData),
  deleteNote: (id) => ipcRenderer.invoke('notes:delete', id),
  restoreNote: (id) => ipcRenderer.invoke('notes:restore', id),

  // Attachments
  saveAttachment: (noteId, filePath) => ipcRenderer.invoke('attachments:save', noteId, filePath),
  saveAttachmentFromBuffer: (noteId, buffer, fileName) => ipcRenderer.invoke('attachments:saveBuffer', noteId, buffer, fileName),
  getAttachments: (noteId) => ipcRenderer.invoke('attachments:getAll', noteId),
  deleteAttachment: (id) => ipcRenderer.invoke('attachments:delete', id)
});

