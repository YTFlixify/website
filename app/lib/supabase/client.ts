import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase/database.types'

export function createClient() {
  return createClientComponentClient<Database>()
} 