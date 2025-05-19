import React from 'react'
import PageLayout from "@/components/layout/page-layout"

export default function FirebaseConfigurationPage() {
  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Firebase configuration</h1>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              API key
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter API key"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              Auth domain
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter Auth domain" 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              Project ID
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter Project ID"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              Storage bucket
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter Storage bucket"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              Messaging sender ID
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter Messaging sender ID"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              App ID
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter App ID"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              Measurement ID
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter Measurement ID"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>
              VAPID key
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter VAPID key"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              IOS API key
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter IOS API key"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">
              Android API key
            </label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter Android API key"
            />
          </div>
        </div>
        
        <div className="text-sm text-center text-gray-500 mt-6">
          <span>Restroman UK support team </span>
          <a href="#" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 