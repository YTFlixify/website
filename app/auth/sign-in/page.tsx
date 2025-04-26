"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null)

  async function handleSubmit(formData: FormData) {
    // Check if we need to wait before allowing another attempt
    const now = Date.now()
    if (lastAttemptTime && now - lastAttemptTime < 5000) { // 5 second cooldown
      setError("Please wait a few seconds before trying again")
      return
    }

    setIsLoading(true)
    setError(null)
    setLastAttemptTime(now)

    try {
      const result = await signIn(formData)

      if (result?.error) {
        // Improve error message for rate limiting
        if (result.error.includes("rate limit")) {
          setError("Too many attempts. Please wait a few minutes before trying again.")
        } else {
          setError(result.error)
        }
        setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="font-bold text-2xl tracking-tighter">
              <span className="text-[#00517c]">FLIXIFY</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
            <p className="mt-2 text-zinc-400">Enter your credentials to access your account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-[#00517c] focus:ring-[#00517c]"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-[#00517c] focus:ring-[#00517c]"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-[#00517c] hover:text-[#00517c]/90">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-bold text-lg"
              >
                {isLoading ? "Signing in..." : "SIGN IN"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-[#00517c] hover:text-[#00517c]/90 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-zinc-500 text-sm">
        <p>© 2025 Flixify. All rights reserved.</p>
      </footer>
    </div>
  )
}
