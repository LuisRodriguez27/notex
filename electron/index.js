const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url'); // Add robust URL conversion

const PRELOAD_PATH = path.join(__dirname, 'preload.js');
const PACKAGED_PATH = path.join(__dirname, '../renderer/dist/index.html');

const notebookService = require('./services/notebookService');
const noteService = require('./services/noteService');
const attachmentService = require('./services/attachmentService');

// Register protocol for handling local images
protocol.registerSchemesAsPrivileged([
	{ scheme: 'local-resource', privileges: { secure: true, supportFetchAPI: true, standard: true, bypassCSP: true } }
]);


function createWindow() {
	const windowConfig = {
		width: 800,
		height: 600,
		show: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: true, // Keep true for security
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

app.whenReady().then(() => {

	protocol.handle('local-resource', (request) => {
		const rawUrl = request.url;
        
        // Remove the scheme. The URL might be "local-resource://C:/..." or "local-resource:///C:/..."
        let pathPart = rawUrl.replace(/^local-resource:\/*/, '');
        
        // Decode URI components
        let decodedPath = decodeURIComponent(pathPart);

        // Fix: If on Windows, ensure we have a colon after the drive letter.
        // If we received "c/Users/..." instead of "c:/Users/...", fix it.
        // This is a known issue where sometimes : is stripped or encoded weirdly if not careful, 
        // though `encodeURI` should preserve it.
        // But more likely: pathToFileURL logic for "c/foo" vs "c:/foo".
        
        if (process.platform === 'win32') {
             // Handle /C:/ case (strip leading slash)
             if (decodedPath.startsWith('/') && /^\/[a-zA-Z]:/.test(decodedPath)) {
                decodedPath = decodedPath.slice(1);
            }
            
            // Handle missing colon if it looks like a drive letter path (e.g. "c/Users")
            // This happens if browsers/protocols mangle the scheme part.
            // If path starts with single char drive letter followed by slash, insert colon.
            if (/^[a-zA-Z]\//.test(decodedPath)) {
                decodedPath = decodedPath.charAt(0) + ':' + decodedPath.slice(1);
            }
        }
        
        try {
            // pathToFileURL handles conversion to file:///C:/... correctly
            // It resolves relative paths against CWD, so we MUST ensure it looks absolute.
            const fileUrl = pathToFileURL(decodedPath).href;
			
			return net.fetch(fileUrl);
		} catch (error) {
			console.error('Protocol error fetching:', decodedPath, error);
            // It might be better to return null to let Electron handle it or fail gracefully
			return new Response('Not Found', { status: 404 });
		}
	});

	createWindow();
})

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

// Attachments
ipcMain.handle('attachments:save', async (_, noteId, filePath) => await attachmentService.saveImage(noteId, filePath));
ipcMain.handle('attachments:saveBuffer', async (_, noteId, buffer, fileName) => await attachmentService.saveImageFromBuffer(noteId, buffer, fileName));
ipcMain.handle('attachments:getAll', async (_, noteId) => await attachmentService.getAttachments(noteId));
ipcMain.handle('attachments:delete', async (_, id) => await attachmentService.deleteAttachment(id));


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})