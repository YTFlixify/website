"use server"

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/supabase/database.types'

export async function createServerClient() {
  try {
    const cookieStore = cookies()
    
    // Create the Supabase client with explicit configuration
    const supabase = createServerComponentClient<Database>(
      {
        cookies: () => cookieStore,
      },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        options: {
          db: {
            schema: 'public'
          }
        }
      }
    )

    // Test the connection and log any errors
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single()

    if (error) {
      console.error('Supabase connection test error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    // Log successful connection
    console.log('Supabase connection test successful:', { data })

    return supabase
  } catch (error) {
    console.error('Error creating Supabase client:', {
      error,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
    throw error
  }
} 