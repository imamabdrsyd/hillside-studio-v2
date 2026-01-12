import { User as SupabaseUser } from '@supabase/supabase-js'

// User Role Types
export type UserRole = 'managing_director' | 'investor' | 'guest'

// Profile from database
export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Extended User with profile
export interface UserWithProfile {
  user: SupabaseUser
  profile: Profile
}

// Auth Context State
export interface AuthState {
  user: SupabaseUser | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
}

// Sign Up Data
export interface SignUpData {
  email: string
  password: string
  fullName: string
}

// Sign In Data
export interface SignInData {
  email: string
  password: string
}

// Update Profile Data
export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string
}

// Update Password Data
export interface UpdatePasswordData {
  currentPassword?: string
  newPassword: string
}

// Password Validation
export interface PasswordValidation {
  isValid: boolean
  hasMinLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  strength: 'weak' | 'medium' | 'strong'
}

// Auth Error
export interface AuthError {
  message: string
  code?: string
}

// Role Badge Props
export interface RoleBadgeProps {
  role: UserRole
  size?: 'sm' | 'md' | 'lg'
}

// Permission Helpers
export const canViewTransactions = (role: UserRole): boolean => {
  return role === 'managing_director'
}

export const canEditTransactions = (role: UserRole): boolean => {
  return role === 'managing_director'
}

export const canDeleteTransactions = (role: UserRole): boolean => {
  return role === 'managing_director'
}

export const canViewFinancials = (role: UserRole): boolean => {
  return role === 'managing_director' || role === 'investor'
}

// Role Display Names
export const roleDisplayNames: Record<UserRole, string> = {
  managing_director: 'Managing Director',
  investor: 'Investor',
  guest: 'Guest',
}

// Role Colors (Tailwind classes)
export const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
  managing_director: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
  investor: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
  },
  guest: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
}
