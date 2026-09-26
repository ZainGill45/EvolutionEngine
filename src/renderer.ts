import "./index.css"
import { createElement, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "@/renderer/app"
import { showView } from "@/renderer/lib/view"

const container = document.getElementById("root")
if (!container) throw new Error("Missing #root element")

if (import.meta.env.DEV) {
  window.ShowVisualComponentsView = () => { showView("visual-components") }
  window.ShowDefaultView = () => { showView("default") }
}

createRoot(container).render(createElement(StrictMode, null, createElement(App)))
