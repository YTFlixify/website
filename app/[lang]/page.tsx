import { i18n } from '@/i18n.config'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function Home({
  params: { lang }
}: {
  params: { lang: string }
}) {
  if (!i18n.locales.includes(lang as any)) notFound()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to Flixify</h1>
      </div>
    </main>
  )
} 