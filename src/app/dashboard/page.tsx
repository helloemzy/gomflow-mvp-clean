'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreateOrderForm from '@/components/forms/CreateOrderForm'
import type { CreateOrderData } from '@/types'

export default function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleCreateOrder = async (data: CreateOrderData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        setShowCreateForm(false)
        // TODO: Show success message and refresh orders
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      // TODO: Show error message
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CreateOrderForm 
            onSubmit={handleCreateOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GOM Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your group orders</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Create New Order</h3>
            <p className="text-gray-600 mb-4">Start a new group order for K-pop merchandise</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary w-full"
            >
              Create Order
            </button>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Browse Orders</h3>
            <p className="text-gray-600 mb-4">Discover and join existing group orders</p>
            <Link href="/orders" className="btn-secondary w-full text-center">
              Browse Orders
            </Link>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Payment Verification</h3>
            <p className="text-gray-600 mb-4">Review and verify payment submissions</p>
            <Link href="/dashboard/payments" className="btn-secondary w-full text-center">
              View Payments
            </Link>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Your recent orders and activities will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}