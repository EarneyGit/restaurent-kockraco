import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ItemSaleData, SaleData } from '@/types/reports'
import { Skeleton } from '@/components/ui/skeleton'

interface ItemsTableProps {
  data: ItemSaleData[] | SaleData[]
  type: 'items' | 'sales'
  isLoading?: boolean
}

export function ItemsTable({ data, type, isLoading }: ItemsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (type === 'items') {
    const itemsData = data as ItemSaleData[]
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-gray-700">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const salesData = data as SaleData[]
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Value</TableHead>
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
          {salesData.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.id}</TableCell>
              <TableCell className="text-gray-700">{sale.customer}</TableCell>
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