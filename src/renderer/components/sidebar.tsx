import { PanelLeftIcon, RefreshCwIcon, SettingsIcon, SquarePenIcon } from "lucide-react"
import type { CSSProperties } from "react"
import { Button } from "@/renderer/components/ui/button"

export const defaultSidebarWidth = 370
const minSidebarWidth = 240
const maxSidebarWidth = 480

export function Sidebar({
  width,
  onResize,
  onToggle,
  onNewThread,
}: {
  readonly width: number
  readonly onResize: (width: number) => void
  readonly onToggle: () => void
  readonly onNewThread: () => void
}) {
  return (
    <aside
      className="relative flex w-(--sidebar-width) shrink-0 flex-col justify-between border-r border-border bg-surface"
      style={{ "--sidebar-width": `${String(width)}px` } as CSSProperties}
    >
      <div className="titlebar flex shrink-0 items-center justify-between">
        <SidebarToggle open onToggle={onToggle} />
        <Button size="icon" aria-label="New thread" onClick={onNewThread}>
          <SquarePenIcon />
        </Button>
      </div>
      <div className="flex shrink-0 items-center justify-between p-2">
        <Button size="icon" aria-label="Settings">
          <SettingsIcon />
        </Button>
        <Button size="icon" aria-label="Check for updates">
          <RefreshCwIcon />
        </Button>
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        className="no-drag absolute inset-y-0 -right-1 z-10 w-2 cursor-col-resize"
        onPointerDown={(event) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          onResize(Math.min(maxSidebarWidth, Math.max(minSidebarWidth, event.clientX)))
        }}
      />
    </aside>
  )
}

export function SidebarToggle({
  open,
  onToggle,
}: {
  readonly open: boolean
  readonly onToggle: () => void
}) {
  return (
    <Button size="icon" aria-label={open ? "Hide sidebar" : "Show sidebar"} onClick={onToggle}>
      <PanelLeftIcon />
    </Button>
  )
}
