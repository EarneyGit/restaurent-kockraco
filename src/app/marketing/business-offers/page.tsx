"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import BusinessOffersModal from "@/components/marketing/business-offers-modal"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface BusinessOffer {
  id: number
  title: string
  content: string
  startDate: Date | null
  endDate: Date | null
  displayOrder: number
  image?: string
}

export default function BusinessOffersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<BusinessOffer | undefined>()
  const [offers, setOffers] = useState<BusinessOffer[]>([
    {
      id: 1,
      title: "Summer Special",
      content: "<p>Get 20% off on all main courses!</p>",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-31"),
      displayOrder: 1,
    },
    {
      id: 2,
      title: "Happy Hour",
      content: "<p>Buy one get one free on selected drinks</p>",
      startDate: new Date("2024-05-01"),
      endDate: null,
      displayOrder: 2,
    },
  ])

  const handleAddOffer = () => {
    setSelectedOffer(undefined)
    setIsModalOpen(true)
  }

  const handleEditOffer = (offer: BusinessOffer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
  }

  const handleDeleteOffer = (id: number) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter((offer) => offer.id !== id))
    }
  }

  const handleSaveOffer = (offer: BusinessOffer) => {
    if (offer.id) {
      setOffers(offers.map((o) => (o.id === offer.id ? offer : o)))
    } else {
      setOffers([...offers, { ...offer, id: Date.now() }])
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
          >
            Add Offer
          </Button>
        </div>
        
        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Start Date</th>
                  <th className="pb-3">End Date</th>
                  <th className="pb-3">Display Order</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b">
                    <td className="py-3">{offer.title}</td>
                    <td className="py-3">
                      {offer.startDate ? format(offer.startDate, "PP") : "-"}
                    </td>
                    <td className="py-3">
                      {offer.endDate ? format(offer.endDate, "PP") : "-"}
                    </td>
                    <td className="py-3">{offer.displayOrder}</td>
                    <td className="py-3">
                      <div className="flex justify-center space-x-6">
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="text-emerald-500 hover:text-emerald-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No offers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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