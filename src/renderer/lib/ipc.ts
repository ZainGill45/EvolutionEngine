import {
  IpcEnvelope,
  responseSchema,
  type IpcChannel,
  type IpcRequest,
  type IpcResponse,
} from "@/shared/ipc"

type RequestArgs<C extends IpcChannel> =
  IpcRequest<C> extends undefined ? [] : [request: IpcRequest<C>]

export const invoke = async <C extends IpcChannel>(
  channel: C,
  ...args: RequestArgs<C>
): Promise<IpcResponse<C>> => {
  const envelope = IpcEnvelope.parse(await window.evolution.invoke(channel, args[0]))
  if (!envelope.ok) throw new Error(envelope.error.message)
  return responseSchema(channel).parse(envelope.value)
}
