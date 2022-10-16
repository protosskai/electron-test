import * as Electron from 'electron';

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  ipcRenderer: Electron.IpcRenderer;
  openExternUrl: Function;
  parseStreamInfo: (url: string) => Promise<string>;
  downloadStream: (
    aid: number,
    cid: number,
    quality: number,
    title: string
  ) => void;
}

declare global {
    interface Window {
        electron: ElectronApi,
    }
}
