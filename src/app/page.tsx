import Link from 'next/link'
import { config } from '@/lib/config'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">
                {config.app.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            K-pop Group Orders
            <span className="text-primary-600"> Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join group orders for your favorite K-pop merchandise. 
            Safe, transparent, and designed for the passionate K-pop community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders" className="btn-primary text-lg px-8 py-3">
              Browse Orders
            </Link>
            <Link href="/dashboard" className="btn-secondary text-lg px-8 py-3">
              Create Order
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, secure group ordering for K-pop fans
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Orders</h3>
              <p className="text-gray-600">
                Find group orders for your favorite artists and merchandise
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Join & Pay</h3>
              <p className="text-gray-600">
                Join orders and submit payment proof securely
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Items</h3>
              <p className="text-gray-600">
                Receive your merchandise when the order is complete
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold mb-4">{config.app.name}</h3>
          <p className="text-gray-400 mb-4">
            Built for the passionate K-pop community
          </p>
          <p className="text-sm text-gray-500">
            Version {config.app.version}
          </p>
        </div>
      </footer>
    </div>
  )
}