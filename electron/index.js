const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const PRELOAD_PATH = path.join(__dirname, 'preload.js');
const PACKAGED_PATH = path.join(__dirname, '../renderer/dist/index.html');

const notebookService = require('./services/notebookService');
const noteService = require('./services/noteService');


function createWindow() {
	const windowConfig = {
		width: 800,
		height: 600,
		show: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: true,
			preload: PRELOAD_PATH
		}
	};
	const win = new BrowserWindow(windowConfig);

	win.once('ready-to-show', () => {
		win.show();
		win.maximize();
	});

	win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
		console.error('Error al cargar contenido:', errorDescription);
	});

	if(app.isPackaged) {
		win.loadFile(PACKAGED_PATH);
	} else {
		win.loadURL('http://localhost:5173');
	}
}

app.whenReady().then(createWindow)

// IPC handlers
// Notebooks
ipcMain.handle('notebooks:getAll', async () => await notebookService.getAllNotebooks());
ipcMain.handle('notebooks:getDeleted', async () => await notebookService.getDeletedNotebooks());
ipcMain.handle('notebooks:getById', async (_, id) => await notebookService.getNotebookById(id));
ipcMain.handle('notebooks:create', async (_, notebookData) => await notebookService.createNotebook(notebookData));
ipcMain.handle('notebooks:update', async (_, id, notebookData) => await notebookService.updateNotebook(id, notebookData));
ipcMain.handle('notebooks:delete', async (_, id) => await notebookService.deleteNotebook(id));
ipcMain.handle('notebooks:restore', async (_, id) => await notebookService.restoreNotebook(id));

// Notes
ipcMain.handle('notes:getAll', async () => await noteService.getAllNotes());
ipcMain.handle('notes:search', async (_, query) => await noteService.searchNotes(query));
ipcMain.handle('notes:getDeleted', async () => await noteService.getDeletedNotes());
ipcMain.handle('notes:getById', async (_, id) => await noteService.getNoteById(id));
ipcMain.handle('notes:create', async (_, noteData) => await noteService.createNote(noteData));
ipcMain.handle('notes:update', async (_, id, noteData) => await noteService.updateNote(id, noteData));
ipcMain.handle('notes:delete', async (_, id) => await noteService.deleteNote(id));
ipcMain.handle('notes:restore', async (_, id) => await noteService.restoreNote(id));


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})