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
import { reportService } from '@/services/report.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { FileDown, Printer } from 'lucide-react'

type ReportType = 'menu-category-totals' | 'daily-totals' | 'order-export' | null

interface MenuCategoryTotal {
  _id: {
    categoryId: string;
    categoryName: string;
  };
  totalQuantity: number;
  totalRevenue: number;
}

interface DailyTotal {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
}

interface OrderExport {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderType: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  tips: number;
  total: number;
  branchName: string;
  createdAt: string;
  items: any[];
}

export default function CustomReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])


  const handleLoadReport = async () => {
    if (!startDate || !endDate || !selectedReport) return
    
    setIsLoading(true)
    try {
      const response = await reportService.getCustomReport(
        selectedReport,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      )
      
      if (response.success && response.data) {
        setReportData(response.data)
      }
    } catch (error) {
      console.error('Failed to load report:', error)
      toast.error('Failed to load report. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (!reportData.length || !selectedReport) return

    // Create table content for PDF
    let tableContent: any[][] = []
    let headers: string[] = []
    let title = ''

    switch (selectedReport) {
      case 'menu-category-totals':
        title = 'Totals By Menu Category'
        headers = ['Category', 'Quantity', 'Revenue']
        tableContent = (reportData as MenuCategoryTotal[]).map(row => [
          row._id.categoryName || 'Uncategorized',
          row.totalQuantity.toString(),
          `£${row.totalRevenue.toFixed(2)}`
        ])
        break
      case 'daily-totals':
        title = 'Daily Totals'
        headers = ['Date', 'Orders', 'Sales', 'Average Order']
        tableContent = (reportData as DailyTotal[]).map(row => [
          `${row._id.day}/${row._id.month}/${row._id.year}`,
          row.totalOrders.toString(),
          `£${row.totalSales.toFixed(2)}`,
          `£${row.averageOrderValue.toFixed(2)}`
        ])
        break
      case 'order-export':
        title = 'Order Export'
        headers = ['Order ID', 'Customer', 'Type', 'Status', 'Total', 'Date']
        tableContent = (reportData as OrderExport[]).map(row => [
          row.orderId,
          row.customerName,
          row.orderType,
          row.status,
          `£${row.total.toFixed(2)}`,
          format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm')
        ])
        break
    }

    // For now, we'll trigger a print dialog for PDF
    // In production, you'd want to implement a proper PDF generation endpoint
    window.print()
  }

  const handleExportCSV = () => {
    if (!reportData.length || !selectedReport) return

    // Create CSV content
    let headers: string[] = []
    let rows: any[][] = []

    switch (selectedReport) {
      case 'menu-category-totals':
        headers = ['Category', 'Quantity', 'Revenue']
        rows = (reportData as MenuCategoryTotal[]).map(row => [
          row._id.categoryName || 'Uncategorized',
          row.totalQuantity,
          row.totalRevenue.toFixed(2)
        ])
        break
      case 'daily-totals':
        headers = ['Date', 'Orders', 'Sales', 'Average Order']
        rows = (reportData as DailyTotal[]).map(row => [
          `${row._id.day}/${row._id.month}/${row._id.year}`,
          row.totalOrders,
          row.totalSales.toFixed(2),
          row.averageOrderValue.toFixed(2)
        ])
        break
      case 'order-export':
        headers = ['Order ID', 'Customer', 'Email', 'Type', 'Status', 'Payment Method', 'Subtotal', 'Tax', 'Delivery Fee', 'Discount', 'Tips', 'Total', 'Branch', 'Date']
        rows = (reportData as OrderExport[]).map(row => [
          row.orderId,
          row.customerName,
          row.customerEmail,
          row.orderType,
          row.status,
          row.paymentMethod,
          row.subtotal.toFixed(2),
          row.tax.toFixed(2),
          row.deliveryFee.toFixed(2),
          row.discount.toFixed(2),
          row.tips.toFixed(2),
          row.total.toFixed(2),
          row.branchName,
          format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm')
        ])
        break
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedReport}_${format(startDate!, 'yyyy-MM-dd')}_${format(endDate!, 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDesktopPrint = () => {
    window.print()
  }

  const renderReportTable = () => {
    if (!reportData.length || !selectedReport) return null

    switch (selectedReport) {
      case 'menu-category-totals':
        const categoryData = reportData as MenuCategoryTotal[]
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row._id.categoryName || 'Uncategorized'}</TableCell>
                  <TableCell className="text-right">{row.totalQuantity}</TableCell>
                  <TableCell className="text-right">£{row.totalRevenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case 'daily-totals':
        const dailyData = reportData as DailyTotal[]
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Average Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{`${row._id.day}/${row._id.month}/${row._id.year}`}</TableCell>
                  <TableCell className="text-right">{row.totalOrders}</TableCell>
                  <TableCell className="text-right">£{row.totalSales.toFixed(2)}</TableCell>
                  <TableCell className="text-right">£{row.averageOrderValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case 'order-export':
        const orderData = reportData as OrderExport[]
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{row.orderId}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell className="capitalize">{row.orderType}</TableCell>
                  <TableCell className="capitalize">{row.status}</TableCell>
                  <TableCell className="text-right">£{row.total.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant={selectedReport === 'menu-category-totals' ? 'default' : 'outline'}
          className={selectedReport === 'menu-category-totals' ? 'bg-yellow-500/80 hover:bg-yellow-500' : 'bg-white'}
          onClick={() => setSelectedReport('menu-category-totals')}
        >
          Totals By Menu Category
        </Button>
        <Button
          variant={selectedReport === 'daily-totals' ? 'default' : 'outline'}
          className={selectedReport === 'daily-totals' ? 'bg-yellow-500/80 hover:bg-yellow-500' : 'bg-white'}
          onClick={() => setSelectedReport('daily-totals')}
        >
          Daily Totals
        </Button>
        <Button
          variant={selectedReport === 'order-export' ? 'default' : 'outline'}
          className={selectedReport === 'order-export' ? 'bg-yellow-500/80 hover:bg-yellow-500' : 'bg-white'}
          onClick={() => setSelectedReport('order-export')}
        >
          Order Export
        </Button>
      </div>

      {/* Report Configuration */}
      {selectedReport && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-medium">
            {selectedReport === 'menu-category-totals' && 'Totals By Menu Category'}
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
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">End Date</label>
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  className="w-full"
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
                <FileDown className="mr-2 h-4 w-4" />
                PDF Export
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="bg-white"
                disabled={isLoading || !reportData.length}
              >
                <FileDown className="mr-2 h-4 w-4" />
                CSV Export
              </Button>
              <Button
                onClick={handleDesktopPrint}
                variant="outline"
                className="bg-white"
                disabled={isLoading || !reportData.length}
              >
                <Printer className="mr-2 h-4 w-4" />
                Desktop Print
              </Button>
            </div>
          </div>

          {/* Report Results */}
          <div className="mt-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : reportData.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                {renderReportTable()}
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