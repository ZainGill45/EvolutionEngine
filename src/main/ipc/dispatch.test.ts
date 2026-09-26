import { Effect, Logger, LogLevel } from "effect"
import { describe, expect, it } from "vitest"
import type { SystemStatus } from "@/shared/ipc"
import { dispatch, type IpcHandlers } from "./dispatch"

const status: SystemStatus = {
  appVersion: "1.0.0",
  electronVersion: "44.4.5",
  sqliteVersion: "3.53.4",
  dataDirectory: "/data",
}

const respondWith = (response: Effect.Effect<SystemStatus, unknown>): IpcHandlers<never> => ({
  "system:status": () => response,
})

const run = (handlers: IpcHandlers<never>, request: unknown) =>
  Effect.runPromise(
    dispatch(handlers, "system:status", request).pipe(
      Logger.withMinimumLogLevel(LogLevel.None),
    ),
  )

describe("dispatch", () => {
  it("returns the handler response", async () => {
    const result = await run(respondWith(Effect.succeed(status)), undefined)

    expect(result).toEqual({ ok: true, value: status })
  })

  it("rejects requests that break the contract", async () => {
    const result = await run(respondWith(Effect.succeed(status)), { unexpected: true })

    expect(result.ok).toBe(false)
  })

  it("reports handler failures", async () => {
    const result = await run(respondWith(Effect.fail(new Error("disk full"))), undefined)

    expect(result).toEqual({ ok: false, error: { message: "disk full" } })
  })

  it("rejects responses that break the contract", async () => {
    const malformed = { ...status, sqliteVersion: 3 } as unknown as SystemStatus
    const result = await run(respondWith(Effect.succeed(malformed)), undefined)

    expect(result.ok).toBe(false)
  })
})
