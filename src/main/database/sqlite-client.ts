import * as Reactivity from "@effect/experimental/Reactivity"
import * as SqlClient from "@effect/sql/SqlClient"
import type { Connection } from "@effect/sql/SqlConnection"
import { SqlError } from "@effect/sql/SqlError"
import * as Statement from "@effect/sql/Statement"
import { Cache, Context, Duration, Effect, Layer, Scope, Stream } from "effect"
import { DatabaseSync, type SQLInputValue, type StatementSync } from "node:sqlite"

interface SqliteClientConfig {
  readonly filename: string
}

const failWith = (message: string) => (cause: unknown) => new SqlError({ cause, message })

const bind = (params: ReadonlyArray<unknown>) => params as ReadonlyArray<SQLInputValue>

const returnsRows = (statement: StatementSync) => statement.columns().length > 0

const open = (filename: string) =>
  Effect.acquireRelease(
    Effect.try({
      try: () => new DatabaseSync(filename),
      catch: failWith(`Failed to open database at ${filename}`),
    }),
    (db) => Effect.sync(() => { db.close() }),
  ).pipe(
    Effect.tap((db) =>
      Effect.try({
        try: () => {
          db.exec("PRAGMA journal_mode = WAL")
          db.exec("PRAGMA foreign_keys = ON")
        },
        catch: failWith("Failed to configure database"),
      }),
    ),
  )

const makeConnection = (config: SqliteClientConfig) =>
  Effect.gen(function* () {
    const db = yield* open(config.filename)

    const statements = yield* Cache.make({
      capacity: 200,
      timeToLive: Duration.minutes(10),
      lookup: (sql: string) =>
        Effect.try({
          try: () => db.prepare(sql),
          catch: failWith("Failed to prepare statement"),
        }),
    })

    const execute = (statement: StatementSync, params: ReadonlyArray<unknown>) =>
      Effect.withFiberRuntime<ReadonlyArray<object>, SqlError>((fiber) =>
        Effect.try({
          try: () => {
            statement.setReadBigInts(Context.get(fiber.currentContext, SqlClient.SafeIntegers))
            if (returnsRows(statement)) return statement.all(...bind(params))
            statement.run(...bind(params))
            return []
          },
          catch: failWith("Failed to execute statement"),
        }),
      )

    const connection: Connection = {
      execute: (sql, params, transformRows) =>
        statements.get(sql).pipe(
          Effect.flatMap((statement) => execute(statement, params)),
          Effect.map((rows) => (transformRows ? transformRows(rows) : rows)),
        ),
      executeRaw: (sql, params) =>
        Effect.flatMap(statements.get(sql), (statement) =>
          Effect.try({
            try: () =>
              returnsRows(statement)
                ? statement.all(...bind(params))
                : statement.run(...bind(params)),
            catch: failWith("Failed to execute statement"),
          }),
        ),
      executeValues: (sql, params) =>
        Effect.acquireUseRelease(
          statements.get(sql),
          (statement) =>
            Effect.try({
              try: () => {
                if (!returnsRows(statement)) {
                  statement.run(...bind(params))
                  return []
                }
                statement.setReturnArrays(true)
                return statement.all(...bind(params)) as unknown as ReadonlyArray<
                  ReadonlyArray<unknown>
                >
              },
              catch: failWith("Failed to execute statement"),
            }),
          (statement) => Effect.sync(() => { statement.setReturnArrays(false) }),
        ),
      executeUnprepared: (sql, params, transformRows) =>
        Effect.try({
          try: () => db.prepare(sql),
          catch: failWith("Failed to prepare statement"),
        }).pipe(
          Effect.flatMap((statement) => execute(statement, params)),
          Effect.map((rows) => (transformRows ? transformRows(rows) : rows)),
        ),
      executeStream: () =>
        Stream.dieMessage("Streaming queries are not supported by the node:sqlite client"),
    }

    return connection
  })

const make = (config: SqliteClientConfig) =>
  Effect.gen(function* () {
    const connection = yield* makeConnection(config)
    const semaphore = yield* Effect.makeSemaphore(1)

    const acquirer = semaphore.withPermits(1)(Effect.succeed(connection))

    const transactionAcquirer = Effect.uninterruptibleMask((restore) =>
      restore(semaphore.take(1)).pipe(
        Effect.zipRight(
          Effect.flatMap(Effect.scope, (scope) =>
            Scope.addFinalizer(scope, semaphore.release(1)),
          ),
        ),
        Effect.as(connection),
      ),
    )

    return yield* SqlClient.make({
      acquirer,
      transactionAcquirer,
      compiler: Statement.makeCompilerSqlite(),
      spanAttributes: [["db.system.name", "sqlite"]],
    })
  })

export const layer = (config: SqliteClientConfig): Layer.Layer<SqlClient.SqlClient, SqlError> =>
  Layer.scoped(SqlClient.SqlClient, make(config)).pipe(Layer.provide(Reactivity.layer))
