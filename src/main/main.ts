import { app, BrowserWindow, ipcMain, session, shell } from "electron";
import { join } from "path";
import {
  getVideoInfo,
  getDownloadInfo,
  extractAid,
  getStreamInfoTable,
  getDownloadUrl
} from "./bilibili/extractor";
import { downloadFile } from "./lib/http";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}

const handleOpenExternUrl = (event, externUrl) => {
  shell.openExternal(externUrl);
};
const handleParseStreamInfo = async (event, url) => {
  console.log(url);
  const aid = extractAid(url);
  if (aid) {
    const videoInfo = await getVideoInfo(aid);
    const downloadInfo = await getDownloadInfo(aid, videoInfo.cid, 16);
    const streamInfo = getStreamInfoTable(aid, videoInfo, downloadInfo);
    return JSON.stringify(streamInfo);
  }
  return null;
};
const handleDownloadStream = async (event, aid, cid, quality, title) => {
    const urls = await getDownloadUrl(aid, cid, quality);
    console.log(urls);
    await downloadFile(urls[0], 'test.mp4');
};
app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("message", (event, message) => {
  console.log(message);
});
ipcMain.on("openExternUrl", handleOpenExternUrl);
ipcMain.handle("parseStreamInfo", handleParseStreamInfo);
ipcMain.on("downloadStream", handleDownloadStream);
