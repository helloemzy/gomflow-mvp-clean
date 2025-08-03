'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateOrderData } from '@/types'

interface CreateOrderFormProps {
  onSubmit: (data: CreateOrderData) => Promise<void>
  isSubmitting?: boolean
}

export default function CreateOrderForm({ onSubmit, isSubmitting = false }: CreateOrderFormProps) {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateOrderData>()
  
  const watchedValues = watch()
  
  const handleFormSubmit = async (data: CreateOrderData) => {
    await onSubmit(data)
  }
  
  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}
              `}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > stepNum ? 'bg-primary-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? 'text-primary-600' : 'text-gray-500'}>Details</span>
          <span className={step >= 2 ? 'text-primary-600' : 'text-gray-500'}>Pricing</span>
          <span className={step >= 3 ? 'text-primary-600' : 'text-gray-500'}>Review</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="input"
                  placeholder="e.g., NewJeans Official Lightstick"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artist/Group *
                </label>
                <input
                  {...register('artist', { required: 'Artist is required' })}
                  className="input"
                  placeholder="e.g., NewJeans"
                />
                {errors.artist && (
                  <p className="text-red-500 text-sm mt-1">{errors.artist.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="input h-24 resize-none"
                  placeholder="Additional details about the order..."
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
                disabled={!watchedValues.title || !watchedValues.artist}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Pricing & Quantity */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Pricing & Quantity</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Item *
                  </label>
                  <input
                    {...register('price_per_item', { 
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0.01, message: 'Price must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    className="input"
                    placeholder="25.00"
                  />
                  {errors.price_per_item && (
                    <p className="text-red-500 text-sm mt-1">{errors.price_per_item.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select {...register('currency')} className="input">
                    <option value="USD">USD</option>
                    <option value="SGD">SGD</option>
                    <option value="MYR">MYR</option>
                    <option value="THB">THB</option>
                    <option value="PHP">PHP</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Quantity (MOQ) *
                </label>
                <input
                  {...register('moq', { 
                    required: 'MOQ is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'MOQ must be at least 1' }
                  })}
                  type="number"
                  className="input"
                  placeholder="10"
                />
                {errors.moq && (
                  <p className="text-red-500 text-sm mt-1">{errors.moq.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Deadline *
                </label>
                <input
                  {...register('deadline', { required: 'Deadline is required' })}
                  type="datetime-local"
                  className="input"
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button type="button" onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
                disabled={!watchedValues.price_per_item || !watchedValues.moq || !watchedValues.deadline}
              >
                Review
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Review Order</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Title:</span>
                  <p>{watchedValues.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Artist:</span>
                  <p>{watchedValues.artist}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price:</span>
                  <p>{watchedValues.currency || 'USD'} {watchedValues.price_per_item}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">MOQ:</span>
                  <p>{watchedValues.moq} items</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-600">Deadline:</span>
                  <p>{watchedValues.deadline ? new Date(watchedValues.deadline).toLocaleString() : 'Not set'}</p>
                </div>
                {watchedValues.description && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-600">Description:</span>
                    <p>{watchedValues.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button type="button" onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}