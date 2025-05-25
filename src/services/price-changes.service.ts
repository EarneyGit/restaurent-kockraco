import axios from '@/lib/axios';

export interface MenuItem {
  id: string;
  name: string;
  currentPrice: number;
  newPrice: number;
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
  showHiddenCategories: boolean;
  showHiddenItems: boolean;
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
  };
}

export interface PriceChangeListItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  affectedProducts: {
    id: string;
    name: string;
    category: string;
    originalPrice: number;
    newPrice: number;
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

class PriceChangesService {
  private baseUrl = '/price-changes';

  // Get categories with products for price changes form
  async getCategoriesWithProducts(showHiddenCategories = false, showHiddenItems = false): Promise<CategoriesResponse> {
    const params = new URLSearchParams({
      showHiddenCategories: showHiddenCategories.toString(),
      showHiddenItems: showHiddenItems.toString()
    });

    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
    const response = await axios.get(url);
    return response.data;
  }

  // Apply price changes to products
  async applyPriceChanges(data: PriceChangeRequest): Promise<PriceChangeResponse> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  // Get list of all price changes
  async getPriceChangesList(): Promise<PriceChangesListResponse> {
    const response = await axios.get(`${this.baseUrl}/list`);
    return response.data;
  }

  // Update specific price change
  async updatePriceChange(
    id: string, 
    data: { 
      name?: string; 
      startDate?: string; 
      endDate?: string; 
      active?: boolean; 
    }
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Remove specific price change
  async removePriceChange(id: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const priceChangesService = new PriceChangesService(); 