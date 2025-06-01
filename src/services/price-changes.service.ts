import api from '@/lib/axios';

export interface MenuItem {
  id: string;
  name: string;
  currentPrice: number;
  effectivePrice: number;
  tempPrice: number;
  revertPrice: number;
  hasActiveChange: boolean;
  activePriceChangeId: string | null;
  activePriceChange: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    tempPrice: number;
  } | null;
}

export interface Category {
  id: string;
  name: string;
  isExpanded: boolean;
  items: MenuItem[];
}

export interface PriceChangeRequest {
  startDate: string;
  endDate: string;
  categories: Category[];
}

export interface PriceChangeResponse {
  success: boolean;
  message: string;
  data: {
    priceChangeId: string;
    affectedProducts: number;
    startDate: string;
    endDate: string;
    autoRevert: boolean;
  };
}

export interface TemporaryPriceChange {
  id: string;
  productId: string;
  productName: string;
  category: string;
  startDate: string;
  endDate: string;
  startPrice: number;
  endPrice: number;
  revertPrice: number;
  active: boolean;
  name: string;
  deleted: boolean;
  deletedAt?: string;
}

export interface TemporaryPriceChangesResponse {
  success: boolean;
  data: {
    current: TemporaryPriceChange[];
    future: TemporaryPriceChange[];
    historical: TemporaryPriceChange[];
    deleted: TemporaryPriceChange[];
    counts: {
      current: number;
      future: number;
      historical: number;
      deleted: number;
      total: number;
    };
  };
}

export interface PriceChangeDetails {
  id: string;
  name: string;
  productId: string;
  productName: string;
  category: string;
  startDate: string;
  endDate: string;
  startPrice: number;
  endPrice: number;
  revertPrice: number;
  active: boolean;
  status: 'current' | 'future' | 'historical';
  type: string;
  autoRevert: boolean;
}

export interface PriceChangeDetailsResponse {
  success: boolean;
  data: PriceChangeDetails;
}

export interface EffectivePrice {
  id: string;
  name: string;
  originalPrice: number;
  effectivePrice: number;
  hasActivePriceChange: boolean;
}

export interface EffectivePricesResponse {
  success: boolean;
  data: EffectivePrice[];
}

export interface PriceChangeListItem {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  active: boolean;
  autoRevert: boolean;
  isExpired: boolean;
  affectedProducts: {
    id: string;
    name: string;
    category: string;
    originalPrice: number;
    tempPrice: number;
    revertPrice: number;
    currentActivePrice: number;
  }[];
}

export interface PriceChangesListResponse {
  success: boolean;
  count: number;
  data: PriceChangeListItem[];
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface UpdatePriceChangeRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  startPrice?: number;
  endPrice?: number;
  active?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

class PriceChangesService {
  private baseUrl = '/price-changes';

  // Get categories with products for price changes form
  async getCategoriesWithProducts(showHiddenCategories = false, showHiddenItems = false): Promise<CategoriesResponse> {
    try {
      const params = new URLSearchParams({
        showHiddenCategories: showHiddenCategories.toString(),
        showHiddenItems: showHiddenItems.toString()
      });

      const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Apply price changes to products
  async applyPriceChanges(data: PriceChangeRequest): Promise<PriceChangeResponse> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error applying price changes:', error);
      throw error;
    }
  }

  // Get temporary price changes categorized by status (Current, Future, Historical)
  async getTemporaryPriceChanges(): Promise<TemporaryPriceChangesResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/temporary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching temporary price changes:', error);
      throw error;
    }
  }

  // Get details of a specific price change
  async getPriceChangeDetails(id: string): Promise<PriceChangeDetailsResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price change details:', error);
      throw error;
    }
  }

  // Get current effective prices for products
  async getEffectivePrices(productIds?: string[]): Promise<EffectivePricesResponse> {
    try {
      const params = productIds ? new URLSearchParams({ productIds: productIds.join(',') }) : null;
      const url = params ? `${this.baseUrl}/effective-prices?${params}` : `${this.baseUrl}/effective-prices`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching effective prices:', error);
      throw error;
    }
  }

  // Get list of all price changes (legacy endpoint)
  async getPriceChangesList(): Promise<PriceChangesListResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price changes list:', error);
      throw error;
    }
  }

  // Update specific price change
  async updatePriceChange(id: string, data: UpdatePriceChangeRequest): Promise<ApiResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating price change:', error);
      throw error;
    }
  }

  // Delete specific price change
  async deletePriceChange(id: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting price change:', error);
      throw error;
    }
  }

  // Toggle price change active status
  async togglePriceChange(id: string): Promise<ApiResponse> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling price change:', error);
      throw error;
    }
  }

  // Revert expired price changes (for manual trigger or admin action)
  async revertExpiredPriceChanges(): Promise<ApiResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/revert-expired`);
      return response.data;
    } catch (error) {
      console.error('Error reverting expired price changes:', error);
      throw error;
    }
  }

  // Legacy method - keeping for backward compatibility
  async removePriceChange(id: string): Promise<ApiResponse> {
    return this.deletePriceChange(id);
  }
}

export const priceChangesService = new PriceChangesService(); 