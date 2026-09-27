export type Author = "learner" | "tutor"

export interface Message {
  readonly id: string
  readonly author: Author
  readonly text: string
}

export const noProviderReply = "Tutor replies will appear here once a model provider is connected."

export const appendExchange = (
  thread: ReadonlyArray<Message>,
  text: string,
): ReadonlyArray<Message> => [
  ...thread,
  { id: crypto.randomUUID(), author: "learner", text },
  { id: crypto.randomUUID(), author: "tutor", text: noProviderReply },
]
