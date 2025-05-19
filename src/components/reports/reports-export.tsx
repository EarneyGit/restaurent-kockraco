import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DownloadIcon } from 'lucide-react'

interface SaleData {
  id: string
  value: number
  tip: number
  delivery: number
  pay: 'Card' | 'Cash'
  delCol: string
  platform: string
  date: string
}

interface ReportsExportProps {
  data: SaleData[]
  reportType: string
  period: string
}

export function ReportsExport({ data, reportType, period }: ReportsExportProps) {
  const exportToCSV = () => {
    const headers = ['ID', 'Value', 'Tip', 'Delivery', 'Pay', 'Del/Col', 'Platform', 'Date']
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.id,
        row.value.toFixed(2),
        row.tip.toFixed(2),
        row.delivery.toFixed(2),
        row.pay,
        row.delCol,
        row.platform,
        row.date
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportType}-${period}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    // For Excel export, we'll use the same CSV format but with .xlsx extension
    // In a real application, you might want to use a library like xlsx
    const headers = ['ID', 'Value', 'Tip', 'Delivery', 'Pay', 'Del/Col', 'Platform', 'Date']
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.id,
        row.value.toFixed(2),
        row.tip.toFixed(2),
        row.delivery.toFixed(2),
        row.pay,
        row.delCol,
        row.platform,
        row.date
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportType}-${period}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    // For PDF export, you would typically use a library like jsPDF
    // This is a placeholder that downloads a text file instead
    const content = data.map(row => 
      `ID: ${row.id}\nValue: £${row.value.toFixed(2)}\nTip: £${row.tip.toFixed(2)}\nDelivery: £${row.delivery.toFixed(2)}\nPay: ${row.pay}\nDel/Col: ${row.delCol}\nPlatform: ${row.platform}\nDate: ${row.date}\n\n`
    ).join('---\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportType}-${period}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 