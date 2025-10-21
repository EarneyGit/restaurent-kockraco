import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SaleData, DiscountObject } from '@/types/reports'

interface ReportsTableProps {
  data: SaleData[]
}

export function ReportsTable({ data }: ReportsTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Postcode</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sale) => {
            const discount: number =
              typeof sale.discount === 'object'
                ? sale.discount.discountAmount
                : sale.discount || 0

            return (
              <TableRow key={sale.id}>
                <TableCell className="text-blue-600">{sale.id}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>£{sale.total.toFixed(2)}</TableCell>
                <TableCell>{discount > 0 ? `£${discount.toFixed(2)}` : '—'}</TableCell>
                <TableCell>{sale.postcode}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
                <TableCell>{sale.paymentStatus}</TableCell>
                <TableCell>{sale.orderType}</TableCell>
                <TableCell>{sale.created}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
