import type { EvolutionBridge } from "@/shared/ipc"

declare global {
  interface Window {
    readonly evolution: EvolutionBridge
    ShowVisualComponentsView?: () => void
    ShowDefaultView?: () => void
  }
}
