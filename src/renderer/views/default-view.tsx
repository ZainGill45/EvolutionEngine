import { useState } from "react"
import { Composer } from "@/renderer/components/chat/composer"
import { MessageThread } from "@/renderer/components/chat/message-thread"
import { StackStatusDialog } from "@/renderer/components/stack-status-dialog"
import { Separator } from "@/renderer/components/ui/separator"
import { appendExchange, type Message } from "@/renderer/lib/chat"

export function DefaultView() {
  const [messages, setMessages] = useState<ReadonlyArray<Message>>([])

  return (
    <div className="flex h-svh flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between px-4">
        <h1 className="font-heading text-sm font-medium">Evolution Engine</h1>
        <StackStatusDialog />
      </header>
      <Separator />
      <MessageThread messages={messages} />
      <Composer onSend={(text) => { setMessages((thread) => appendExchange(thread, text)) }} />
    </div>
  )
}
