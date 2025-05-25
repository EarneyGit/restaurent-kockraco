import axios from '@/lib/axios';

export interface SmsEmailMessage {
  _id: string;
  branchId: {
    _id: string;
    name: string;
  };
  type: 'email' | 'sms';
  target: 'ordered' | 'reservation' | 'all';
  template: string;
  subject?: string;
  message: string;
  scheduledTime?: string;
  sentTime?: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  targetBranches: Array<{
    _id: string;
    name: string;
  }>;
  overrideGdpr: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  metadata: {
    totalRecipients: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    openCount: number;
    clickCount: number;
  };
  deliveryRate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSmsEmailMessageData {
  type: 'email' | 'sms';
  target: 'ordered' | 'reservation' | 'all';
  template: string;
  subject?: string;
  message: string;
  scheduledTime?: string;
  targetBranches: string[];
  overrideGdpr: boolean;
}

export interface UpdateSmsEmailMessageData {
  subject?: string;
  message?: string;
  scheduledTime?: string;
  targetBranches?: string[];
  overrideGdpr?: boolean;
}

export interface SmsEmailMessageStats {
  totalMessages: number;
  sentMessages: number;
  scheduledMessages: number;
  failedMessages: number;
  emailMessages: number;
  smsMessages: number;
  deliveryRate: string;
  openRate: string;
  clickRate: string;
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  totalOpens: number;
  totalClicks: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

class SmsEmailMessageService {
  private baseUrl = '/sms-email-messages';

  // Get all SMS/Email messages
  async getSmsEmailMessages(params?: PaginationParams): Promise<ApiResponse<SmsEmailMessage[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
    const response = await axios.get(url);
    return response.data;
  }

  // Get single SMS/Email message
  async getSmsEmailMessage(id: string): Promise<ApiResponse<SmsEmailMessage>> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new SMS/Email message
  async createSmsEmailMessage(data: CreateSmsEmailMessageData): Promise<ApiResponse<SmsEmailMessage>> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  // Update SMS/Email message
  async updateSmsEmailMessage(id: string, data: UpdateSmsEmailMessageData): Promise<ApiResponse<SmsEmailMessage>> {
    const response = await axios.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete SMS/Email message
  async deleteSmsEmailMessage(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Get message statistics
  async getSmsEmailMessageStats(): Promise<ApiResponse<SmsEmailMessageStats>> {
    const response = await axios.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export default new SmsEmailMessageService(); 