'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/i18n.config'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>(i18n.defaultLocale)

  useEffect(() => {
    // Extract locale from pathname
    const pathLocale = pathname.split('/')[1]
    if (i18n.locales.includes(pathLocale as Locale)) {
      setLocale(pathLocale as Locale)
    }
  }, [pathname])

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    setLocale(newLocale)
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPath)
  }, [pathname, router])

  const value = useMemo(() => ({
    locale,
    setLocale: handleLocaleChange
  }), [locale, handleLocaleChange])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 