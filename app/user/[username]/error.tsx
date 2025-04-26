'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Profile page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="font-bold text-2xl tracking-tighter">
              <span className="text-[#00517c]">FLIXIFY</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-zinc-400 mb-8">
            We encountered an error while loading this profile. Please try again later.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={reset}
              className="bg-[#00517c] hover:bg-[#00517c]/90 text-white"
            >
              Try again
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 