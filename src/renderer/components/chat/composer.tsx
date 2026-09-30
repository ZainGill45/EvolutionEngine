import { useState } from "react"
import { Textarea } from "@/renderer/components/ui/textarea"

export function Composer({ onSend }: { readonly onSend: (text: string) => void }) {
  const [draft, setDraft] = useState("")

  return (
    <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
      <Textarea
        aria-label="Message"
        autoFocus
        className="max-h-60 resize-none"
        placeholder="Ask a question or explain your thinking"
        value={draft}
        onChange={(event) => { setDraft(event.target.value) }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
          event.preventDefault()
          const text = draft.trim()
          if (!text) return
          onSend(text)
          setDraft("")
        }}
      />
    </div>
  )
}
