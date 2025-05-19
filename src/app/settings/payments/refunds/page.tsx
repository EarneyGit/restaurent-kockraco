"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, parse, startOfDay } from "date-fns"

interface Refund {
  orderNumber: string
  customer: string
  ordered: string
  total: number
  refund: number
}

export default function RefundsPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [allRefunds] = useState<Refund[]>([
    {
      orderNumber: "12715174",
      customer: "Doug Barr",
      ordered: "2025-02-05 18:38:19",
      total: 36.47,
      refund: 0.00
    },
    // Add more sample data for testing
    {
      orderNumber: "12715175",
      customer: "John Doe",
      ordered: "2025-03-05 10:30:00",
      total: 45.99,
      refund: 10.00
    },
    {
      orderNumber: "12715176",
      customer: "Jane Smith",
      ordered: "2025-04-05 15:45:00",
      total: 29.99,
      refund: 29.99
    }
  ])

  // Filter refunds based on selected date
  const filteredRefunds = allRefunds.filter(refund => {
    const refundDate = startOfDay(new Date(refund.ordered))
    const selectedDateTime = startOfDay(new Date(selectedDate))
    return refundDate.getTime() === selectedDateTime.getTime()
  })

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/settings/payments" className="text-gray-500">
              ← Back
            </Link>
            <h1 className="text-2xl font-medium">Payment Refunds</h1>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show refunds for:
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-48"
              />
            </div>

            {filteredRefunds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-4 py-2 text-gray-600">Order Number</th>
                      <th className="text-left px-4 py-2 text-gray-600">Customer</th>
                      <th className="text-left px-4 py-2 text-gray-600">Ordered</th>
                      <th className="text-right px-4 py-2 text-gray-600">Total</th>
                      <th className="text-right px-4 py-2 text-gray-600">Refund</th>
                      <th className="text-right px-4 py-2 text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredRefunds.map((refund) => (
                      <tr key={refund.orderNumber}>
                        <td className="px-4 py-3">{refund.orderNumber}</td>
                        <td className="px-4 py-3">{refund.customer}</td>
                        <td className="px-4 py-3">
                          {format(new Date(refund.ordered), "dd/MM/yyyy HH:mm:ss")}
                        </td>
                        <td className="px-4 py-3 text-right">£{refund.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">£{refund.refund.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="link" className="text-emerald-500">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                There were no refunds on {format(new Date(selectedDate), "dd/MM/yyyy")}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 