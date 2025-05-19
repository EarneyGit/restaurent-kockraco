export interface MenuItem {
  id: string
  name: string
  price: number
  hideItem: boolean
  delivery: boolean
  collection: boolean
  dineIn: boolean
  description?: string
  weight?: number
  calorificValue?: string
  calorieDetails?: string
  images?: string[]
  availability?: {
    monday?: DayAvailability
    tuesday?: DayAvailability
    wednesday?: DayAvailability
    thursday?: DayAvailability
    friday?: DayAvailability
    saturday?: DayAvailability
    sunday?: DayAvailability
  }
  allergens?: {
    contains: string[]
    mayContain: string[]
  }
  priceChanges?: PriceChange[]
}

export interface DayAvailability {
  isAvailable: boolean
  type: 'All Day' | 'Specific Times' | 'Not Available'
  times?: TimeSlot[]
}

export interface TimeSlot {
  start: string // 24-hour format, e.g., "09:00"
  end: string // 24-hour format, e.g., "17:00"
}

export interface Category {
  id: string
  name: string
  displayOrder: number
  hidden: boolean
  imageUrl?: string
  availability: {
    [key: string]: 'All Day' | 'Specific Times' | 'Not Available'
  }
  printers: string[]
  items: MenuItem[]
}

export interface Allergen {
  id: string
  name: string
  icon?: string
}

export interface PriceChange {
  id: string
  name: string
  type: 'increase' | 'decrease' | 'fixed'
  value: number
  startDate: string
  endDate: string
  daysOfWeek: string[]
  timeStart?: string
  timeEnd?: string
  active: boolean
} 