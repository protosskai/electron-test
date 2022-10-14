import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: ipcRenderer,
    openExternUrl: (url) => ipcRenderer.send("openExternUrl", url)
})
