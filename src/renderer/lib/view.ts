import { useSyncExternalStore } from "react"

export type View = "default" | "visual-components"

let current: View = "default"
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const showView = (view: View) => {
  current = view
  for (const listener of listeners) listener()
}

export const useView = () => useSyncExternalStore(subscribe, () => current)
