import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { MessagesContextMenu } from "./context-menu"
import { createClient } from "@/lib/supabase/client"

export function MessagesButton() {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('recipient_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('read', false)

      if (error) throw error
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('messages')
          .select('count')
          .eq('recipient_id', user.id)
          .eq('read', false)
          .single()

        if (error) throw error
        setUnreadCount(data?.count || 0)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()
  }, [])

  return (
    <MessagesContextMenu onMarkAllRead={markAllAsRead}>
      <Link
        href="/messages"
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
      >
        <Mail className="w-5 h-5 text-zinc-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#00517c] rounded-full">
            {unreadCount}
          </span>
        )}
      </Link>
    </MessagesContextMenu>
  )
} 