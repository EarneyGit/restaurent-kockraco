import { BaseUrl } from '@/lib/config';

const API_BASE_URL = `${BaseUrl}/api`;

// Types
export interface ReportSummary {
  totalOrders: number;
  totalSales: number;
  totalTips: number;
  totalDeliveryFees: number;
  averageOrderValue: number;
  cashOrders: number;
  cardOrders: number;
  deliveryOrders: number;
  pickupOrders: number;
  dineInOrders: number;
}

export interface EndOfNightReport {
  date: string;
  summary: ReportSummary;
  topItems: Array<{
    _id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  hourlySales: Array<{
    _id: number;
    orders: number;
    sales: number;
  }>;
}

export interface EndOfMonthReport {
  period: string;
  summary: {
    totalOrders: number;
    totalSales: number;
    totalTips: number;
    totalDeliveryFees: number;
    averageOrderValue: number;
    uniqueCustomers: number;
  };
  dailyBreakdown: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    orders: number;
    sales: number;
    averageOrderValue: number;
  }>;
  topCustomers: Array<{
    _id: string;
    totalOrders: number;
    totalSpent: number;
    customerName: string;
    customerEmail: string;
  }>;
}

export interface SalesHistoryItem {
  id: string;
  customer: string;
  value: number;
  discount: number;
  tip: number;
  postcode: string;
  pay: 'Card' | 'Cash';
  type: 'Delivery' | 'Collection';
  created: string;
  platform: string;
}

export interface ItemSaleData {
  id: string;
  name: string;
  quantity: number;
  created: string;
}

export interface DiscountHistoryItem {
  id: string;
  customer: string;
  discount: string;
  value: number;
  date: string;
}

export interface OutletReportData {
  branch: {
    id: string;
    name: string;
    address: any;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalOrders: number;
    totalSales: number;
    averageOrderValue: number;
    totalCustomers: number;
  };
  orderTypeBreakdown: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface CustomReportData {
  type: string;
  period: {
    startDate: string;
    endDate: string;
  };
  data: any;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

class ReportService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // End of Night Report
  async getEndOfNightReport(date?: string, branchId?: string): Promise<{ success: boolean; data: EndOfNightReport }> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (branchId) params.append('branchId', branchId);

    const response = await fetch(`${API_BASE_URL}/reports/end-of-night?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch end of night report');
    }

    return response.json();
  }

  // End of Month Report
  async getEndOfMonthReport(month?: number, year?: number, branchId?: string): Promise<{ success: boolean; data: EndOfMonthReport }> {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    if (branchId) params.append('branchId', branchId);

    const response = await fetch(`${API_BASE_URL}/reports/end-of-month?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch end of month report');
    }

    return response.json();
  }

  // Sales History
  async getSalesHistory(filters: ReportFilters): Promise<{ success: boolean; data: SalesHistoryItem[]; pagination: PaginationInfo }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/reports/sales-history?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch sales history');
    }

    return response.json();
  }

  // Item Sales History
  async getItemSalesHistory(filters: ReportFilters & { productId?: string; categoryId?: string }): Promise<{ success: boolean; data: ItemSaleData[]; pagination: PaginationInfo }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/reports/item-sales-history?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch item sales history');
    }

    return response.json();
  }

  // Discount History
  async getDiscountHistory(filters: ReportFilters & { discountType?: string }): Promise<{ success: boolean; data: DiscountHistoryItem[]; pagination: PaginationInfo }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/reports/discount-history?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch discount history');
    }

    return response.json();
  }

  // Outlet Reports
  async getOutletReport(branchId: string, period?: string): Promise<{ success: boolean; data: OutletReportData }> {
    const params = new URLSearchParams();
    params.append('branchId', branchId);
    if (period) params.append('period', period);

    const response = await fetch(`${API_BASE_URL}/reports/outlet-reports?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch outlet report');
    }

    return response.json();
  }

  // Custom Reports
  async getCustomReport(type: string, startDate: string, endDate: string, branchId?: string): Promise<{ success: boolean; type: string; period: { startDate: string; endDate: string }; data: any }> {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (branchId) params.append('branchId', branchId);

    const response = await fetch(`${API_BASE_URL}/reports/custom?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch custom report');
    }

    return response.json();
  }

  // Dashboard Summary
  async getDashboardSummary(period?: string, branchId?: string): Promise<{ 
    success: boolean; 
    data: Array<{
      label: string;
      value: string | number;
      previousValue: string | number;
      percentageChange: number;
      prefix?: string;
    }> 
  }> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (branchId) params.append('branchId', branchId);

    const response = await fetch(`${API_BASE_URL}/reports/dashboard-summary?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch dashboard summary');
    }

    return response.json();
  }

  // Helper methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export const reportService = new ReportService();
