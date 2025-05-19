import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DiscountHistoryItem } from '@/types/reports'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface DiscountHistoryTableProps {
  data: DiscountHistoryItem[]
  isLoading?: boolean
}

export function DiscountHistoryTable({ data, isLoading }: DiscountHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No discount history found for the selected period
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.customer}</TableCell>
            <TableCell>{item.discount}</TableCell>
            <TableCell className="text-right">£{item.value.toFixed(2)}</TableCell>
            <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 