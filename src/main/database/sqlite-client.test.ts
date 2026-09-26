import * as Migrator from "@effect/sql/Migrator"
import * as SqlClient from "@effect/sql/SqlClient"
import { Effect } from "effect"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import * as SqliteClient from "./sqlite-client"

const run = <A, E>(
  program: Effect.Effect<A, E, SqlClient.SqlClient>,
  filename = ":memory:",
) => Effect.runPromise(Effect.provide(program, SqliteClient.layer({ filename })))

const createTopics = Effect.flatMap(
  SqlClient.SqlClient,
  (sql) => sql`create table topics (id integer primary key, name text not null unique)`,
)

describe("SqliteClient", () => {
  it("binds parameters and returns rows", async () => {
    const rows = await run(
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient
        yield* createTopics
        yield* sql`insert into topics ${sql.insert([{ name: "HTTP" }, { name: "SQL" }])}`
        return yield* sql`select id, name from topics where name = ${"SQL"}`
      }),
    )

    expect(rows).toEqual([{ id: 2, name: "SQL" }])
  })

  it("rolls back a failed transaction", async () => {
    const count = await run(
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient
        yield* createTopics
        yield* sql`insert into topics ${sql.insert({ name: "HTTP" })}`.pipe(
          Effect.zipRight(Effect.fail("abort")),
          sql.withTransaction,
          Effect.ignore,
        )
        return yield* sql<{ count: number }>`select count(*) as count from topics`
      }),
    )

    expect(count).toEqual([{ count: 0 }])
  })

  it("enforces foreign keys", async () => {
    const error = await run(
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient
        yield* createTopics
        yield* sql`create table threads (id integer primary key, topic_id integer not null references topics (id))`
        return yield* Effect.flip(sql`insert into threads ${sql.insert({ topic_id: 42 })}`)
      }),
    )

    expect(error._tag).toBe("SqlError")
  })

  it("runs each migration exactly once", async () => {
    const migrate = Migrator.make({})({
      loader: Migrator.fromRecord({ "1_create_topics": createTopics }),
    })

    const [first, second] = await run(Effect.all([migrate, migrate]))

    expect(first).toEqual([[1, "create_topics"]])
    expect(second).toEqual([])
  })

  describe("with a database file", () => {
    let directory: string

    beforeEach(async () => {
      directory = await mkdtemp(path.join(tmpdir(), "evolution-engine-"))
    })

    afterEach(async () => {
      await rm(directory, { recursive: true, force: true })
    })

    it("persists data across connections", async () => {
      const filename = path.join(directory, "test.db")

      await run(
        Effect.gen(function* () {
          const sql = yield* SqlClient.SqlClient
          yield* createTopics
          yield* sql`insert into topics ${sql.insert({ name: "HTTP" })}`
        }),
        filename,
      )

      const rows = await run(
        Effect.flatMap(SqlClient.SqlClient, (sql) => sql`select name from topics`),
        filename,
      )

      expect(rows).toEqual([{ name: "HTTP" }])
    })
  })
})
