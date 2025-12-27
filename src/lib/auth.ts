import { supabase } from './supabase'
import type { Profile } from './supabase'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') + '/functions/v1'

export interface RegisterData {
  phone: string
  name: string
  password: string
  user_type?: 'customer' | 'driver'
  profile_type?: 'regular' | 'student' | 'worker' | 'parent'
}

export interface LoginData {
  phone: string
  password?: string
  otp?: string
}

export interface AuthResponse {
  user: Profile
  token: string
  refresh_token?: string
}

export const authAPI = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${FUNCTIONS_URL}/auth-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    const result = await response.json()

    if (result.token) {
      await supabase.auth.setSession({
        access_token: result.token,
        refresh_token: result.refresh_token || ''
      })
    }

    return result
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${FUNCTIONS_URL}/auth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    const result = await response.json()

    if (result.token) {
      await supabase.auth.setSession({
        access_token: result.token,
        refresh_token: result.refresh_token || ''
      })
    }

    return result
  },

  async sendOTP(phone: string): Promise<{ message: string; expires_in: number; dev_otp?: string }> {
    const response = await fetch(`${FUNCTIONS_URL}/auth-otp-send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ phone })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send OTP')
    }

    return response.json()
  },

  async verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(`${FUNCTIONS_URL}/auth-otp-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ phone, otp })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'OTP verification failed')
    }

    const result = await response.json()

    if (result.token) {
      await supabase.auth.setSession({
        access_token: result.token,
        refresh_token: result.refresh_token || ''
      })
    }

    return result
  },

  async getProfile(): Promise<Profile> {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/users-me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch profile')
    }

    return response.json()
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/users-me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update profile')
    }

    return response.json()
  },

  async submitStudentVerification(data: {
    document_url: string
    school_name?: string
    student_id?: string
  }): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/users-student-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit verification')
    }

    return response.json()
  },

  async getChildProfiles() {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/users-child-profiles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch child profiles')
    }

    return response.json()
  },

  async createChildProfile(data: {
    name: string
    age?: number
    school_name?: string
    pickup_locations?: string[]
    dropoff_locations?: string[]
    emergency_contact?: string
  }) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/users-child-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create child profile')
    }

    return response.json()
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/customer`
      }
    })

    if (error) {
      throw error
    }

    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }
}
