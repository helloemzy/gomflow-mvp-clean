import Link from 'next/link'
import type { Order } from '@/types'

interface OrderCardProps {
  order: Order & { gom?: { name: string; email: string } }
}

export default function OrderCard({ order }: OrderCardProps) {
  const progressPercentage = (order.current_count / order.moq) * 100
  const isNearDeadline = new Date(order.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const timeLeft = Math.ceil((new Date(order.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {order.title}
          </h3>
          <p className="text-sm text-gray-600">by {order.artist}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg text-primary-600">
            {order.currency} {order.price_per_item}
          </p>
          <p className="text-xs text-gray-500">per item</p>
        </div>
      </div>
      
      {/* Description */}
      {order.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {order.description}
        </p>
      )}
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{order.current_count} / {order.moq}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progressPercentage >= 100 ? 'MOQ Reached!' : `${(100 - progressPercentage).toFixed(0)}% to go`}
        </p>
      </div>
      
      {/* Timeline */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-500">Organized by</p>
          <p className="text-sm font-medium">{order.gom?.name || 'GOM'}</p>
        </div>
        <div className="text-right">
          <p className={`text-xs ${isNearDeadline ? 'text-orange-600' : 'text-gray-500'}`}>
            {timeLeft > 0 ? `${timeLeft} days left` : 'Expired'}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(order.deadline).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Link 
          href={`/orders/${order.id}`}
          className="btn-secondary flex-1 text-center text-sm"
        >
          View Details
        </Link>
        <Link 
          href={`/orders/${order.id}/join`}
          className="btn-primary flex-1 text-center text-sm"
        >
          Join Order
        </Link>
      </div>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {progressPercentage >= 100 && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            MOQ Reached
          </span>
        )}
        {isNearDeadline && timeLeft > 0 && (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            Ending Soon
          </span>
        )}
      </div>
    </div>
  )
}