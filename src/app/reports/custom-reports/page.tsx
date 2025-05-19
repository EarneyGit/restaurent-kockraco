'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ReportType = 'menu-category' | 'daily-totals' | 'order-export' | null

interface DailyTotal {
  outlet: string
  date: string
  total: number
}

// Sample data - replace with API call
const sampleData: DailyTotal[] = [
  { outlet: 'Admin user', date: '17/04/2025', total: 88.63 },
  { outlet: 'Admin user', date: '18/04/2025', total: 0.00 },
  { outlet: 'Admin user', date: '19/04/2025', total: 27.97 },
  { outlet: 'Admin user', date: '20/04/2025', total: 80.38 },
  { outlet: 'Admin user', date: '21/04/2025', total: 22.47 },
  { outlet: 'Admin user', date: '22/04/2025', total: 0.00 },
  { outlet: 'Admin user', date: '23/04/2025', total: 0.00 },
  { outlet: 'Admin user', date: '24/04/2025', total: 86.83 },
  { outlet: 'Admin user', date: '25/04/2025', total: 143.53 },
  { outlet: 'Admin user', date: '26/04/2025', total: 55.42 },
  { outlet: 'Admin user', date: '27/04/2025', total: 107.83 },
  { outlet: 'Admin user', date: '28/04/2025', total: 21.96 },
  { outlet: 'Admin user', date: '29/04/2025', total: 0.00 },
  { outlet: 'Admin user', date: '30/04/2025', total: 0.00 }
]

export default function CustomReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<DailyTotal[]>([])

  // Function to parse date string in DD/MM/YYYY format
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/')
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  // Function to format date to DD/MM/YYYY
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy')
  }

  const handleLoadReport = async () => {
    if (!startDate || !endDate) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter data based on date range
      const filtered = sampleData.filter(item => {
        const itemDate = parseDate(item.date)
        return itemDate >= startDate && itemDate <= endDate
      })
      
      setReportData(filtered)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = () => {
    if (!reportData.length) return

    // Create table content for PDF
    const tableContent = reportData.map(row => [
      row.outlet,
      row.date,
      `£${row.total.toFixed(2)}`
    ])

    // Create a hidden form to submit for PDF generation
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/api/export-pdf' // Your PDF generation endpoint
    form.target = '_blank'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'data'
    input.value = JSON.stringify({
      title: 'Daily Totals Report',
      dateRange: `${formatDate(startDate!)} to ${formatDate(endDate!)}`,
      headers: ['Outlet', 'Date', 'Total'],
      rows: tableContent
    })

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const handleExportCSV = () => {
    if (!reportData.length) return

    // Create CSV content
    const headers = ['Outlet', 'Date', 'Total']
    const rows = reportData.map(row => [
      row.outlet,
      row.date,
      row.total.toFixed(2)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `daily_totals_${formatDate(startDate!)}_${formatDate(endDate!)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDesktopPrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant={selectedReport === 'menu-category' ? 'default' : 'outline'}
          className={selectedReport === 'menu-category' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-white'}
          onClick={() => setSelectedReport('menu-category')}
        >
          Totals By Menu Category
        </Button>
        <Button
          variant={selectedReport === 'daily-totals' ? 'default' : 'outline'}
          className={selectedReport === 'daily-totals' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-white'}
          onClick={() => setSelectedReport('daily-totals')}
        >
          Daily Totals
        </Button>
        <Button
          variant={selectedReport === 'order-export' ? 'default' : 'outline'}
          className={selectedReport === 'order-export' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-white'}
          onClick={() => setSelectedReport('order-export')}
        >
          Order Export
        </Button>
      </div>

      {/* Report Configuration */}
      {selectedReport && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-medium">
            {selectedReport === 'menu-category' && 'Totals By Menu Category'}
            {selectedReport === 'daily-totals' && 'Daily Totals'}
            {selectedReport === 'order-export' && 'Order Export'}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  className="w-full"
                //   placeholderText="dd/mm/yyyy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">End Date</label>
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  className="w-full"
                //   placeholderText="dd/mm/yyyy"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleLoadReport}
                disabled={isLoading || !startDate || !endDate}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {isLoading ? 'Loading...' : 'Load'}
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="bg-white"
                disabled={isLoading || !reportData.length}
              >
                PDF Export
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="bg-white"
                disabled={isLoading || !reportData.length}
              >
                CSV Export
              </Button>
              <Button
                onClick={handleDesktopPrint}
                variant="outline"
                className="bg-white"
                disabled={isLoading || !reportData.length}
              >
                Desktop Print
              </Button>
            </div>
          </div>

          {/* Report Results */}
          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading report...</div>
            ) : reportData.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Outlet</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.outlet}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell className="text-right">£{row.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select dates and click Load to generate the report
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 