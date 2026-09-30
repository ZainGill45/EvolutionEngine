import { app, BrowserWindow } from "electron"
import path from "node:path"
import { isDevToolsShortcut } from "@/main/devtools"

const background = "#0a0a0a"
const foreground = "#f5f5f5"

export const createMainWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: background,
    titleBarStyle: "hidden",
    titleBarOverlay: { color: background, symbolColor: foreground, height: 48 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  window.removeMenu()
  window.once("ready-to-show", () => {
    window.maximize()
    window.show()
  })
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }))

  if (!app.isPackaged) {
    window.webContents.on("before-input-event", (event, input) => {
      if (isDevToolsShortcut(input)) {
        event.preventDefault()
        window.webContents.toggleDevTools()
      }
    })
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    void window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    )
  }

  return window
}
