// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)),
    // showAlert: (message) => alert(message), // ✅ 여기에 넣었다고 가정
    showAlert: (message) => ipcRenderer.invoke('show-alert', message),
    showUnsavedDialog: () => ipcRenderer.invoke("show-unsaved-dialog")
});
