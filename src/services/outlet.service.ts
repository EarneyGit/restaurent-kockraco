import { BaseUrl } from '@/lib/config';

const API_BASE_URL = `${BaseUrl}/api`;

export interface OutletAddress {
  street: string
  addressLine2?: string
  city: string
  county?: string
  state: string
  postcode: string
  country: string
}

export interface OutletOrderingOptions {
  collection: {
    displayFormat: 'TimeOnly' | 'DateAndTime'
    timeslotLength: number
  }
  delivery: {
    displayFormat: 'TimeOnly' | 'DateAndTime'
    timeslotLength: number
  }
}

export interface OutletPreOrdering {
  allowCollectionPreOrders: boolean
  allowDeliveryPreOrders: boolean
}

export interface OutletSettings {
  id: string
  name: string
  aboutUs: string
  email: string
  contactNumber: string
  telephone?: string
  address: OutletAddress
  openingTimes: Record<string, string[]>
  orderingOptions: OutletOrderingOptions
  preOrdering: OutletPreOrdering
}

export interface OutletDetailsUpdate {
  name?: string
  aboutUs?: string
  email?: string
  contactNumber?: string
  telephone?: string
}

export interface OutletLocationUpdate {
  street?: string
  addressLine2?: string
  city?: string
  county?: string
  state?: string
  postcode?: string
  country?: string
}

class OutletService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get outlet settings
  async getOutletSettings(): Promise<{ success: boolean; data: OutletSettings }> {
    const response = await fetch(`${API_BASE_URL}/branches/outlet-settings`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch outlet settings');
    }

    return response.json();
  }

  // Update outlet details
  async updateOutletDetails(details: OutletDetailsUpdate): Promise<{ success: boolean; data: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/branches/outlet-details`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update outlet details');
    }

    return response.json();
  }

  // Update outlet location
  async updateOutletLocation(location: OutletLocationUpdate): Promise<{ success: boolean; data: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/branches/outlet-location`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update outlet location');
    }

    return response.json();
  }

  // Update outlet ordering options
  async updateOutletOrderingOptions(options: OutletOrderingOptions): Promise<{ success: boolean; data: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/branches/outlet-ordering-options`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update outlet ordering options');
    }

    return response.json();
  }

  // Update outlet pre-ordering settings
  async updateOutletPreOrdering(preOrdering: OutletPreOrdering): Promise<{ success: boolean; data: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/branches/outlet-pre-ordering`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(preOrdering),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update outlet pre-ordering settings');
    }

    return response.json();
  }

  // Helper methods
  formatOpeningTimes(openingTimes: Record<string, string[]>): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days.map(day => {
      const times = openingTimes[day] || []
      if (times.length === 0) return `${day}: Closed`
      return `${day}: ${times.join(', ')}`
    }).join('\n')
  }

  parseOpeningTimes(text: string): Record<string, string[]> {
    const lines = text.split('\n').filter(line => line.trim())
    const openingTimes: Record<string, string[]> = {}
    
    lines.forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match) {
        const [, day, timesStr] = match
        if (timesStr.toLowerCase() === 'closed') {
          openingTimes[day] = []
        } else {
          openingTimes[day] = timesStr.split(',').map(time => time.trim())
        }
      }
    })
    
    return openingTimes
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  validatePostcode(postcode: string): boolean {
    // UK postcode validation
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i
    return postcodeRegex.test(postcode)
  }

  getDisplayFormatOptions() {
    return [
      { value: 'TimeOnly', label: 'Time Only' },
      { value: 'DateAndTime', label: 'Date and Time' }
    ]
  }

  getTimeslotLengthOptions() {
    return [
      { value: 15, label: '15 minutes' },
      { value: 30, label: '30 minutes' },
      { value: 45, label: '45 minutes' },
      { value: 60, label: '1 hour' }
    ]
  }
}

export const outletService = new OutletService() 