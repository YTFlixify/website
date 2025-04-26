import { redirect } from "next/navigation"
import { createServerClient } from "@/app/lib/supabase/server-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function Profile() {
  try {
    console.log("Starting profile fetch...")
    const supabase = await createServerClient()
    
    // Get session with more detailed error handling
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    console.log("Session data:", { 
      hasSession: !!session, 
      userId: session?.user?.id,
      sessionError: sessionError ? JSON.stringify(sessionError) : null 
    })

    if (sessionError) {
      console.error("Session error:", sessionError)
      throw new Error(`Session error: ${JSON.stringify(sessionError)}`)
    }

    if (!session?.user?.id) {
      console.log("No valid session found, redirecting to sign in")
      redirect("/auth/sign-in")
    }

    // Verify the profiles table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)

    console.log("Table check result:", { 
      tableExists: !!tableCheck, 
      tableError: tableError ? JSON.stringify(tableError) : null 
    })

    if (tableError) {
      console.error("Table check error:", tableError)
      throw new Error(`Database error: ${JSON.stringify(tableError)}`)
    }

    console.log("Fetching profile for user:", session.user.id)
    
    // Try to fetch the profile with more detailed error handling
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()

    console.log("Profile fetch result:", { 
      hasProfile: !!profile, 
      profileError: profileError ? JSON.stringify(profileError) : null 
    })

    // If profile doesn't exist, create one
    if (!profile && !profileError) {
      console.log("No profile found, creating new profile")
      const username = session.user.email?.split("@")[0] || "user"
      const displayName = session.user.user_metadata?.full_name || username

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert([
          {
            id: session.user.id,
            username: username,
            display_name: displayName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      console.log("Profile creation result:", { 
        newProfile: !!newProfile, 
        createError: createError ? JSON.stringify(createError) : null 
      })

      if (createError) {
        console.error("Error creating profile:", createError)
        throw new Error(`Failed to create profile: ${JSON.stringify(createError)}`)
      }

      profile = newProfile
    }

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      throw new Error(`Failed to load profile: ${JSON.stringify(profileError)}`)
    }

    if (!profile) {
      throw new Error("Profile not found and could not be created")
    }

    console.log("Fetching preferences for user:", session.user.id)
    
    let { data: preferences, error: preferencesError } = await supabase
      .from("content_preferences")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    console.log("Preferences fetch result:", { 
      hasPreferences: !!preferences, 
      preferencesError: preferencesError ? JSON.stringify(preferencesError) : null,
      errorCode: preferencesError?.code,
      errorMessage: preferencesError?.message,
      errorDetails: preferencesError?.details
    })

    // If preferences don't exist, create default ones
    if (preferencesError?.code === 'PGRST116') { // No rows returned
      console.log("No preferences found, creating default preferences")
      const { data: newPreferences, error: createError } = await supabase
        .from("content_preferences")
        .insert([
          {
            user_id: session.user.id,
            favorite_category: null,
            notification_enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error("Error creating default preferences:", createError)
      } else {
        preferences = newPreferences
        preferencesError = null
      }
    } else if (preferencesError) {
      console.error("Error fetching preferences:", {
        error: preferencesError,
        code: preferencesError.code,
        message: preferencesError.message,
        details: preferencesError.details,
        hint: preferencesError.hint
      })
    }

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
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <div className="flex gap-4">
                <Link href="/messages">
                  <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white">
                    View Messages
                  </Button>
                </Link>
                <Link href={`/user/${profile?.username}`}>
                  <Button className="bg-[#00517c] hover:bg-[#00517c]/90 text-white">View Public Profile</Button>
                </Link>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-[#00517c]">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={profile.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {profile?.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.display_name || profile?.username}</h2>
                  <p className="text-zinc-400">@{profile?.username}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <p>{session.user.email}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Username</p>
                  <p>{profile?.username || "Not set"}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Display Name</p>
                  <p>{profile?.display_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Bio</p>
                  <p>{profile?.bio || "No bio added yet"}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/profile/edit">
                  <Button className="bg-[#00517c] hover:bg-[#00517c]/90 text-white">Edit Profile</Button>
                </Link>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Content Preferences</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-400 text-sm">Favorite Category</p>
                  <p>{preferences?.favorite_category || "Not set"}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Notifications</p>
                  <p>{preferences?.notification_enabled ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/profile/preferences">
                  <Button className="bg-[#00517c] hover:bg-[#00517c]/90 text-white">Edit Preferences</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error in Profile component:", error)
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
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Error</h1>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <p>{error instanceof Error ? error.message : "An error occurred"}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
