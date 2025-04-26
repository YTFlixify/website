'use server'

import { createServerClient } from "@/app/lib/supabase/server-client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function markMessagesAsRead(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from("messages")
      .update({ 
        read: true, 
        updated_at: new Date().toISOString() 
      })
      .eq("recipient_id", userId)
      .eq("read", false)

    if (error) {
      console.error("Error marking messages as read:", error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error)
    return { error: "Failed to mark messages as read" }
  }
}

export async function getUnreadCount(userId: string) {
  const supabase = createServerClient()
  
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("read", false)

  if (error) {
    console.error("Error fetching unread count:", error)
    return { error }
  }

  return { count: count || 0 }
}

export async function signInWithEmail(email: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
  redirect("/")
}

export async function getSession() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
} 