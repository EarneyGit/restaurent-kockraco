"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"
import api from '@/lib/axios'
import { useAuth } from '@/contexts/auth-context'

interface Product {
  name: string
  price: number
}

interface OrderProduct {
  product: Product
  quantity: number
  _id: string
}

interface CustomerDetails {
  address: string
  lastName: string
  firstName: string
  phone: string
  email: string
  latitude: number
  longitude: number
}

interface Branch {
  name: string
}

interface Order {
  _id: string
  orderNumber: string
  products: OrderProduct[]
  orderCustomerDetails: CustomerDetails
  branchId: Branch
  deliveryMethod: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}

export default function TodayOrdersPage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all')

  const statusList = ['all', 'pending', 'processing', 'completed', 'cancelled'] as const

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        setLoading(true)
        const response = await api.get('/orders?today=true')
        const data = response.data
        if (data.success) setOrders(data.data)
        else setError('Failed to fetch orders')
      } catch {
        setError('Error connecting to the server')
      } finally {
        setLoading(false)
      }
    }

    fetchTodayOrders()
    const interval = setInterval(fetchTodayOrders, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigate = (path: string) => window.location.href = path

  const getStatusCount = (status: string) => {
    if (status === 'all') return orders.length
    else return orders.filter(o => o.status === status).length
  }

  const getStatusColor = (status: string) => {
    if (status === 'pending') return 'bg-blue-100/70 text-blue-800'
    else if (status === 'processing') return 'bg-yellow-100/70 text-yellow-800'
    else if (status === 'completed') return 'bg-green-100/70 text-green-800'
    else if (status === 'cancelled') return 'bg-red-100/70 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const displayedOrders = orders.filter(o => selectedStatus === 'all' || o.status === selectedStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => handleNavigate('/orders/live')}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="font-medium">Today's Orders</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{displayName}</span>
          <Button variant="ghost" size="sm" onClick={() => handleNavigate('/orders/live')}>
            Exit <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-medium mb-4">Today's Orders</h1>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {statusList.map(status => (
            <div
              key={status}
              className={`cursor-pointer rounded-lg p-4 text-center shadow-sm ${getStatusColor(status)} ${selectedStatus === status ? 'border border-gray-400' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              <div className="font-bold text-xl">{getStatusCount(status)}</div>
              <div className="capitalize">{status}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : displayedOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-40">No orders for this status</div>
        ) : (
          <div className="grid gap-4">
            {displayedOrders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Order #{order.orderNumber}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Branch: </span>
                    {order.branchId?.name || 'N/A'}
                  </div>

                  <div>
                    <span className="text-gray-500">Delivery Method: </span>
                    <span className="capitalize">{order.deliveryMethod}</span>
                  </div>

                  {order.deliveryMethod === 'delivery' && order.orderCustomerDetails?.address && (
                    <div>
                      <span className="text-gray-500">Delivery Address: </span>
                      <span className="">{order.orderCustomerDetails.address}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-500">Items:</span>
                    <div className="ml-4 mt-1 space-y-1">
                      {order.products.map(item => (
                        <div key={item._id}>{item.quantity}x {item.product.name}</div>
                      ))}
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
