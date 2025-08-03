import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const joinOrderSchema = z.object({
  quantity: z.number().int().positive()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { quantity } = joinOrderSchema.parse(body)
    
    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    if (order.status !== 'active') {
      return NextResponse.json(
        { error: 'Order is not active' },
        { status: 400 }
      )
    }
    
    const total_amount = order.price_per_item * quantity
    
    // Create submission
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .insert({
        order_id: params.id,
        user_id: user.id,
        quantity,
        total_amount
      })
      .select()
      .single()
    
    if (submissionError) {
      if (submissionError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'You have already joined this order' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to join order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(submission, { status: 201 })
    
  } catch (error) {
    console.error('Join order error:', error)
    return NextResponse.json(
      { error: 'Failed to join order' },
      { status: 500 }
    )
  }
}