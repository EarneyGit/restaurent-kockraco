"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

interface DeliveryAddress {
  street: string
  city: string
  state: string
}

interface BranchInfo {
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  _id: string
  name: string
  id: string
}

interface OrderItem {
  product: string
  quantity: number
  price: number
  _id: string
  addons: any[]
}

interface Order {
  _id: string
  orderNumber: string
  deliveryAddress: DeliveryAddress
  items: OrderItem[]
  totalAmount: number
  status: 'new' | 'in-progress' | 'complete'
  paymentMethod: string
  paymentStatus: string
  deliveryMethod: string
  branchId: BranchInfo
  estimatedDeliveryTime: string
  createdAt: string
}

export default function LiveOrdersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'new' | 'in-progress' | 'complete'>('new')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Map UI status to API status
  const getApiStatus = (uiStatus: 'new' | 'in-progress' | 'complete') => {
    switch (uiStatus) {
      case 'new':
        return 'pending'
      case 'in-progress':
        return 'processing'
      case 'complete':
        return 'completed'
      default:
        return 'pending'
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const apiStatus = getApiStatus(activeTab)
        const response = await fetch(`http://localhost:5000/api/orders?status=${apiStatus}`)
        const data = await response.json()
        
        if (data.success) {
          // Map API status back to UI status
          const mappedOrders = data.data.map((order: any) => ({
            ...order,
            status: activeTab // Use the UI status instead of API status
          }))
          setOrders(mappedOrders)
        } else {
          setError('Failed to fetch orders')
        }
      } catch (err) {
        setError('Error connecting to the server')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    // Set up polling every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    
    return () => clearInterval(interval)
  }, [activeTab]) // Added activeTab as dependency to refetch when tab changes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const filteredOrders = orders.filter(order => order.status === activeTab)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Add a helper function to safely calculate total items
  const calculateTotalItems = (items: OrderItem[] | undefined) => {
    if (!items || !Array.isArray(items)) return 0
    return items.reduce((acc, item) => acc + (item?.quantity || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-medium">Live Orders</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Admin user</span>
          <Button variant="ghost" size="sm" onClick={() => handleNavigate('/orders/live/exit')}>
            Exit <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div className="w-64 h-full bg-white" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <Button variant="ghost" onClick={toggleMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/orders/today')}
                  >
                    Today's Orders
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/orders/search')}
                  >
                    Search orders
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/orders/take-offline')}
                  >
                    Take items offline
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/orders/settings')}
                  >
                    Restaurant Settings
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/orders/lead-times')}
                  >
                    Change lead times
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Order Tabs */}
      <div className="border-b bg-white">
        <div className="flex">
          <button
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2",
              activeTab === 'new'
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('new')}
          >
            New
          </button>
          <button
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2",
              activeTab === 'in-progress'
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress
          </button>
          <button
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2",
              activeTab === 'complete'
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('complete')}
          >
            Complete
          </button>
        </div>
      </div>

      {/* Orders Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center text-gray-500 mt-8">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-8">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {activeTab === 'new' && "No new orders"}
            {activeTab === 'in-progress' && "No orders in progress"}
            {activeTab === 'complete' && "No completed orders"}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Order #{order.orderNumber || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.deliveryMethod || 'N/A'}</div>
                    {order.deliveryMethod === 'delivery' && order.deliveryAddress && (
                      <div className="text-sm text-gray-600 mt-1">
                        {[
                          order.deliveryAddress.street,
                          order.deliveryAddress.city
                        ].filter(Boolean).join(', ') || 'No address provided'}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      Branch: {order.branchId?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Items: {calculateTotalItems(order.items)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">£{(order.totalAmount || 0).toFixed(2)}</div>
                    <div className="text-sm text-pink-500">
                      {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Payment: {order.paymentStatus || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 