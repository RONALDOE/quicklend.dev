import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { spawn } from 'child_process';

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    icon: path.join(process.env.PUBLIC, 'QL.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  win.maximize();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // Iniciar el servidor
  const serverProcess = spawn('node', [path.join(__dirname, '..', 'server', 'index.js')]);

  serverProcess.stdout.on('data', (data) => {
    console.log(`Salida del servidor: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Error del servidor: ${data}`);
  });

  app.on('before-quit', () => {
    // Detener el servidor cuando se cierre la aplicación
    serverProcess.kill();
  });
}

app.on('window-all-closed', () => {
  win = null;
});

app.whenReady().then(createWindow);
