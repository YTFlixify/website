"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Check your email for the password reset link")
    }

    setIsLoading(false)
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
            <h2 className="mt-6 text-3xl font-bold">Reset your password</h2>
            <p className="mt-2 text-zinc-400">Enter your email and we'll send you a link to reset your password</p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 border-green-900 text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg"
              >
                {isLoading ? "Sending..." : "SEND RESET LINK"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Remember your password?{" "}
              <Link href="/auth/sign-in" className="text-yellow-400 hover:text-yellow-500 font-medium">
                Sign in
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
