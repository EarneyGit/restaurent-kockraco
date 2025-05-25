import axios from '@/lib/axios';

export interface Branch {
  _id: string;
  name: string;
  code: string;
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
  isActive: boolean;
  isDefault: boolean;
  capacity: number;
  description?: string;
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
}

export default new BranchService(); 