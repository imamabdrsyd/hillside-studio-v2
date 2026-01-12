'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import {
  Profile,
  AuthState,
  SignUpData,
  SignInData,
  UpdateProfileData,
  UpdatePasswordData,
} from '@/types/auth'

interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>
  signIn: (data: SignInData) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (data: UpdatePasswordData) => Promise<{ error: Error | null }>
  updateProfile: (data: UpdateProfileData) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    initialized: false,
  })

  const supabase = createClient()

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({
            user: session.user,
            profile,
            loading: false,
            initialized: true,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            initialized: true,
          })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setState({
          user: null,
          profile: null,
          loading: false,
          initialized: true,
        })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          profile,
          loading: false,
          initialized: true,
        })
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          initialized: true,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign up new user
  const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error: error as Error }
    }
  }

  // Sign in existing user
  const signIn = async (data: SignInData): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: error as Error }
    }
  }

  // Sign out user
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setState({
        user: null,
        profile: null,
        loading: false,
        initialized: true,
      })
      // Redirect to login after signout
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Send password reset email
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { error: error as Error }
    }
  }

  // Update user password
  const updatePassword = async (
    data: UpdatePasswordData
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error updating password:', error)
      return { error: error as Error }
    }
  }

  // Update user profile
  const updateProfile = async (
    data: UpdateProfileData
  ): Promise<{ error: Error | null }> => {
    try {
      if (!state.user) {
        throw new Error('No user logged in')
      }

      const { error } = await (supabase
        .from('profiles') as any)
        .update(data)
        .eq('id', state.user.id)

      if (error) throw error

      // Refresh profile
      await refreshProfile()

      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error: error as Error }
    }
  }

  // Refresh user profile
  const refreshProfile = async () => {
    if (!state.user) return

    const profile = await fetchProfile(state.user.id)
    setState((prev) => ({
      ...prev,
      profile,
    }))
  }

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
