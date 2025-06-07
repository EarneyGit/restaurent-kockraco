import axios from '@/lib/axios';

// Customer interfaces
export interface CustomerSimple {
  postcode: string;
  address: string;
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  customerType: 'Regular' | 'New';
}

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
  createdAt?: string;
  updatedAt?: string;
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
  data: CustomerSimple[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCustomers: number;
    customersPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CustomerDetailsResponse {
  success: boolean;
  data: CustomerDetails;
}

export interface CustomerStatsResponse {
  success: boolean;
  data: CustomerStats;
}

class CustomerService {
  private baseUrl = '/customers';

  /**
   * Get customers with filtering and pagination
   */
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomerResponse> {
    try {
      // Use POST method for customer list
      const response = await axios.post(`${this.baseUrl}/list`, filters);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch customers');
    }
  }

  /**
   * Get customer details by ID (for modal view)
   */
  async getCustomerDetails(customerId: string): Promise<CustomerDetailsResponse> {
    try {
      console.log('Calling API for customer ID:', customerId);
      console.log('API URL:', `${this.baseUrl}/${customerId}`);
      
      const response = await axios.get(`${this.baseUrl}/${customerId}`);
      console.log('API Response:', response);
      console.log('Response Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.response?.data?.message);
      
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
      console.error('Error filtering customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to filter customers');
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

  /**
   * Update customer information
   */
  async updateCustomer(customerId: string, updateData: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    mobileNumber?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postalCode?: string;
    address?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const response = await axios.put(`${this.baseUrl}/${customerId}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating customer:', error);
      throw new Error(error.response?.data?.message || 'Failed to update customer');
    }
  }

  /**
   * Test API connection
   */
  async testApiConnection(): Promise<void> {
    try {
      console.log('Testing API connection...');
      const response = await fetch(`${this.baseUrl}/api/customers/683c4271fe9160e097c05181`);
      console.log('Direct fetch response status:', response.status);
      
      const data = await response.json();
      console.log('Direct fetch response data:', data);
    } catch (error) {
      console.error('Direct fetch error:', error);
    }
  }
}

export const customerService = new CustomerService(); 