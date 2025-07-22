"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import { Eye, Search, Filter, Calendar } from "lucide-react";

interface Payment {
  _id: string;
  stripePaymentIntentId: string;
  paymentStatus: string;
  userFullName: string;
  totalAmount: number;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStats {
  totalPaid: number;
  totalRefunded: number;
  totalTax: number;
  totalTransactions: number;
  paidTransactions: number;
  refundedTransactions: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPaid: 0,
    totalRefunded: 0,
    totalTax: 0,
    totalTransactions: 0,
    paidTransactions: 0,
    refundedTransactions: 0,
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "paid",
    search: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  const getApiUrl = () => {
    return process.env.NODE_ENV === "production"
      ? "https://your-production-api.com/api"
      : "http://localhost:5000/api";
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`${getApiUrl()}/payments?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
        setPagination(data.pagination || pagination);
      } else {
        console.error("Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/payments/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data || stats);
      } else {
        console.error("Failed to fetch payment stats");
      }
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : Number(value), // Ensure page is always a number
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      paid: "bg-green-100 text-green-800",
      refunded: "bg-red-100 text-red-800",
      open: "bg-yellow-100 text-yellow-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Payments</h1>
          <p className="text-gray-600 mb-6">
            View and manage all payment transactions processed through your
            restaurant.
          </p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Amount Paid
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(stats.totalPaid)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.paidTransactions} transactions
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Amount Refunded
              </h3>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(stats.totalRefunded)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.refundedTransactions} refunds
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Tax Amount
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(stats.totalTax)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Estimated tax collected
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="h-4 w-4 inline mr-1" />
                  Payment Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="open">Open</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="h-4 w-4 inline mr-1" />
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Payment ID, Order #, Customer name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Payment Transactions</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading payments...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Intent ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No payments found for the selected criteria.
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {payment.stripePaymentIntentId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                  payment.paymentStatus
                                )}`}
                              >
                                {payment.paymentStatus.charAt(0).toUpperCase() +
                                  payment.paymentStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.userFullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{payment.orderNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(payment.totalAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payment.createdAt)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      to{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      of {pagination.totalItems} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleFilterChange(
                            "page",
                            Math.max(1, pagination.currentPage - 1)
                          )
                        }
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          handleFilterChange(
                            "page",
                            Math.min(
                              pagination.totalPages,
                              pagination.currentPage + 1
                            )
                          )
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
