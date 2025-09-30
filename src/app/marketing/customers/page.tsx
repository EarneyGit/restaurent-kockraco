"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"
import { customerService, CustomerSimple, CustomerResponse } from '@/services/customer.service'
import { useAuth } from '@/contexts/auth-context'
import { ORDER_ENDPOINTS } from '@/config/api.config'

interface SearchFilters {
  firstName: string
  lastName: string
  email: string
  mobile: string
  postcode: string
}

export default function CustomersPage() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [filters, setFilters] = useState<SearchFilters>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    postcode: ''
  })
  
  // State for API data
  const [customers, setCustomers] = useState<CustomerSimple[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  
  // State for customer details modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSimple | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  
  // State for customer orders
  const [customerOrders, setCustomerOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderPage, setOrderPage] = useState(1)
  const [orderTotalPages, setOrderTotalPages] = useState(1)
  const [orderTotal, setOrderTotal] = useState(0)

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: CustomerResponse = await customerService.getFilteredCustomers(
        {
          firstName: filters.firstName || undefined,
          lastName: filters.lastName || undefined,
          email: filters.email || undefined,
          mobile: filters.mobile || undefined,
          postcode: filters.postcode || undefined,
          branchId: user?.branchId || undefined,
        },
        currentPage,
        itemsPerPage,
        'lastOrderDate',
        'desc'
      )
      
      setCustomers(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalCustomers(response.pagination.totalCustomers)
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      setError(err.message || 'Failed to fetch customers')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch customers when component mounts or dependencies change
  useEffect(() => {
    if (user?.branchId) {
      fetchCustomers()
    }
  }, [currentPage, itemsPerPage, user?.branchId])

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1) // Reset to first page when searching
    fetchCustomers()
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Fetch customer orders
  const fetchCustomerOrders = async (customerId: string, page: number = 1) => {
    try {
      setOrdersLoading(true)
      
      // Get the token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No authentication token found')
        return
      }
      
      // Use the configured API endpoint
      const url = `${ORDER_ENDPOINTS.CUSTOMER_ORDERS(customerId)}?page=${page}&limit=5`
      
      // Make the API request with proper authentication
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setCustomerOrders(data.data)
        setOrderTotalPages(data.totalPages)
        setOrderPage(data.currentPage)
        setOrderTotal(data.total)
      } else {
        console.error('Failed to fetch customer orders:', data.message)
      }
    } catch (err: any) {
      console.error('Error fetching customer orders:', err.message || err)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Handle customer details view
  const handleViewDetails = async (customerId: string) => {
    try {
      setModalLoading(true)
      const response = await customerService.getCustomerDetails(customerId)
      setSelectedCustomer(response.data)
      setIsModalOpen(true)
      
      // Reset orders pagination
      setOrderPage(1)
      
      // Fetch customer orders
      await fetchCustomerOrders(customerId)
    } catch (err: any) {
      console.error('Error fetching customer details:', err)
      setError('Failed to fetch customer details')
    } finally {
      setModalLoading(false)
    }
  }

  // Handle order page change
  const handleOrderPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= orderTotalPages && selectedCustomer) {
      setOrderPage(newPage)
      fetchCustomerOrders(selectedCustomer.id, newPage)
    }
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
    setCustomerOrders([])
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-3 border-b bg-white gap-4">
        <div className="flex-1"></div>
        <h1 className="text-lg sm:text-xl font-medium text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button 
            onClick={() => import('@/lib/utils').then(({ viewYourStore }) => viewYourStore())}
            className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">View Your Store</span>
            <span className="sm:hidden">Store</span>
          </button>
        </div>
      </header>
      
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">Customers</h1>
        
        {/* Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <input 
            type="text" 
            placeholder="First name" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.firstName}
            onChange={(e) => setFilters(prev => ({ ...prev, firstName: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Last name" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.lastName}
            onChange={(e) => setFilters(prev => ({ ...prev, lastName: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Email" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.email}
            onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Mobile" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.mobile}
            onChange={(e) => setFilters(prev => ({ ...prev, mobile: e.target.value }))}
          />
          <div className="flex">
            <input 
              type="text" 
              placeholder="Postcode" 
              className="border border-gray-300 rounded-l-md px-3 py-2 text-sm flex-1"
              value={filters.postcode}
              onChange={(e) => setFilters(prev => ({ ...prev, postcode: e.target.value }))}
            />
            <button 
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 rounded-r-md disabled:opacity-50"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchCustomers}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <span className="ml-2 text-gray-600">Loading customers...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No customers found</p>
              {Object.values(filters).some(filter => filter !== '') && (
                <button 
                  onClick={() => {
                    setFilters({
                      firstName: '',
                      lastName: '',
                      email: '',
                      mobile: '',
                      postcode: ''
                    })
                    setCurrentPage(1)
                    fetchCustomers()
                  }}
                  className="mt-2 text-teal-500 hover:text-teal-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-3 sm:px-6 py-3">Name</th>
                    <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">Email</th>
                    <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Mobile</th>
                    <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">Address</th>
                    <th className="px-3 sm:px-6 py-3">Orders</th>
                    <th className="px-3 sm:px-6 py-3">Total Spent</th>
                    <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Type</th>
                    <th className="px-3 sm:px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {customer.firstName || 'N/A'} {customer.lastName || 'N/A'}
                        </div>
                        <div className="text-gray-500 sm:hidden">
                          {customer.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm text-gray-500 hidden sm:table-cell">
                        {customer.email || 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm hidden md:table-cell">
                        {customer.mobile || 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm hidden lg:table-cell">
                        <div className="max-w-xs truncate" title={customer.address || 'N/A'}>
                          {customer.address || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {customer.totalOrders}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm font-medium">
                        {customerService.formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${customerService.getCustomerTypeBadgeColor(customer.customerType)}`}>
                          {customer.customerType}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-sm">
                        <button 
                          className="text-teal-500 hover:text-teal-700 font-medium"
                          onClick={() => handleViewDetails(customer.id)}
                          disabled={modalLoading}
                        >
                          {modalLoading ? 'Loading...' : 'Details'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination Controls - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCustomers)} of {totalCustomers} customers</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading}
              title="First page"
            >
              &lt;&lt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              title="Previous page"
            >
              &lt;
            </button>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value))}
              disabled={loading}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">of {totalPages}</span>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              disabled={loading}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              title="Next page"
            >
              &gt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
              title="Last page"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.firstName || 'N/A'} {selectedCustomer.lastName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedCustomer.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mobile</label>
                      <p className="text-sm text-gray-900">{selectedCustomer.mobile || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{selectedCustomer.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Postcode</label>
                      <p className="text-sm text-gray-900">{selectedCustomer.postcode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Order Statistics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Statistics</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Total Orders</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-900">Total Spent</span>
                        <span className="text-2xl font-bold text-green-600">
                          {customerService.formatCurrency(selectedCustomer.totalSpent)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-900">Average Order Value</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {customerService.formatCurrency((selectedCustomer as any).averageOrderValue || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-900">Customer Type</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${customerService.getCustomerTypeBadgeColor(selectedCustomer.customerType)}`}>
                          {selectedCustomer.customerType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History Summary */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">First Order Date</label>
                    <p className="text-sm text-gray-900">
                      {(selectedCustomer as any).firstOrderDate 
                        ? new Date((selectedCustomer as any).firstOrderDate).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Order Date</label>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.lastOrderDate 
                        ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Detailed Order History with Pagination */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <h4 className="text-md font-medium p-4 border-b bg-gray-50">
                    Recent Orders ({orderTotal})
                  </h4>
                  
                  {ordersLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-500">Loading orders...</span>
                    </div>
                  ) : customerOrders.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No order history found for this customer.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order #
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {customerOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-blue-600">
                                    {order.orderNumber}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {order.formattedDate}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {order.orderType}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                  <div className="text-sm font-medium text-gray-900">
                                    £{order.finalTotal.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Order Pagination */}
                      {orderTotalPages > 1 && (
                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                          <div className="flex-1 flex justify-between sm:hidden">
                            <button
                              onClick={() => handleOrderPageChange(orderPage - 1)}
                              disabled={orderPage === 1}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => handleOrderPageChange(orderPage + 1)}
                              disabled={orderPage === orderTotalPages}
                              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(orderPage - 1) * 5 + 1}</span> to{" "}
                                <span className="font-medium">
                                  {Math.min(orderPage * 5, orderTotal)}
                                </span>{" "}
                                of <span className="font-medium">{orderTotal}</span> orders
                              </p>
                            </div>
                            <div>
                              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                  onClick={() => handleOrderPageChange(1)}
                                  disabled={orderPage === 1}
                                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <span className="sr-only">First</span>
                                  <span>«</span>
                                </button>
                                <button
                                  onClick={() => handleOrderPageChange(orderPage - 1)}
                                  disabled={orderPage === 1}
                                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <span className="sr-only">Previous</span>
                                  <span>‹</span>
                                </button>
                                
                                {/* Page numbers */}
                                {[...Array(orderTotalPages)].map((_, i) => {
                                  const pageNum = i + 1;
                                  // Only show pages near current page
                                  if (
                                    pageNum === 1 ||
                                    pageNum === orderTotalPages ||
                                    (pageNum >= orderPage - 1 && pageNum <= orderPage + 1)
                                  ) {
                                    return (
                                      <button
                                        key={pageNum}
                                        onClick={() => handleOrderPageChange(pageNum)}
                                        className={`relative inline-flex items-center px-4 py-2 border ${
                                          pageNum === orderPage
                                            ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        } text-sm font-medium`}
                                      >
                                        {pageNum}
                                      </button>
                                    );
                                  }
                                  
                                  // Show ellipsis for skipped pages
                                  if (
                                    (pageNum === 2 && orderPage > 3) ||
                                    (pageNum === orderTotalPages - 1 && orderPage < orderTotalPages - 2)
                                  ) {
                                    return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                                  }
                                  
                                  return null;
                                })}
                                
                                <button
                                  onClick={() => handleOrderPageChange(orderPage + 1)}
                                  disabled={orderPage === orderTotalPages}
                                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <span className="sr-only">Next</span>
                                  <span>›</span>
                                </button>
                                <button
                                  onClick={() => handleOrderPageChange(orderTotalPages)}
                                  disabled={orderPage === orderTotalPages}
                                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <span className="sr-only">Last</span>
                                  <span>»</span>
                                </button>
                              </nav>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}