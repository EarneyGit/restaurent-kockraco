import { BaseUrl } from '@/lib/config';

const API_BASE_URL = `${BaseUrl}/api`;

export interface DaySettings {
  isCollectionAllowed: boolean;
  isDeliveryAllowed: boolean;
  isTableOrderingAllowed: boolean;
  defaultTimes: {
    start: string;
    end: string;
  };
  breakTime: {
    enabled: boolean;
    start: string;
    end: string;
  };
  collection: {
    leadTime: number;
    displayedTime: string;
  };
  delivery: {
    useDifferentTimes: boolean;
    leadTime: number;
    displayedTime: string;
    customTimes: {
      start: string;
      end: string;
    };
  };
  tableOrdering: {
    useDifferentTimes: boolean;
    leadTime: number;
    displayedTime: string;
    customTimes: {
      start: string;
      end: string;
    };
  };
}

export interface WeeklySchedule {
  monday: DaySettings;
  tuesday: DaySettings;
  wednesday: DaySettings;
  thursday: DaySettings;
  friday: DaySettings;
  saturday: DaySettings;
  sunday: DaySettings;
}

export interface ClosedDate {
  _id?: string;
  date: string;
  type: 'single' | 'range';
  endDate?: string;
  reason: string;
}

export interface RestrictionDaySettings {
  enabled: boolean;
  orderTotal: number;
  windowSize: number;
}

export interface OrderingRestrictions {
  type: 'None' | 'Combined Total' | 'Split Total';
  combined: {
    sunday: RestrictionDaySettings;
    monday: RestrictionDaySettings;
    tuesday: RestrictionDaySettings;
    wednesday: RestrictionDaySettings;
    thursday: RestrictionDaySettings;
    friday: RestrictionDaySettings;
    saturday: RestrictionDaySettings;
  };
  collection: {
    sunday: RestrictionDaySettings;
    monday: RestrictionDaySettings;
    tuesday: RestrictionDaySettings;
    wednesday: RestrictionDaySettings;
    thursday: RestrictionDaySettings;
    friday: RestrictionDaySettings;
    saturday: RestrictionDaySettings;
  };
  delivery: {
    sunday: RestrictionDaySettings;
    monday: RestrictionDaySettings;
    tuesday: RestrictionDaySettings;
    wednesday: RestrictionDaySettings;
    thursday: RestrictionDaySettings;
    friday: RestrictionDaySettings;
    saturday: RestrictionDaySettings;
  };
}

export interface OrderingRestrictionsWeeklyType {
  monday?: RestrictionDaySettings;
  tuesday?: RestrictionDaySettings;
  wednesday?: RestrictionDaySettings;
  thursday?: RestrictionDaySettings;
  friday?: RestrictionDaySettings;
  saturday?: RestrictionDaySettings;
  sunday?: RestrictionDaySettings;
}

export interface OrderingTimes {
  _id: string;
  branchId: string;
  weeklySchedule: WeeklySchedule;
  closedDates: ClosedDate[];
  restrictions: OrderingRestrictionsWeeklyType;
  createdAt: string;
  updatedAt: string;
}

export interface OrderingTimesResponse {
  success: boolean;
  data: OrderingTimes;
}

export interface AvailabilityCheck {
  success: boolean;
  data: {
    isAvailable: boolean;
    reason?: string;
    nextAvailableTime?: string;
    orderType: 'collection' | 'delivery' | 'tableOrdering';
  };
}

class OrderingTimesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get ordering times
  async getOrderingTimes(): Promise<OrderingTimesResponse> {
    const response = await fetch(`${API_BASE_URL}/ordering-times`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch ordering times');
    }

    return response.json();
  }

  // Update weekly schedule
  async updateWeeklySchedule(weeklySchedule: WeeklySchedule): Promise<{ success: boolean; data: OrderingTimes; message: string }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/weekly-schedule`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ weeklySchedule }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update weekly schedule');
    }

    return response.json();
  }

  // Update specific day schedule
  async updateDaySchedule(dayName: string, daySettings: DaySettings): Promise<{ success: boolean; data: OrderingTimes; message: string }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/day/${dayName}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(daySettings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update day schedule');
    }

    return response.json();
  }

  // Get closed dates
  async getClosedDates(): Promise<{ success: boolean; data: ClosedDate[] }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/closed-dates`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch closed dates');
    }

    return response.json();
  }

  // Add closed date
  async addClosedDate(closedDate: Omit<ClosedDate, '_id'>): Promise<{ success: boolean; data: ClosedDate; message: string }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/closed-dates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(closedDate),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add closed date');
    }

    return response.json();
  }

  // Remove closed date
  async removeClosedDate(closedDateId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/closed-dates/${closedDateId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove closed date');
    }

    return response.json();
  }

  // Remove all closed dates
  async removeAllClosedDates(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/closed-dates`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove all closed dates');
    }

    return response.json();
  }

  // Get restrictions
  async getRestrictions(): Promise<{ success: boolean; data: OrderingRestrictions }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/restrictions`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch restrictions');
    }

    return response.json();
  }

  // Update restrictions
  async updateRestrictions(restrictions: OrderingRestrictions): Promise<{ success: boolean; data: OrderingRestrictions; message: string }> {
    const response = await fetch(`${API_BASE_URL}/ordering-times/restrictions`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ restrictions }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update restrictions');
    }

    return response.json();
  }

  // Check availability (public endpoint)
  async checkAvailability(
    branchId: string,
    orderType: 'collection' | 'delivery' | 'tableOrdering',
    requestedTime?: string
  ): Promise<AvailabilityCheck> {
    const params = new URLSearchParams({
      branchId,
      orderType,
    });

    if (requestedTime) {
      params.append('requestedTime', requestedTime);
    }

    const response = await fetch(`${API_BASE_URL}/ordering-times/check-availability?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check availability');
    }

    return response.json();
  }

  // Helper methods
  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  formatTimeRange(start: string, end: string): string {
    if (!start || !end) return '';
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  validateTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  isTimeAfter(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h1 > h2 || (h1 === h2 && m1 > m2);
  }

  calculateDisplayedTime(startTime: string, leadTime: number): string {
    if (!startTime || !this.validateTimeFormat(startTime)) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + leadTime;
    
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }

  getDayName(dayIndex: number): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  }

  getDayDisplayName(dayName: string): string {
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }

  getDefaultDaySettings(): DaySettings {
    return {
      isCollectionAllowed: false,
      isDeliveryAllowed: false,
      isTableOrderingAllowed: false,
      defaultTimes: {
        start: "11:45",
        end: "21:50"
      },
      breakTime: {
        enabled: false,
        start: "15:00",
        end: "16:00"
      },
      collection: {
        leadTime: 20,
        displayedTime: "12:10"
      },
      delivery: {
        useDifferentTimes: false,
        leadTime: 45,
        displayedTime: "12:30",
        customTimes: {
          start: "11:45",
          end: "21:50"
        }
      },
      tableOrdering: {
        useDifferentTimes: false,
        leadTime: 0,
        displayedTime: "",
        customTimes: {
          start: "11:45",
          end: "21:50"
        }
      }
    };
  }

  getDefaultRestrictionSettings(): RestrictionDaySettings {
    return {
      enabled: false,
      orderTotal: 0,
      windowSize: 5
    };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export const orderingTimesService = new OrderingTimesService(); 