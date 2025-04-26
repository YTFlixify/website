"use client"

import * as React from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { markAllMessagesAsRead } from "@/lib/actions/messages"

interface MessagesContextMenuProps {
  children: React.ReactNode
  onMarkAllRead?: () => Promise<void>
}

export function MessagesContextMenu({ children, onMarkAllRead }: MessagesContextMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleMarkAsRead = async () => {
    try {
      setIsLoading(true)
      console.log("Starting mark as read process...")
      
      if (onMarkAllRead) {
        await onMarkAllRead()
      } else {
        const result = await markAllMessagesAsRead()
        console.log("Server action result:", result)
        
        if (!result.success) {
          toast({
            title: "Error",
            description: "Failed to mark messages as read",
            variant: "destructive",
          })
          return
        }
      }
      
      console.log("Successfully marked messages as read")
      toast({
        title: "Success",
        description: "Messages marked as read",
      })
      
      // Force a hard refresh of the page
      window.location.reload()
    } catch (error) {
      console.error("Unexpected error in handleMarkAsRead:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="block">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[160px] bg-zinc-900 border border-zinc-800 rounded-md p-1">
        <ContextMenuItem 
          onClick={handleMarkAsRead}
          disabled={isLoading}
          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-zinc-100 focus:bg-zinc-800 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          {isLoading ? "Marking as Read..." : "Mark All as Read"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
} 