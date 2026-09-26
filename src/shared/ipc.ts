import { z } from "zod"

export const SystemStatus = z.object({
  appVersion: z.string(),
  electronVersion: z.string(),
  sqliteVersion: z.string(),
  dataDirectory: z.string(),
})

export type SystemStatus = z.infer<typeof SystemStatus>

const ipcContract = {
  "system:status": {
    request: z.undefined(),
    response: SystemStatus,
  },
} satisfies Record<string, { request: z.ZodType; response: z.ZodType }>

type IpcContract = typeof ipcContract

export type IpcChannel = keyof IpcContract

export type IpcRequest<C extends IpcChannel> = z.infer<IpcContract[C]["request"]>

export type IpcResponse<C extends IpcChannel> = z.infer<IpcContract[C]["response"]>

export const requestSchema = <C extends IpcChannel>(channel: C) =>
  ipcContract[channel].request as IpcContract[C]["request"]

export const responseSchema = <C extends IpcChannel>(channel: C) =>
  ipcContract[channel].response as IpcContract[C]["response"]

export const ipcChannels = Object.keys(ipcContract) as ReadonlyArray<IpcChannel>

export const isIpcChannel = (channel: unknown): channel is IpcChannel =>
  typeof channel === "string" && Object.hasOwn(ipcContract, channel)

export const IpcEnvelope = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), value: z.unknown() }),
  z.object({ ok: z.literal(false), error: z.object({ message: z.string() }) }),
])

export type IpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: { readonly message: string } }

export interface EvolutionBridge {
  readonly invoke: (channel: IpcChannel, request?: unknown) => Promise<unknown>
}
