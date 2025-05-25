import { BaseUrl } from '@/lib/config';

const API_BASE_URL = `${BaseUrl}/api`;

// Types
export interface BusinessOffer {
  _id: string;
  id?: string;
  title: string;
  content: string;
  startDate: string | null;
  endDate: string | null;
  displayOrder: number;
  image?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  stats: {
    views: number;
    clicks: number;
    lastViewed: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BusinessOfferResponse {
  success: boolean;
  data: BusinessOffer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOffers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface BusinessOfferStats {
  totalOffers: number;
  activeOffers: number;
  totalViews: number;
  totalClicks: number;
  averageViews: number;
  averageClicks: number;
  clickThroughRate: string;
  topOffers: Array<{
    _id: string;
    title: string;
    stats: {
      views: number;
      clicks: number;
    };
  }>;
}

class BusinessOfferService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getBusinessOffers(page = 1, limit = 20, isActive?: boolean): Promise<BusinessOfferResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (isActive !== undefined) {
      params.append('isActive', isActive.toString());
    }

    const response = await fetch(`${API_BASE_URL}/business-offers?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch business offers');
    }

    return response.json();
  }

  async getBusinessOffer(id: string): Promise<{ success: boolean; data: BusinessOffer; branchId: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch business offer');
    }

    return response.json();
  }

  async createBusinessOffer(offerData: Partial<BusinessOffer>): Promise<{ success: boolean; data: BusinessOffer; message: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(offerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create business offer');
    }

    return response.json();
  }

  async updateBusinessOffer(id: string, offerData: Partial<BusinessOffer>): Promise<{ success: boolean; data: BusinessOffer; message: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(offerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update business offer');
    }

    return response.json();
  }

  async deleteBusinessOffer(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete business offer');
    }

    return response.json();
  }

  async getActiveBusinessOffers(branchId: string): Promise<{ success: boolean; data: BusinessOffer[]; branchId: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/active/${branchId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch active business offers');
    }

    return response.json();
  }

  async trackOfferView(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/${id}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to track offer view');
    }

    return response.json();
  }

  async trackOfferClick(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/${id}/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to track offer click');
    }

    return response.json();
  }

  async getBusinessOfferStats(): Promise<{ success: boolean; data: BusinessOfferStats; branchId: string }> {
    const response = await fetch(`${API_BASE_URL}/business-offers/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch business offer statistics');
    }

    return response.json();
  }

  // Helper methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getOfferStatusBadgeColor(isActive: boolean): string {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  isOfferCurrentlyActive(offer: BusinessOffer): boolean {
    if (!offer.isActive) return false;
    
    const now = new Date();
    
    // Check start date
    if (offer.startDate && now < new Date(offer.startDate)) return false;
    
    // Check end date
    if (offer.endDate && now > new Date(offer.endDate)) return false;
    
    return true;
  }

  stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  truncateContent(content: string, maxLength = 100): string {
    const plainText = this.stripHtmlTags(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  }
}

export const businessOfferService = new BusinessOfferService(); 