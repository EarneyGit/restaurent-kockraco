"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"
import { BaseUrl } from '@/lib/config'
import { toast } from 'react-hot-toast'
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

interface DeliveryAddress {
  street: string
  city: string
  state: string
}

interface Branch {
  name: string
}

interface Order {
  _id: string
  orderNumber: string
  products: OrderProduct[]
  deliveryAddress: DeliveryAddress
  branchId: Branch
  deliveryMethod: string
}

export default function TodayOrdersPage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'
  
  const [orderCount, setOrderCount] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        setLoading(true)
        const response = await api.get('/orders?today=true')
        const data = response.data
        if (data.success) {
          setOrders(data.data)
          setOrderCount(data.count)
        } else {
          setError('Failed to fetch orders')
        }
      } catch (err) {
        setError('Error connecting to the server')
      } finally {
        setLoading(false)
      }
    }

    fetchTodayOrders()
    const interval = setInterval(fetchTodayOrders, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleNavigate('/orders/live')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="font-medium">Today's Orders</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{displayName}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleNavigate('/orders/live/exit')}
          >
            Exit <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-medium mb-6">Today's Orders</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <span className="text-4xl font-bold text-emerald-500">{orderCount}</span>
            <p className="text-gray-500 mt-2">Orders Today</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders today</div>
        ) : (
          <div className="grid gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="font-medium mb-2">Order #{order.orderNumber}</div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Branch: </span>
                    {order.branchId?.name || 'N/A'}
                  </div>

                  <div>
                    <span className="text-gray-500">Delivery Method: </span>
                    <span className="capitalize">{order.deliveryMethod}</span>
                  </div>

                  {order.deliveryMethod === 'delivery' && order.deliveryAddress && (
                    <div>
                      <span className="text-gray-500">Delivery Address: </span>
                      <div className="ml-4">
                        {[
                          order.deliveryAddress.street,
                          order.deliveryAddress.city,
                          order.deliveryAddress.state
                        ].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-500">Items:</span>
                    <div className="ml-4 mt-1 space-y-1">
                      {order.products.map(item => (
                        <div key={item._id}>
                          {item.quantity}x {item.product.name}
                        </div>
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