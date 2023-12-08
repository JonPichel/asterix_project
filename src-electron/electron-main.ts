import { app, BrowserWindow, dialog, ipcMain } from "electron"
import path from "path"
import os from "os"
import { spawn } from "child_process"

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

let mainWindow: BrowserWindow | undefined

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      //backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  })

  mainWindow.loadURL(process.env.APP_URL)

  const serverProcess = spawn("./asterixdecoder.exe")

  serverProcess.on("error", (err) => {
    console.error(`Error spawning process: ${err.message}`)
    dialog.showErrorBox("Error", `Error spawning process: ${err.message}`)
  })

  serverProcess.stdout.on("data", (data) => {
    console.log("FROM BACKEND", data.toString())
  })

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow?.webContents.closeDevTools()
    })
  }

  mainWindow.on("closed", () => {
    mainWindow = undefined
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === undefined) {
    createWindow()
  }
})
