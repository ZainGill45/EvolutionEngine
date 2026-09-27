import { useRef, useState } from "react"
import { Button } from "@/renderer/components/ui/button"
import { Textarea } from "@/renderer/components/ui/textarea"

export function Composer({ onSend }: { readonly onSend: (text: string) => void }) {
  const [draft, setDraft] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const text = draft.trim()

  const submit = () => {
    if (!text) return
    onSend(text)
    setDraft("")
    textareaRef.current?.focus()
  }

  return (
    <form
      className="mx-auto flex w-full max-w-3xl shrink-0 flex-col gap-2 px-6 pt-4 pb-6"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <Textarea
        ref={textareaRef}
        aria-label="Message"
        autoFocus
        className="max-h-60 resize-none"
        placeholder="Ask a question or explain your thinking"
        value={draft}
        onChange={(event) => { setDraft(event.target.value) }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
          event.preventDefault()
          submit()
        }}
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Enter to send, Shift+Enter for a new line</p>
        <Button type="submit" disabled={!text}>
          Send
        </Button>
      </div>
    </form>
  )
}
