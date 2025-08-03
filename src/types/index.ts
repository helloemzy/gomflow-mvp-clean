export interface User {
  id: string
  email: string
  name?: string
  is_gom: boolean
  created_at: string
}

export interface Order {
  id: string
  title: string
  description?: string
  artist: string
  price_per_item: number
  currency: string
  moq: number
  current_count: number
  deadline: string
  status: 'active' | 'completed' | 'cancelled'
  gom_id: string
  created_at: string
}

export interface Submission {
  id: string
  order_id: string
  user_id: string
  quantity: number
  total_amount: number
  status: 'pending' | 'paid' | 'verified' | 'rejected'
  created_at: string
}

export interface Payment {
  id: string
  submission_id: string
  proof_url?: string
  notes?: string
  verified_by?: string
  verified_at?: string
  created_at: string
}

export interface CreateOrderData {
  title: string
  description?: string
  artist: string
  price_per_item: number
  currency: string
  moq: number
  deadline: string
}

export interface JoinOrderData {
  quantity: number
}