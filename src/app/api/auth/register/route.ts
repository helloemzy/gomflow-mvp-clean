import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  is_gom: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, is_gom = false } = registerSchema.parse(body)
    
    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    
    if (authError) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      )
    }
    
    // Create user profile
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        is_gom
      })
      .select()
      .single()
    
    if (userError) {
      // Cleanup auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Profile creation failed' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      user: userData,
      message: 'Registration successful'
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}