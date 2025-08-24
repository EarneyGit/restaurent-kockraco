'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PrinterIcon, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { reportService } from '@/services/report.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

interface MonthOption {
  value: string;
  label: string;
  month: number;
  year: number;
}

// Generate months from June 2023 to current month
const generateMonthOptions = () => {
  const options: MonthOption[] = []
  const currentDate = new Date()
  let date = new Date(2023, 5, 1) // June 2023

  while (date <= currentDate) {
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy'),
      month: date.getMonth() + 1, // 1-based month
      year: date.getFullYear()
    })
    date = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  }

  return options.reverse() // Most recent first
}

const monthOptions = generateMonthOptions()

export default function EndOfMonthPage() {
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0])
  const [loading, setLoading] = useState(false)


  // Report data
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalTips: 0,
    totalDeliveryFees: 0,
    averageOrderValue: 0,
    uniqueCustomers: 0
  })

  const [dailyBreakdown, setDailyBreakdown] = useState<Array<{
    _id: { year: number; month: number; day: number };
    orders: number;
    sales: number;
    averageOrderValue: number;
  }>>([])

  const [topCustomers, setTopCustomers] = useState<Array<{
    _id: string;
    totalOrders: number;
    totalSpent: number;
    customerName: string;
    customerEmail: string;
  }>>([])

  // Fetch report data
  const fetchReportData = async (monthOption: MonthOption) => {
    setLoading(true)
    try {
      const response = await reportService.getEndOfMonthReport(
        monthOption.month,
        monthOption.year
      )
      
      if (response.success && response.data) {
        setSummary(response.data.summary)
        setDailyBreakdown(response.data.dailyBreakdown)
        setTopCustomers(response.data.topCustomers)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      toast.error('Failed to fetch report data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData(selectedMonth)
  }, [selectedMonth])

  const handleMonthChange = (value: string) => {
    const monthOption = monthOptions.find(opt => opt.value === value)
    if (monthOption) {
      setSelectedMonth(monthOption)
    }
  }

  const handleRefresh = () => {
    fetchReportData(selectedMonth)
  }

  const handlePrint = () => {
    window.print()
  }

  // Calculate daily sales chart data
  const dailySalesData = dailyBreakdown.map(day => ({
    date: `${day._id.day}/${day._id.month}`,
    sales: day.sales,
    orders: day.orders
  }))

  const totalDays = dailyBreakdown.length
  const daysWithSales = dailyBreakdown.filter(day => day.orders > 0).length

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">End of Month Report</h1>
        <div className="flex gap-4 items-center no-print">
          <select
            value={selectedMonth.value}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="w-[200px] h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Monthly Summary - {selectedMonth.label}</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              <p className="text-sm text-gray-500">Unique Customers</p>
              <p className="text-2xl font-semibold">{summary.uniqueCustomers}</p>
            </div>
          </div>
        )}
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Daily Breakdown</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : dailyBreakdown.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {daysWithSales} out of {totalDays} days had sales
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Orders</th>
                    <th className="text-right py-2">Sales</th>
                    <th className="text-right py-2">Average Order</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyBreakdown.map((day) => (
                    <tr key={`${day._id.year}-${day._id.month}-${day._id.day}`} className="border-b">
                      <td className="py-2">
                        {format(new Date(day._id.year, day._id.month - 1, day._id.day), 'dd MMM yyyy')}
                      </td>
                      <td className="text-right py-2">{day.orders}</td>
                      <td className="text-right py-2">£{day.sales.toFixed(2)}</td>
                      <td className="text-right py-2">£{day.averageOrderValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">No sales data for this month</p>
        )}
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Top Customers</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : topCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-right py-2">Orders</th>
                  <th className="text-right py-2">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b">
                    <td className="py-2">{customer.customerName}</td>
                    <td className="py-2 text-gray-600">{customer.customerEmail}</td>
                    <td className="text-right py-2">{customer.totalOrders}</td>
                    <td className="text-right py-2">£{customer.totalSpent.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No customer data for this month</p>
        )}
      </div>
    </>
  )
}