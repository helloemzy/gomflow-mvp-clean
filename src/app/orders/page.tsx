'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types'
import OrderCard from '@/components/orders/OrderCard'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtist, setSelectedArtist] = useState('')
  
  useEffect(() => {
    fetchOrders()
  }, [selectedArtist])
  
  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedArtist) params.set('artist', selectedArtist)
      
      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredOrders = orders.filter(order =>
    order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Orders</h1>
          <p className="text-gray-600 mt-2">Find and join K-pop group orders</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist
              </label>
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="input"
              >
                <option value="">All Artists</option>
                <option value="NewJeans">NewJeans</option>
                <option value="TWICE">TWICE</option>
                <option value="BLACKPINK">BLACKPINK</option>
                <option value="aespa">aespa</option>
                <option value="IVE">IVE</option>
                <option value="(G)I-DLE">(G)I-DLE</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedArtist 
                ? 'Try adjusting your search filters' 
                : 'Be the first to create an order!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}