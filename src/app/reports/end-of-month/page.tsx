'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ItemsTable } from '@/components/reports/items-table'
import { PrinterIcon } from 'lucide-react'
import { format, subMonths } from 'date-fns'
import { SaleData } from '@/types/reports'

interface MonthOption {
  value: string;
  label: string;
}

// Generate months from June 2023 to current month
const generateMonthOptions = () => {
  const options: MonthOption[] = []
  const currentDate = new Date()
  let date = new Date(2023, 5, 1) // June 2023

  while (date <= currentDate) {
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    })
    date = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  }

  return options.reverse() // Most recent first
}

const monthOptions = generateMonthOptions()

// Sample data for current and previous month
const generateSampleData = (month: string): SaleData[] => {
  const [year, monthNum] = month.split('-').map(Number)
  const date = new Date(year, monthNum - 1)
  
  if (format(date, 'yyyy-MM') === format(new Date(), 'yyyy-MM')) {
    return [
      {
        id: '12707587',
        customer: '2382095 - Chris Jermain',
        value: 24.46,
        discount: 0.00,
        tip: 0.00,
        postcode: 'KY12 8YP',
        pay: 'Card',
        type: 'Delivery',
        created: format(date, 'dd/MM/yyyy'),
        platform: 'App4'
      },
      {
        id: '12706377',
        customer: '[Guest] Danny Morgan',
        value: 22.28,
        discount: 0.00,
        tip: 0.00,
        postcode: 'KY12 8DE',
        pay: 'Card',
        type: 'Collection',
        created: format(date, 'dd/MM/yyyy'),
        platform: 'App4'
      }
    ]
  } else if (format(date, 'yyyy-MM') === format(subMonths(new Date(), 1), 'yyyy-MM')) {
    return [
      {
        id: '12705555',
        customer: '2382095 - Chris Jermain',
        value: 35.50,
        discount: 2.00,
        tip: 0.00,
        postcode: 'KY12 8YP',
        pay: 'Cash',
        type: 'Delivery',
        created: format(date, 'dd/MM/yyyy'),
        platform: 'App4'
      }
    ]
  }
  
  return []
}

export default function EndOfMonthPage() {
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value)
  const [filteredData, setFilteredData] = useState<SaleData[]>(generateSampleData(selectedMonth))
  const [expandedItems, setExpandedItems] = useState<string[]>(['all-sales'])

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    setFilteredData(generateSampleData(month))
  }

  const handlePrint = () => {
    window.print()
  }

  const cardOnlyData = filteredData.filter(sale => sale.pay === 'Card')
  const cashOnlyData = filteredData.filter(sale => sale.pay === 'Cash')

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">End of Month Report</h1>
        <div className="flex gap-4 items-center no-print">
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="w-[200px] h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button onClick={handlePrint} variant="outline" className="bg-white">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        value={expandedItems}
        onValueChange={handleAccordionChange}
        className="w-full space-y-4"
      >
        <AccordionItem value="all-sales" className="border-none">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-medium">
                All Sales {!filteredData.length && '(no data)'}
              </h2>
              <AccordionTrigger />
            </div>
            <AccordionContent>
              <div className="p-4">
                <ItemsTable data={filteredData} type="sales" />
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        <AccordionItem value="card-only" className="border-none">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-medium">
                Sales by Card Only {!cardOnlyData.length && '(no data)'}
              </h2>
              <AccordionTrigger />
            </div>
            <AccordionContent>
              <div className="p-4">
                <ItemsTable data={cardOnlyData} type="sales" />
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        <AccordionItem value="cash-only" className="border-none">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-medium">
                Sales by Cash Only {!cashOnlyData.length && '(no data)'}
              </h2>
              <AccordionTrigger />
            </div>
            <AccordionContent>
              <div className="p-4">
                <ItemsTable data={cashOnlyData} type="sales" />
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  )
} 