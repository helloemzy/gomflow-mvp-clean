import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const createOrderSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  artist: z.string().min(1),
  price_per_item: z.number().positive(),
  currency: z.string().length(3).optional(),
  moq: z.number().int().positive(),
  deadline: z.string().datetime()
})

// GET /api/orders - List orders with filtering
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const artist = searchParams.get('artist')
    const status = searchParams.get('status') || 'active'
    
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        gom:users!orders_gom_id_fkey(name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    
    if (artist) {
      query = query.ilike('artist', `%${artist}%`)
    }
    
    const { data: orders, error } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        has_more: orders.length === limit
      }
    })
    
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const orderData = createOrderSchema.parse(body)
    
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        ...orderData,
        gom_id: user.id
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(order, { status: 201 })
    
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}