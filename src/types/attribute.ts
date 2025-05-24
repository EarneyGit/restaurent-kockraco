export interface Attribute {
  _id?: string
  id?: string
  name: string
  displayOrder: number
  type: 'single' | 'multiple' | 'multiple-times'
  requiresSelection: boolean
  availableDays: string[]
  branchId?: string
  isActive: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface AttributeFormData {
  name: string
  displayOrder: number
  type: 'single' | 'multiple' | 'multiple-times'
  requiresSelection: boolean
  availableDays: string[]
  description?: string
}

export interface AttributeApiResponse {
  success: boolean
  data: Attribute | Attribute[]
  count?: number
  message?: string
}

export const DAYS_OF_WEEK = [
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday', 
  'Sunday'
] as const

export type DayOfWeek = typeof DAYS_OF_WEEK[number] 