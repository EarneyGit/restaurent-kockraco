"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ItemsTable } from "@/components/reports/items-table";
import { PrinterIcon, RotateCw, FileDown, FileText } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { SaleData } from "@/types/reports";
import { reportService } from "@/services/report.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function SalesHistoryPage() {
  // Set default date range to start of month and current date
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState<Date>(startOfMonth);
  const [endDate, setEndDate] = useState<Date>(today);

  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState<number>(50);

  // Fetch sales data
  const fetchSalesData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await reportService.getSalesHistory({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        page,
        limit: pageSize,
      });

      if (response.success) {
        setSalesData(response.data as unknown as SaleData[]);
        if (response.pagination) {
          setCurrentPage(response.pagination.currentPage);
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
      toast.error("Failed to fetch sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData(1);
  }, [startDate, endDate, pageSize]);

  const handleRefresh = () => {
    fetchSalesData(currentPage);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!salesData || salesData.length === 0) {
      toast.error("No data to export");
      return;
    }
    // Create CSV headers based on SaleData keys we show
    const headers = [
      "Order Number",
      "Customer",
      "Email",
      "Order Type",
      "Total",
      "Discount",
      "Postcode",
      "Order Status",
      "Payment Method",
      "Payment Status",
      "Created",
    ];

    const rows = salesData.map((s) => {
      const discountAmount =
        typeof (s as any).discount === "object" &&
        (s as any).discount?.discountAmount
          ? (s as any).discount.discountAmount
          : typeof (s as any).discount === "number"
          ? (s as any).discount
          : 0;
      const value = ((s as any).total ?? 0) as number;
      return [
        (s as any).orderNumber ?? s.id ?? "",
        s.customer ?? "",
        s.email ?? "",
        s.orderType ?? "",
        value.toFixed(2),
        (discountAmount as number).toFixed(2),
        (s as any).postcode ?? "",
        (s as any).status ?? "",
        (s as any).paymentMethod ?? "",
        (s as any).paymentStatus ?? "",
        s.created ?? "",
      ];
    });

    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-history_${format(startDate, "yyyyMMdd")}_${format(
      endDate,
      "yyyyMMdd"
    )}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!salesData || salesData.length === 0) {
      toast.error("No data to export");
      return;
    }
    // Use the print stylesheet to make a PDF via browser print to PDF
    // Open a new window with a simple table and trigger print
    const win = window.open("", "_blank");
    if (!win) return;
    const title = `Sales History: ${formatDate(startDate)} - ${formatDate(
      endDate
    )}`;
    const style = `<style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }
      h1 { font-size: 18px; margin-bottom: 12px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
      th { background: #f3f4f6; text-align: left; }
    </style>`;
    const header = [
      "Order Number",
      "Customer",
      "Email",
      "Order Type",
      "Total",
      "Discount",
      "Postcode",
      "Order Status",
      "Payment Method",
      "Payment Status",
      "Created",
    ];
    const rows = salesData.map((s) => {
      const discountAmount =
        typeof (s as any).discount === "object" &&
        (s as any).discount?.discountAmount
          ? (s as any).discount.discountAmount
          : typeof (s as any).discount === "number"
          ? (s as any).discount
          : 0;
      const value = ((s as any).total ?? 0) as number;
      return [
        (s as any).orderNumber ?? s.id ?? "",
        s.customer ?? "",
        s.email ?? "",
        s.orderType ?? "",
        value.toFixed(2),
        (discountAmount as number).toFixed(2),
        (s as any).postcode ?? "",
        (s as any).status ?? "",
        (s as any).paymentMethod ?? "",
        (s as any).paymentStatus ?? "",
        s.created ?? "",
      ];
    });
    const table = `
      <table>
        <thead><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows
            .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    `;
    win.document.write(
      `<html><head><title>${title}</title>${style}</head><body><h1>${title}</h1>${table}</body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
  };

  const handlePageChange = (page: number) => {
    fetchSalesData(page);
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  // Totals with discount handling
  const totalValue = salesData.reduce((sum, sale) => sum + sale.total, 0);

  const totalDiscounts = salesData.reduce((sum, sale) => {
    if (typeof sale.discount === "object" && sale.discount.discountAmount) {
      return sum + sale.discount.discountAmount;
    }
    return sum;
  }, 0);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">
          Sales History Report: {formatDate(startDate)} - {formatDate(endDate)}
        </h1>
        <div className="flex gap-4 items-center no-print">
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              className="w-[200px]"
            />
            <span className="text-gray-500">to</span>
            <DatePicker
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              className="w-[200px]"
            />
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="bg-white"
              disabled={loading}
            >
              <RotateCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
              className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
            >
              {[10, 30, 50, 100, 300, 1000].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="bg-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="bg-white"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-t p-4">
          <div className="flex gap-8">
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Value</div>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">£{totalValue.toFixed(2)}</div>
              )}
            </div>
            <div className="flex-1 border rounded-md p-4">
              <div className="text-sm text-gray-500">Total Discounts</div>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl mt-1">
                  £{totalDiscounts.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Scrollable table area - responsive both axes */}
              <div className="relative -mx-4 md:mx-0">
                <div className="overflow-auto min-h-[300px] max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh] xl:max-h-[75vh]">
                  <ItemsTable data={salesData} type="sales" />
                </div>
              </div>

              {/* Pagination (always visible) */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
                  items
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                    {totalPages > 5 && (
                      <Button
                        variant={
                          totalPages === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
