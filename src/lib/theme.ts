export type Theme = "light" | "dark";

export function getTheme(): Theme {
  const saved = localStorage.getItem("mc_theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("mc_theme", theme);
  window.dispatchEvent(new CustomEvent<Theme>("mc-theme-change", { detail: theme }));
}
