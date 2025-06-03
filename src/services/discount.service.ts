import { BaseUrl } from '@/lib/config';

const API_BASE_URL = `${BaseUrl}/api`;

// Types
export interface Discount {
  _id: string;
  id?: string;
  name: string;
  code: string;
  allowMultipleCoupons: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxSpend: number;
  outlets: {
    [key: string]: boolean;
  };
  legacyOutlets?: {
    dunfermline: boolean;
    edinburgh: boolean;
    glasgow: boolean;
  };
  timeDependent: boolean;
  startDate: string | null;
  endDate: string | null;
  maxUses: {
    total: number;
    perCustomer: number;
    perDay: number;
  };
  daysAvailable: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  serviceTypes: {
    collection: boolean;
    delivery: boolean;
    tableOrdering: boolean;
  };
  firstOrderOnly: boolean;
  isActive: boolean;
  usageStats: {
    totalUsed: number;
    totalSavings: number;
    lastUsed: string | null;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DiscountResponse {
  success: boolean;
  data: Discount[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDiscounts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface DiscountValidationResponse {
  success: boolean;
  data: {
    discountId: string;
    code: string;
    name: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    originalTotal: number;
    newTotal: number;
    savings: number;
  };
  message: string;
}

export interface DiscountStats {
  totalDiscounts: number;
  activeDiscounts: number;
  totalUsed: number;
  totalSavings: number;
  averageDiscountValue: number;
  topDiscounts: Array<{
    _id: string;
    name: string;
    code: string;
    usageStats: {
      totalUsed: number;
      totalSavings: number;
    };
  }>;
}

class DiscountService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getDiscounts(page = 1, limit = 20, isActive?: boolean): Promise<DiscountResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (isActive !== undefined) {
      params.append('isActive', isActive.toString());
    }

    const response = await fetch(`${API_BASE_URL}/discounts?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch discounts');
    }

    return response.json();
  }

  async getDiscount(id: string): Promise<{ success: boolean; data: Discount; branchId: string }> {
    const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch discount');
    }

    return response.json();
  }

  async createDiscount(discountData: Partial<Discount>): Promise<{ success: boolean; data: Discount; message: string }> {
    const response = await fetch(`${API_BASE_URL}/discounts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(discountData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create discount');
    }

    return response.json();
  }

  async updateDiscount(id: string, discountData: Partial<Discount>): Promise<{ success: boolean; data: Discount; message: string }> {
    const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(discountData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update discount');
    }

    return response.json();
  }

  async deleteDiscount(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete discount');
    }

    return response.json();
  }

  async validateDiscountCode(
    code: string,
    branchId: string,
    orderTotal: number,
    deliveryMethod?: string,
    userId?: string
  ): Promise<DiscountValidationResponse> {
    const response = await fetch(`${API_BASE_URL}/discounts/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        branchId,
        orderTotal,
        deliveryMethod,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate discount code');
    }

    return response.json();
  }

  async getDiscountStats(): Promise<{ success: boolean; data: DiscountStats; branchId: string }> {
    const response = await fetch(`${API_BASE_URL}/discounts/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch discount statistics');
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
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatDiscountValue(discount: Discount): string {
    if (discount.discountType === 'percentage') {
      return `${discount.discountValue}%`;
    } else {
      return this.formatCurrency(discount.discountValue);
    }
  }

  getDiscountStatusBadgeColor(isActive: boolean): string {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  getDiscountTypeBadgeColor(discountType: 'percentage' | 'fixed'): string {
    return discountType === 'percentage'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  }
}

export const discountService = new DiscountService(); 