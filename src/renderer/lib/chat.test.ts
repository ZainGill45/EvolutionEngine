import { describe, expect, it } from "vitest"
import { appendExchange, noProviderReply } from "./chat"

describe("appendExchange", () => {
  it("appends the learner message followed by the tutor reply", () => {
    const thread = appendExchange([], "Why does CORS not stop curl?")

    expect(thread.map(({ author, text }) => ({ author, text }))).toEqual([
      { author: "learner", text: "Why does CORS not stop curl?" },
      { author: "tutor", text: noProviderReply },
    ])
  })

  it("keeps earlier messages and gives every message a unique id", () => {
    const first = appendExchange([], "What is a preflight request?")
    const second = appendExchange(first, "Which methods skip it?")

    expect(second.slice(0, 2)).toEqual(first)
    expect(new Set(second.map((message) => message.id)).size).toBe(4)
  })
})
