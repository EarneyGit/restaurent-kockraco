"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Payout {
  id: string
  available: string
  amount: number
  status: "Paid"
  downloadUrl: string
}

export default function PayoutsPage() {
  const [payouts] = useState<Payout[]>([
    {
      id: "4VXOER66XQ5XTLI0",
      available: "2025-05-12 07:00:34",
      amount: 194.29,
      status: "Paid",
      downloadUrl: "#"
    },
    {
      id: "3DL5Y866UY57BCDE",
      available: "2025-05-05 07:00:48",
      amount: 312.85,
      status: "Paid",
      downloadUrl: "#"
    },
    {
      id: "3HE69D66S64HKT7W",
      available: "2025-04-28 07:01:08",
      amount: 330.02,
      status: "Paid",
      downloadUrl: "#"
    },
    {
      id: "3DVWV364PE3AQA7W",
      available: "2025-04-21 07:00:06",
      amount: 1188.91,
      status: "Paid",
      downloadUrl: "#"
    }
  ])

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/settings/payments" className="text-gray-500">
              ← Back
            </Link>
            <h1 className="text-2xl font-medium">Payment Payouts</h1>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-2 text-gray-600">Payout ID</th>
                    <th className="text-left px-4 py-2 text-gray-600">Available</th>
                    <th className="text-left px-4 py-2 text-gray-600">Amount</th>
                    <th className="text-left px-4 py-2 text-gray-600">Status</th>
                    <th className="text-right px-4 py-2 text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-4 py-3">{payout.id}</td>
                      <td className="px-4 py-3">
                        {format(new Date(payout.available), "dd/MM/yyyy HH:mm:ss")}
                      </td>
                      <td className="px-4 py-3">£{payout.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="link" className="text-emerald-500">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 