import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import type { Database } from '@/lib/supabase/database.types'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Create a new cookie store for this request
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ 
      cookies: () => cookieStore 
    })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error("Error getting user:", userError)
      return NextResponse.json({ error: "Authentication error" }, { status: 500 })
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messageId = params.id
    console.log("Attempting to delete message:", messageId, "for user:", user.id)

    // First, verify the message exists and user has permission
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("id, sender_id, recipient_id") // Select only necessary fields
      .eq("id", messageId)
      .single()

    if (fetchError) {
      console.error("Error fetching message:", fetchError.message)
      // Provide specific error if it's a "not found" error
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: "Message not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Error fetching message" }, { status: 500 })
    }

    if (!message) {
      // This case should ideally be caught by fetchError.code === 'PGRST116'
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    console.log("Found message:", message)

    // Check permissions using the correct types
    if (message.sender_id !== user.id && message.recipient_id !== user.id) {
      console.log("Permission denied. User:", user.id, "Message sender:", message.sender_id, "Message recipient:", message.recipient_id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the message
    console.log("Executing delete query for message:", messageId)
    const { data: deleteData, error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId)
      .select() // Keep select for confirmation

    if (deleteError) {
      console.error("Error deleting message:", deleteError.message)
      return NextResponse.json({ error: `Database deletion error: ${deleteError.message}` }, { status: 500 })
    }
    
    // Check if any rows were actually deleted based on the returned data
    if (!deleteData || deleteData.length === 0) {
      console.warn("Delete query executed but returned no data. RLS policy likely prevented deletion.")
      // Return success=false to client to indicate non-persistence despite no DB error
      return NextResponse.json({ success: false, error: "Message deletion blocked by policy" }, { status: 403 }) // Use 403 Forbidden
    }

    console.log("Delete result (should contain deleted row):", deleteData)
    console.log("Successfully deleted message from database:", messageId)
    return NextResponse.json({ success: true, data: deleteData })
  } catch (error: any) {
    console.error("Critical error in DELETE /api/messages/[id]:", error.message)
    return NextResponse.json({ error: `Internal server error: ${error.message || 'Unknown error'}` }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })
  
  const { data: message, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(message)
} 