"use client"

import React, { useState, useRef } from 'react'
import { MessageCircle, Trash, Star, MoreVertical, Search, ChevronDown, X, HelpCircle } from 'lucide-react'
import Image from 'next/image'

interface DeliverymanReview {
  id: number
  deliveryman: {
    id: number
    name: string
    image: string
  }
  customer: {
    name: string
  }
  order_id: string
  rating: number
  review: string
  created_at: string
}

export default function DeliverymenReviews() {
  const [selectedReviews, setSelectedReviews] = useState<number[]>([])
  const [selectedDeliveryman, setSelectedDeliveryman] = useState<string>('all')
  const [isDeliverymanDropdownOpen, setIsDeliverymanDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const checkAllRef = useRef<HTMLInputElement>(null)

  // Mock data for deliverymen reviews
  const reviews: DeliverymanReview[] = [
    {
      id: 1,
      deliveryman: {
        id: 1,
        name: 'John Doe',
        image: '/images/avatar-1.png'
      },
      customer: {
        name: 'Alice Smith'
      },
      order_id: '#10205',
      rating: 4,
      review: 'Fast delivery, very professional service.',
      created_at: '2023-05-15 14:30'
    },
    {
      id: 2,
      deliveryman: {
        id: 2,
        name: 'Mike Wilson',
        image: '/images/avatar-2.png'
      },
      customer: {
        name: 'Bob Johnson'
      },
      order_id: '#10206',
      rating: 5,
      review: 'Excellent service! Food was still hot when delivered.',
      created_at: '2023-05-14 18:45'
    },
    {
      id: 3,
      deliveryman: {
        id: 1,
        name: 'John Doe',
        image: '/images/avatar-1.png'
      },
      customer: {
        name: 'Charlie Brown'
      },
      order_id: '#10210',
      rating: 3,
      review: 'Delivery was a bit late, but food was good.',
      created_at: '2023-05-13 12:15'
    }
  ]

  // List of unique deliverymen
  const deliverymen = Array.from(new Set(reviews.map(review => review.deliveryman.name)))

  // Filter reviews based on selected deliveryman and search query
  const filteredReviews = reviews.filter(review => {
    const matchesDeliveryman = selectedDeliveryman === 'all' || review.deliveryman.name === selectedDeliveryman
    const matchesSearch = searchQuery === '' || 
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesDeliveryman && matchesSearch
  })

  function toggleSelectAll() {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(filteredReviews.map(review => review.id))
    }
  }

  function toggleSelectReview(id: number) {
    if (selectedReviews.includes(id)) {
      setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id))
    } else {
      setSelectedReviews([...selectedReviews, id])
    }
  }

  function renderRating(rating: number) {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-gray-900">Deliverymen reviews</h1>
        </div>

        {/* Actions Bar */}
        <div className="p-6 border-b flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            {selectedReviews.length > 0 && (
              <button className="flex items-center text-red-500 gap-2">
                <Trash size={18} />
                <span>Delete selected</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                placeholder="Search by name, order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Deliveryman Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center justify-between gap-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg w-56 p-2.5"
                onClick={() => setIsDeliverymanDropdownOpen(!isDeliverymanDropdownOpen)}
              >
                <span>
                  {selectedDeliveryman === 'all' 
                    ? 'All deliverymen' 
                    : selectedDeliveryman}
                </span>
                <ChevronDown size={18} />
              </button>

              {isDeliverymanDropdownOpen && (
                <div className="absolute z-10 w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setSelectedDeliveryman('all')
                          setIsDeliverymanDropdownOpen(false)
                        }}
                      >
                        All deliverymen
                      </button>
                    </li>
                    {deliverymen.map((name) => (
                      <li key={name}>
                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setSelectedDeliveryman(name)
                            setIsDeliverymanDropdownOpen(false)
                          }}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <input
                    ref={checkAllRef}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope="col" className="px-6 py-3">Deliveryman</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Order ID</th>
                <th scope="col" className="px-6 py-3">Rating</th>
                <th scope="col" className="px-6 py-3">Review</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="w-4 p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => toggleSelectReview(review.id)}
                      />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 relative rounded-full overflow-hidden">
                        <Image
                          src={review.deliveryman.image}
                          alt={review.deliveryman.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{review.deliveryman.name}</span>
                    </td>
                    <td className="px-6 py-4">{review.customer.name}</td>
                    <td className="px-6 py-4">{review.order_id}</td>
                    <td className="px-6 py-4">{renderRating(review.rating)}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{review.review}</td>
                    <td className="px-6 py-4">{review.created_at}</td>
                    <td className="px-6 py-4">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <X size={40} className="text-gray-400 p-2 bg-gray-100 rounded-full" />
                      <p className="text-gray-500 text-sm">No reviews found</p>
                      {searchQuery && (
                        <button
                          className="text-blue-500 text-sm font-medium mt-2"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
              <span className="font-medium">3</span> reviews
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled
              className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-400 text-sm"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-400 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Support Footer */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <HelpCircle size={16} />
        <span>Have a question? Contact support at</span>
        <a href="mailto:support@example.com" className="text-blue-500">support@example.com</a>
      </div>
    </div>
  )
} 