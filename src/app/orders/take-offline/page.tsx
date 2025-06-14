"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, X, Search, Clock, Package, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

interface Product {
  id: string
  name: string
  price: number
  category: {
    name: string
  }
  isOffline: boolean
}

interface Attribute {
  id: string
  name: string
  type: string
  isOffline: boolean
}

export default function TakeOfflinePage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'
  
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'products' | 'attributes' | null>(null)

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  // Fetch products
  const fetchProducts = async (searchQuery = "") => {
    try {
      setLoading(true)
      const params = searchQuery ? { searchText: searchQuery } : {}
      const response = await api.get('/products/offline', { params })
      
      if (response.data.success) {
        setProducts(response.data.data)
        setSearchType('products')
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  // Fetch attributes
  const fetchAttributes = async (searchQuery = "") => {
    try {
      setLoading(true)
      const params = searchQuery ? { searchText: searchQuery } : {}
      const response = await api.get('/attributes/offline', { params })
      
      if (response.data.success) {
        setAttributes(response.data.data)
        setSearchType('attributes')
      }
    } catch (error: any) {
      console.error('Error fetching attributes:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch attributes')
    } finally {
      setLoading(false)
    }
  }

  // Toggle product offline status
  const toggleProductOffline = async (productId: string, isOffline: boolean) => {
    try {
      const response = await api.patch(`/products/${productId}/toggle-offline`, {
        isOffline: !isOffline
      })
      
      if (response.data.success) {
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, isOffline: !isOffline }
            : product
        ))
        toast.success(response.data.message)
      }
    } catch (error: any) {
      console.error('Error toggling product:', error)
      toast.error(error.response?.data?.message || 'Failed to toggle product')
    }
  }

  // Toggle attribute offline status
  const toggleAttributeOffline = async (attributeId: string, isOffline: boolean) => {
    try {
      const response = await api.patch(`/attributes/${attributeId}/toggle-offline`, {
        isOffline: !isOffline
      })
      
      if (response.data.success) {
        setAttributes(prev => prev.map(attribute => 
          attribute.id === attributeId 
            ? { ...attribute, isOffline: !isOffline }
            : attribute
        ))
        toast.success(response.data.message)
      }
    } catch (error: any) {
      console.error('Error toggling attribute:', error)
      toast.error(error.response?.data?.message || 'Failed to toggle attribute')
    }
  }

  // Turn all products offline
  const turnAllProductsOffline = async () => {
    try {
      const response = await api.patch('/products/toggle-all-offline', {
        isOffline: true
      })
      
      if (response.data.success) {
        setProducts(prev => prev.map(product => ({ ...product, isOffline: true })))
        toast.success(response.data.message)
      }
    } catch (error: any) {
      console.error('Error turning all products offline:', error)
      toast.error(error.response?.data?.message || 'Failed to turn all products offline')
    }
  }

  // Handle search
  const handleSearch = (type: 'products' | 'attributes') => {
    if (type === 'products') {
      fetchProducts(searchTerm)
    } else {
      fetchAttributes(searchTerm)
    }
  }

  // Load products by default
  useEffect(() => {
    fetchProducts()
  }, [])

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
          <span className="font-medium">Take items offline</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{displayName}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleNavigate('/orders/live')}
          >
            Exit <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-medium mb-6">Take items offline</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Input
            type="text"
            placeholder="Enter search text here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="flex gap-2 mb-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleSearch('products')}
              disabled={loading}
            >
              {loading && searchType === 'products' ? 'Searching...' : 'Search Products'}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleSearch('attributes')}
              disabled={loading}
            >
              {loading && searchType === 'attributes' ? 'Searching...' : 'Search Attributes'}
            </Button>
          </div>

          {/* Turn all products off button */}
          {searchType === 'products' && products.length > 0 && (
            <div className="mb-6 text-center">
              <Button 
                variant="outline" 
                onClick={turnAllProductsOffline}
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                Turn all products off
              </Button>
            </div>
          )}

          {/* Products List */}
          {searchType === 'products' && (
            <div className="space-y-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.category?.name} • £{product.price.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductOffline(product.id, product.isOffline)}
                      className={`ml-4 ${
                        product.isOffline 
                          ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {product.isOffline ? 'Turn on' : 'Turn off'}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {loading ? 'Loading products...' : 'No products found'}
                </div>
              )}
            </div>
          )}

          {/* Attributes List */}
          {searchType === 'attributes' && (
            <div className="space-y-3">
              {attributes.length > 0 ? (
                attributes.map((attribute) => (
                  <div key={attribute.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{attribute.name}</div>
                      <div className="text-sm text-gray-500">
                        Type: {attribute.type}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAttributeOffline(attribute.id, attribute.isOffline)}
                      className={`ml-4 ${
                        attribute.isOffline 
                          ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {attribute.isOffline ? 'Turn on' : 'Turn off'}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {loading ? 'Loading attributes...' : 'No attributes found'}
                </div>
              )}
            </div>
          )}

          {/* Default state */}
          {!searchType && (
            <div className="text-center text-gray-500 py-8">
              Click "Search Products" or "Search Attributes" to view items
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 