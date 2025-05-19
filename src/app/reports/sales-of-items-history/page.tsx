'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ItemsTable } from '@/components/reports/items-table'
import { PrinterIcon, RotateCw } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { ItemSaleData } from '@/types/reports'

const sampleData: (ItemSaleData & { created: string })[] = [
  {
    id: '41168460',
    name: 'Curly Fries (V)',
    quantity: 2,
    created: '16/05/2025'
  },
  {
    id: '41168461',
    name: 'Original Chicken Wrap',
    quantity: 1,
    created: '16/05/2025'
  },
  {
    id: '41158177',
    name: 'Mac Daddy Chicken Wrap',
    quantity: 1,
    created: '15/05/2025'
  },
  {
    id: '41158178',
    name: 'Cola BBQ Chicken Tenders',
    quantity: 1,
    created: '15/05/2025'
  },
  {
    id: '41158179',
    name: 'Half Chicken',
    quantity: 1,
    created: '15/05/2025'
  },
  {
    id: '41158180',
    name: 'Seasoned Skin-on Fries',
    quantity: 1,
    created: '15/05/2025'
  }
]

export default function SalesOfItemsHistoryPage() {
  // Set default date range to start of month and current date
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const [startDate, setStartDate] = useState<Date>(startOfMonth)
  const [endDate, setEndDate] = useState<Date>(today)
  
  const [filteredData, setFilteredData] = useState<(ItemSaleData & { created: string })[]>(() => {
    return sampleData.filter(item => {
      const [day, month, year] = item.created.split('/')
      const itemDate = new Date(Number(year), Number(month) - 1, Number(day))
      return itemDate >= startOfMonth && itemDate <= today
    })
  })

  const handleRefresh = () => {
    if (!startDate || !endDate) {
      setFilteredData(sampleData)
      return
    }

    // Add timestamps to make the comparison inclusive of the full days
    const startDateTime = new Date(startDate.setHours(0, 0, 0, 0))
    const endDateTime = new Date(endDate.setHours(23, 59, 59, 999))

    const filtered = sampleData.filter(item => {
      const [day, month, year] = item.created.split('/')
      const itemDate = new Date(Number(year), Number(month) - 1, Number(day))
      return itemDate >= startDateTime && itemDate <= endDateTime
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

  const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">
          Sales of Items History: {formatDate(startDate)} - {formatDate(endDate)}
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
          <ItemsTable data={filteredData} type="items" />
        </div>
        <div className="border-t p-4">
          <div className="flex gap-8">
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Quantity</div>
              <div className="text-2xl mt-1">{totalQuantity}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 