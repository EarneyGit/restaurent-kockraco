"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, X, Mail, Phone } from "lucide-react"
import { BaseUrl } from '@/lib/config'

interface Product {
  _id: string
  name: string
  price: number
  discountPercentage: number
  id: string
}

interface OrderProduct {
  product: Product
  quantity: number
  price: number
  _id: string
  id: string
}

interface User {
  _id: string
  name: string
  email: string
  phone: string
  id: string
}

interface DeliveryAddress {
  street: string
  city: string
  state: string
}

interface BranchAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Branch {
  _id: string
  name: string
  address: BranchAddress
  id: string
}

interface Order {
  _id: string
  orderNumber: string
  user: User
  products: OrderProduct[]
  deliveryAddress?: DeliveryAddress
  branchId: Branch
  status: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  deliveryMethod: string
  createdAt: string
  updatedAt: string
}

export default function SearchOrdersPage() {
  const [searchText, setSearchText] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchMessage, setSearchMessage] = useState<string | null>(null)

  const fetchOrders = async (searchType?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // If no search text or no search type, fetch all orders
      if (!searchText.trim() || !searchType) {
        const response = await fetch(`${BaseUrl}/api/orders`)
        const data = await response.json()
        
        if (data.success) {
          setOrders(data.data)
          setSearchMessage(`Found ${data.data.length} orders`)
        } else {
          setError('Failed to fetch orders')
        }
        setLoading(false)
        return
      }

      // Build endpoint for filtered search
      let endpoint = `${BaseUrl}/api/orders?`
      switch (searchType) {
        case 'orderNumber':
          endpoint += `orderNumber=${searchText}`
          break
        case 'name':
          endpoint += `userName=${searchText}`
          break
        case 'phone':
          endpoint += `mobileNumber=${searchText}`
          break
        case 'postcode':
          endpoint += `postCode=${searchText}`
          break
        default:
          setError('Invalid search type')
          setLoading(false)
          return
      }

      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
        setSearchMessage(`Found ${data.data.length} orders`)
      } else {
        setError('Failed to fetch orders')
      }
    } catch (err) {
      setError('Error connecting to the server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initially fetch all orders
    fetchOrders()
  }, [])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
    // If search text is cleared, fetch all orders
    if (!value.trim()) {
      fetchOrders()
    }
  }

  const handleSearch = (searchType: string) => {
    fetchOrders(searchType)
  }

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen">
      {/* Left Panel - Search and Orders List */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <Input
            type="text"
            placeholder="Enter search text here"
            value={searchText}
            onChange={handleSearchInputChange}
            className="mb-4"
          />
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => handleSearch('orderNumber')}
              disabled={!searchText.trim()}
            >
              Order Number
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => handleSearch('name')}
              disabled={!searchText.trim()}
            >
              Name
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => handleSearch('postcode')}
              disabled={!searchText.trim()}
            >
              Postcode
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => handleSearch('phone')}
              disabled={!searchText.trim()}
            >
              Mobile Number
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedOrder?._id === order._id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{order.user?.name || 'Guest'}</div>
                    <div className="text-sm text-gray-500">{order.deliveryMethod}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">£{order.totalAmount.toFixed(2)}</div>
                    <div className="text-sm text-pink-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Order #{order.orderNumber}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Order Details */}
      <div className="flex-1 bg-gray-50">
        <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleNavigate('/orders/live')}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="font-medium">Search Orders</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Admin user</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigate('/orders/live/exit')}
            >
              Exit <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        {selectedOrder ? (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-medium">
                    Order No: {selectedOrder.orderNumber}
                  </h2>
                  <div className="mt-2 text-gray-600">
                    {selectedOrder.deliveryMethod}
                    <br />
                    Status: {selectedOrder.status}
                    <br />
                    Created: {formatDate(selectedOrder.createdAt)}
                    <br />
                    Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm">
                      {(selectedOrder.user?.name || 'Guest').split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="font-medium">{selectedOrder.user?.name || 'Guest'}</div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.branchId.name}
                  </div>
                </div>
              </div>

              {selectedOrder.deliveryMethod === 'delivery' && selectedOrder.deliveryAddress && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Delivery Address</h3>
                  <p className="text-gray-600">
                    {[
                      selectedOrder.deliveryAddress.street,
                      selectedOrder.deliveryAddress.city,
                      selectedOrder.deliveryAddress.state
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {selectedOrder.user && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedOrder.user.email}
                    </div>
                    {selectedOrder.user.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedOrder.user.phone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-2">Items</th>
                      <th className="pb-2 text-center">Quantity</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="py-2">
                          <div>{item.product?.name || 'Unknown Product'}</div>
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">£{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t">
                      <td colSpan={2} className="py-2 text-right font-medium">Total</td>
                      <td className="py-2 text-right font-medium">£{selectedOrder.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Select an order to view details
          </div>
        )}
      </div>
    </div>
  )
} 