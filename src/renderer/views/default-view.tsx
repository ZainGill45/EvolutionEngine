import { useState } from "react"
import { Composer } from "@/renderer/components/chat/composer"
import { MessageThread } from "@/renderer/components/chat/message-thread"
import { defaultSidebarWidth, Sidebar, SidebarToggle } from "@/renderer/components/sidebar"
import { appendExchange, type Message } from "@/renderer/lib/chat"

export function DefaultView() {
  const [messages, setMessages] = useState<ReadonlyArray<Message>>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth)

  const toggleSidebar = () => { setSidebarOpen((open) => !open) }
  const send = (text: string) => { setMessages((thread) => appendExchange(thread, text)) }

  return (
    <div className="flex h-svh">
      {sidebarOpen && (
        <Sidebar
          width={sidebarWidth}
          onResize={setSidebarWidth}
          onToggle={toggleSidebar}
          onNewThread={() => { setMessages([]) }}
        />
      )}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="titlebar flex shrink-0 items-center">
          {!sidebarOpen && <SidebarToggle open={false} onToggle={toggleSidebar} />}
        </div>
        {messages.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 pb-12">
            <h1 className="px-6 text-center font-heading text-2xl font-medium">
              What do you want to understand?
            </h1>
            <Composer onSend={send} />
          </div>
        ) : (
          <>
            <MessageThread messages={messages} />
            <Composer onSend={send} />
          </>
        )}
      </main>
    </div>
  )
}
