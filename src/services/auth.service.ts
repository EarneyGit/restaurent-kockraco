import axios from '@/lib/axios';

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(email: string, password: string) {
    const response = await axios.post(`/auth/login`, {
      email,
      password
    });
    return response.data;
  }

  async logout() {
    const response = await axios.get(
      `/auth/logout`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async verifyToken() {
    try {
      const response = await axios.get(
        `/auth/verify-token`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      // Handle token verification errors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw error;
    }
  }

  async getMe() {
    const response = await axios.get(
      `/auth/me`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async sendOtp(email: string) {
    const response = await axios.post(`/auth/send-otp`, { email });
    return response.data;
  }

  async verifyOtp(email: string, otp: string) {
    const response = await axios.post(`/auth/verify-otp`, { email, otp });
    return response.data;
  }

  async register(userData: any) {
    const response = await axios.post(`/auth/register`, userData);
    return response.data;
  }

  async forgotPasswordOtp(email: string) {
    const response = await axios.post(`/auth/forgot-password-otp`, { email });
    return response.data;
  }

  async resetPassword(email: string, otp: string, password: string) {
    const response = await axios.post(`/auth/reset-password`, {
      email,
      otp,
      password
    });
    return response.data;
  }
}

export const authService = new AuthService(); 