'use client'

import { useState, useEffect, useCallback } from "react"
import { redirect, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { MessageForm } from "@/components/message-form"
import { MessageItem } from "@/components/message-item"
import { useToast } from "@/hooks/use-toast"
import { debounce } from "@/lib/utils"
import { deleteMessage } from "@/lib/actions/messages"
import { AuthButtonWrapper } from "@/app/components/auth-button-wrapper"

export default function Messages() {
  const [receivedMessages, setReceivedMessages] = useState<any[]>([])
  const [sentMessages, setSentMessages] = useState<any[]>([])
  const [filteredReceivedMessages, setFilteredReceivedMessages] = useState<any[]>([])
  const [filteredSentMessages, setFilteredSentMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const [deletingMessages, setDeletingMessages] = useState<Set<string>>(new Set())

  // Filter messages based on search query
  const filterMessages = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredReceivedMessages(receivedMessages)
      setFilteredSentMessages(sentMessages)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filteredReceived = receivedMessages.filter(msg => 
      msg.content.toLowerCase().includes(lowerQuery) ||
      msg.sender?.username?.toLowerCase().includes(lowerQuery) ||
      msg.receiver?.username?.toLowerCase().includes(lowerQuery)
    )
    const filteredSent = sentMessages.filter(msg => 
      msg.content.toLowerCase().includes(lowerQuery) ||
      msg.sender?.username?.toLowerCase().includes(lowerQuery) ||
      msg.receiver?.username?.toLowerCase().includes(lowerQuery)
    )

    setFilteredReceivedMessages(filteredReceived)
    setFilteredSentMessages(filteredSent)
  }, [receivedMessages, sentMessages])

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      filterMessages(query)
    }, 300),
    [filterMessages]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Fetch messages and profiles
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Session error:", sessionError)
        toast({
          title: "Authentication Error",
          description: "Failed to get session",
          variant: "destructive",
        })
        return
      }

      if (!session) {
        console.error("No active session")
        toast({
          title: "Authentication Error",
          description: "Please sign in to view messages",
          variant: "destructive",
        })
        return
      }

      console.log("Current user ID:", session.user.id)

      // Get all messages for the current user
      console.log("Fetching received messages...")
      const { data: received, error: receivedError } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          read,
          created_at,
          updated_at
        `)
        .eq("recipient_id", session.user.id)
        .order("created_at", { ascending: false })

      if (receivedError) {
        console.error("Error fetching received messages:", {
          message: receivedError.message,
          details: receivedError.details,
          hint: receivedError.hint,
          code: receivedError.code
        })
        toast({
          title: "Error",
          description: receivedError.message || "Failed to load received messages",
          variant: "destructive",
        })
      } else {
        console.log("Successfully fetched received messages:", received?.length || 0)
      }

      // Get sent messages
      console.log("Fetching sent messages...")
      const { data: sent, error: sentError } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          read,
          created_at,
          updated_at
        `)
        .eq("sender_id", session.user.id)
        .order("created_at", { ascending: false })

      if (sentError) {
        console.error("Error fetching sent messages:", {
          message: sentError.message,
          details: sentError.details,
          hint: sentError.hint,
          code: sentError.code
        })
        toast({
          title: "Error",
          description: sentError.message || "Failed to load sent messages",
          variant: "destructive",
        })
      } else {
        console.log("Successfully fetched sent messages:", sent?.length || 0)
      }

      // Fetch profile information separately
      const senderIds = [...new Set([
        ...(received || []).map(msg => msg.sender_id),
        ...(sent || []).map(msg => msg.sender_id)
      ])]
      
      const recipientIds = [...new Set([
        ...(received || []).map(msg => msg.recipient_id),
        ...(sent || []).map(msg => msg.recipient_id)
      ])]

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", [...senderIds, ...recipientIds])

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError)
      } else {
        // Create a map of profile data
        const profilesMap = (profiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile
          return acc
        }, {} as Record<string, { id: string; username: string }>)

        // Add profile data to messages
        const receivedWithProfiles = (received || []).map(msg => ({
          ...msg,
          sender: profilesMap[msg.sender_id],
          receiver: profilesMap[msg.recipient_id]
        }))

        const sentWithProfiles = (sent || []).map(msg => ({
          ...msg,
          sender: profilesMap[msg.sender_id],
          receiver: profilesMap[msg.recipient_id]
        }))

        setReceivedMessages(receivedWithProfiles)
        setSentMessages(sentWithProfiles)
        setFilteredReceivedMessages(receivedWithProfiles)
        setFilteredSentMessages(sentWithProfiles)
      }
    } catch (error) {
      console.error("Unexpected error in fetchData:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading messages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleDeleteMessage = async (messageId: string) => {
    setDeletingMessages(prev => new Set(prev).add(messageId))
    
    // Store current state for potential rollback
    const previousReceived = [...receivedMessages]
    const previousSent = [...sentMessages]
    
    // Optimistically update UI
    setReceivedMessages(prev => prev.filter(msg => msg.id !== messageId))
    setSentMessages(prev => prev.filter(msg => msg.id !== messageId))
    setFilteredReceivedMessages(prev => prev.filter(msg => msg.id !== messageId))
    setFilteredSentMessages(prev => prev.filter(msg => msg.id !== messageId))
    
    try {
      const result = await deleteMessage(messageId)
      
      if (!result.success) {
        // Rollback on failure
        setReceivedMessages(previousReceived)
        setSentMessages(previousSent)
        setFilteredReceivedMessages(previousReceived)
        setFilteredSentMessages(previousSent)
        toast({
          title: "Error",
          description: result.error || "Failed to delete message",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Message deleted successfully",
        })
        // Refetch data to ensure we're in sync with the server
        fetchData()
      }
    } catch (error) {
      // Rollback on error
      setReceivedMessages(previousReceived)
      setSentMessages(previousSent)
      setFilteredReceivedMessages(previousReceived)
      setFilteredSentMessages(previousSent)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setDeletingMessages(prev => {
        const next = new Set(prev)
        next.delete(messageId)
        return next
      })
    }
  }

  return (
    <>
      {/* Navigation Bar */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                <span className="text-[#00517c]">FLIXIFY</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/videos" className="text-sm font-medium hover:text-[#00517c]">
                  Videos
                </Link>
                <Link href="/streams" className="text-sm font-medium hover:text-[#00517c]">
                  Streams
                </Link>
              </nav>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <AuthButtonWrapper />
              <Button className="rounded-full text-sm h-9 px-4 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 bg-zinc-900 border-zinc-800 rounded-full text-sm h-9"
              />
            </div>
            <Link href="/profile">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white">
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Received Messages */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Received Messages</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : filteredReceivedMessages.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              {searchQuery ? "No messages match your search" : "No messages received yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReceivedMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={message.recipient_id}
                  onDelete={handleDeleteMessage}
                  isDeleting={deletingMessages.has(message.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sent Messages */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sent Messages</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : filteredSentMessages.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              {searchQuery ? "No messages match your search" : "No messages sent yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSentMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={message.sender_id}
                  onDelete={handleDeleteMessage}
                  isDeleting={deletingMessages.has(message.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
