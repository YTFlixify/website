"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"

export default function EditProfile() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    username: "",
    display_name: "",
    bio: "",
  })

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/sign-in")
          return
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("username, display_name, bio")
          .eq("id", session.user.id)
          .single()

        if (error) {
          throw error
        }

        if (data) {
          setProfile({
            username: data.username || "",
            display_name: data.display_name || "",
            bio: data.bio || "",
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/sign-in")
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)

      if (error) {
        throw error
      }

      setSuccess("Profile updated successfully!")

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/profile")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="font-bold text-2xl tracking-tighter">
              FORT<span className="text-yellow-400">CREATOR</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/profile" className="flex items-center text-yellow-400 hover:text-yellow-500">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Profile
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-900 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-900/20 border-green-900 text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent"></div>
              <p className="mt-4">Loading profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-zinc-800 border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400"
                    required
                  />
                  <p className="mt-1 text-xs text-zinc-500">This is your unique identifier on the platform</p>
                </div>

                <div>
                  <Label htmlFor="display_name" className="text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={profile.display_name}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-zinc-800 border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                  <p className="mt-1 text-xs text-zinc-500">This is how your name will appear to others</p>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full bg-zinc-800 border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Tell others a bit about yourself</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="border-zinc-700 hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
