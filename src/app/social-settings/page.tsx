"use client"

import React from "react"
import PageLayout from "@/components/layout/page-layout"

function SocialSettingsPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Social settings</h1>
          
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>

        {/* Social Media Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instagram */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Instagram</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="text"
                  name="instagram"
                  id="instagram"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
            </div>
          </div>

          {/* Facebook */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Facebook</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook URL
                </label>
                <input
                  type="text"
                  name="facebook"
                  id="facebook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Twitter</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter URL
                </label>
                <input
                  type="text"
                  name="twitter"
                  id="twitter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </div>
          </div>

          {/* Youtube */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Youtube</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                  Youtube URL
                </label>
                <input
                  type="text"
                  name="youtube"
                  id="youtube"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://youtube.com/channel/yourchannelid"
                />
              </div>
            </div>
          </div>

          {/* Telegram */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Telegram</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-1">
                  Telegram URL
                </label>
                <input
                  type="text"
                  name="telegram"
                  id="telegram"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://t.me/yourusername"
                />
              </div>
            </div>
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

export default SocialSettingsPage 