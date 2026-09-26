import * as Migrator from "@effect/sql/Migrator"
import { Layer } from "effect"
import * as SqliteClient from "./sqlite-client"

const migrate = Migrator.make({})({
  loader: Migrator.fromGlob(import.meta.glob("./migrations/*.ts")),
})

export const DatabaseLive = (filename: string) =>
  Layer.effectDiscard(migrate).pipe(Layer.provideMerge(SqliteClient.layer({ filename })))
