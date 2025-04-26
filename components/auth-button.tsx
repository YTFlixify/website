"use client"

import { useEffect, useState } from "react"
import { AuthButtonClient } from "@/components/auth-button-client"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthData {
  user: User | null
  unreadCount: number
}

export function AuthButton() {
  const [authData, setAuthData] = useState<AuthData>({
    user: null,
    unreadCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        let unreadCount = 0
        if (user) {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('read', false)
          unreadCount = count || 0
        }

        setAuthData({ user, unreadCount })
      } catch (error) {
        console.error('Error fetching auth data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthData()
  }, [])

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse bg-gray-200 rounded" />
  }

  return <AuthButtonClient user={authData.user} unreadCount={authData.unreadCount} />
}
