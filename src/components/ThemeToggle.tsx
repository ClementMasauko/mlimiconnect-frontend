import React, { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem("mc_theme");
    if (s) return s === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("mc_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button onClick={() => setDark(d => !d)} className="px-2 py-1 rounded">
      {dark ? "☾" : "☀"}
    </button>
  );
}
