'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PrinterIcon } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { format, isSameDay, isAfter, isBefore, startOfToday, endOfDay } from 'date-fns'

interface OutletData {
  restaurant: string
  acceptedOrders: number
  acceptedTotal: number
  rejectedOrders: number
  rejectedTotal: number
  date: string // Date in DD/MM/YYYY format
}

// Function to parse date string in DD/MM/YYYY format
function parseDate(dateStr: string) {
  const [day, month, year] = dateStr.split('/')
  return new Date(Number(year), Number(month) - 1, Number(day))
}

// Function to filter and aggregate data by date range and restaurant
function filterDataByDateRange(fromDate: Date, data: OutletData[]) {
  const today = endOfDay(new Date())
  
  const filteredData = data.filter(item => {
    const itemDate = parseDate(item.date)
    return (
      // Include if date is same as or after fromDate AND before or same as today
      (isAfter(itemDate, fromDate) || isSameDay(itemDate, fromDate)) &&
      (isBefore(itemDate, today) || isSameDay(itemDate, today))
    )
  })

  // Aggregate data by restaurant
  const restaurantMap = new Map<string, OutletData>()
  
  filteredData.forEach(item => {
    const existing = restaurantMap.get(item.restaurant)
    if (existing) {
      restaurantMap.set(item.restaurant, {
        restaurant: item.restaurant,
        acceptedOrders: existing.acceptedOrders + item.acceptedOrders,
        acceptedTotal: existing.acceptedTotal + item.acceptedTotal,
        rejectedOrders: existing.rejectedOrders + item.rejectedOrders,
        rejectedTotal: existing.rejectedTotal + item.rejectedTotal,
        date: item.date
      })
    } else {
      restaurantMap.set(item.restaurant, item)
    }
  })

  return Array.from(restaurantMap.values())
}

// Sample data with dates
const allSampleData: OutletData[] = [
  {
    restaurant: 'Edinburgh',
    acceptedOrders: 2,
    acceptedTotal: 38.96,
    rejectedOrders: 0,
    rejectedTotal: 0.00,
    date: '15/05/2025'
  },
  {
    restaurant: 'Edinburgh',
    acceptedOrders: 3,
    acceptedTotal: 52.50,
    rejectedOrders: 1,
    rejectedTotal: 15.99,
    date: '14/05/2025'
  },
  {
    restaurant: 'Admin user',
    acceptedOrders: 1,
    acceptedTotal: 26.44,
    rejectedOrders: 0,
    rejectedTotal: 0.00,
    date: '15/05/2025'
  },
  {
    restaurant: 'Admin user',
    acceptedOrders: 2,
    acceptedTotal: 45.90,
    rejectedOrders: 1,
    rejectedTotal: 12.99,
    date: '14/05/2025'
  }
]

export default function OutletsReportPage() {
  const today = startOfToday()
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OutletData[]>(() => filterDataByDateRange(today, allSampleData))

  const handleDateChange = async (date: Date | null) => {
    if (!date) return
    
    setSelectedDate(date)
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const filtered = filterDataByDateRange(date, allSampleData)
      setData(filtered)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Calculate totals
  const totalAcceptedOrders = data.reduce((sum, item) => sum + item.acceptedOrders, 0)
  const totalAcceptedValue = data.reduce((sum, item) => sum + item.acceptedTotal, 0)
  const totalRejectedOrders = data.reduce((sum, item) => sum + item.rejectedOrders, 0)
  const totalRejectedValue = data.reduce((sum, item) => sum + item.rejectedTotal, 0)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">
          Outlets Report: {format(selectedDate, 'dd/MM/yyyy')} - Present
        </h1>
        <div className="flex gap-4 items-center no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From:</span>
            <DatePicker
              selected={selectedDate}
              onSelect={handleDateChange}
              className="w-[200px]"
            />
          </div>
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            className="bg-white"
            disabled={isLoading}
          >
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Accepted Orders</TableHead>
                  <TableHead>Accepted Total</TableHead>
                  <TableHead>Rejected/Refunded Orders</TableHead>
                  <TableHead>Rejected/Refunded Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-5 w-[120px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[80px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No data available for the selected date range
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.restaurant}>
                      <TableCell>{item.restaurant}</TableCell>
                      <TableCell>{item.acceptedOrders}</TableCell>
                      <TableCell>£{item.acceptedTotal.toFixed(2)}</TableCell>
                      <TableCell>{item.rejectedOrders}</TableCell>
                      <TableCell>£{item.rejectedTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="border-t p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">Accepted Orders</div>
              {isLoading ? (
                <div className="mt-1">
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <div className="text-2xl mt-1">{totalAcceptedOrders}</div>
              )}
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">Accepted Total</div>
              {isLoading ? (
                <div className="mt-1">
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <div className="text-2xl mt-1">£{totalAcceptedValue.toFixed(2)}</div>
              )}
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">Rejected/Refunded Orders</div>
              {isLoading ? (
                <div className="mt-1">
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <div className="text-2xl mt-1">{totalRejectedOrders}</div>
              )}
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">Rejected/Refunded Total</div>
              {isLoading ? (
                <div className="mt-1">
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <div className="text-2xl mt-1">£{totalRejectedValue.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 