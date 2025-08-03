export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          is_gom: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          is_gom?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          is_gom?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          title: string
          description: string | null
          artist: string
          price_per_item: number
          currency: string
          moq: number
          current_count: number
          deadline: string
          status: 'active' | 'completed' | 'cancelled'
          gom_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          artist: string
          price_per_item: number
          currency?: string
          moq: number
          current_count?: number
          deadline: string
          status?: 'active' | 'completed' | 'cancelled'
          gom_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          artist?: string
          price_per_item?: number
          currency?: string
          moq?: number
          current_count?: number
          deadline?: string
          status?: 'active' | 'completed' | 'cancelled'
          gom_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          order_id: string
          user_id: string
          quantity: number
          total_amount: number
          status: 'pending' | 'paid' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          quantity: number
          total_amount: number
          status?: 'pending' | 'paid' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          quantity?: number
          total_amount?: number
          status?: 'pending' | 'paid' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          submission_id: string
          proof_url: string | null
          notes: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          proof_url?: string | null
          notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          proof_url?: string | null
          notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}