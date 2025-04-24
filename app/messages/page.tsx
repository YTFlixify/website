import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export default async function Messages() {
  const supabase = createClient()

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in")
  }

  // Get all messages for the current user with proper joins
  const { data: receivedMessages, error: receivedError } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!sender_id(username, display_name)
    `)
    .eq("recipient_id", session.user.id)
    .order("created_at", { ascending: false })

  console.log("Received messages query error:", receivedError)

  const { data: sentMessages, error: sentError } = await supabase
    .from("messages")
    .select(`
      *,
      recipient:profiles!recipient_id(username, display_name)
    `)
    .eq("sender_id", session.user.id)
    .order("created_at", { ascending: false })

  console.log("Sent messages query error:", sentError)

  // Mark unread messages as read
  const unreadMessageIds = receivedMessages?.filter((message) => !message.read).map((message) => message.id) || []

  if (unreadMessageIds.length > 0) {
    await supabase
      .from("messages")
      .update({ read: true, updated_at: new Date().toISOString() })
      .in("id", unreadMessageIds)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="font-bold text-2xl tracking-tighter">
              FORT<span className="text-yellow-400">CREATOR</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Link href="/profile">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white">
                Back to Profile
              </Button>
            </Link>
          </div>

          {(receivedError || sentError) && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-lg mb-6">
              <p className="font-bold">Error loading messages:</p>
              <p>{receivedError?.message || sentError?.message}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Received Messages */}
            <div>
              <h2 className="text-xl font-bold mb-4">Received Messages</h2>
              {receivedMessages && receivedMessages.length > 0 ? (
                <div className="space-y-4">
                  {receivedMessages.map((message) => (
                    <div key={message.id} className="bg-zinc-900 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <Link
                          href={`/user/${message.sender.username}`}
                          className="font-bold text-yellow-400 hover:text-yellow-500"
                        >
                          From: {message.sender.display_name || message.sender.username}
                        </Link>
                        <span className="text-zinc-500 text-sm">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-zinc-300">{message.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500">No messages received yet.</p>
              )}
            </div>

            {/* Sent Messages */}
            <div>
              <h2 className="text-xl font-bold mb-4">Sent Messages</h2>
              {sentMessages && sentMessages.length > 0 ? (
                <div className="space-y-4">
                  {sentMessages.map((message) => (
                    <div key={message.id} className="bg-zinc-800 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <Link
                          href={`/user/${message.recipient.username}`}
                          className="font-bold text-yellow-400 hover:text-yellow-500"
                        >
                          To: {message.recipient.display_name || message.recipient.username}
                        </Link>
                        <span className="text-zinc-500 text-sm">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          {message.read ? " • Read" : " • Unread"}
                        </span>
                      </div>
                      <p className="text-zinc-300">{message.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500">No messages sent yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
