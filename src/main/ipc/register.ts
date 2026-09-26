import { ipcMain } from "electron"
import type { ManagedRuntime } from "effect"
import { ipcChannels } from "@/shared/ipc"
import { dispatch, type IpcHandlers } from "./dispatch"

export const registerIpcHandlers = <R>(
  runtime: ManagedRuntime.ManagedRuntime<R, unknown>,
  handlers: IpcHandlers<R>,
) => {
  for (const channel of ipcChannels) {
    ipcMain.handle(channel, (_event, request: unknown) =>
      runtime.runPromise(dispatch(handlers, channel, request)),
    )
  }
}
