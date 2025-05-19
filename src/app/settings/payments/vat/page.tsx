"use client"

import PageLayout from "@/components/layout/page-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MonthlyReport {
  month: string
  year: number
}

export default function VatReportPage() {
  const reports: MonthlyReport[] = [
    { month: "April", year: 2025 },
    { month: "March", year: 2025 },
    { month: "February", year: 2025 },
    { month: "January", year: 2025 },
    { month: "December", year: 2024 },
    { month: "November", year: 2024 },
    { month: "October", year: 2024 },
    { month: "September", year: 2024 }
  ]

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/settings/payments" className="text-gray-500">
              ← Back
            </Link>
            <h1 className="text-2xl font-medium">VAT Report</h1>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={`${report.month}-${report.year}`}
                  className="flex items-center justify-between py-4 border-b last:border-b-0"
                >
                  <div className="text-gray-900">
                    {report.month} {report.year}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-emerald-500">
                      Download CSV
                    </Button>
                    <Button variant="outline" size="sm" className="text-emerald-500">
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 