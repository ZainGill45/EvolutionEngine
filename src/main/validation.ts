import { Data, Effect } from "effect"
import { z } from "zod"

class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
}> {}

export const decode = <T extends z.ZodType>(
  schema: T,
  value: unknown,
): Effect.Effect<z.infer<T>, ValidationError> => {
  const result = schema.safeParse(value)
  return result.success
    ? Effect.succeed(result.data)
    : Effect.fail(new ValidationError({ message: z.prettifyError(result.error) }))
}
