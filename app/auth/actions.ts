"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string

  const supabase = createServerActionClient<Database>({ cookies })

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        username,
        full_name: username,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Check your email to confirm your account!" }
}

export async function signOut() {
  const supabase = createServerActionClient<Database>({ cookies })
  await supabase.auth.signOut()
  redirect("/")
}

export async function getSession() {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
