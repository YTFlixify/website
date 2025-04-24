"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Check for unread messages
  useEffect(() => {
    if (!user) return

    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("read", false)

        if (error) {
          console.error("Error fetching unread count:", error)
          return
        }

        setUnreadCount(count || 0)
      } catch (err) {
        console.error("Error in fetchUnreadCount:", err)
      }
    }

    fetchUnreadCount()

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New message received:", payload)
          fetchUnreadCount()
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        className="rounded-full text-sm h-9 px-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
        disabled
      >
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/messages">
          <Button
            variant="outline"
            className="rounded-full text-sm h-9 px-4 border-zinc-700 hover:bg-zinc-800 hover:text-white relative"
            onClick={() => router.refresh()}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant="outline"
            className="rounded-full text-sm h-9 px-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            Profile
          </Button>
        </Link>
        <Button
          variant="outline"
          className="rounded-full text-sm h-9 px-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Link href="/auth/sign-in">
      <Button
        variant="outline"
        className="rounded-full text-sm h-9 px-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
      >
        Sign In
      </Button>
    </Link>
  )
}
