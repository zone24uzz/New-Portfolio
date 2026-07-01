"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type Language = "en" | "uz" | "ru"

type TranslationValue = string | string[] | Record<string, unknown>
type TranslationMap = Record<string, TranslationValue>

type Translations = Record<Language, TranslationMap>

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string, params?: Record<string, string | number>) => string
  mounted: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

async function loadTranslations(lang: Language): Promise<TranslationMap> {
  try {
    const mod = await import(`./translations/${lang}.json`)
    return mod.default as TranslationMap
  } catch {
    console.warn(`Failed to load translations for ${lang}`)
    return {}
  }
}

function resolvePath(obj: TranslationMap, path: string): TranslationValue | undefined {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current as TranslationValue
}

export function I18nProvider({
  children,
  initialLang = "uz",
}: {
  children: ReactNode
  initialLang?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLang)
  const [translations, setTranslations] = useState<TranslationMap>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("__fmp_lang") as Language | null
    if (saved && ["en", "uz", "ru"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      loadTranslations(language).then(setTranslations)
      localStorage.setItem("__fmp_lang", language)
    }
  }, [language, mounted])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const value = resolvePath(translations, path)
      if (typeof value !== "string") {
        return path
      }
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
          return key in params ? String(params[key]) : `{{${key}}}`
        })
      }
      return value
    },
    [translations]
  )

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, mounted }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return ctx
}
