import React from 'react'
import { Package } from 'lucide-react'

function UpdateDatabasePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Update database</h1>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2">
          <span className="text-sm font-medium">Update database</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border p-12 flex flex-col items-center justify-center">
        <div className="flex justify-center mb-8">
          <Package className="w-16 h-16 text-blue-500" />
        </div>
        
        <p className="text-gray-600 text-center mb-4">
          In order to update database using this file you need to click button above
        </p>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a></p>
      </div>
    </div>
  )
}

export default UpdateDatabasePage 