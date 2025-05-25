// Delivery Charge Types
export interface DeliveryCharge {
  _id: string;
  branchId: string;
  maxDistance: number;
  minSpend: number;
  maxSpend: number;
  charge: number;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PriceOverride {
  _id: string;
  branchId: string;
  prefix: string;
  postfix: string;
  minSpend: number;
  charge: number;
  isActive: boolean;
  fullPostcode: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostcodeExclusion {
  _id: string;
  branchId: string;
  prefix: string;
  postfix: string;
  reason: string;
  isActive: boolean;
  fullPostcode: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryChargeResponse {
  success: boolean;
  data: DeliveryCharge[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCharges: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface PriceOverrideResponse {
  success: boolean;
  data: PriceOverride[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOverrides: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface PostcodeExclusionResponse {
  success: boolean;
  data: PostcodeExclusion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalExclusions: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface DeliveryCalculationRequest {
  branchId: string;
  postcode: string;
  distance: number;
  orderTotal: number;
}

export interface DeliveryCalculationResponse {
  success: boolean;
  data?: {
    charge: number;
    type: 'postcode_override' | 'distance_based';
    postcode?: string;
    minSpend?: number;
    maxDistance?: number;
    maxSpend?: number;
  };
  deliverable: boolean;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class DeliveryChargeService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Delivery Charges
  async getDeliveryCharges(page = 1, limit = 20, isActive?: boolean): Promise<DeliveryChargeResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(isActive !== undefined && { isActive: isActive.toString() }),
      });

      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching delivery charges:', error);
      throw error;
    }
  }

  async getDeliveryCharge(id: string): Promise<{ success: boolean; data: DeliveryCharge }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching delivery charge:', error);
      throw error;
    }
  }

  async createDeliveryCharge(chargeData: Partial<DeliveryCharge>): Promise<{ success: boolean; data: DeliveryCharge }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges`, {
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
      console.error('Error creating delivery charge:', error);
      throw error;
    }
  }

  async updateDeliveryCharge(id: string, chargeData: Partial<DeliveryCharge>): Promise<{ success: boolean; data: DeliveryCharge }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/${id}`, {
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
      console.error('Error updating delivery charge:', error);
      throw error;
    }
  }

  async deleteDeliveryCharge(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting delivery charge:', error);
      throw error;
    }
  }

  async createBulkDeliveryCharges(charges: Partial<DeliveryCharge>[]): Promise<{ success: boolean; data: DeliveryCharge[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ charges }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating bulk delivery charges:', error);
      throw error;
    }
  }

  // Price Overrides
  async getPriceOverrides(page = 1, limit = 20, isActive?: boolean): Promise<PriceOverrideResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(isActive !== undefined && { isActive: isActive.toString() }),
      });

      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/price-overrides?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching price overrides:', error);
      throw error;
    }
  }

  async createPriceOverride(overrideData: Partial<PriceOverride>): Promise<{ success: boolean; data: PriceOverride }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/price-overrides`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(overrideData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating price override:', error);
      throw error;
    }
  }

  async updatePriceOverride(id: string, overrideData: Partial<PriceOverride>): Promise<{ success: boolean; data: PriceOverride }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/price-overrides/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(overrideData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating price override:', error);
      throw error;
    }
  }

  async deletePriceOverride(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/price-overrides/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting price override:', error);
      throw error;
    }
  }

  // Postcode Exclusions
  async getPostcodeExclusions(page = 1, limit = 20, isActive?: boolean): Promise<PostcodeExclusionResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(isActive !== undefined && { isActive: isActive.toString() }),
      });

      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/postcode-exclusions?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching postcode exclusions:', error);
      throw error;
    }
  }

  async createPostcodeExclusion(exclusionData: Partial<PostcodeExclusion>): Promise<{ success: boolean; data: PostcodeExclusion }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/postcode-exclusions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(exclusionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating postcode exclusion:', error);
      throw error;
    }
  }

  async updatePostcodeExclusion(id: string, exclusionData: Partial<PostcodeExclusion>): Promise<{ success: boolean; data: PostcodeExclusion }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/postcode-exclusions/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(exclusionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating postcode exclusion:', error);
      throw error;
    }
  }

  async deletePostcodeExclusion(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/postcode-exclusions/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting postcode exclusion:', error);
      throw error;
    }
  }

  // Public calculation endpoint
  async calculateDeliveryCharge(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/delivery-charges/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          deliverable: false,
          message: data.message || `HTTP error! status: ${response.status}`
        };
      }

      return data;
    } catch (error) {
      console.error('Error calculating delivery charge:', error);
      return {
        success: false,
        deliverable: false,
        message: 'Failed to calculate delivery charge'
      };
    }
  }

  // Helper methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  }

  formatDistance(distance: number): string {
    return `${distance} miles`;
  }

  getChargeStatusBadgeColor(isActive: boolean): string {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  getChargeTypeDisplay(charge: DeliveryCharge): string {
    return `Up to ${this.formatDistance(charge.maxDistance)} - ${this.formatCurrency(charge.charge)}`;
  }

  getOverrideDisplay(override: PriceOverride): string {
    return `${override.fullPostcode} - ${this.formatCurrency(override.charge)}`;
  }

  getExclusionDisplay(exclusion: PostcodeExclusion): string {
    return `${exclusion.fullPostcode} - ${exclusion.reason}`;
  }
}

export const deliveryChargeService = new DeliveryChargeService(); 