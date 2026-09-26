import "./index.css"
import { createElement, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "@/renderer/app"
import { followSystemTheme } from "@/renderer/lib/theme"

const container = document.getElementById("root")
if (!container) throw new Error("Missing #root element")

followSystemTheme()
createRoot(container).render(createElement(StrictMode, null, createElement(App)))
