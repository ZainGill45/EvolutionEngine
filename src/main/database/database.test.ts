import * as SqlClient from "@effect/sql/SqlClient"
import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { DatabaseLive } from "./database"

describe("DatabaseLive", () => {
  it("prepares the migrations table on startup", async () => {
    const tables = await Effect.runPromise(
      Effect.flatMap(
        SqlClient.SqlClient,
        (sql) => sql`select name from sqlite_master where type = 'table'`,
      ).pipe(Effect.provide(DatabaseLive(":memory:"))),
    )

    expect(tables).toContainEqual({ name: "effect_sql_migrations" })
  })
})
