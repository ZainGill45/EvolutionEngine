import js from "@eslint/js"
import { plugin as shadcn } from "@shadcn/lint"
import { defineConfig, globalIgnores } from "eslint/config"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

const roundedClass = String.raw`/(^|[\s:])rounded(-|\s|$)/`
const hardEdges = "Evolution Engine uses hard edges. Border radius is not allowed. See docs/design-system.md."

export default defineConfig([
  globalIgnores([".vite", "out", "node_modules"]),
  {
    files: ["**/*.{ts,mts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["*.{ts,mts}", "src/main.ts", "src/main/**/*.ts", "src/preload.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/renderer.ts", "src/renderer/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn },
    rules: {
      "shadcn/no-restyle": ["error", { allow: ["layout"] }],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-inline-styles": "error",
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=${roundedClass}]`, message: hardEdges },
        { selector: `TemplateElement[value.raw=${roundedClass}]`, message: hardEdges },
      ],
    },
  },
  {
    files: ["src/renderer/components/ui/**"],
    rules: {
      "shadcn/no-arbitrary-values": "off",
    },
  },
])
