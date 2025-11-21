// Tipos generados automáticamente para Supabase
// Estos tipos coinciden con el esquema de la base de datos

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
      groups: {
        Row: {
          id: string
          code: string
          name: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          code: string
          name?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      submissions: {
        Row: {
          id: string
          group_id: string | null
          participant_code: string
          answers: number[]
          timestamp: string
          user_name: string | null
        }
        Insert: {
          id?: string
          group_id?: string | null
          participant_code: string
          answers: number[]
          timestamp?: string
          user_name?: string | null
        }
        Update: {
          id?: string
          group_id?: string | null
          participant_code?: string
          answers?: number[]
          timestamp?: string
          user_name?: string | null
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string | null
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

// Tipos de conveniencia para usar en la aplicación
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupInsert = Database['public']['Tables']['groups']['Insert']
export type GroupUpdate = Database['public']['Tables']['groups']['Update']

export type Submission = Database['public']['Tables']['submissions']['Row']
export type SubmissionInsert = Database['public']['Tables']['submissions']['Insert']
export type SubmissionUpdate = Database['public']['Tables']['submissions']['Update']

export type Admin = Database['public']['Tables']['admins']['Row']
export type AdminInsert = Database['public']['Tables']['admins']['Insert']
export type AdminUpdate = Database['public']['Tables']['admins']['Update']

