import { createClient } from '@supabase/supabase-js'
import { config } from './config'
import type { Database } from '@/types/database'

// Get Supabase configuration with fallbacks
const supabaseUrl = config.supabase.url || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = config.supabase.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = config.supabase.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side Supabase instance (conditional initialization)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null

// Server-side Supabase instance (conditional initialization)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })
  : null

// Auth helpers
export const auth = {
  async signUp(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured')
    return await supabase.auth.signUp({ email, password })
  },
  
  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured')
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  async signOut() {
    if (!supabase) throw new Error('Supabase not configured')
    return await supabase.auth.signOut()
  },
  
  async getUser() {
    if (!supabase) throw new Error('Supabase not configured')
    return await supabase.auth.getUser()
  }
}