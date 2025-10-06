"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

interface Props {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
  branchId: string | null;
}

export function ReportOrderDetailsModal({
  orderId,
  open,
  onClose,
  branchId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!open || !orderId) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}?branchId=${branchId}`);
        if (res.data?.success) setOrder(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [open, orderId, branchId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : order ? (
          <div className="p-4">
            {/* Header */}
            <div className="bg-white flex flex-col md:flex-row md:items-center md:justify-between rounded-lg shadow-sm p-6 mb-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-emerald-600 mb-2">
                  Order No: {order.orderNumber}
                </h1>
                <div className="text-sm text-gray-600">
                  {new Date(order.createdAt || order.created).toLocaleString()}
                </div>
              </div>
              <div className="text-right text-sm text-gray-600 mt-4 md:mt-0">
                <div>
                  Payment: {order.paymentMethod} ({order.paymentStatus})
                </div>
                <div>Type: {order.deliveryMethod || order.orderType}</div>
              </div>
            </div>

            {/* Animated Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h3 className="text-lg font-semibold mb-3">Status</h3>
              {(() => {
                const rawStatus = (order.status || order.orderStatus || "")
                  .toString()
                  .toLowerCase();
                const steps = [
                  "pending",
                  "processing",
                  "ready",
                  "completed",
                ] as const;
                const currentIndex = steps.indexOf(rawStatus as any);
                return (
                  <div className="flex items-center gap-3">
                    {steps.map((s, i) => {
                      const isCurrent =
                        i === currentIndex || (currentIndex === -1 && i === 0);
                      const isDone = i < currentIndex;
                      const base = isDone
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500";
                      const pulse =
                        isCurrent && rawStatus !== "completed"
                          ? "animate-pulse"
                          : "";
                      return (
                        <div key={s} className="flex items-center gap-3">
                          <div
                            className={`h-8 px-3 rounded-full text-xs font-semibold flex items-center ${base} ${pulse}`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`h-[2px] w-6 ${
                                i < currentIndex
                                  ? "bg-emerald-400"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Delivery Address (only for delivery orders) */}
            {((order.deliveryMethod || "").toLowerCase() === "delivery" ||
              (order.orderType || "").toLowerCase() === "delivery") && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
                {(() => {
                  const addr = order.deliveryAddress || order.address || {};
                  const street = addr.street;
                  const city = addr.city;
                  const state = addr.state;
                  const country = addr.country;
                  const pc = addr.postalCode || addr.zipCode || addr.postcode;
                  const line = [street, city, state || country, pc]
                    .filter(Boolean)
                    .join(", ");
                  return <p className="text-gray-700">{line || "-"}</p>;
                })()}
              </div>
            )}

            {/* Items + Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <div className="space-y-3">
                {(order.products || order.items || []).map((it: any) => (
                  <div
                    key={it._id || it.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">
                      {it.product?.name || it.name}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">Qty: {it.quantity}</span>
                      <span className="font-semibold">
                        £{(Number(it.itemTotal ?? it.price) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {order.serviceCharge !== undefined && (
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm">Service Charge</span>
                  <span className="text-sm">
                    £{Number(order.serviceCharge || 0).toFixed(2)}
                  </span>
                </div>
              )}
              {order.subtotal !== undefined && (
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-semibold">Subtotal</span>
                  <span className="text-sm font-semibold">
                    £{Number(order.subtotal).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t mt-3">
                <span className="text-base font-semibold">Total</span>
                <span className="text-base font-semibold">
                  £
                  {(order.total || order.subtotal)?.toFixed?.(2) ?? order.total}
                </span>
              </div>
            </div>

            {/* Customer */}
            {(order.customer || order.customerName) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3">Customer</h3>
                <div className="text-gray-700">
                  {order.customer?.name ||
                    order.customer?.fullName ||
                    order.customerName ||
                    ""}
                </div>
                {order.customer?.email && (
                  <div className="text-sm text-gray-600">
                    {order.customer.email}
                  </div>
                )}
                {order.customer?.phone && (
                  <div className="text-sm text-gray-600">
                    {order.customer.phone}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-gray-500">Order not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
