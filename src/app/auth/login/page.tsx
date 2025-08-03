'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()
  
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Store token and redirect
        localStorage.setItem('access_token', result.session.access_token)
        window.location.href = '/dashboard'
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">GOMFLOW</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email'
                }
              })}
              type="email"
              className="input"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="input"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}