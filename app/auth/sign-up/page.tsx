"use client"

import { useState } from "react"
import Link from "next/link"
import { signUp } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignUp() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.success)
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
            <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
            <p className="mt-2 text-zinc-400">Join the community and get access to exclusive content</p>
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

          <form action={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-[#00517c] focus:ring-[#00517c]"
                  placeholder="Choose a username"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full bg-zinc-900 border-zinc-800 focus:border-[#00517c] focus:ring-[#00517c]"
                  placeholder="Create a password"
                />
                <p className="mt-1 text-xs text-zinc-500">Password must be at least 6 characters long</p>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full py-6 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-bold text-lg"
              >
                {isLoading ? "Creating account..." : "CREATE ACCOUNT"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-[#00517c] hover:text-[#00517c]/90 font-medium">
                Sign in
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
