import axios from '@/lib/axios';

export interface Branch {
  _id: string;
  name: string;
  code: string;
  aboutUs?: string;
  address: {
    street: string;
    addressLine2?: string;
    city: string;
    county?: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    telephone?: string;
  };
  location?: {
    type: string;
    coordinates: number[];
    formattedAddress?: string;
  };
  openingHours?: Array<{
    day: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
  }>;
  openingTimes?: any;
  orderingOptions?: {
    collection: {
      displayFormat: string;
      timeslotLength: number;
    };
    delivery: {
      displayFormat: string;
      timeslotLength: number;
    };
  };
  preOrdering?: {
    allowCollectionPreOrders: boolean;
    allowDeliveryPreOrders: boolean;
  };
  isActive: boolean;
  isDefault: boolean;
  capacity: number;
  description?: string;
  image?: string;
  slug?: string;
  manager?: string;
  isCollectionEnabled?: boolean;
  isDeliveryEnabled?: boolean;
  isTableOrderingEnabled?: boolean;
  facilities?: string[];
  maxCapacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

class BranchService {
  private baseUrl = '/branches';

  // Get all branches (public endpoint for branch selection)
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  // Get user's assigned branch
  async getMyBranch(): Promise<ApiResponse<Branch>> {
    const response = await axios.get(`${this.baseUrl}/my-branch`);
    return response.data;
  }

  // Create new branch
  async createBranch(data: Partial<Branch>): Promise<ApiResponse<Branch>> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  // Update user's branch
  async updateMyBranch(data: Partial<Branch>): Promise<ApiResponse<Branch>> {
    const response = await axios.put(`${this.baseUrl}/my-branch`, data);
    return response.data;
  }

  // Delete user's branch
  async deleteMyBranch(): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/my-branch`);
    return response.data;
  }

  // SuperAdmin Methods - Manage any branch by ID
  
  // Get specific branch by ID (SuperAdmin only)
  async getBranchById(branchId: string): Promise<ApiResponse<Branch>> {
    const response = await axios.get(`${this.baseUrl}/admin/${branchId}`);
    return response.data;
  }

  // Update specific branch by ID (SuperAdmin only)
  async updateBranchById(branchId: string, data: Partial<Branch>): Promise<ApiResponse<Branch>> {
    const response = await axios.put(`${this.baseUrl}/admin/${branchId}`, data);
    return response.data;
  }

  // Delete specific branch by ID (SuperAdmin only)
  async deleteBranchById(branchId: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/admin/${branchId}`);
    return response.data;
  }

  // Create branch as SuperAdmin
  async createBranchAsAdmin(data: Partial<Branch>): Promise<ApiResponse<Branch>> {
    const response = await axios.post(`${this.baseUrl}/admin`, data);
    return response.data;
  }

  // Bulk delete branches (SuperAdmin only)
  async bulkDeleteBranches(branchIds: string[]): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/admin/bulk`, {
      data: { branchIds }
    });
    return response.data;
  }

  // Get branches with advanced filtering (SuperAdmin only)
  async getBranchesWithFilters(filters: {
    isActive?: boolean;
    isDefault?: boolean;
    city?: string;
    state?: string;
    search?: string;
  }): Promise<ApiResponse<Branch[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`${this.baseUrl}/admin/filtered?${params.toString()}`);
    return response.data;
  }

  // Get branch statistics (SuperAdmin only)
  async getBranchStatistics(): Promise<ApiResponse<{
    totalBranches: number;
    activeBranches: number;
    inactiveBranches: number;
    branchesByRegion: Array<{ region: string; count: number }>;
    averageCapacity: number;
  }>> {
    const response = await axios.get(`${this.baseUrl}/admin/statistics`);
    return response.data;
  }

  // Update branch settings by ID (SuperAdmin only)
  async updateBranchSettings(branchId: string, settings: {
    isCollectionEnabled?: boolean;
    isDeliveryEnabled?: boolean;
    isTableOrderingEnabled?: boolean;
  }): Promise<ApiResponse<Branch>> {
    const response = await axios.patch(`${this.baseUrl}/admin/${branchId}/settings`, settings);
    return response.data;
  }

  // Set default branch (SuperAdmin only)
  async setDefaultBranch(branchId: string): Promise<ApiResponse<Branch>> {
    const response = await axios.patch(`${this.baseUrl}/admin/${branchId}/set-default`);
    return response.data;
  }

  // Toggle branch status (SuperAdmin only)
  async toggleBranchStatus(branchId: string): Promise<ApiResponse<Branch>> {
    const response = await axios.patch(`${this.baseUrl}/admin/${branchId}/toggle-status`);
    return response.data;
  }
}

export default new BranchService(); 