'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ItemsTable } from '@/components/reports/items-table'
import { PrinterIcon, RotateCw } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { ItemSaleData } from '@/types/reports'
import { reportService } from '@/services/report.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export default function SalesOfItemsHistoryPage() {
  // Set default date range to start of month and current date
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const [startDate, setStartDate] = useState<Date>(startOfMonth)
  const [endDate, setEndDate] = useState<Date>(today)
  
  const [itemSalesData, setItemSalesData] = useState<ItemSaleData[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)


  // Fetch item sales data
  const fetchItemSalesData = async (page = 1) => {
    setLoading(true)
    try {
      const response = await reportService.getItemSalesHistory({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        page,
        limit: 50
      })
      
      if (response.success) {
        setItemSalesData(response.data)
        if (response.pagination) {
          setCurrentPage(response.pagination.currentPage)
          setTotalPages(response.pagination.totalPages || 1)
          setTotalItems(response.pagination.totalItems || response.data.length)
        }
      }
    } catch (error) {
      console.error('Failed to fetch item sales data:', error)
      toast.error('Failed to fetch item sales data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItemSalesData(1)
  }, [startDate, endDate])

  const handleRefresh = () => {
    fetchItemSalesData(currentPage)
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePageChange = (page: number) => {
    fetchItemSalesData(page)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/')
  }

  const totalQuantity = itemSalesData.reduce((sum, item) => sum + item.quantity, 0)

  // Group items by name to get unique items count
  const uniqueItems = new Set(itemSalesData.map(item => item.name)).size

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
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="bg-white"
              disabled={loading}
            >
              <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <ItemsTable data={itemSalesData} type="items" />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, totalItems)} of {totalItems} items
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && <span className="px-2">...</span>}
                      {totalPages > 5 && (
                        <Button
                          variant={totalPages === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="border-t p-4">
          <div className="flex gap-8">
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Quantity</div>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">{totalQuantity}</div>
              )}
            </div>
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Unique Items</div>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">{uniqueItems}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}