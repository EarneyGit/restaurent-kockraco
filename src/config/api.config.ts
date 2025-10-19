export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const ORDER_ENDPOINTS = {
  CUSTOMER_ORDERS: (customerId: string) => `${API_BASE_URL}/api/orders/customer/${customerId}`
};
