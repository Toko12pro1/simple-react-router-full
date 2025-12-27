import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export type Profile = {
  id: string
  phone: string
  name: string
  user_type: 'customer' | 'driver' | 'admin'
  profile_type: 'regular' | 'student' | 'worker' | 'parent'
  status: 'active' | 'suspended' | 'pending'
  discount_percentage: number
  wallet_balance: number
  is_student_verified: boolean
  is_driver_verified: boolean
  avatar_url?: string
  zone?: string
  created_at: string
  updated_at: string
}

export type ChildProfile = {
  id: string
  parent_id: string
  name: string
  age?: number
  school_name?: string
  pickup_locations: string[]
  dropoff_locations: string[]
  emergency_contact?: string
  created_at: string
  updated_at: string
}
