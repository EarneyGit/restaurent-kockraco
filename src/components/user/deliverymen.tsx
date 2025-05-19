"use client"

import React, { useState } from 'react'
import { Search, Pencil, Plus, List } from 'lucide-react'

interface Deliveryman {
  id: number
  name: string
  ordersCount: number
  totalPrice: string
  rate: number
  wallet: string
  setting: {
    brand: string
    model: string
    number: string
    color: string
  }
}

export default function DeliverymenList() {
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([
    { 
      id: 122, 
      name: "Delivery TEST", 
      ordersCount: 4, 
      totalPrice: "$ 249.82", 
      rate: 0, 
      wallet: "$ 31.42",
      setting: {
        brand: "AUDI",
        model: "S8",
        number: "A123AAA",
        color: "black"
      }
    },
    { 
      id: 106, 
      name: "Delivery Delivery", 
      ordersCount: 34, 
      totalPrice: "$ 24,041.38", 
      rate: 0, 
      wallet: "$ 0.00",
      setting: {
        brand: "BMW",
        model: "M5 F90 competition",
        number: "M111MM",
        color: "#000"
      }
    }
  ])
  
  const [selectedDeliverymen, setSelectedDeliverymen] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  
  const handleSelectAll = () => {
    if (selectedDeliverymen.length === deliverymen.length) {
      setSelectedDeliverymen([])
    } else {
      setSelectedDeliverymen(deliverymen.map(deliveryman => deliveryman.id))
    }
  }
  
  const handleSelectDeliveryman = (id: number) => {
    if (selectedDeliverymen.includes(id)) {
      setSelectedDeliverymen(selectedDeliverymen.filter(deliverymanId => deliverymanId !== id))
    } else {
      setSelectedDeliverymen([...selectedDeliverymen, id])
    }
  }

  const renderRating = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return <div className="flex">{stars}</div>
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Deliverymen list</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          <Plus size={18} />
          Add deliveryman
        </button>
      </div>
      
      <div className="mb-6 flex justify-between">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50">
            Delete selection
          </button>
          <button className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
            <List size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by id, title"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Type of technique</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="bicycle">Bicycle</option>
              <option value="foot">On foot</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedDeliverymen.length === deliverymen.length && deliverymen.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveryman setting</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliverymen.map((deliveryman) => (
                <tr key={deliveryman.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedDeliverymen.includes(deliveryman.id)}
                      onChange={() => handleSelectDeliveryman(deliveryman.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{deliveryman.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{deliveryman.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{deliveryman.ordersCount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{deliveryman.totalPrice}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderRating(deliveryman.rate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{deliveryman.wallet}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <p>Brand: {deliveryman.setting.brand}</p>
                      <p>Model: {deliveryman.setting.model}</p>
                      <p>Number: {deliveryman.setting.number}</p>
                      <p>Color: {deliveryman.setting.color}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200 text-blue-600">2</button>
                      <button className="p-1.5 bg-red-100 rounded-full hover:bg-red-200 text-red-600">®</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <button className="relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="inline-flex -space-x-px">
            <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-500 text-sm font-medium text-white focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500">
              1
            </button>
          </span>
          <button className="relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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