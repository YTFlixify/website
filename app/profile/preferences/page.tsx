"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function EditPreferences() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [preferences, setPreferences] = useState({
    favorite_category: "",
    notification_enabled: true,
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)

  const categories = [
    { 
      id: "live-streams",
      title: "Live Streams", 
      desc: "Watch me play live and interact with the community"
    },
    { 
      id: "challenges",
      title: "Challenges", 
      desc: "Epic gaming challenges and competitions"
    },
    { 
      id: "shorts",
      title: "YouTube Shorts", 
      desc: "Quick, entertaining gaming moments"
    },
    { 
      id: "gameplay",
      title: "Gameplay Videos", 
      desc: "Full gameplay sessions and walkthroughs"
    }
  ]

  useEffect(() => {
    async function getPreferences() {
      try {
        setLoading(true)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/sign-in")
          return
        }

        setUserId(session.user.id)

        const { data, error } = await supabase
          .from("content_preferences")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw error
        }

        if (data) {
          setPreferences({
            favorite_category: data.favorite_category || "",
            notification_enabled: data.notification_enabled,
          })
          setPreferenceId(data.id)
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
        setError("Failed to load preferences")
      } finally {
        setLoading(false)
      }
    }

    getPreferences()
  }, [supabase, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (!userId) {
        throw new Error("User not authenticated")
      }

      const updates = {
        user_id: userId,
        favorite_category: preferences.favorite_category,
        notification_enabled: preferences.notification_enabled,
        updated_at: new Date().toISOString(),
      }

      let error

      if (preferenceId) {
        // Update existing preferences
        const { error: updateError } = await supabase.from("content_preferences").update(updates).eq("id", preferenceId)

        error = updateError
      } else {
        // Insert new preferences
        const { error: insertError } = await supabase.from("content_preferences").insert(updates)

        error = insertError
      }

      if (error) {
        throw error
      }

      setSuccess("Preferences updated successfully!")

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/profile")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating preferences:", error)
      setError(error.message || "Failed to update preferences")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="font-bold text-2xl tracking-tighter">
              FLIXIFY
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/profile" className="flex items-center text-[#00517c] hover:text-[#00517c]/90">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Profile
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Edit Your Preferences</h1>

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
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00517c] border-r-transparent"></div>
              <p className="mt-4">Loading preferences...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="favorite_category" className="text-sm font-medium mb-2 block">
                    Favorite Content Category
                  </Label>
                  <Select
                    value={preferences.favorite_category}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, favorite_category: value }))}
                  >
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 focus:ring-[#00517c]">
                      <SelectValue placeholder="Select your favorite category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.title}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-zinc-500">We'll prioritize this content in your feed</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-sm font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-xs text-zinc-500">Receive updates about new content</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={preferences.notification_enabled}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, notification_enabled: checked }))
                    }
                    className="data-[state=checked]:bg-[#00517c]"
                  />
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
                  className="bg-[#00517c] hover:bg-[#00517c]/90 text-white font-bold"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
