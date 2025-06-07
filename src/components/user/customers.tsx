"use client"

import React, { useState, useEffect } from 'react'
import { Search, Eye, Loader2, X } from 'lucide-react'
import { customerService, CustomerSimple, CustomerDetails, CustomerFilters } from '@/services/customer.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface CustomerDetailsModalProps {
  isOpen: boolean
  customerId: string | null
  onClose: () => void
}

function CustomerDetailsModal({ isOpen, customerId, onClose }: CustomerDetailsModalProps) {
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && customerId) {
      loadCustomerDetails()
    } else {
      // Clear customer data when modal closes
      setCustomer(null)
    }
  }, [isOpen, customerId])

  const loadCustomerDetails = async () => {
    if (!customerId) return
    
    try {
      setLoading(true)
      console.log('Loading customer details for ID:', customerId)
      
      // Test direct API call
      await customerService.testApiConnection()
      
      const response = await customerService.getCustomerDetails(customerId)
      console.log('Service response:', response)
      
      setCustomer(response.data)
      console.log('Customer data set:', response.data)
    } catch (error: any) {
      console.error('Error loading customer details:', error)
      console.error('Error message:', error.message)
      
      toast.error(error.message || 'Failed to load customer details')
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Customer Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading customer details...</span>
            </div>
          ) : customer ? (
            <>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Customer ID:</span>
                      <p className="font-medium">{customer.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Full Name:</span>
                      <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{customer.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mobile:</span>
                      <p className="font-medium">{customer.mobile || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Address:</span>
                      <p className="font-medium">{customer.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Postcode:</span>
                      <p className="font-medium">{customer.postcode || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Member Since:</span>
                      <p className="font-medium">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Updated:</span>
                      <p className="font-medium">{customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Statistics</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Total Orders:</span>
                      <p className="font-medium">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Total Spent:</span>
                      <p className="font-medium">£{customer.totalSpent?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Average Order Value:</span>
                      <p className="font-medium">£{customer.averageOrderValue?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Customer Type:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.customerType === 'Regular' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {customer.customerType}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Order:</span>
                      <p className="font-medium">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders yet'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">First Order:</span>
                      <p className="font-medium">{customer.firstOrderDate ? new Date(customer.firstOrderDate).toLocaleDateString() : 'No orders yet'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Order History</h3>
                {customer.orders && customer.orders.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Order #</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Date</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Amount</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.orders.map((order) => (
                          <tr key={order.orderId} className="border-t">
                            <td className="p-3">{order.orderNumber}</td>
                            <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">£{order.totalAmount?.toFixed(2)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3">{order.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p>No order history available</p>
                    <p className="text-sm mt-1">This customer hasn't placed any orders yet.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load customer details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerSimple[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    limit: 20
  })
  const [searchForm, setSearchForm] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    postcode: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [filters])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerService.getCustomers(filters)
      setCustomers(response.data)
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Error loading customers:', error)
      toast.error(error.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setFilters({
      ...filters,
      ...searchForm,
      page: 1
    })
  }

  const handleClearSearch = () => {
    setSearchForm({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      postcode: ''
    })
    setFilters({
      page: 1,
      limit: 20
    })
  }
  
  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(customers.map(customer => customer.id))
    }
  }
  
  const handleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id))
    } else {
      setSelectedCustomers([...selectedCustomers, id])
    }
  }
  
  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId)
    setDetailsModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Customers</h1>
          <div className="text-sm text-gray-500">
            Total: {pagination.totalCustomers} customers
          </div>
        </div>
        
        {/* Search Filters */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Input 
            placeholder="User Id"
            value={searchForm.userId}
            onChange={(e) => setSearchForm({ ...searchForm, userId: e.target.value })}
          />
          <Input 
            placeholder="First name"
            value={searchForm.firstName}
            onChange={(e) => setSearchForm({ ...searchForm, firstName: e.target.value })}
          />
          <Input 
            placeholder="Last name"
            value={searchForm.lastName}
            onChange={(e) => setSearchForm({ ...searchForm, lastName: e.target.value })}
          />
          <Input 
            placeholder="Email"
            value={searchForm.email}
            onChange={(e) => setSearchForm({ ...searchForm, email: e.target.value })}
          />
          <Input 
            placeholder="Mobile"
            value={searchForm.mobile}
            onChange={(e) => setSearchForm({ ...searchForm, mobile: e.target.value })}
          />
          <Input 
            placeholder="Postcode"
            value={searchForm.postcode}
            onChange={(e) => setSearchForm({ ...searchForm, postcode: e.target.value })}
            />
          </div>
        
        <div className="flex gap-2 mb-6">
          <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={handleClearSearch}>
            Clear
          </Button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading customers...</span>
          </div>
        )}
        
        {/* Table */}
        {!loading && (
          <>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-left font-medium">ID</th>
                    <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Email</th>
                    <th className="p-3 text-left font-medium">Mobile</th>
                    <th className="p-3 text-left font-medium">Orders</th>
                    <th className="p-3 text-left font-medium">Total Spent</th>
                    <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded"
                    />
                  </td>
                      <td className="p-3 text-sm">{customer.id.slice(-6)}</td>
                      <td className="p-3">{customer.firstName} {customer.lastName}</td>
                  <td className="p-3">{customer.email}</td>
                      <td className="p-3">{customer.mobile}</td>
                      <td className="p-3">{customer.totalOrders}</td>
                      <td className="p-3">£{customer.totalSpent?.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.customerType === 'Regular' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {customer.customerType}
                        </span>
                      </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                          <button 
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200"
                            onClick={() => handleViewCustomer(customer.id)}
                            title="View Details"
                          >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            
            {customers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            )}
        
        {/* Pagination */}
            {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * filters.limit!) + 1} to {Math.min(pagination.currentPage * filters.limit!, pagination.totalCustomers)} of {pagination.totalCustomers} customers
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={pagination.currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
          </div>
        </div>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      <CustomerDetailsModal
        isOpen={detailsModalOpen}
        customerId={selectedCustomerId}
        onClose={() => {
          setDetailsModalOpen(false)
          setSelectedCustomerId(null)
        }}
      />
    </div>
  )
} 