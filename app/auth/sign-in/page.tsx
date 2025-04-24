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

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold tracking-tighter">
                FORT<span className="text-yellow-400">CREATOR</span>
              </h1>
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
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-yellow-400 focus:ring-yellow-400"
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
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-yellow-400 hover:text-yellow-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg"
              >
                {isLoading ? "Signing in..." : "SIGN IN"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-yellow-400 hover:text-yellow-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-zinc-500 text-sm">
        <p>© 2025 FortCreator. All rights reserved.</p>
      </footer>
    </div>
  )
}
