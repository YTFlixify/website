import { i18n } from '@/i18n.config'

type Messages = typeof import('@/messages/en.json')

export async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`)
    return (await import('@/messages/en.json')).default
  }
}

export function getCurrentLocale(pathname: string): string {
  const pathLocale = pathname.split('/')[1]
  return i18n.locales.includes(pathLocale as any) ? pathLocale : i18n.defaultLocale
} 