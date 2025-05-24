import axios from '@/lib/axios';

export interface RepeatingPushNotification {
  _id: string;
  branchId: string;
  messageText: string;
  startRun: string;
  endRun: string;
  lastRun: string | null;
  nextRun: string | null;
  status: 'active' | 'inactive';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  executionCount: number;
  maxExecutions: number | null;
  metadata: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    lastExecutionStatus: 'success' | 'failed' | 'pending';
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isDue?: boolean;
  isExpired?: boolean;
}

export interface CreateRepeatingPushNotificationData {
  messageText: string;
  startRun: string;
  endRun: string;
  status?: 'active' | 'inactive';
  frequency?: 'daily' | 'weekly' | 'monthly';
  interval?: number;
}

export interface UpdateRepeatingPushNotificationData {
  messageText?: string;
  startRun?: string;
  endRun?: string;
  status?: 'active' | 'inactive';
  frequency?: 'daily' | 'weekly' | 'monthly';
  interval?: number;
}

export interface RepeatingPushNotificationStats {
  total: number;
  byStatus: Array<{
    _id: string;
    count: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
  }>;
  summary: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
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

class RepeatingPushNotificationService {
  private baseUrl = '/repeating-push-notifications';

  // Get all repeating push notifications
  async getRepeatingPushNotifications(params?: PaginationParams): Promise<ApiResponse<RepeatingPushNotification[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
    const response = await axios.get(url);
    return response.data;
  }

  // Get single repeating push notification
  async getRepeatingPushNotification(id: string): Promise<ApiResponse<RepeatingPushNotification>> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new repeating push notification
  async createRepeatingPushNotification(data: CreateRepeatingPushNotificationData): Promise<ApiResponse<RepeatingPushNotification>> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  // Update repeating push notification
  async updateRepeatingPushNotification(id: string, data: UpdateRepeatingPushNotificationData): Promise<ApiResponse<RepeatingPushNotification>> {
    const response = await axios.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete repeating push notification
  async deleteRepeatingPushNotification(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Toggle status of repeating push notification
  async toggleRepeatingPushNotificationStatus(id: string): Promise<ApiResponse<RepeatingPushNotification>> {
    const response = await axios.patch(`${this.baseUrl}/${id}/toggle-status`);
    return response.data;
  }

  // Get notification statistics
  async getRepeatingNotificationStats(): Promise<ApiResponse<RepeatingPushNotificationStats>> {
    const response = await axios.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export const repeatingPushNotificationService = new RepeatingPushNotificationService(); 