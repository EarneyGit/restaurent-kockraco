"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import BusinessOffersModal from "@/components/marketing/business-offers-modal"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { businessOfferService, BusinessOffer, BusinessOfferResponse } from '@/services/business-offer.service'

export default function BusinessOffersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<BusinessOffer | undefined>()
  const [offers, setOffers] = useState<BusinessOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOffers, setTotalOffers] = useState(0)

  // Fetch offers from API
  const fetchOffers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: BusinessOfferResponse = await businessOfferService.getBusinessOffers(currentPage, 20)
      
      setOffers(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalOffers(response.pagination.totalOffers)
    } catch (err: any) {
      console.error('Error fetching business offers:', err)
      setError(err.message || 'Failed to fetch business offers')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch offers when component mounts or page changes
  useEffect(() => {
    fetchOffers()
  }, [currentPage])

  const handleAddOffer = () => {
    setSelectedOffer(undefined)
    setIsModalOpen(true)
  }

  const handleEditOffer = (offer: BusinessOffer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
  }

  const handleDeleteOffer = async (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        await businessOfferService.deleteBusinessOffer(id)
        fetchOffers() // Refresh the list
      } catch (err: any) {
        console.error('Error deleting business offer:', err)
        alert('Failed to delete business offer: ' + err.message)
      }
    }
  }

  const handleSaveOffer = async (offer: Partial<BusinessOffer>) => {
    try {
      if (offer._id) {
        // Update existing offer
        await businessOfferService.updateBusinessOffer(offer._id, offer)
    } else {
        // Create new offer
        await businessOfferService.createBusinessOffer(offer)
      }
      fetchOffers() // Refresh the list
    } catch (err: any) {
      console.error('Error saving business offer:', err)
      alert('Failed to save business offer: ' + err.message)
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
          <h1 className="text-2xl font-medium">Business Offers</h1>
          <Button
            onClick={handleAddOffer}
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={loading}
          >
            Add Offer
          </Button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchOffers}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <span className="ml-2 text-gray-600">Loading business offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No business offers available</p>
            </div>
          ) : (
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Title</th>
                    <th className="pb-3">Content</th>
                  <th className="pb-3">Start Date</th>
                  <th className="pb-3">End Date</th>
                  <th className="pb-3">Display Order</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Stats</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                    <tr key={offer._id} className="border-b">
                    <td className="py-3">{offer.title}</td>
                    <td className="py-3">
                        <div className="max-w-xs truncate">
                          {businessOfferService.truncateContent(offer.content, 50)}
                        </div>
                      </td>
                      <td className="py-3">
                        {offer.startDate ? businessOfferService.formatDate(offer.startDate) : "-"}
                    </td>
                    <td className="py-3">
                        {offer.endDate ? businessOfferService.formatDate(offer.endDate) : "-"}
                    </td>
                    <td className="py-3">{offer.displayOrder}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${businessOfferService.getOfferStatusBadgeColor(offer.isActive)}`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="text-sm text-gray-600">
                          <div>Views: {offer.stats.views}</div>
                          <div>Clicks: {offer.stats.clicks}</div>
                        </div>
                      </td>
                    <td className="py-3">
                      <div className="flex justify-center space-x-6">
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="text-emerald-500 hover:text-emerald-700"
                            disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleDeleteOffer(offer._id)}
                          className="text-red-500 hover:text-red-700"
                            disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {offers.length} of {totalOffers} business offers
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

        <BusinessOffersModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offer={selectedOffer}
          onSave={handleSaveOffer}
        />
      </div>
    </PageLayout>
  )
} 