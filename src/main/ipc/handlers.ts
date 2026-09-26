import * as SqlClient from "@effect/sql/SqlClient"
import { app } from "electron"
import { Effect } from "effect"
import { z } from "zod"
import { decode } from "@/main/validation"
import type { IpcHandlers } from "./dispatch"

const SqliteVersionRows = z.tuple([z.object({ version: z.string() })])

export const handlers: IpcHandlers<SqlClient.SqlClient> = {
  "system:status": () =>
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient
      const rows = yield* sql`select sqlite_version() as version`
      const [{ version }] = yield* decode(SqliteVersionRows, rows)
      return {
        appVersion: app.getVersion(),
        electronVersion: process.versions.electron,
        sqliteVersion: version,
        dataDirectory: app.getPath("userData"),
      }
    }),
}
