"use client"

import { useState, useEffect } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ItemsTable } from '@/components/reports/items-table'
import { PrinterIcon, RefreshCw } from 'lucide-react'
import { SaleData } from '@/types/reports'
import { reportService } from '@/services/report.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export default function EndOfNightPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [salesData, setSalesData] = useState<SaleData[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['all-sales'])
  const [orderState, setOrderState] = useState<'completed' | 'cancelled'>('completed')


  // Summary data
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalTips: 0,
    totalDeliveryFees: 0,
    averageOrderValue: 0,
    cashOrders: 0,
    cardOrders: 0,
    deliveryOrders: 0,
    pickupOrders: 0,
    dineInOrders: 0
  })

  // Top items data
  const [topItems, setTopItems] = useState<Array<{
    _id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>>([])

  // Hourly sales data
  const [hourlySales, setHourlySales] = useState<Array<{
    _id: number;
    orders: number;
    sales: number;
  }>>([])

  // Fetch report data
  const fetchReportData = async (date: Date) => {
    setLoading(true)
    try {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const response = await reportService.getEndOfNightReport(formattedDate, undefined, orderState)
      
      if (response.success && response.data) {
        setSummary(response.data.summary)
        setTopItems(response.data.topItems)
        setHourlySales(response.data.hourlySales)
        
        // Transform data for sales table - this would need actual order data
        // For now, we'll create mock data based on summary
        const mockSalesData: SaleData[] = []
        
        setSalesData(mockSalesData)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      toast.error('Failed to fetch report data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData(selectedDate)
  }, [selectedDate, orderState])

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleRefresh = () => {
    fetchReportData(selectedDate)
  }

  const handlePrint = () => {
    window.print()
  }

  const cardOnlyData = salesData.filter(sale => sale.paymentMethod === 'Card')
  const cashOnlyData = salesData.filter(sale => sale.paymentMethod === 'Cash')

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">End of Night Report</h1>
        <div className="flex gap-4 items-center no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={orderState}
              onChange={(e) => setOrderState(e.target.value as 'completed' | 'cancelled')}
              className="w-[160px] h-9 rounded-md border border-input bg-white px-2 text-sm"
            >
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <DatePicker
            selected={selectedDate}
            onSelect={handleDateChange}
            className="w-[200px]"
          />
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="bg-white"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handlePrint} variant="outline" className="bg-white">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Daily Summary</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{summary.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold">£{summary.totalSales.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Order</p>
              <p className="text-2xl font-semibold">£{summary.averageOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tips</p>
              <p className="text-2xl font-semibold">£{summary.totalTips.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Fees</p>
              <p className="text-2xl font-semibold">£{summary.totalDeliveryFees.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cash Orders</p>
              <p className="text-2xl font-semibold">{summary.cashOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Card Orders</p>
              <p className="text-2xl font-semibold">{summary.cardOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Orders</p>
              <p className="text-2xl font-semibold">{summary.deliveryOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup Orders</p>
              <p className="text-2xl font-semibold">{summary.pickupOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dine-in Orders</p>
              <p className="text-2xl font-semibold">{summary.dineInOrders}</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Top Selling Items</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : topItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, index) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">£{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No sales data for this date</p>
        )}
      </div>

      {/* Hourly Sales Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Hourly Sales Breakdown</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : hourlySales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Hour</th>
                  <th className="text-right py-2">Orders</th>
                  <th className="text-right py-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {hourlySales.map((hour) => (
                  <tr key={hour._id} className="border-b">
                    <td className="py-2">{hour._id}:00 - {hour._id + 1}:00</td>
                    <td className="text-right py-2">{hour.orders}</td>
                    <td className="text-right py-2">£{hour.sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hourly data for this date</p>
        )}
      </div>

      {/* Detailed Sales Accordion - Only show if we have actual sales data */}
      {salesData.length > 0 && (
        <Accordion
          type="multiple"
          value={expandedItems}
          onValueChange={handleAccordionChange}
          className="w-full space-y-4"
        >
          <AccordionItem value="all-sales" className="border-none">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-medium">
                  All Sales {!salesData.length && '(no data)'}
                </h2>
                <AccordionTrigger className="py-0 hover:no-underline flex-none border-none">
                  <span className="text-sm text-gray-500 mr-2">
                    {expandedItems.includes('all-sales') ? 'Collapse' : 'Expand'}
                  </span>
                </AccordionTrigger>
              </div>
              <AccordionContent>
                <div className="p-4">
                  <ItemsTable data={salesData} type="sales" />
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>

          <AccordionItem value="cash-only" className="border-none">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-medium">
                  Sales by Cash Only {!cashOnlyData.length && '(no data)'}
                </h2>
                <AccordionTrigger className="py-0 hover:no-underline flex-none border-none">
                  <span className="text-sm text-gray-500 mr-2">
                    {expandedItems.includes('cash-only') ? 'Collapse' : 'Expand'}
                  </span>
                </AccordionTrigger>
              </div>
              <AccordionContent>
                <div className="p-4">
                  <ItemsTable data={cashOnlyData} type="sales" />
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>

          <AccordionItem value="card-only" className="border-none">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-medium">
                  Sales by Card Only {!cardOnlyData.length && '(no data)'}
                </h2>
                <AccordionTrigger className="py-0 hover:no-underline flex-none border-none">
                  <span className="text-sm text-gray-500 mr-2">
                    {expandedItems.includes('card-only') ? 'Collapse' : 'Expand'}
                  </span>
                </AccordionTrigger>
              </div>
              <AccordionContent>
                <div className="p-4">
                  <ItemsTable data={cardOnlyData} type="sales" />
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      )}
    </>
  )
}