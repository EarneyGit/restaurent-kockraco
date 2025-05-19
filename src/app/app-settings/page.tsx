"use client"

import React from "react"
import PageLayout from "@/components/layout/page-layout"

function AppSettingsPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">App Settings</h1>
          
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>

        {/* App Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vendor App iOS */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Vendor App iOS</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://codecanyon.net/item/a-single-multibranch-restaurant-vendor-app-iosandroid/45828823?s..."
              defaultValue="https://codecanyon.net/item/a-single-multibranch-restaurant-vendor-app-iosandroid/45828823?s..."
            />
          </div>

          {/* Vendor App Android */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Vendor App Android</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://codecanyon.net/item/a-single-multibranch-restaurant-vendor-app-iosandroid/45828823?s..."
              defaultValue="https://codecanyon.net/item/a-single-multibranch-restaurant-vendor-app-iosandroid/45828823?s..."
            />
          </div>

          {/* Delivery App iOS */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Delivery App iOS</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://codecanyon.net/item/a-single-multibranch-restaurant-delivery-app-iosandroid/45828976?s..."
              defaultValue="https://codecanyon.net/item/a-single-multibranch-restaurant-delivery-app-iosandroid/45828976?s..."
            />
          </div>

          {/* Delivery App Android */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Delivery App Android</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://codecanyon.net/item/a-single-multibranch-restaurant-delivery-app-iosandroid/45828976?s..."
              defaultValue="https://codecanyon.net/item/a-single-multibranch-restaurant-delivery-app-iosandroid/45828976?s..."
            />
          </div>

          {/* Customer App iOS */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Customer App iOS</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://codecanyon.net/item/a-single-multibranch-restaurant-grocery-store-food-ordering-and-deliv..."
              defaultValue="https://codecanyon.net/item/a-single-multibranch-restaurant-grocery-store-food-ordering-and-deliv..."
            />
          </div>

          {/* Customer App Android */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Customer App Android</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://codecanyon.net/item/a-single-multibranch-restaurant-grocery-store-food-ordering-and-deliv..."
              defaultValue="https://codecanyon.net/item/a-single-multibranch-restaurant-grocery-store-food-ordering-and-deliv..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Restroman UK support team <span className="text-blue-500">123456789</span></p>
        </div>
      </div>
    </PageLayout>
  )
}

export default AppSettingsPage 