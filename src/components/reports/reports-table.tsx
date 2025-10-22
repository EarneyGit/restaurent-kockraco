import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaleData, DiscountObject } from "@/types/reports";

interface ReportsTableProps {
  data: SaleData[];
}

const getPaymentMethodColor = (paymentMethod: string) => {
  if (paymentMethod === "card") return "text-purple-600";
  if (paymentMethod === "cash") return "text-green-600";
  if (paymentMethod === "cash_on_delivery") return "text-green-600";
  return "text-gray-600";
};

const getPaymentStatusColor = (
  paymentStatus: string,
  paymentMethod: string
) => {
  // if cash or cash_on_delivery, return text-green-600
  if (paymentStatus === "paid") return "text-green-600";
  if (paymentMethod === "cash" || paymentMethod === "cash_on_delivery") {
    return "text-green-600";
  }

  if (paymentStatus === "pending") return "text-blue-600";
  if (paymentStatus === "processing") return "text-yellow-600";
  if (paymentStatus === "refunded") return "text-orange-600";
  return "text-gray-600";
};

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
              typeof sale.discount === "object"
                ? sale.discount.discountAmount
                : sale.discount || 0;

            return (
              <TableRow key={sale.id}>
                <TableCell className="text-blue-600">{sale.id}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>£{sale.total.toFixed(2)}</TableCell>
                <TableCell>
                  {discount > 0 ? `£${discount.toFixed(2)}` : "—"}
                </TableCell>
                <TableCell>{sale.postcode}</TableCell>
                <TableCell
                  className={getPaymentMethodColor(sale.paymentMethod)}
                >
                  {sale.paymentMethod}
                </TableCell>{" "}
                <TableCell
                  className={getPaymentStatusColor(
                    sale.paymentStatus,
                    sale.paymentMethod
                  )}
                >
                  {sale.paymentStatus}
                </TableCell>{" "}
                <TableCell>{sale.orderType}</TableCell>
                <TableCell>{sale.created}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
