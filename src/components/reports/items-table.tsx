import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemSaleData, SaleData } from "@/types/reports";
import { Button } from "@/components/ui/button";
import React from "react";
import { ReportOrderDetailsModal } from "./order-details-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemsTableProps {
  data: ItemSaleData[] | SaleData[];
  type: "items" | "sales";
  isLoading?: boolean;
}

export function ItemsTable({ data, type, isLoading }: ItemsTableProps) {
    const [openId, setOpenId] = React.useState<string | null>(null);
    const [openBranchId, setOpenBranchId] = React.useState<string | null>(null);
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (type === "items") {
    const itemsData = data as ItemSaleData[];
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
    );
  }

  const salesData = data as SaleData[];

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Postcode</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.map((sale) => {
            const discount =
              typeof sale.discount === "object"
                ? sale.discount.discountAmount
                : sale.discount || 0;
            return (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  {sale.orderNumber}
                </TableCell>
                <TableCell className="text-gray-700">{sale.customerName}</TableCell>
                <TableCell>{sale.customerEmail}</TableCell>
                <TableCell>{sale.orderType}</TableCell>
                <TableCell>£{sale.total.toFixed(2)}</TableCell>
                <TableCell>
                  {discount > 0 ? `£${discount.toFixed(2)}` : "—"}
                </TableCell>
                <TableCell>{sale.postcode}</TableCell>
                <TableCell>{sale.status}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
                <TableCell>{sale.paymentStatus}</TableCell>
                <TableCell>{sale.created}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpenId(sale.id);
                      setOpenBranchId(sale.branchId);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ReportOrderDetailsModal
        orderId={openId}
        open={Boolean(openId)}
        onClose={() => setOpenId(null)}
        branchId={openBranchId}
      />
    </div>
  );
}
