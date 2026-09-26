import { defineConfig, type Plugin } from "vite"

const singleFilePreload: Plugin = {
  name: "evolution-engine:single-file-preload",
  outputOptions: (options) => {
    const singleFile = { ...options, codeSplitting: false }
    Reflect.deleteProperty(singleFile, "inlineDynamicImports")
    return singleFile
  },
}

export default defineConfig({
  plugins: [singleFilePreload],
  resolve: { tsconfigPaths: true },
})
