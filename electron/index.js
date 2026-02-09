const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const PRELOAD_PATH = path.join(__dirname, 'preload.js');
const PACKAGED_PATH = path.join(__dirname, '../renderer/dist/index.html');

const notebookService = require('./services/notebookService');

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
ipcMain.handle('notebook:getAll', async () => await notebookService.getAllNotebooks());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})