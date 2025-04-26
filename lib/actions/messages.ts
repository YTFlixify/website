'use server'

import { createServerClient } from "@/app/lib/supabase/server-client"
import { revalidatePath } from "next/cache"
import { toast } from "sonner"

export async function sendMessage(recipientId: string, content: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      content,
      read: false,
    })

  if (error) {
    throw error
  }

  revalidatePath("/messages")
  return { success: true }
}

export async function markMessageAsRead(messageId: string) {
  const supabase = await createServerClient()
  
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)

  if (error) {
    throw error
  }
}

export async function markAllMessagesAsRead() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // First get the count of messages that will be updated
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false)

  // Then update them
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("recipient_id", user.id)
    .eq("read", false)

  if (error) {
    throw error
  }

  revalidatePath("/messages")
  return { success: true, updatedCount: count || 0 }
}

export async function getUnreadCount() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { count: 0 }
  }

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false)

  if (error) {
    throw error
  }

  return { count: count || 0 }
}

export async function getUnreadMessagesCount(userId: string) {
  const supabase = await createServerClient()
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('read', false)

  if (error) {
    throw error
  }

  return count || 0
}

export async function deleteMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[deleteMessage] Attempting to delete message with ID: ${messageId}`);
  try {
    const supabase = await createServerClient()
    
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('[deleteMessage] User fetch error:', userError)
      return { success: false, error: 'Failed to get user' }
    }
    
    if (!user) {
      console.log('[deleteMessage] No authenticated user, cannot delete.');
      return { success: false, error: 'Not authenticated' }
    }

    console.log(`[deleteMessage] User ${user.id} attempting deletion.`);

    // First verify the message exists and belongs to the user
    console.log(`[deleteMessage] Verifying message ${messageId} ownership for user ${user.id}`);
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .single()

    if (fetchError) {
      console.error('[deleteMessage] Error fetching message for verification:', fetchError)
      return { success: false, error: 'Message not found or access denied' }
    }

    if (!message) {
      console.log(`[deleteMessage] Message ${messageId} not found or user ${user.id} does not own it.`);
      return { success: false, error: 'Message not found' }
    }

    console.log(`[deleteMessage] Message ${messageId} verified. Proceeding with deletion.`);
    // Delete the message
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (deleteError) {
      console.error('[deleteMessage] Error deleting message from database:', deleteError)
      return { success: false, error: 'Failed to delete message' }
    }

    console.log(`[deleteMessage] Message ${messageId} successfully deleted from database.`);
    // Revalidate all relevant paths
    console.log('[deleteMessage] Revalidating paths: /messages, /, /profile');
    revalidatePath('/messages')
    revalidatePath('/')
    revalidatePath('/profile')
    
    console.log(`[deleteMessage] Deletion successful for message ${messageId}.`);
    return { success: true }
  } catch (error) {
    console.error('[deleteMessage] Unexpected error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
} 