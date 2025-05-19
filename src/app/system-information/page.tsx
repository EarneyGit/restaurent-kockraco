import React from 'react'
import { Info } from 'lucide-react'

function SystemInformationPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System information</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">PHP Version</span>
          </div>
          <div className="p-4 border-b">
            <span>8.1.32</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">Laravel Version</span>
          </div>
          <div className="p-4 border-b">
            <span>8.83.27</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">OS Version</span>
          </div>
          <div className="p-4 border-b">
            <span>Linux srv784976 6.8.0-57-generic #59-Ubuntu SMP PREEMPT_DYNAMIC Sat Mar 15 17:40:59 UTC 2025 x86_64</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">MySQL Version</span>
          </div>
          <div className="p-4 border-b">
            <span>8.0.36-28</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">NodeJs Version</span>
          </div>
          <div className="p-4 border-b">
            <span>v20.19.0</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">NPM Version</span>
          </div>
          <div className="p-4 border-b">
            <span>10.8.2</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">Project Version</span>
          </div>
          <div className="p-4 border-b">
            <span></span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">Composer Version</span>
          </div>
          <div className="p-4 border-b">
            <span>Composer version 2.8.6 2025-02-25 13:03:50</span>
          </div>
          
          <div className="p-4 border-b border-r bg-gray-50">
            <span className="font-medium">error</span>
          </div>
          <div className="p-4 border-b">
            <span>No error</span>
          </div>
          
          <div className="p-4 border-r bg-gray-50">
            <span className="font-medium">engine</span>
          </div>
          <div className="p-4">
            <span>innodb_version</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a></p>
      </div>
    </div>
  )
}

export default SystemInformationPage 