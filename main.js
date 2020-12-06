const { app, BrowserWindow, } = require('electron');

// Main Process
function createWindow () {
  // Cria uma janela de navegação.
  let win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // e carregar o index.html do aplicativo.
  win.loadFile('index.html');
}

app.on('ready', createWindow);