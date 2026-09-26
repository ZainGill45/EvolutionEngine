import { Cause, Effect } from "effect"
import { decode } from "@/main/validation"
import {
  requestSchema,
  responseSchema,
  type IpcChannel,
  type IpcRequest,
  type IpcResponse,
  type IpcResult,
} from "@/shared/ipc"

export type IpcHandlers<R> = {
  readonly [C in IpcChannel]: (
    request: IpcRequest<C>,
  ) => Effect.Effect<IpcResponse<C>, unknown, R>
}

const failureMessage = (cause: Cause.Cause<unknown>) => {
  const error = Cause.squash(cause)
  return error instanceof Error ? error.message : "Unexpected error"
}

export const dispatch = <C extends IpcChannel, R>(
  handlers: IpcHandlers<R>,
  channel: C,
  request: unknown,
): Effect.Effect<IpcResult<IpcResponse<C>>, never, R> =>
  decode(requestSchema(channel), request).pipe(
    Effect.flatMap(handlers[channel]),
    Effect.flatMap((response) => decode(responseSchema(channel), response)),
    Effect.map((value): IpcResult<IpcResponse<C>> => ({ ok: true, value })),
    Effect.catchAllCause((cause) =>
      Effect.logError(`IPC request on ${channel} failed`, cause).pipe(
        Effect.as<IpcResult<IpcResponse<C>>>({
          ok: false,
          error: { message: failureMessage(cause) },
        }),
      ),
    ),
  )
