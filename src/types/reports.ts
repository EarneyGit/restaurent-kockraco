export interface DiscountObject {
  discountAmount: number
  discountType: "percentage" | "fixed"
  discountValue: number
}

export interface SaleData {
  id: string
  customerName: string
  customerEmail: string
  email: string
  total: number
  discount: number | DiscountObject // can be a number (like 0) or an object
  postcode: string
  paymentMethod: string
  paymentStatus: string
  orderType: string
  deliveryAddress: string
  created: string
  status: string
  orderNumber: string
  branchId: string
  branchName: string
}

export interface DiscountHistoryItem {
  id: string
  customer: string
  discount: string
  value: number
  date: string
}

export type DiscountType = 'all' | 'first-order' | 'loyalty' | 'limited-time' | 'free-wrap'

export interface TableColumn<T> {
  header: string
  accessorKey: keyof T
  cell?: (info: { getValue: () => any }) => React.ReactNode
}

export interface ItemSaleData {
  id: string
  name: string
  quantity: number
  created: string
} 