// Supabase Database Types
// Auto-generated types for type-safe database access

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'managing_director' | 'investor' | 'guest'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'managing_director' | 'investor' | 'guest'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'managing_director' | 'investor' | 'guest'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          date: string
          category: string
          description: string
          income: number
          expense: number
          account: string
          notes: string | null
          user_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          date: string
          category: string
          description: string
          income?: number
          expense?: number
          account: string
          notes?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          date?: string
          category?: string
          description?: string
          income?: number
          expense?: number
          account?: string
          notes?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      assets: {
        Row: {
          id: string
          item_name: string
          asset_type: string
          purchase_date: string
          purchase_price: number
          quantity: number
          status: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_name: string
          asset_type: string
          purchase_date: string
          purchase_price: number
          quantity?: number
          status?: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_name?: string
          asset_type?: string
          purchase_date?: string
          purchase_price?: number
          quantity?: number
          status?: string
          user_id?: string | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          guest_name: string
          nights: number
          check_in: string
          check_out: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          guest_name: string
          nights: number
          check_in: string
          check_out: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          guest_name?: string
          nights?: number
          check_in?: string
          check_out?: string
          user_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
