'use client'

import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import CommonHeader from '@/components/layout/common-header'

const tabs = [
  { id: 'end-of-night', label: 'End of Night', path: '/reports' },
  { id: 'end-of-month', label: 'End of Month', path: '/reports/end-of-month' },
  { id: 'sales-history', label: 'Sales History', path: '/reports/sales-history' },
  { id: 'sales-of-items-history', label: 'Sales of Items History', path: '/reports/sales-of-items-history' },
  { id: 'discount-history', label: 'Discount History', path: '/reports/discount-history' },
  { id: 'outlets-report', label: 'Outlets Report', path: '/reports/outlets-report' },
  { id: 'custom-reports', label: 'Custom Reports', path: '/reports/custom-reports' }
]

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedTab, setSelectedTab] = useState<string>('end-of-night')

  // Update selected tab when pathname changes
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === pathname)
    if (currentTab) {
      setSelectedTab(currentTab.id)
    }
  }, [pathname])

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      setSelectedTab(tabId)
      router.push(tab.path)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader />

      <div className="border-b bg-white">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'px-6 py-4 text-sm font-medium',
                selectedTab === tab.id
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  )
} 