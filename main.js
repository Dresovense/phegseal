const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, "graphics\system\icon.ico")
    });


    win.loadFile('index.html');

};

app.whenReady().then(() => {
    createWindow();    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


