export interface SaleData {
  id: string
  customer: string
  value: number
  discount: number
  tip: number
  postcode: string
  pay: 'Card' | 'Cash'
  type: 'Delivery' | 'Collection'
  created: string
  platform: string
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