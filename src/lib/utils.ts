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
