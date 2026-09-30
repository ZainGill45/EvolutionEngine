import { app, BrowserWindow, dialog, nativeTheme } from "electron"
import started from "electron-squirrel-startup"
import { ManagedRuntime } from "effect"
import path from "node:path"
import { DatabaseLive } from "@/main/database/database"
import { handlers } from "@/main/ipc/handlers"
import { registerIpcHandlers } from "@/main/ipc/register"
import { createMainWindow } from "@/main/window"

const runtime = ManagedRuntime.make(
  DatabaseLive(path.join(app.getPath("userData"), "evolution-engine.db")),
)

const start = async () => {
  await app.whenReady()
  nativeTheme.themeSource = "dark"
  await runtime.runtime()
  registerIpcHandlers(runtime, handlers)
  createMainWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
}

let disposed = false

app.on("will-quit", (event) => {
  if (disposed) return
  event.preventDefault()
  void runtime.dispose().finally(() => {
    disposed = true
    app.quit()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

if (started) {
  app.quit()
} else {
  start().catch((error: unknown) => {
    dialog.showErrorBox(
      "Evolution Engine failed to start",
      error instanceof Error ? error.message : String(error),
    )
    app.exit(1)
  })
}
