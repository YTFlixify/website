import { createClient } from "@/lib/supabase/client"

export async function initializeStorage() {
  const supabase = createClient()
  
  try {
    // Try to list files in the profiles bucket to verify access
    const { data: files, error: listError } = await supabase.storage
      .from('profiles')
      .list('avatars', {
        limit: 1
      })

    // If we get a permission error, the bucket exists but we don't have access
    // If we get a not found error, the bucket doesn't exist
    if (listError) {
      if (listError.message.includes('not found')) {
        throw new Error('The profiles bucket does not exist. Please create it in the Supabase dashboard.')
      } else if (listError.message.includes('permission')) {
        throw new Error('You do not have permission to access the profiles bucket. Please check your storage policies.')
      } else {
        throw new Error(`Storage access error: ${listError.message}`)
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Storage initialization error:', error)
    return { success: false, error: error.message }
  }
} 