import React from 'react'
import { BellIcon, MoonIcon } from 'lucide-react'

interface PageHeaderProps {
  userName?: string
  userRole?: string
}

function PageHeader({ userName = 'Owner Durai', userRole = 'Admin' }: PageHeaderProps) {
  return (
    <div className="bg-gray-50 py-4 px-6 flex justify-between items-center border-b">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {userName}</h1>
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
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white overflow-hidden">
            <img 
              src={`https://ui-avatars.com/api/?name=${userName.replace(/\s+/g, '+')}&background=4f46e5&color=ffffff`}
              alt={userName}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader 