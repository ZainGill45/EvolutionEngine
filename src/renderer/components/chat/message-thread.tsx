import { cn } from "cn"
import { useEffect, useRef } from "react"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import type { Author, Message } from "@/renderer/lib/chat"

const authorLabels = {
  learner: "You",
  tutor: "Tutor",
} as const satisfies Record<Author, string>

export function MessageThread({ messages }: { readonly messages: ReadonlyArray<Message> }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div
        role="log"
        aria-label="Conversation"
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8"
      >
        {messages.map((message) => (
          <ThreadMessage key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  )
}

function ThreadMessage({ message }: { readonly message: Message }) {
  const fromLearner = message.author === "learner"

  return (
    <article className={cn("flex flex-col gap-2", fromLearner && "items-end")}>
      <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {authorLabels[message.author]}
      </span>
      <p
        className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
          fromLearner && "max-w-xl border border-border bg-surface px-4 py-3 shadow-raised",
        )}
      >
        {message.text}
      </p>
    </article>
  )
}
