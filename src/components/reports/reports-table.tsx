import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SaleData } from '@/types/reports'

interface ReportsTableProps {
  data: SaleData[]
}

export function ReportsTable({ data }: ReportsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>value</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Postcode</TableHead>
            <TableHead>Pay</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Platform</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="text-blue-600">{sale.id}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell>£{sale.value.toFixed(2)}</TableCell>
              <TableCell>£{sale.discount.toFixed(2)}</TableCell>
              <TableCell>£{sale.tip.toFixed(2)}</TableCell>
              <TableCell>{sale.postcode}</TableCell>
              <TableCell>{sale.pay}</TableCell>
              <TableCell>{sale.type}</TableCell>
              <TableCell>{sale.created}</TableCell>
              <TableCell>{sale.platform}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 