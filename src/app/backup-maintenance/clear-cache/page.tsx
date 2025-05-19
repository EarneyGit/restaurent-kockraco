import React from 'react'
import { AlertTriangle } from 'lucide-react'

function ClearCachePage() {
  return (
    <div className="p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Clear cache</h1>
        </div>

        {/* Warning Message */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <AlertTriangle className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Do you really want to clear the cache?</h2>
          <p className="text-gray-600 mb-6">Clearing the cache will remove temporary data and might help resolve certain issues.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Clear cache
          </button>
        </div>

        {/* Cache Information */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Cache Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Size
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Last Cleared
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  Application Cache
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  24.5 MB
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  23-05-2023 09:45
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  Database Cache
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  18.2 MB
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  23-05-2023 09:45
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  Route Cache
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  5.7 MB
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  23-05-2023 09:45
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a></p>
        </div>
      </div>
    </div>
  )
}

export default ClearCachePage 