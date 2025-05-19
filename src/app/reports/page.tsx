"use client"

import { useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ItemsTable } from '@/components/reports/items-table'
import { PrinterIcon } from 'lucide-react'
import { SaleData } from '@/types/reports'

const sampleData: SaleData[] = [
  {
    id: '12707587',
    customer: '2382095 - Chris Jermain',
    value: 24.46,
    discount: 0.00,
    tip: 0.00,
    postcode: 'KY12 8YP',
    pay: 'Card',
    type: 'Delivery',
    created: '05/03/2024',
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
    created: '05/03/2024',
    platform: 'App4'
  }
]

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filteredData, setFilteredData] = useState<SaleData[]>(sampleData)
  const [expandedItems, setExpandedItems] = useState<string[]>(['all-sales'])

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    if (!date) {
      setFilteredData(sampleData)
      return
    }

    const filtered = sampleData.filter(sale => {
      const [day, month, year] = sale.created.split('/')
      const saleDate = new Date(Number(year), Number(month) - 1, Number(day))
      return (
        saleDate.getFullYear() === date.getFullYear() &&
        saleDate.getMonth() === date.getMonth() &&
        saleDate.getDate() === date.getDate()
      )
    })
    setFilteredData(filtered)
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
        <h1 className="text-2xl font-medium">End of Night Report</h1>
        <div className="flex gap-4 items-center no-print">
          <DatePicker
            selected={selectedDate}
            onSelect={handleDateChange}
            className="w-[200px]"
          />
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
              <AccordionTrigger className="py-0 hover:no-underline flex-none border-none">
                <span className="text-sm text-gray-500 mr-2">
                  {expandedItems.includes('all-sales') ? 'Collapse' : 'Expand'}
                </span>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="p-4">
                <ItemsTable data={filteredData} type="sales" />
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
              <AccordionTrigger className="py-0 hover:no-underline flex-none border-none">
                <span className="text-sm text-gray-500 mr-2">
                  {expandedItems.includes('cash-only') ? 'Collapse' : 'Expand'}
                </span>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="p-4">
                <ItemsTable data={cashOnlyData} type="sales" />
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
              <AccordionTrigger className="py-0 hover:no-underline flex-none border-none">
                <span className="text-sm text-gray-500 mr-2">
                  {expandedItems.includes('card-only') ? 'Collapse' : 'Expand'}
                </span>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="p-4">
                <ItemsTable data={cardOnlyData} type="sales" />
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  )
} 