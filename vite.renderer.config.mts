import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const contentSecurityPolicy: Plugin = {
  name: "evolution-engine:content-security-policy",
  apply: "build",
  transformIndexHtml: () => [
    {
      tag: "meta",
      attrs: {
        "http-equiv": "Content-Security-Policy",
        content:
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:",
      },
      injectTo: "head-prepend",
    },
  ],
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contentSecurityPolicy],
  resolve: { tsconfigPaths: true },
})
