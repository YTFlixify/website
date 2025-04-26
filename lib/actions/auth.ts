"use server"

import { createServerClient } from "@/app/lib/supabase/server-client"
import type { User } from "@supabase/supabase-js"

export async function getAuthData() {
  const supabase = await createServerClient()
  
  // Get the current authenticated user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("getAuthData: Error fetching user or no user:", userError)
    return { user: null, unreadCount: 0 }
  }

  // Get unread message count
  const { count, error: countError } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false)

  if (countError) {
    console.error("getAuthData: Error fetching unread count:", countError)
    return { user, unreadCount: 0 }
  }

  return { user, unreadCount: count || 0 }
} 