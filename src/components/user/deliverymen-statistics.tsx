"use client"

import React from 'react'

interface DeliverymanData {
  id: number
  name: string
  orders: number
  wallet: string
  rate: number
}

export default function DeliverymenStatistics() {
  // Mock data for deliverymen
  const deliveryData = [
    { 
      id: 106, 
      name: "Delivery Delivery", 
      orders: 34, 
      wallet: "$ 0.00",
      rate: 0 
    },
    { 
      id: 122, 
      name: "Delivery TEST", 
      orders: 4, 
      wallet: "$ 31.42",
      rate: 0 
    }
  ]
  
  // Determine top and lowest stats
  const topOrders = [...deliveryData].sort((a, b) => b.orders - a.orders)
  const lowestOrders = [...deliveryData].sort((a, b) => a.orders - b.orders)
  
  // For earnings, sort by wallet amount (removing $ and parsing as float)
  const topEarner = [...deliveryData].sort((a, b) => {
    const aValue = parseFloat(a.wallet.replace('$', '').trim())
    const bValue = parseFloat(b.wallet.replace('$', '').trim())
    return bValue - aValue
  })
  
  const lowestEarner = [...deliveryData].sort((a, b) => {
    const aValue = parseFloat(a.wallet.replace('$', '').trim())
    const bValue = parseFloat(b.wallet.replace('$', '').trim())
    return aValue - bValue
  })
  
  const hasRatingData = deliveryData.some(data => data.rate > 0)
  
  const renderNoData = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-4 w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-gray-500">No Data</p>
    </div>
  )
  
  return (
    <div className="w-full px-6 py-6">
      <h1 className="text-2xl font-medium mb-6">Top rating</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Rating Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hasRatingData ? (
                  deliveryData
                    .filter(data => data.rate > 0)
                    .sort((a, b) => b.rate - a.rate)
                    .map(data => (
                      <tr key={`top-rating-${data.id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.rate}</td>
                      </tr>
                    ))
                ) : renderNoData()}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Lowest Rating Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-medium px-4 py-3 border-b">Lowest rating</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hasRatingData ? (
                  deliveryData
                    .filter(data => data.rate > 0)
                    .sort((a, b) => a.rate - b.rate)
                    .map(data => (
                      <tr key={`lowest-rating-${data.id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.rate}</td>
                      </tr>
                    ))
                ) : renderNoData()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-medium mb-6">Top orders</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Orders Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topOrders.map(data => (
                  <tr key={`top-orders-${data.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Lowest Orders Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-medium px-4 py-3 border-b">Lowest orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowestOrders.map(data => (
                  <tr key={`lowest-orders-${data.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-medium mb-6">Top earner</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Earner Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topEarner.map(data => (
                  <tr key={`top-earner-${data.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.wallet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Lowest Earner Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-medium px-4 py-3 border-b">Lowest earner</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowestEarner.map(data => (
                  <tr key={`lowest-earner-${data.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.wallet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>Restroman UK support team</span>
        <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 