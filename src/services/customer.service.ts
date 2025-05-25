import axios from '@/lib/axios';

// Customer interfaces
export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  address: string;
  postcode: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  firstOrderDate: string;
  customerType: 'Regular' | 'New';
}

export interface CustomerDetails extends Customer {
  orders: CustomerOrder[];
}

export interface CustomerOrder {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  deliveryMethod: string;
  createdAt: string;
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  totalRevenue: number;
  averageCustomerValue: number;
  averageOrdersPerCustomer: number;
  newCustomers: number;
  regularCustomers: number;
  retentionRate: number;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  userId?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  mobile?: string;
  postcode?: string;
  sortBy?: 'name' | 'email' | 'totalOrders' | 'totalSpent' | 'lastOrderDate';
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerResponse {
  success: boolean;
  data: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCustomers: number;
    customersPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface CustomerDetailsResponse {
  success: boolean;
  data: CustomerDetails;
  branchId: string;
}

export interface CustomerStatsResponse {
  success: boolean;
  data: CustomerStats;
  branchId: string;
}

class CustomerService {
  private baseUrl = '/customers';

  /**
   * Get customers with filtering and pagination
   */
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomerResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch customers');
    }
  }

  /**
   * Get customer details by ID
   */
  async getCustomer(customerId: string): Promise<CustomerDetailsResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${customerId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats(): Promise<CustomerStatsResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch customer statistics');
    }
  }

  /**
   * Search customers by text (searches across name, email, mobile)
   */
  async searchCustomers(searchText: string, page: number = 1, limit: number = 20): Promise<CustomerResponse> {
    try {
      const filters: CustomerFilters = {
        page,
        limit
      };

      // If search text looks like an email, search by email
      if (searchText.includes('@')) {
        filters.email = searchText;
      }
      // If search text looks like a phone number, search by mobile
      else if (/^\+?[\d\s\-\(\)]+$/.test(searchText)) {
        filters.mobile = searchText;
      }
      // If search text looks like a postcode, search by postcode
      else if (/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(searchText)) {
        filters.postcode = searchText;
      }
      // Otherwise, search by first name
      else {
        filters.firstname = searchText;
      }

      return await this.getCustomers(filters);
    } catch (error: any) {
      console.error('Error searching customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to search customers');
    }
  }

  /**
   * Get customers with advanced filtering
   */
  async getFilteredCustomers(
    filters: {
      userId?: string;
      firstname?: string;
      lastname?: string;
      email?: string;
      mobile?: string;
      postcode?: string;
    },
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'lastOrderDate',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<CustomerResponse> {
    try {
      const customerFilters: CustomerFilters = {
        ...filters,
        page,
        limit,
        sortBy: sortBy as any,
        sortOrder
      };

      return await this.getCustomers(customerFilters);
    } catch (error: any) {
      console.error('Error fetching filtered customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered customers');
    }
  }

  /**
   * Format customer name for display
   */
  formatCustomerName(customer: Customer): string {
    const firstName = customer.firstname || '';
    const lastName = customer.lastname || '';
    return `${firstName} ${lastName}`.trim() || 'Guest Customer';
  }

  /**
   * Format customer address for display
   */
  formatCustomerAddress(customer: Customer): string {
    const address = customer.address || '';
    const postcode = customer.postcode || '';
    
    if (address && postcode) {
      return `${address}, ${postcode}`;
    } else if (address) {
      return address;
    } else if (postcode) {
      return postcode;
    }
    
    return 'No address provided';
  }

  /**
   * Format currency values
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get customer type badge color
   */
  getCustomerTypeBadgeColor(customerType: 'Regular' | 'New'): string {
    switch (customerType) {
      case 'Regular':
        return 'bg-green-100 text-green-800';
      case 'New':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const customerService = new CustomerService(); 