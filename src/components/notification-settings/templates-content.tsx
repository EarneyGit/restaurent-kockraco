import React from 'react'
import { Mail, Pencil, Plus, Trash } from 'lucide-react'

export default function TemplatesContent() {
  // Sample data - empty initially
  const templates = []

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Email templates</h1>
        <div className="flex items-center gap-3">
          {templates.length > 0 && (
            <button 
              className="px-4 py-2 text-sm text-red-600 font-medium border border-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              Delete selection
            </button>
          )}
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm text-white font-medium bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add email template
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b">
              <th className="px-6 py-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Send to</th>
              <th className="px-6 py-4">Created at</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.length > 0 ? (
              templates.map((template, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4">{template.id}</td>
                  <td className="px-6 py-4">{template.sendTo}</td>
                  <td className="px-6 py-4">{template.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Pencil size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Mail className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-sm text-gray-500">No data</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Restroman UK support team</p>
        <p>Tel: +998 94 123 45 67</p>
      </div>
    </div>
  )
} 