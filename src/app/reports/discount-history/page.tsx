'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { PrinterIcon, RotateCw } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { useDiscountHistory } from '@/hooks/use-discount-history'
import { format } from 'date-fns'
import { DiscountHistoryTable } from '@/components/reports/discount-history-table'
import { Skeleton } from '@/components/ui/skeleton'

type DiscountType = 'all' | 'first-order' | 'loyalty' | 'limited-time' | 'free-wrap'

const discountTypes = [
  { value: 'all', label: 'All' },
  { value: 'first-order', label: 'First Order Discount' },
  { value: 'loyalty', label: 'Loyalty Points' },
  { value: 'limited-time', label: '20 discount offer for limited time' },
  { value: 'free-wrap', label: 'Free Wrap' }
] as const

export default function DiscountHistoryPage() {
  const {
    startDate,
    endDate,
    selectedType,
    filteredData,
    isLoading,
    error,
    setStartDate,
    setEndDate,
    setSelectedType,
    handleRefresh
  } = useDiscountHistory()

  const handlePrint = () => {
    window.print()
  }

  // Memoize summary calculations to prevent unnecessary recalculations
  const summaries = useMemo(() => {
    const userRewardDiscounts = filteredData.filter(item => item.discount === 'User Reward')
    const limitedTimeDiscounts = filteredData.filter(item => item.discount === '20 discount offer for limited time')
    
    return {
      userReward: {
        count: userRewardDiscounts.length,
        total: userRewardDiscounts.reduce((sum, item) => sum + item.value, 0)
      },
      limitedTime: {
        count: limitedTimeDiscounts.length,
        total: limitedTimeDiscounts.reduce((sum, item) => sum + item.value, 0)
      },
      all: {
        count: filteredData.length,
        total: filteredData.reduce((sum, item) => sum + item.value, 0)
      }
    }
  }, [filteredData])

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error loading discount history: {error}
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">
          Discount History: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
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
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DiscountType)}
              className="w-[200px] h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {discountTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="bg-white"
              disabled={isLoading}
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
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
          <DiscountHistoryTable data={filteredData} isLoading={isLoading} />
        </div>
        <div className="border-t p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">User Reward</div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">
                  {summaries.userReward.count} (£{summaries.userReward.total.toFixed(2)})
                </div>
              )}
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">20 discount offer for limited time</div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">
                  {summaries.limitedTime.count} (£{summaries.limitedTime.total.toFixed(2)})
                </div>
              )}
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-gray-500">All Discounts</div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">
                  {summaries.all.count} (£{summaries.all.total.toFixed(2)})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 