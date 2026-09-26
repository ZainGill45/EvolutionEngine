export const followSystemTheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
  const apply = () => document.documentElement.classList.toggle("dark", prefersDark.matches)
  apply()
  prefersDark.addEventListener("change", apply)
}
