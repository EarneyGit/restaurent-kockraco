// Service Charge Types
export interface ServiceCharge {
  _id: string;
  branchId: string;
  orderType: 'All' | 'Collection' | 'Delivery' | 'Table';
  chargeType: 'Fixed' | 'Percentage';
  value: number;
  minSpend: number;
  maxSpend: number;
  optional: boolean;
  isActive: boolean;
  formattedCharge: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceChargeResponse {
  success: boolean;
  data: ServiceCharge[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCharges: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface ServiceChargeCalculationRequest {
  branchId: string;
  orderType: string;
  orderTotal: number;
  includeOptional?: boolean;
}

export interface ServiceChargeCalculationResponse {
  success: boolean;
  data: {
    totalMandatory: number;
    totalOptional: number;
    totalAll: number;
    breakdown: {
      id: string;
      name: string;
      type: string;
      value: number;
      amount: number;
      optional: boolean;
    }[];
  };
}

export interface ServiceChargeStats {
  success: boolean;
  data: {
    totalCharges: number;
    activeCharges: number;
    mandatoryCharges: number;
    optionalCharges: number;
    averageValue: number;
    totalFixedCharges: number;
    totalPercentageCharges: number;
    chargesByOrderType: {
      _id: string;
      count: number;
      averageValue: number;
    }[];
  };
  branchId: string;
}

export interface ApplicableChargesResponse {
  success: boolean;
  data: {
    charge: ServiceCharge;
    amount: number;
  }[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ServiceChargeService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Service Charges CRUD
  async getServiceCharges(page = 1, limit = 20, isActive?: boolean, orderType?: string): Promise<ServiceChargeResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(isActive !== undefined && { isActive: isActive.toString() }),
        ...(orderType && { orderType }),
      });

      const response = await fetch(`${API_BASE_URL}/settings/service-charges?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service charges:', error);
      throw error;
    }
  }

  async getServiceCharge(id: string): Promise<{ success: boolean; data: ServiceCharge }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/service-charges/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service charge:', error);
      throw error;
    }
  }

  async createServiceCharge(chargeData: Partial<ServiceCharge>): Promise<{ success: boolean; data: ServiceCharge }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/service-charges`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(chargeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating service charge:', error);
      throw error;
    }
  }

  async updateServiceCharge(id: string, chargeData: Partial<ServiceCharge>): Promise<{ success: boolean; data: ServiceCharge }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/service-charges/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(chargeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating service charge:', error);
      throw error;
    }
  }

  async deleteServiceCharge(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/service-charges/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting service charge:', error);
      throw error;
    }
  }

  // Public calculation endpoint
  async calculateServiceCharges(request: ServiceChargeCalculationRequest): Promise<ServiceChargeCalculationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/service-charges/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating service charges:', error);
      throw error;
    }
  }

  // Statistics
  async getServiceChargeStats(): Promise<ServiceChargeStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/service-charges/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service charge stats:', error);
      throw error;
    }
  }

  // Get applicable charges for order type
  async getApplicableCharges(orderType: string, branchId: string, orderTotal: number): Promise<ApplicableChargesResponse> {
    try {
      const params = new URLSearchParams({
        branchId,
        orderTotal: orderTotal.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/settings/service-charges/applicable/${orderType}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching applicable charges:', error);
      throw error;
    }
  }

  // Helper methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  }

  getChargeStatusBadgeColor(isActive: boolean): string {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  getChargeTypeBadgeColor(chargeType: string): string {
    return chargeType === 'Fixed'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  }

  getOrderTypeBadgeColor(orderType: string): string {
    switch (orderType) {
      case 'All':
        return 'bg-gray-100 text-gray-800';
      case 'Collection':
        return 'bg-orange-100 text-orange-800';
      case 'Delivery':
        return 'bg-green-100 text-green-800';
      case 'Table':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getOptionalBadgeColor(optional: boolean): string {
    return optional
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';
  }

  getChargeDisplay(charge: ServiceCharge): string {
    const typeDisplay = charge.chargeType === 'Fixed' 
      ? this.formatCurrency(charge.value)
      : `${charge.value}%`;
    
    const orderTypeDisplay = charge.orderType === 'All' ? 'All Orders' : charge.orderType;
    const optionalDisplay = charge.optional ? ' (Optional)' : '';
    
    return `${orderTypeDisplay}: ${typeDisplay}${optionalDisplay}`;
  }

  getChargeConditions(charge: ServiceCharge): string {
    const conditions: string[] = [];
    
    if (charge.minSpend > 0) {
      conditions.push(`Min spend: ${this.formatCurrency(charge.minSpend)}`);
    }
    
    if (charge.maxSpend > 0) {
      conditions.push(`Max spend: ${this.formatCurrency(charge.maxSpend)}`);
    }
    
    return conditions.length > 0 ? conditions.join(', ') : 'No conditions';
  }

  calculateChargeAmount(charge: ServiceCharge, orderTotal: number): number {
    // Check conditions
    if (orderTotal < charge.minSpend) return 0;
    if (charge.maxSpend > 0 && orderTotal > charge.maxSpend) return 0;
    
    if (charge.chargeType === 'Percentage') {
      return (orderTotal * charge.value) / 100;
    } else {
      return charge.value;
    }
  }

  getOrderTypeOptions(): { value: string; label: string }[] {
    return [
      { value: 'All', label: 'All Orders' },
      { value: 'Collection', label: 'Collection' },
      { value: 'Delivery', label: 'Delivery' },
      { value: 'Table', label: 'Table Ordering' },
    ];
  }

  getChargeTypeOptions(): { value: string; label: string }[] {
    return [
      { value: 'Fixed', label: 'Fixed Amount' },
      { value: 'Percentage', label: 'Percentage' },
    ];
  }

  validateChargeData(chargeData: Partial<ServiceCharge>): string[] {
    const errors: string[] = [];

    if (!chargeData.orderType) {
      errors.push('Order type is required');
    }

    if (!chargeData.chargeType) {
      errors.push('Charge type is required');
    }

    if (chargeData.value === undefined || chargeData.value < 0) {
      errors.push('Charge value must be a positive number');
    }

    if (chargeData.chargeType === 'Percentage' && chargeData.value && chargeData.value > 100) {
      errors.push('Percentage value cannot exceed 100%');
    }

    if (chargeData.minSpend !== undefined && chargeData.minSpend < 0) {
      errors.push('Minimum spend cannot be negative');
    }

    if (chargeData.maxSpend !== undefined && chargeData.maxSpend < 0) {
      errors.push('Maximum spend cannot be negative');
    }

    if (
      chargeData.minSpend !== undefined &&
      chargeData.maxSpend !== undefined &&
      chargeData.maxSpend > 0 &&
      chargeData.minSpend > chargeData.maxSpend
    ) {
      errors.push('Minimum spend cannot be greater than maximum spend');
    }

    return errors;
  }
}

export const serviceChargeService = new ServiceChargeService(); 