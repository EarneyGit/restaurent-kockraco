'use client'

import React, { memo, useCallback } from 'react'
import { LogOut, Eye } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface CommonHeaderProps {
  title?: string
  showViewStore?: boolean
}

const CommonHeader = memo(function CommonHeader({ title, showViewStore = true }: CommonHeaderProps) {
  const { logout, user } = useAuth()
  
  // Use actual user data if available
  const displayName = user?.name || title || 'Admin user'

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const handleViewStore = useCallback(() => {
    // Placeholder for view store functionality
    console.log('View store clicked')
  }, [])

  return (
    <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
      <div className="flex-1"></div>
      <h1 className="text-xl font-medium flex-1 text-center">{displayName}</h1>
      <div className="flex justify-end flex-1 items-center space-x-4">
        {showViewStore && (
          <button 
            className="flex items-center text-gray-700 font-medium"
            onClick={handleViewStore}
          >
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
})

export default CommonHeader 