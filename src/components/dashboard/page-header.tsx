import React from 'react'
import { BellIcon, MoonIcon, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface PageHeaderProps {
  userName?: string
  userRole?: string
}

function PageHeader({ userName = 'Owner Durai', userRole = 'Admin' }: PageHeaderProps) {
  const { logout, user } = useAuth()
  
  // Use actual user data if available
  const displayName = user?.firstName + " " + user?.lastName || userName
  const displayRole = user?.roleDetails?.name || user?.role || userRole

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="bg-gray-50 py-4 px-6 flex justify-between items-center border-b">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {displayName}</h1>
        <p className="text-gray-600 text-sm">Monitor your business performance and data</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <MoonIcon className="h-5 w-5 text-gray-700" />
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors relative">
          <BellIcon className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2 border border-gray-200 rounded px-3 py-1">
          <span className="font-medium text-sm">EN</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-gray-500">{displayRole}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white overflow-hidden">
            <img 
              src={`https://ui-avatars.com/api/?name=${displayName.replace(/\s+/g, '+')}&background=4f46e5&color=ffffff`}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default PageHeader 