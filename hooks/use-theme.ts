"use client"

import { useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Read from localStorage or system preference
    const stored = localStorage.getItem("__fmp_theme") as Theme | null
    if (stored) {
      applyTheme(stored)
      setThemeState(stored)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const initial: Theme = prefersDark ? "dark" : "light"
      applyTheme(initial)
      setThemeState(initial)
    }
  }, [])

  const applyTheme = (t: Theme) => {
    const html = document.documentElement
    if (t === "dark") {
      html.classList.add("dark")
      html.classList.remove("light")
    } else {
      html.classList.add("light")
      html.classList.remove("dark")
    }
  }

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t)
    setThemeState(t)
    localStorage.setItem("__fmp_theme", t)
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return { theme, setTheme, toggle, mounted, isDark: theme === "dark" }
}
