import { useState, useEffect } from 'react'
import { subDays } from 'date-fns'
import { DiscountType } from '@/types/reports'

interface DiscountHistoryItem {
  id: string
  customer: string
  discount: string
  value: number
  date: string
}

// Sample data - replace with API call
const sampleData: DiscountHistoryItem[] = [
  {
    id: '1',
    customer: 'John Doe',
    discount: 'User Reward',
    value: 5.00,
    date: '2024-03-15'
  },
  {
    id: '2',
    customer: 'Jane Smith',
    discount: '20 discount offer for limited time',
    value: 20.00,
    date: '2024-03-14'
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    discount: 'First Order Discount',
    value: 10.00,
    date: '2024-03-14'
  },
  {
    id: '4',
    customer: 'Sarah Wilson',
    discount: 'User Reward',
    value: 7.50,
    date: '2024-03-13'
  },
  {
    id: '5',
    customer: 'Chris Brown',
    discount: 'Free Wrap',
    value: 8.99,
    date: '2024-03-13'
  },
  {
    id: '6',
    customer: 'Emma Davis',
    discount: '20 discount offer for limited time',
    value: 20.00,
    date: '2024-03-12'
  },
  {
    id: '7',
    customer: 'Tom Wilson',
    discount: 'Loyalty Points',
    value: 15.00,
    date: '2024-03-12'
  },
  {
    id: '8',
    customer: 'Lisa Anderson',
    discount: 'First Order Discount',
    value: 10.00,
    date: '2024-03-11'
  }
]

export function useDiscountHistory() {
  const [startDate, setStartDate] = useState(() => subDays(new Date(), 7))
  const [endDate, setEndDate] = useState(() => new Date())
  const [selectedType, setSelectedType] = useState<DiscountType>('all')
  const [filteredData, setFilteredData] = useState<DiscountHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter data based on date range and type
      const filtered = sampleData.filter(item => {
        const itemDate = new Date(item.date)
        const isInDateRange = itemDate >= startDate && itemDate <= endDate
        
        if (selectedType === 'all') return isInDateRange
        
        const discountTypeMap: Record<DiscountType, string> = {
          'first-order': 'First Order Discount',
          'loyalty': 'User Reward',
          'limited-time': '20 discount offer for limited time',
          'free-wrap': 'Free Wrap',
          'all': ''
        }
        
        return isInDateRange && item.discount === discountTypeMap[selectedType]
      })
      
      setFilteredData(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [startDate, endDate, selectedType])

  const handleRefresh = () => {
    fetchData()
  }

  return {
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
  }
} 