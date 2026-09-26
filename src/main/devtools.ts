import type { Input } from "electron"

type ShortcutInput = Pick<Input, "type" | "key" | "control" | "shift" | "alt" | "meta">

export const isDevToolsShortcut = (input: ShortcutInput) => {
  if (input.type !== "keyDown") return false
  const key = input.key.toLowerCase()
  if (key === "f12") return true
  if (key !== "i") return false
  return (input.control && input.shift) || (input.meta && input.alt)
}
