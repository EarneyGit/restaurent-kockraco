import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface SummaryMetric {
  label: string
  value: string | number
  previousValue?: string | number
  percentageChange?: number
  prefix?: string
}

interface ReportsSummaryProps {
  metrics: SummaryMetric[]
}

export function ReportsSummary({ metrics }: ReportsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">{metric.label}</div>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-semibold">
                {metric.prefix && metric.prefix}
                {metric.value}
              </div>
              {metric.percentageChange !== undefined && (
                <span
                  className={`ml-2 text-sm flex items-center ${
                    metric.percentageChange >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {metric.percentageChange >= 0 ? (
                    <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(metric.percentageChange)}%
                </span>
              )}
            </div>
            {metric.previousValue !== undefined && (
              <div className="mt-1 text-sm text-gray-500">
                Previous: {metric.prefix && metric.prefix}
                {metric.previousValue}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 