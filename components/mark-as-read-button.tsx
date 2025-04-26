"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { markAllMessagesAsRead } from "@/lib/actions/messages"

interface MarkAsReadButtonProps {
  onSuccess?: () => void
}

export function MarkAsReadButton({ onSuccess }: MarkAsReadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleMarkAsRead = async () => {
    try {
      setIsLoading(true)
      console.log("Starting mark as read process...")
      
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
      
      if (result.updatedCount === 0) {
        toast({
          title: "No Messages",
          description: "No unread messages to mark as read",
        })
        return
      }
      
      console.log("Successfully marked messages as read")
      toast({
        title: "Success",
        description: `Marked ${result.updatedCount} message${result.updatedCount === 1 ? '' : 's'} as read`,
      })
      
      // Call the onSuccess callback if provided
      onSuccess?.()
      
      // Refresh the page to show updated state
      router.refresh()
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
    <Button
      onClick={handleMarkAsRead}
      disabled={isLoading}
      variant="outline"
      className="border-zinc-700 hover:bg-zinc-800 hover:text-white"
    >
      {isLoading ? "Marking as Read..." : "Mark All as Read"}
    </Button>
  )
} 