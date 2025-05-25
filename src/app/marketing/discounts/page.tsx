"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"
import DiscountModal from "@/components/marketing/discount-modal"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { discountService, Discount, DiscountResponse } from '@/services/discount.service'

export default function DiscountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | undefined>()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDiscounts, setTotalDiscounts] = useState(0)

  // Fetch discounts from API
  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: DiscountResponse = await discountService.getDiscounts(currentPage, 20)
      
      setDiscounts(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalDiscounts(response.pagination.totalDiscounts)
    } catch (err: any) {
      console.error('Error fetching discounts:', err)
      setError(err.message || 'Failed to fetch discounts')
      setDiscounts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch discounts when component mounts or page changes
  useEffect(() => {
    fetchDiscounts()
  }, [currentPage])

  const handleAddDiscount = () => {
    setSelectedDiscount(undefined)
    setIsModalOpen(true)
  }

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount)
    setIsModalOpen(true)
  }

  const handleDeleteDiscount = async (id: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      try {
        await discountService.deleteDiscount(id)
        fetchDiscounts() // Refresh the list
      } catch (err: any) {
        console.error('Error deleting discount:', err)
        alert('Failed to delete discount: ' + err.message)
      }
    }
  }

  const handleSaveDiscount = async (discount: Partial<Discount>) => {
    try {
      if (discount._id) {
        // Update existing discount
        await discountService.updateDiscount(discount._id, discount)
      } else {
        // Create new discount
        await discountService.createDiscount(discount)
      }
      fetchDiscounts() // Refresh the list
    } catch (err: any) {
      console.error('Error saving discount:', err)
      alert('Failed to save discount: ' + err.message)
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">Discounts</h1>
          <Button
            onClick={handleAddDiscount}
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={loading}
          >
            Add Discount
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchDiscounts}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Discounts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <span className="ml-2 text-gray-600">Loading discounts...</span>
            </div>
          ) : discounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No discounts available</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Min Spend</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount._id} className="border-b">
                    <td className="px-6 py-4">{discount.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {discount.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${discountService.getDiscountTypeBadgeColor(discount.discountType)}`}>
                        {discountService.formatDiscountValue(discount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {discount.startDate ? discountService.formatDate(discount.startDate) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {discount.endDate ? discountService.formatDate(discount.endDate) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {discountService.formatCurrency(discount.minSpend)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${discountService.getDiscountStatusBadgeColor(discount.isActive)}`}>
                        {discount.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleEditDiscount(discount)}
                          className="text-emerald-500 hover:text-emerald-700"
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteDiscount(discount._id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {discounts.length} of {totalDiscounts} discounts
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <DiscountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          discount={selectedDiscount}
          onSave={handleSaveDiscount}
        />
      </div>
    </PageLayout>
  )
} 