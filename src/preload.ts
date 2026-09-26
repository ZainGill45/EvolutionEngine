import { contextBridge, ipcRenderer } from "electron"
import { isIpcChannel, type EvolutionBridge } from "@/shared/ipc"

const bridge: EvolutionBridge = {
  invoke: (channel, request) =>
    isIpcChannel(channel)
      ? (ipcRenderer.invoke(channel, request) as Promise<unknown>)
      : Promise.reject(new Error("Unknown IPC channel")),
}

contextBridge.exposeInMainWorld("evolution", bridge)
