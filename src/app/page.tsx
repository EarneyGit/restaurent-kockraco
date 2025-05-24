"use client"

import { useState, useEffect } from 'react'
import { format, subDays, startOfDay, endOfDay, subWeeks, subMonths } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { LogOut } from 'lucide-react'

// Sample data generator from dashboard
interface DayData {
  date: string;
  hourlyData: { hour: number; sales: number; orders: number; }[];
  totalSales: number;
  totalOrders: number;
}

const generateSampleData = (days: number) => {
  const data: DayData[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      let baseSales = 0
      let baseOrders = 0

      // Lunch rush (11am - 2pm)
      if (hour >= 11 && hour <= 14) {
        baseSales = isWeekend ? 800 : 500
        baseOrders = isWeekend ? 25 : 15
      }
      // Dinner rush (6pm - 9pm)
      else if (hour >= 18 && hour <= 21) {
        baseSales = isWeekend ? 1000 : 700
        baseOrders = isWeekend ? 30 : 20
      }
      // Normal hours
      else if (hour >= 9 && hour <= 22) {
        baseSales = isWeekend ? 300 : 200
        baseOrders = isWeekend ? 10 : 7
      }
      // Late night/early morning
      else {
        baseSales = isWeekend ? 100 : 50
        baseOrders = isWeekend ? 4 : 2
      }

      // Add some randomness
      const sales = Math.floor(baseSales + (Math.random() * baseSales * 0.4) - (baseSales * 0.2))
      const orders = Math.floor(baseOrders + (Math.random() * baseOrders * 0.4) - (baseOrders * 0.2))

      return {
        hour,
        sales,
        orders
      }
    })

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      hourlyData,
      totalSales: hourlyData.reduce((sum, h) => sum + h.sales, 0),
      totalOrders: hourlyData.reduce((sum, h) => sum + h.orders, 0)
    } as {
      date: string;
      hourlyData: { hour: number; sales: number; orders: number; }[];
      totalSales: number;
      totalOrders: number;
    })
  }
  return data
}

type DateFilter = 'yesterday' | 'today' | 'lastWeek' | 'thisWeek' | 'lastMonth' | 'thisMonth' | 'last30Days' | 'custom'

export default function HomePage() {
  const { logout, user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>('today')
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: startOfDay(subDays(new Date(), 1)),
    to: endOfDay(subDays(new Date(), 1))
  })
  const [stats, setStats] = useState<{
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    comparisonStats: {
      salesChange: number
      ordersChange: number
      avgOrderChange: number
    }
    hourlyData: Array<{
      hour: number
      sales: number
      orders: number
    }>
  } | null>(null)
  const [customDateRange, setCustomDateRange] = useState({
    from: '',
    to: ''
  })
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)

  // Use actual user data if available
  const displayName = user?.name || 'Admin User'

  const handleLogout = () => {
    logout()
  }

  const handleFilterChange = (filter: DateFilter) => {
    setSelectedFilter(filter)
    const today = new Date()
    
    if (filter === 'custom') {
      setShowCustomDatePicker(true)
      return
    }
    
    setShowCustomDatePicker(false)
    
    switch (filter) {
      case 'today':
        setDateRange({
          from: startOfDay(today),
          to: endOfDay(today)
        })
        break
      case 'yesterday':
        const yesterday = subDays(today, 1)
        setDateRange({
          from: startOfDay(yesterday),
          to: endOfDay(yesterday)
        })
        break
      case 'thisWeek':
        setDateRange({
          from: startOfDay(subDays(today, today.getDay() - 1)),
          to: endOfDay(today)
        })
        break
      case 'lastWeek':
        const lastWeekStart = subWeeks(today, 1)
        setDateRange({
          from: startOfDay(subDays(lastWeekStart, lastWeekStart.getDay() - 1)),
          to: endOfDay(subDays(today, today.getDay()))
        })
        break
      case 'thisMonth':
        setDateRange({
          from: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
          to: endOfDay(today)
        })
        break
      case 'lastMonth':
        const lastMonth = subMonths(today, 1)
        setDateRange({
          from: startOfDay(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)),
          to: endOfDay(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0))
        })
        break
      case 'last30Days':
        setDateRange({
          from: startOfDay(subDays(today, 29)),
          to: endOfDay(today)
        })
        break
    }
  }

  const handleCustomDateSubmit = () => {
    setDateRange({
      from: startOfDay(new Date(customDateRange.from)),
      to: endOfDay(new Date(customDateRange.to))
    })
  }

  useEffect(() => {
    // Filter data based on date range
    const SAMPLE_DATA = generateSampleData(90)
    const filteredData = SAMPLE_DATA.filter(day => {
      const date = new Date(day.date)
      return date >= startOfDay(dateRange.from) && date <= endOfDay(dateRange.to)
    })

    if (filteredData.length === 0) {
      setStats(null)
      return
    }

    // Calculate current period totals
    const currentTotalSales = filteredData.reduce((sum, day) => sum + day.totalSales, 0)
    const currentTotalOrders = filteredData.reduce((sum, day) => sum + day.totalOrders, 0)
    const currentAvgOrder = currentTotalOrders > 0 ? currentTotalSales / currentTotalOrders : 0

    // Calculate previous period totals for comparison
    const daysDiff = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const previousFrom = subDays(dateRange.from, daysDiff)
    const previousTo = subDays(dateRange.from, 1)
    
    const previousData = SAMPLE_DATA.filter(day => {
      const date = new Date(day.date)
      return date >= startOfDay(previousFrom) && date <= endOfDay(previousTo)
    })

    const previousTotalSales = previousData.reduce((sum, day) => sum + day.totalSales, 0)
    const previousTotalOrders = previousData.reduce((sum, day) => sum + day.totalOrders, 0)
    const previousAvgOrder = previousTotalOrders > 0 ? previousTotalSales / previousTotalOrders : 0

    // Calculate hourly averages
    const hourlyAverages = Array.from({ length: 24 }, (_, hour) => {
      const salesSum = filteredData.reduce((sum, day) => 
        sum + (day.hourlyData.find(h => h.hour === hour)?.sales || 0), 0)
      const ordersSum = filteredData.reduce((sum, day) => 
        sum + (day.hourlyData.find(h => h.hour === hour)?.orders || 0), 0)
      
      return {
        hour,
        sales: Math.round(salesSum / filteredData.length),
        orders: Math.round(ordersSum / filteredData.length)
      }
    })

    setStats({
      totalSales: currentTotalSales,
      totalOrders: currentTotalOrders,
      averageOrderValue: currentAvgOrder,
      comparisonStats: {
        salesChange: previousTotalSales > 0 ? ((currentTotalSales - previousTotalSales) / previousTotalSales) * 100 : 0,
        ordersChange: previousTotalOrders > 0 ? ((currentTotalOrders - previousTotalOrders) / previousTotalOrders) * 100 : 0,
        avgOrderChange: previousAvgOrder > 0 ? ((currentAvgOrder - previousAvgOrder) / previousAvgOrder) * 100 : 0
      },
      hourlyData: hourlyAverages
    })
  }, [dateRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value)
  }

  return (
    <div className="p-6 bg-gray-50">
      {/* Header with location and view store button */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex-1"></div>
        <h1 className="text-2xl font-medium text-center flex-1">{displayName}</h1>
        <div className="flex items-center justify-end flex-1 space-x-4">
          <button className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            View Your Store
          </button>
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
      
      {/* Date filter tabs */}
      <div className="flex flex-col border-b mb-6">
        <div className="flex">
          {['yesterday', 'today', 'lastWeek', 'thisWeek', 'lastMonth', 'thisMonth', 'last30Days', 'custom'].map((filter) => (
            <button
              key={filter}
              className={cn(
                "px-4 py-3",
                selectedFilter === filter 
                  ? "text-teal-500 border-b-2 border-teal-500 font-medium"
                  : "text-gray-500"
              )}
              onClick={() => handleFilterChange(filter as DateFilter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
        
        {showCustomDatePicker && (
          <div className="flex items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Date Range:</span>
              <Input
                type="date"
                value={customDateRange.from}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-40"
              />
              <span>To:</span>
              <Input
                type="date"
                value={customDateRange.to}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-40"
              />
            </div>
            <Button 
              onClick={handleCustomDateSubmit}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              Generate Report
            </Button>
          </div>
        )}
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalSales) : '---'}
              </h2>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs",
                  stats?.comparisonStats?.salesChange && stats.comparisonStats.salesChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {stats?.comparisonStats ? 
                    `${stats.comparisonStats.salesChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.comparisonStats.salesChange).toFixed(1)}%` 
                    : '---'
                  }
                </span>
              </div>
            </div>
            <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalSales) : '---'}
              </h2>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs",
                  stats?.comparisonStats?.salesChange && stats.comparisonStats.salesChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {stats?.comparisonStats ? 
                    `${stats.comparisonStats.salesChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.comparisonStats.salesChange).toFixed(1)}%` 
                    : '---'
                  }
                </span>
              </div>
            </div>
            <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Order Value</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.averageOrderValue) : '---'}
              </h2>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs",
                  stats?.comparisonStats?.avgOrderChange && stats.comparisonStats.avgOrderChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {stats?.comparisonStats ? 
                    `${stats.comparisonStats.avgOrderChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.comparisonStats.avgOrderChange).toFixed(1)}%` 
                    : '---'
                  }
                </span>
              </div>
            </div>
            <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalOrders.toLocaleString() : '---'}
              </h2>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs",
                  stats?.comparisonStats?.ordersChange && stats.comparisonStats.ordersChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {stats?.comparisonStats ? 
                    `${stats.comparisonStats.ordersChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.comparisonStats.ordersChange).toFixed(1)}%` 
                    : '---'
                  }
                </span>
              </div>
            </div>
            <div className="bg-purple-100 h-10 w-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Sales Report */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Hourly Sales Report</h3>
          <span className="text-xs text-gray-500">
            {stats ? `${formatCurrency(stats.averageOrderValue)} Average` : '---'}
          </span>
        </div>
        <div className="h-52 relative">
          <div className="h-40 w-full flex items-end space-x-1">
            {stats?.hourlyData.map((data, i) => (
              <div 
                key={i} 
                className="flex-1 bg-green-500 transition-all duration-300"
                style={{ height: `${(data.sales / Math.max(...stats.hourlyData.map(d => d.sales))) * 100}%` }}
              ></div>
            ))}
          </div>
          <div className="mt-2 w-full flex justify-between text-xs text-gray-500">
            {[0, 4, 8, 12, 16, 20, 23].map(hour => (
              <span key={hour} className="w-4 text-center">{hour}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Sales Report */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Daily Sales Report</h3>
          <span className="text-xs text-gray-500">
            {stats ? `${formatCurrency(stats.averageOrderValue)} Average` : '---'}
          </span>
        </div>
        <div className="h-52">
          <div className="h-40 w-full flex items-end space-x-1">
            {stats?.hourlyData.slice(0, 7).map((data, i) => (
              <div 
                key={i} 
                className="flex-1 bg-green-500 transition-all duration-300"
                style={{ height: `${(data.sales / Math.max(...stats.hourlyData.map(d => d.sales))) * 100}%` }}
              >
                <div className="text-xs text-center text-white mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders by Delivery Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Orders By Delivery Type</h3>
            <span className="text-xs text-gray-500">View Details</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40">
              <div className="h-32 w-full flex items-end">
                <div className="w-full bg-teal-400" style={{ height: '80%' }}></div>
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">Delivery</div>
            </div>
            <div className="h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-teal-400 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-bold">
                    {stats?.totalSales ? formatCurrency(stats.totalSales * 0.6) : '---'}
                  </span>
                  <span className="text-xs">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Orders By Payment Type</h3>
            <span className="text-xs text-gray-500">View Details</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40">
              <div className="h-32 w-full flex items-end">
                <div className="w-full bg-teal-400" style={{ height: '70%' }}></div>
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">Cash</div>
            </div>
            <div className="h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-teal-400 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-bold">
                    {stats?.totalSales ? formatCurrency(stats.totalSales * 0.4) : '---'}
                  </span>
                  <span className="text-xs">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers by Branch & Top Selling Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Customers by Branch Orders</h3>
            <span className="text-xs text-gray-500">View Details</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40">
              <div className="h-32 w-full flex items-end">
                <div className="w-full bg-teal-400" style={{ height: '65%' }}></div>
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">Branch</div>
            </div>
            <div className="h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-teal-400 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-bold">
                    {stats?.totalSales ? formatCurrency(stats.totalSales * 0.3) : '---'}
                  </span>
                  <span className="text-xs">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Top Selling Products by Value</h3>
            <span className="text-xs text-gray-500">View Details</span>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Large BBQ Chicken Feast', price: 9.99, sales: stats?.totalSales ? stats.totalSales * 0.2 : 0 },
              { name: 'Garlic Bread with Cheese', price: 3.99, sales: stats?.totalSales ? stats.totalSales * 0.15 : 0 },
              { name: 'Regular Pepperoni Pizza', price: 6.99, sales: stats?.totalSales ? stats.totalSales * 0.1 : 0 }
            ].map((product, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{product.name}</span>
                <span className="font-semibold">{formatCurrency(product.sales)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Overview */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Customer Overview</h3>
          <span className="text-xs text-gray-500">View Details</span>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-medium mb-3 text-center">Retention</h4>
            <div className="h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-teal-400 relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-bold">78%</span>
                  <span className="text-xs">Returning</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3 text-center">Value Split</h4>
            <div className="h-40 flex items-end justify-center">
              <div className="w-24 h-36 bg-teal-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Operating Hours</h3>
          <span className="text-xs text-gray-500">All Outlets</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center h-8">
              <span className="w-12 text-xs text-gray-500">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
              <div className="flex-1 h-6 bg-gray-100 mx-2 relative">
                <div className="absolute inset-y-0 left-1/4 right-1/4 bg-teal-400"></div>
              </div>
              <span className="w-12 text-xs text-gray-500">24h</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-teal-400 mr-1"></div>
              <span className="text-xs text-gray-500">Open Hours</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 mr-1"></div>
              <span className="text-xs text-gray-500">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 