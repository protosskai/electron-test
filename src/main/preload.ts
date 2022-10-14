import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: ipcRenderer,
    openExternUrl: (url) => ipcRenderer.send("openExternUrl", url),
    parseStreamInfo: (url) => ipcRenderer.invoke('parseStreamInfo', url),
    downloadStream: (url) => ipcRenderer.send('downloadStream', url)
})
