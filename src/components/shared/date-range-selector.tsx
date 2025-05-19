'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface DateRange {
  from: Date
  to: Date
}

type DateRangeOption = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last30Days' | 'custom'

interface DateRangeSelectorProps {
  onChange: (range: DateRange) => void
  className?: string
}

const dateRangeOptions: { value: DateRangeOption; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom' }
]

export function DateRangeSelector({ onChange, className }: DateRangeSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>('today')
  const [customRange, setCustomRange] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  })

  const handleOptionSelect = (option: DateRangeOption) => {
    setSelectedOption(option)
    
    const today = new Date()
    let range: DateRange
    
    switch (option) {
      case 'today':
        range = { from: today, to: today }
        break
      case 'yesterday': {
        const yesterday = subDays(today, 1)
        range = { from: yesterday, to: yesterday }
        break
      }
      case 'thisWeek':
        range = {
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: today
        }
        break
      case 'lastWeek': {
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 })
        range = {
          from: lastWeekStart,
          to: endOfWeek(lastWeekStart, { weekStartsOn: 1 })
        }
        break
      }
      case 'thisMonth':
        range = {
          from: startOfMonth(today),
          to: today
        }
        break
      case 'lastMonth': {
        const lastMonth = subDays(startOfMonth(today), 1)
        range = {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        }
        break
      }
      case 'last30Days':
        range = {
          from: subDays(today, 29), // 29 days ago + today = 30 days
          to: today
        }
        break
      case 'custom':
        range = customRange
        break
      default:
        range = { from: today, to: today }
    }

    onChange(range)
  }

  const handleCustomRangeChange = (type: 'from' | 'to', date: Date) => {
    const newRange = {
      ...customRange,
      [type]: date
    }
    setCustomRange(newRange)
    if (selectedOption === 'custom') {
      onChange(newRange)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs 
        value={selectedOption} 
        onValueChange={(value) => handleOptionSelect(value as DateRangeOption)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {dateRangeOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="text-sm"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {selectedOption === 'custom' && (
        <div className="flex items-center gap-2 bg-white rounded-lg border p-4">
          <DatePicker
            selected={customRange.from}
            onSelect={(date) => date && handleCustomRangeChange('from', date)}
            className="w-[160px]"
          />
          <span className="text-gray-500">to</span>
          <DatePicker
            selected={customRange.to}
            onSelect={(date) => date && handleCustomRangeChange('to', date)}
            className="w-[160px]"
          />
        </div>
      )}
    </div>
  )
} 