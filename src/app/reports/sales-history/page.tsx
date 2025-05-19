'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ItemsTable } from '@/components/reports/items-table'
import { PrinterIcon, RotateCw } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { SaleData } from '@/types/reports'

const sampleData: SaleData[] = [
  {
    id: '12803700',
    customer: '[Guest] Toby Thomas',
    value: 14.47,
    discount: 0.00,
    tip: 0.00,
    postcode: 'KY12 9HS',
    pay: 'Card',
    type: 'Collection',
    created: '16/05/2025',
    platform: 'App4'
  },
  {
    id: '12800277',
    customer: '[Guest] Kevan Tate',
    value: 33.96,
    discount: 0.00,
    tip: 0.00,
    postcode: 'KY12 8RN',
    pay: 'Card',
    type: 'Delivery',
    created: '16/05/2025',
    platform: 'App4'
  },
  {
    id: '12793015',
    customer: '2382095 - Chris Jermain',
    value: 22.95,
    discount: 5.00,
    tip: 0.00,
    postcode: 'KY12 8YP',
    pay: 'Card',
    type: 'Delivery',
    created: '15/05/2025',
    platform: 'App4'
  },
  {
    id: '12792198',
    customer: '[Guest] Danny Morgan',
    value: 36.38,
    discount: 0.00,
    tip: 0.00,
    postcode: 'KY12 8DE',
    pay: 'Card',
    type: 'Collection',
    created: '15/05/2025',
    platform: 'App4'
  }
]

export default function SalesHistoryPage() {
  // Set default date range to start of month and current date
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const [startDate, setStartDate] = useState<Date>(startOfMonth)
  const [endDate, setEndDate] = useState<Date>(today)
  
  const [filteredData, setFilteredData] = useState<SaleData[]>(() => {
    return sampleData.filter(sale => {
      const [day, month, year] = sale.created.split('/')
      const saleDate = new Date(Number(year), Number(month) - 1, Number(day))
      return saleDate >= startOfMonth && saleDate <= today
    })
  })

  const handleRefresh = () => {
    if (!startDate || !endDate) {
      setFilteredData(sampleData)
      return
    }

    const filtered = sampleData.filter(sale => {
      const [day, month, year] = sale.created.split('/')
      const saleDate = new Date(Number(year), Number(month) - 1, Number(day))
      return saleDate >= startDate && saleDate <= endDate
    })
    setFilteredData(filtered)
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/')
  }

  const totalValue = filteredData.reduce((sum, sale) => sum + sale.value, 0)
  const totalDiscounts = filteredData.reduce((sum, sale) => sum + sale.discount, 0)
  const totalTips = filteredData.reduce((sum, sale) => sum + sale.tip, 0)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">
          Sales History Report: {formatDate(startDate)} - {formatDate(endDate)}
        </h1>
        <div className="flex gap-4 items-center no-print">
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              className="w-[200px]"
            />
            <span className="text-gray-500">to</span>
            <DatePicker
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              className="w-[200px]"
            />
            <Button onClick={handleRefresh} variant="outline" className="bg-white">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handlePrint} variant="outline" className="bg-white">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <ItemsTable data={filteredData} type="sales" />
        </div>
        <div className="border-t p-4">
          <div className="flex gap-8">
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="text-2xl mt-1">£{totalValue.toFixed(2)}</div>
            </div>
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Discounts</div>
              <div className="text-2xl mt-1">£{totalDiscounts.toFixed(2)}</div>
            </div>
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Tips</div>
              <div className="text-2xl mt-1">£{totalTips.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 