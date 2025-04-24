import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function Profile() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  const { data: preferences } = await supabase
    .from("content_preferences")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

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
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">View Public Profile</Button>
              </Link>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-yellow-400">
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
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Edit Profile</Button>
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
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Edit Preferences</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
