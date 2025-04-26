import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/app/lib/supabase/server-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { MessageForm } from "@/components/message-form"
import { cookies } from 'next/headers'

export default async function UserProfile({ params }: { params: { username: string } }) {
  const { username } = params
  
  if (!username) {
    console.error("No username provided")
    return notFound()
  }

  try {
    // Initialize Supabase client
    const cookieStore = cookies()
    if (!cookieStore) {
      throw new Error("Cookie store not available")
    }

    const supabase = await createServerClient()
    if (!supabase) {
      throw new Error("Failed to initialize Supabase client")
    }

    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1)
      .single()

    if (testError) {
      console.error("Database connection test failed:", testError)
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    console.log("Fetching profile for username:", username)

    // Get the profile for the username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        bio,
        created_at,
        updated_at
      `)
      .eq("username", username)
      .single()

    if (profileError) {
      console.error("Profile fetch error details:", {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint
      })
      
      if (profileError.code === "PGRST116") {
        return notFound()
      }
      throw new Error(`Failed to load profile: ${profileError.message}`)
    }

    if (!profile) {
      console.log("No profile found for username:", username)
      return notFound()
    }

    console.log("Profile found:", {
      id: profile.id,
      username: profile.username,
      hasDisplayName: !!profile.display_name,
      hasAvatar: !!profile.avatar_url,
      hasBio: !!profile.bio
    })

    // Get the current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session fetch error:", {
        message: sessionError.message,
        status: sessionError.status
      })
      throw new Error(`Failed to load session: ${sessionError.message}`)
    }

    const session = sessionData.session
    const isOwnProfile = session?.user.id === profile.id
    const isAuthenticated = !!session

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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/" className="flex items-center text-[#00517c] hover:text-[#00517c]/90">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </div>

            <div className="bg-zinc-900 rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/5 p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-zinc-800 border-4 border-[#00517c]">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {profile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile.display_name || `@${profile.username}`}</h1>
                    <p className="text-zinc-400 mb-4">@{profile.username}</p>
                    {profile.bio && (
                      <div className="max-w-2xl">
                        <p className="text-zinc-300">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-8">
                {isOwnProfile ? (
                  <div className="flex justify-end">
                    <Link href="/profile/edit">
                      <Button className="bg-[#00517c] hover:bg-[#00517c]/90 text-white">Edit Profile</Button>
                    </Link>
                  </div>
                ) : isAuthenticated ? (
                  <div className="mt-6 border-t border-zinc-800 pt-6">
                    <h2 className="text-xl font-bold mb-4">Send a Message</h2>
                    <MessageForm recipientId={profile.id} recipientName={profile.display_name || profile.username} />
                  </div>
                ) : (
                  <div className="mt-6 border-t border-zinc-800 pt-6 text-center">
                    <p className="mb-4">Sign in to send a message to {profile.display_name || profile.username}</p>
                    <Link href="/auth/sign-in">
                      <Button className="bg-[#00517c] hover:bg-[#00517c]/90 text-white">Sign In</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Unexpected error in UserProfile:", error)
    throw error
  }
}
