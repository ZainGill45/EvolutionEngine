import { describe, expect, it } from "vitest"
import { isDevToolsShortcut } from "./devtools"

const press = (key: string, modifiers: Partial<Record<"control" | "shift" | "alt" | "meta", boolean>> = {}) => ({
  type: "keyDown",
  key,
  control: false,
  shift: false,
  alt: false,
  meta: false,
  ...modifiers,
})

describe("isDevToolsShortcut", () => {
  it.each([
    ["F12", press("F12")],
    ["Ctrl+Shift+I", press("I", { control: true, shift: true })],
    ["Cmd+Opt+I", press("i", { meta: true, alt: true })],
  ])("matches %s", (_name, input) => {
    expect(isDevToolsShortcut(input)).toBe(true)
  })

  it.each([
    ["I", press("i")],
    ["Ctrl+I", press("i", { control: true })],
    ["Shift+I", press("I", { shift: true })],
  ])("ignores %s", (_name, input) => {
    expect(isDevToolsShortcut(input)).toBe(false)
  })

  it("ignores key releases", () => {
    expect(isDevToolsShortcut({ ...press("F12"), type: "keyUp" })).toBe(false)
  })
})
