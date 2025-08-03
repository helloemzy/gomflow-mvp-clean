import { createClient } from '@supabase/supabase-js'
import { config } from './config'
import type { Database } from '@/types/database'

// Client-side Supabase instance
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

// Server-side Supabase instance (for API routes)
export const supabaseAdmin = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
)

// Auth helpers
export const auth = {
  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password })
  },
  
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  async signOut() {
    return await supabase.auth.signOut()
  },
  
  async getUser() {
    return await supabase.auth.getUser()
  }
}