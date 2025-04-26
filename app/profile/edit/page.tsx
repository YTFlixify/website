"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft, Upload } from "lucide-react"
import { initializeStorage } from "@/lib/supabase/storage"

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
    avatar_url: "",
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

        // First try to get the profile
        let { data, error } = await supabase
          .from("profiles")
          .select("username, display_name, bio, avatar_url")
          .eq("id", session.user.id)
          .single()

        // If profile doesn't exist, create it
        if (!data && !error) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: session.user.id,
                username: session.user.email?.split("@")[0] || "user",
                display_name: session.user.email?.split("@")[0] || "User",
              },
            ])
            .select("username, display_name, bio, avatar_url")
            .single()

          if (createError) {
            throw createError
          }

          data = newProfile
        }

        if (error) {
          throw error
        }

        if (data) {
          setProfile({
            username: data.username || "",
            display_name: data.display_name || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url || "",
          })
          if (data.avatar_url) {
            setPreviewUrl(data.avatar_url)
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        setError("Failed to load profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase, router])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviewUrl(previewUrl)

    try {
      setSaving(true)
      setError(null)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/sign-in")
        return
      }

      console.log("Starting file upload...")
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      })

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`
      const filePath = fileName

      console.log("Attempting upload to path:", filePath)

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      console.log("Upload result:", { error: uploadError })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log("Generated public URL:", publicUrl)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id)

      if (updateError) {
        throw new Error(`Profile update failed: ${updateError.message}`)
      }

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      setSuccess("Profile picture updated successfully!")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setError(error.message || "Failed to upload profile picture")
      // Clean up the preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    } finally {
      setSaving(false)
    }
  }

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
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00517c] border-r-transparent"></div>
              <p className="mt-4">Loading profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-4xl">{profile.display_name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#00517c] hover:bg-[#00517c]/90 text-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Profile Picture
                  </Button>
                </div>

                <div>
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-zinc-800 border-zinc-700 focus:border-[#00517c] focus:ring-[#00517c]"
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
                    className="mt-1 block w-full bg-zinc-800 border-zinc-700 focus:border-[#00517c] focus:ring-[#00517c]"
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
                    className="mt-1 block w-full bg-zinc-800 border-zinc-700 focus:border-[#00517c] focus:ring-[#00517c]"
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
                  className="bg-[#00517c] hover:bg-[#00517c]/90 text-white font-bold"
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
