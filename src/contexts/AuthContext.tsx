'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
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

/**
 * AuthContextType - Interface yang mendefinisikan semua fungsi dan state
 * yang tersedia dalam Auth Context.
 * Extends AuthState untuk mewarisi properti user, profile, loading, dan initialized.
 */
interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>
  signIn: (data: SignInData) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (data: UpdatePasswordData) => Promise<{ error: Error | null }>
  updateProfile: (data: UpdateProfileData) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

/**
 * Membuat React Context untuk Auth.
 * Default value undefined agar bisa mendeteksi jika digunakan di luar Provider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider - Component utama yang menyediakan auth state ke seluruh aplikasi.
 * Wrap komponen root aplikasi dengan provider ini untuk mengakses auth di mana saja.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * State management untuk authentication.
   * - user: Data user dari Supabase Auth
   * - profile: Data profil user dari tabel 'profiles'
   * - loading: Status loading saat proses auth berlangsung
   * - initialized: Flag untuk menandai auth sudah diinisialisasi
   */
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    initialized: false,
  })

  // Memoize Supabase client agar tidak di-recreate setiap render
  const supabase = useMemo(() => createClient(), [])

  /**
   * fetchProfile - Mengambil data profil user dari tabel 'profiles' di database.
   * @param userId - ID user dari Supabase Auth
   * @returns Profile object jika ditemukan, null jika tidak ada atau error
   *
   * Catatan: Menggunakan 'as any' untuk bypass TypeScript karena
   * tabel 'profiles' mungkin belum didefinisikan di types Supabase.
   */
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // Query ke tabel profiles dengan filter berdasarkan user ID
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single() // Mengambil single row karena ID unik

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

  /**
   * useEffect untuk inisialisasi auth state saat komponen mount.
   * Melakukan 2 hal utama:
   * 1. Mengecek session yang sudah ada (untuk persistent login)
   * 2. Setup listener untuk perubahan auth state
   */
  useEffect(() => {
    // Flag untuk mencegah state update setelah unmount (memory leak prevention)
    let mounted = true

    /**
     * initializeAuth - Fungsi async untuk mengecek dan restore session.
     * Dipanggil sekali saat komponen pertama kali mount.
     */
    const initializeAuth = async () => {
      try {
        // Ambil session aktif dari Supabase (jika ada)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Hanya update state jika komponen masih mounted
        if (mounted) {
          if (session?.user) {
            // User sudah login - simpan token dan fetch profile
            if (session.access_token) {
              localStorage.setItem('auth_token', session.access_token)
            }

            // Ambil data profil dari database
            const profile = await fetchProfile(session.user.id)
            setState({
              user: session.user,
              profile,
              loading: false,
              initialized: true,
            })
          } else {
            // Tidak ada session - clear token dan reset state
            localStorage.removeItem('auth_token')
            setState({
              user: null,
              profile: null,
              loading: false,
              initialized: true,
            })
          }
        }
      } catch (error) {
        // Error handling - reset ke state default
        console.error('Error initializing auth:', error)
        if (mounted) {
          localStorage.removeItem('auth_token')
          setState({
            user: null,
            profile: null,
            loading: false,
            initialized: true,
          })
        }
      }
    }

    // Jalankan inisialisasi
    initializeAuth()

    /**
     * onAuthStateChange - Listener yang dipanggil setiap kali ada perubahan auth.
     * Event yang bisa terjadi: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, dll.
     * Ini memastikan UI selalu sinkron dengan state auth terbaru.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)

      if (mounted) {
        if (session?.user) {
          // User login/token refresh - update token dan state
          if (session.access_token) {
            localStorage.setItem('auth_token', session.access_token)
          }

          const profile = await fetchProfile(session.user.id)
          setState({
            user: session.user,
            profile,
            loading: false,
            initialized: true,
          })
        } else {
          // User logout - clear semua data
          localStorage.removeItem('auth_token')
          setState({
            user: null,
            profile: null,
            loading: false,
            initialized: true,
          })
        }
      }
    })

    /**
     * Cleanup function - dipanggil saat komponen unmount.
     * Penting untuk:
     * 1. Set mounted = false agar tidak ada state update setelah unmount
     * 2. Unsubscribe dari listener untuk mencegah memory leak
     */
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array = hanya jalan sekali saat mount

  /**
   * signUp - Mendaftarkan user baru ke Supabase Auth.
   * @param data - Object berisi email, password, dan fullName
   * @returns Object dengan error (null jika sukses)
   *
   * Flow:
   * 1. Kirim request signup ke Supabase
   * 2. Supabase akan mengirim email verifikasi ke user
   * 3. User klik link di email -> redirect ke /auth/callback
   */
  const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // Metadata tambahan yang disimpan di user object
          data: {
            full_name: data.fullName,
          },
          // URL redirect setelah user verifikasi email
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

  /**
   * signIn - Login user yang sudah terdaftar.
   * @param data - Object berisi email dan password
   * @returns Object dengan error (null jika sukses)
   *
   * Catatan: Setelah login berhasil, onAuthStateChange listener akan
   * otomatis terpicu dan mengupdate state + fetch profile.
   */
  const signIn = async (data: SignInData): Promise<{ error: Error | null }> => {
    try {
      // Autentikasi dengan email & password
      const { data: sessionData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Simpan access token ke localStorage untuk akses API
      if (sessionData?.session?.access_token) {
        localStorage.setItem('auth_token', sessionData.session.access_token)
        console.log('Token saved to localStorage')
      }

      return { error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: error as Error }
    }
  }

  /**
   * signOut - Logout user dari aplikasi.
   *
   * Flow:
   * 1. Panggil Supabase signOut untuk invalidate session
   * 2. Hapus token dari localStorage
   * 3. Reset state ke kondisi awal (not logged in)
   * 4. Redirect ke halaman login
   */
  const signOut = async () => {
    try {
      // Logout dari Supabase (invalidate session di server)
      await supabase.auth.signOut()

      // Bersihkan token dari localStorage
      localStorage.removeItem('auth_token')

      // Reset state ke kondisi tidak login
      setState({
        user: null,
        profile: null,
        loading: false,
        initialized: true,
      })

      // Redirect ke halaman login
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  /**
   * resetPassword - Mengirim email reset password ke user.
   * @param email - Email user yang ingin reset password
   * @returns Object dengan error (null jika sukses)
   *
   * Flow:
   * 1. Supabase kirim email dengan link reset password
   * 2. User klik link -> redirect ke /reset-password
   * 3. Di halaman tersebut, user bisa set password baru
   */
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // URL redirect setelah user klik link di email
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { error: error as Error }
    }
  }

  /**
   * updatePassword - Mengubah password user yang sudah login.
   * @param data - Object berisi newPassword
   * @returns Object dengan error (null jika sukses)
   *
   * Catatan: User harus sudah login untuk bisa update password.
   * Biasanya dipanggil setelah user klik link reset password.
   */
  const updatePassword = async (
    data: UpdatePasswordData
  ): Promise<{ error: Error | null }> => {
    try {
      // Update password di Supabase Auth
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

  /**
   * updateProfile - Mengupdate data profil user di database.
   * @param data - Object berisi field yang ingin diupdate (full_name, avatar_url, dll)
   * @returns Object dengan error (null jika sukses)
   *
   * Catatan: Setelah update berhasil, otomatis refresh profile
   * agar UI menampilkan data terbaru.
   */
  const updateProfile = async (
    data: UpdateProfileData
  ): Promise<{ error: Error | null }> => {
    try {
      // Pastikan user sudah login
      if (!state.user) {
        throw new Error('No user logged in')
      }

      // Update data di tabel profiles
      const { error } = await (supabase
        .from('profiles') as any)
        .update(data)
        .eq('id', state.user.id)

      if (error) throw error

      // Refresh profile untuk sinkronisasi state dengan database
      await refreshProfile()

      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error: error as Error }
    }
  }

  /**
   * refreshProfile - Mengambil ulang data profil dari database.
   * Berguna untuk memastikan state selalu sinkron dengan database,
   * terutama setelah ada perubahan data profil.
   */
  const refreshProfile = async () => {
    // Guard: hanya refresh jika user sudah login
    if (!state.user) return

    // Fetch profile terbaru dari database
    const profile = await fetchProfile(state.user.id)

    // Update state dengan profile terbaru (spread prev untuk keep data lain)
    setState((prev) => ({
      ...prev,
      profile,
    }))
  }

  /**
   * value - Object yang berisi semua state dan fungsi auth
   * yang akan di-provide ke seluruh aplikasi melalui Context.
   */
  const value: AuthContextType = {
    ...state, // Spread state: user, profile, loading, initialized
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  }

  // Render Provider dengan value yang sudah disiapkan
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth - Custom hook untuk mengakses Auth Context.
 *
 * Penggunaan:
 * const { user, profile, signIn, signOut } = useAuth()
 *
 * Error akan di-throw jika hook digunakan di luar AuthProvider.
 * Ini membantu developer mendeteksi kesalahan setup lebih awal.
 */
export function useAuth() {
  const context = useContext(AuthContext)

  // Guard: pastikan hook digunakan di dalam AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
