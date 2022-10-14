import * as Electron from 'electron';

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
    ipcRenderer: Electron.IpcRenderer,
    openExternUrl: Function,
    parseStreamInfo: (url: string) => Promise<string>
    downloadStream: (stream: string) => void
}

declare global {
    interface Window {
        electron: ElectronApi,
    }
}
