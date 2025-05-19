'use server'

import { z } from 'zod'
import { action } from '@/lib/safe-action'
import { type DateRange } from '@/components/shared/date-range-selector'

// Types for sales data
export interface SaleStats {
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
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
}

// Input validation schema
const getSalesStatsSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  })
})

// Mock data generator - Replace with actual database queries
function generateMockSalesData(dateRange: DateRange): SaleStats {
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sales: Math.floor(Math.random() * 1000) + 100,
    orders: Math.floor(Math.random() * 20) + 1
  }))

  const totalSales = hourlyData.reduce((sum, hour) => sum + hour.sales, 0)
  const totalOrders = hourlyData.reduce((sum, hour) => sum + hour.orders, 0)

  return {
    totalSales,
    totalOrders,
    averageOrderValue: totalSales / totalOrders,
    comparisonStats: {
      salesChange: 15.5,
      ordersChange: 8.2,
      avgOrderChange: 6.8
    },
    hourlyData,
    topProducts: [
      { name: 'Chicken Wrap', quantity: 45, revenue: 450 },
      { name: 'Curly Fries', quantity: 38, revenue: 152 },
      { name: 'Cola BBQ Wings', quantity: 32, revenue: 384 }
    ]
  }
}

// Server action
export const getSalesStats = action(getSalesStatsSchema, async ({ dateRange }) => {
  try {
    // TODO: Replace with actual database query
    const stats = generateMockSalesData(dateRange)
    
    return {
      data: stats,
      error: null
    }
  } catch (error) {
    console.error('Error fetching sales stats:', error)
    return {
      data: null,
      error: 'Failed to fetch sales statistics. Please try again.'
    }
  }
}) 