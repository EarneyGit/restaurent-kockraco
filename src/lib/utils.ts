import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Redirects the user to their store URL defined in environment variables
 */
export function viewYourStore() {
  const storeUrl =
    process.env.NEXT_PUBLIC_STORE_BASE_URL || "http://localhost:8080";
  window.open(storeUrl, "_blank");
}

// Helper function to get today's date in YYYY-MM-DD format using local timezone
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const getOrderCustomerDetails = (order: any) => {
  if (order.isGuestOrder) {
    return {
      firstName: order.orderCustomerDetails?.firstName,
      lastName: order.orderCustomerDetails?.lastName,
      email: order.orderCustomerDetails?.email,
      phone: order.orderCustomerDetails?.phone,
      address: order.orderCustomerDetails?.address,
      latitude: order.orderCustomerDetails?.latitude,
      longitude: order.orderCustomerDetails?.longitude,
    };
  }
  return order.user;
};

export const transformOrder = (order: any) => {
  if (order.isGuestOrder) {
    order.customerName =
      (
        order.orderCustomerDetails?.firstName +
        " " +
        order.orderCustomerDetails?.lastName
      ).trim() ||
      order.orderCustomerDetails?.email ||
      "Customer";
    order.customerEmail = order.orderCustomerDetails?.email;
    order.customerPhone = order.orderCustomerDetails?.phone;
  } else {
    order.customerName =
      (order?.user?.firstName + " " + order?.user?.lastName).trim() ||
      order?.user?.email ||
      "Customer";
    order.customerEmail = order?.user?.email || "";
    order.customerPhone = order?.user?.phone || "";
  }
  return order;
};

export const isEmpty = (value: any) => {
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }
  if (Number.isNaN(value) || value === null || value === undefined) {
    return true;
  }
  return false;
};
