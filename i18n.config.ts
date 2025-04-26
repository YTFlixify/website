export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'ko'],
} as const

export type Locale = (typeof i18n)['locales'][number] 