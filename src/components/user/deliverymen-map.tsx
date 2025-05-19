"use client"

import React, { useState } from 'react'
import { Search } from 'lucide-react'

interface DeliverymanMarker {
  id: number
  name: string
  lastActive: string
  activeOrders: number
  position: {
    lat: number
    lng: number
  }
}

export default function DeliverymenMap() {
  const [deliverymen, setDeliverymen] = useState<DeliverymanMarker[]>([
    { 
      id: 1, 
      name: "Delivery D.", 
      lastActive: "3 hours ago",
      activeOrders: 1,
      position: {
        lat: 51.505,
        lng: -0.09
      }
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [mapFilter, setMapFilter] = useState('All')
  
  return (
    <div className="w-full px-6 py-6">
      <h1 className="text-2xl font-medium mb-6">Deliveries</h1>
      
      <div className="flex justify-end mb-6">
        <div className="relative">
          <button 
            className={`px-4 py-2 rounded-l-md ${mapFilter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setMapFilter('All')}
          >
            All
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        <div className="relative h-[600px] bg-[#f8f7f2]">
          {/* Map container */}
          <div className="w-full h-full">
            {/* Google Map would be initialized here in a production app */}
            <div className="flex items-center justify-center w-full h-full">
              {/* Placeholder for map */}
              <div className="absolute w-full h-full">
                {/* Simulated map */}
                <div className="bg-[#f8f7f2] w-full h-full flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white cursor-pointer">
                      <span className="text-xl">📍</span>
                    </div>
                  </div>
                  
                  {/* Google Map attribution */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2 text-xs text-gray-500">
                    <div>
                      <img src="https://maps.gstatic.com/mapfiles/api-3/images/google4.png" alt="Google" className="h-5 inline-block" />
                    </div>
                    <div className="flex space-x-4">
                      <span>Keyboard shortcuts</span>
                      <span>Map data ©2025</span>
                      <span>Terms</span>
                      <span>Report a map error</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deliveryman card - top right */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-4 max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <h3 className="font-medium">Delivery D.</h3>
                <p className="text-sm text-gray-500">3 hours ago</p>
                <div className="text-sm">Active Orders: 1</div>
              </div>
            </div>
          </div>
          
          {/* Full screen button - bottom right */}
          <button className="absolute bottom-16 right-4 p-2 bg-white rounded-sm shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>Restroman UK support team</span>
        <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 