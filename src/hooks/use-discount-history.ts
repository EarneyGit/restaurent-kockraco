import { useState, useEffect } from 'react'
import { subDays, format } from 'date-fns'
import { DiscountType } from '@/types/reports'
import { reportService } from '@/services/report.service'
import { toast } from 'sonner'

interface DiscountHistoryItem {
  id: string
  customer: string
  discount: string
  value: number
  date: string
}

export function useDiscountHistory() {
  const [startDate, setStartDate] = useState(() => subDays(new Date(), 7))
  const [endDate, setEndDate] = useState(() => new Date())
  const [selectedType, setSelectedType] = useState<DiscountType>('all')
  const [filteredData, setFilteredData] = useState<DiscountHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  const fetchData = async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await reportService.getDiscountHistory({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        discountType: selectedType === 'all' ? undefined : selectedType,
        page,
        limit: 50
      })
      
      if (response.success) {
        setFilteredData(response.data)
        if (response.pagination) {
          setCurrentPage(response.pagination.currentPage)
          setTotalPages(response.pagination.totalPages)
        }
      } else {
        throw new Error('Failed to fetch discount history')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [startDate, endDate, selectedType])

  const handleRefresh = () => {
    fetchData(currentPage)
  }

  const handlePageChange = (page: number) => {
    fetchData(page)
  }

  return {
    startDate,
    endDate,
    selectedType,
    filteredData,
    isLoading,
    error,
    currentPage,
    totalPages,
    setStartDate,
    setEndDate,
    setSelectedType,
    handleRefresh,
    handlePageChange
  }
}