"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"
import { customerService, Customer, CustomerResponse } from '@/services/customer.service'

interface SearchFilters {
  userId: string
  firstname: string
  lastname: string
  email: string
  mobile: string
  postcode: string
}

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [filters, setFilters] = useState<SearchFilters>({
    userId: '',
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    postcode: ''
  })
  
  // State for API data
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: CustomerResponse = await customerService.getFilteredCustomers(
        {
          userId: filters.userId || undefined,
          firstname: filters.firstname || undefined,
          lastname: filters.lastname || undefined,
          email: filters.email || undefined,
          mobile: filters.mobile || undefined,
          postcode: filters.postcode || undefined,
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
    fetchCustomers()
  }, [currentPage, itemsPerPage])

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

  // Handle customer details view
  const handleViewDetails = async (customerId: string) => {
    try {
      const response = await customerService.getCustomer(customerId)
      // You can implement a modal or navigate to a details page here
      console.log('Customer details:', response.data)
      // For now, just log the details
      alert(`Customer Details:\nName: ${customerService.formatCustomerName(response.data)}\nEmail: ${response.data.email}\nTotal Orders: ${response.data.totalOrders}\nTotal Spent: ${customerService.formatCurrency(response.data.totalSpent)}`)
    } catch (err: any) {
      console.error('Error fetching customer details:', err)
      alert('Failed to fetch customer details')
    }
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-medium mb-6">Customers</h1>
        
        {/* Search Filters */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <input 
            type="text" 
            placeholder="User Id" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.userId}
            onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="First name" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.firstname}
            onChange={(e) => setFilters(prev => ({ ...prev, firstname: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Last name" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.lastname}
            onChange={(e) => setFilters(prev => ({ ...prev, lastname: e.target.value }))}
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
                      userId: '',
                      firstname: '',
                      lastname: '',
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
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3">Firstname</th>
                  <th className="px-6 py-3">Lastname</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Mobile</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Postcode</th>
                  <th className="px-6 py-3">Orders</th>
                  <th className="px-6 py-3">Total Spent</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{customer.firstname || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">{customer.lastname || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{customer.email || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">{customer.mobile || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">{customer.address || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">{customer.postcode || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium">
                      {customerService.formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${customerService.getCustomerTypeBadgeColor(customer.customerType)}`}>
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <button 
                        className="text-teal-500 hover:text-teal-700"
                        onClick={() => handleViewDetails(customer.id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Controls - Bottom Only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading}
            >
              &lt;&lt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
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
            <span className="text-sm">of {totalPages}</span>
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
            <span className="text-sm">of {totalCustomers}</span>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              &gt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 