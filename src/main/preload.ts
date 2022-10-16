import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer,
  openExternUrl: (url) => ipcRenderer.send("openExternUrl", url),
  parseStreamInfo: (url) => ipcRenderer.invoke("parseStreamInfo", url),
  downloadStream: (aid, cid, quality, title) =>
    ipcRenderer.send("downloadStream", aid, cid, quality, title),
});
