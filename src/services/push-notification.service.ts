import axios from '@/lib/axios';

export interface PushNotification {
  _id: string;
  branchId: string;
  text: string;
  title: string;
  scheduledTime?: Date;
  sentTime?: Date;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  targetAudience: 'all' | 'active_customers' | 'new_customers' | 'vip_customers';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  metadata: {
    totalRecipients: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    clickCount: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deliveryRate?: string;
}

export interface CreatePushNotificationData {
  text: string;
  title?: string;
  scheduledTime?: Date;
  targetAudience?: 'all' | 'active_customers' | 'new_customers' | 'vip_customers';
}

export interface UpdatePushNotificationData {
  text?: string;
  title?: string;
  scheduledTime?: Date;
  targetAudience?: 'all' | 'active_customers' | 'new_customers' | 'vip_customers';
  status?: 'scheduled' | 'sent' | 'failed' | 'cancelled';
}

export interface PushNotificationStats {
  total: number;
  byStatus: Array<{
    _id: string;
    count: number;
    totalRecipients: number;
    successfulDeliveries: number;
    failedDeliveries: number;
  }>;
  summary: {
    totalRecipients: number;
    successfulDeliveries: number;
    failedDeliveries: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: 'scheduled' | 'sent' | 'failed' | 'cancelled';
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

class PushNotificationService {
  private baseUrl = '/push-notifications';

  // Get all push notifications
  async getPushNotifications(params?: PaginationParams): Promise<ApiResponse<PushNotification[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
    const response = await axios.get(url);
    return response.data;
  }

  // Get single push notification
  async getPushNotification(id: string): Promise<ApiResponse<PushNotification>> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new push notification
  async createPushNotification(data: CreatePushNotificationData): Promise<ApiResponse<PushNotification>> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  // Update push notification
  async updatePushNotification(id: string, data: UpdatePushNotificationData): Promise<ApiResponse<PushNotification>> {
    const response = await axios.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete push notification
  async deletePushNotification(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Get notification statistics
  async getNotificationStats(): Promise<ApiResponse<PushNotificationStats>> {
    const response = await axios.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export const pushNotificationService = new PushNotificationService(); 