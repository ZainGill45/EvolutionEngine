import { TooltipProvider } from "@/renderer/components/ui/tooltip"
import { useView } from "@/renderer/lib/view"
import { DefaultView } from "@/renderer/views/default-view"
import { VisualComponentsView } from "@/renderer/views/visual-components-view"

export function App() {
  return (
    <TooltipProvider>
      {useView() === "visual-components" ? <VisualComponentsView /> : <DefaultView />}
    </TooltipProvider>
  )
}
