"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface MessageFormProps {
  recipientId: string
  recipientName: string
}

export function MessageForm({ recipientId, recipientName }: MessageFormProps) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!message.trim()) {
      setError("Message cannot be empty")
      return
    }

    try {
      setSending(true)
      setError(null)
      setSuccess(null)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError("You must be signed in to send messages")
        return
      }

      const { error } = await supabase.from("messages").insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: message.trim(),
      })

      if (error) {
        throw error
      }

      setSuccess(`Message sent to ${recipientName}!`)
      setMessage("")

      // Refresh the router to update any UI that depends on this data
      router.refresh()
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError(error.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/20 border-green-900 text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Send a message to ${recipientName}...`}
          className="min-h-[120px] bg-zinc-800 border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={sending || !message.trim()}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
          >
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  )
}
