"use server"

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'

interface AuthData {
  user: User | null
  unreadCount: number
}

export async function getAuthData(): Promise<AuthData> {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { user: null, unreadCount: 0 }
  }

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .eq('read', false)

  return { user, unreadCount: count || 0 }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  await supabase.auth.signOut()
} 