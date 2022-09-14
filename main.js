const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });


    win.loadFile('index.html');

};

app.whenReady().then(() => {
    createWindow();    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


