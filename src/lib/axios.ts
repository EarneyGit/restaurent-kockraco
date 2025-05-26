'use client';

import axios from 'axios';
import { BaseUrl } from './config';

const BASE_URL = `${BaseUrl}/api`;

// Define types for config objects
interface ConfigType {
  headers?: Record<string, string>;
  [key: string]: any;
}

// Helper function to get auth header
function getAuthHeader() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// Helper to handle auth errors
async function handleAuthError(error: any) {
  if (typeof window !== 'undefined' && error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

const api = {
  get: async (url: string, config: ConfigType = {}) => {
    try {
      return await axios.get(`${BASE_URL}${url}`, {
        ...config,
        headers: {
          ...getAuthHeader(),
          ...(config.headers || {}),
        },
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
  post: async (url: string, data = {}, config: ConfigType = {}) => {
    try {
      // Initialize headers based on data type
      const headers = {
        ...getAuthHeader(),
        ...(config.headers || {}),
      };

      // Only add Content-Type for non-FormData
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      return await axios.post(`${BASE_URL}${url}`, data, {
        ...config,
        headers,
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
  put: async (url: string, data = {}, config: ConfigType = {}) => {
    try {
      return await axios.put(`${BASE_URL}${url}`, data, {
        ...config,
        headers: {
          ...getAuthHeader(),
          ...(config.headers || {}),
        },
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
  patch: async (url: string, data = {}, config: ConfigType = {}) => {
    try {
      return await (axios as any).patch(`${BASE_URL}${url}`, data, {
        ...config,
        headers: {
          ...getAuthHeader(),
          ...(config.headers || {}),
        },
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
  delete: async (url: string, config: ConfigType = {}) => {
    try {
      return await axios.delete(`${BASE_URL}${url}`, {
        ...config,
        headers: {
          ...getAuthHeader(),
          ...(config.headers || {}),
        },
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
};

export default api; 