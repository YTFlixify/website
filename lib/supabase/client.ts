"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single instance of the Supabase client to be used across the client components
export const createClient = () => {
  try {
    console.log("Creating Supabase client-side client...")
    const client = createClientComponentClient<Database>()
    
    // Verify client initialization
    if (!client) {
      throw new Error("Failed to create Supabase client")
    }
    
    console.log("Supabase client-side client created successfully")
    return client
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
