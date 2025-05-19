"use client"
import React from 'react'
import PageLayout from "@/components/layout/page-layout"
import { Pencil, Plus, Trash } from 'lucide-react'

function LanguagesPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Languages</h1>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
            <Plus size={16} />
            Add language
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                  {/* Checkbox column */}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Image
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="default-language"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  Thai
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <img src="/images/th-flag.png" alt="Thai" className="h-6 w-10 object-cover rounded" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="p-1 bg-blue-100 text-blue-600 rounded-full">
                      <Pencil size={16} />
                    </button>
                    <button className="p-1 bg-red-100 text-red-600 rounded-full">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="default-language"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                      defaultChecked
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  tr
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <img src="/images/us-flag.png" alt="US Flag" className="h-6 w-10 object-cover rounded" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="p-1 bg-blue-100 text-blue-600 rounded-full">
                      <Pencil size={16} />
                    </button>
                    <button className="p-1 bg-red-100 text-red-600 rounded-full">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="default-language"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  English
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <img src="/images/us-flag.png" alt="US Flag" className="h-6 w-10 object-cover rounded" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="p-1 bg-blue-100 text-blue-600 rounded-full">
                      <Pencil size={16} />
                    </button>
                    <button className="p-1 bg-red-100 text-red-600 rounded-full">
                      <Trash size={16} />
                    </button>
                  </div>
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
    </PageLayout>
  )
}

export default LanguagesPage 