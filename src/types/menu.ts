export interface MenuItem {
  id: string
  name: string
  price: number
  type?: 'item' | 'group'
  hideItem: boolean
  delivery: boolean
  collection: boolean
  dineIn: boolean
  description?: string
  weight?: number
  calorificValue?: string
  calorieDetails?: string
  images?: (string | File | Blob)[]
  category?: string
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
  selectedItems?: string[]
  itemSettings?: {
    showSelectedOnly: boolean
    showSelectedCategories: boolean
    limitSingleChoice: boolean
    addAttributeCharges: boolean
    useProductPrices: boolean
    showChoiceAsDropdown: boolean
  }
  tillProviderProductId?: string
  cssClass?: string
  freeDelivery?: boolean
  collectionOnly?: boolean
  deleted?: boolean
  hidePrice?: boolean
  allowAddWithoutChoices?: boolean
  isGroupItem?: boolean
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
  description?: string
  displayOrder: number
  hidden: boolean
  imageUrl?: string
  includeAttributes?: boolean
  includeDiscounts?: boolean
  availability: {
    [key: string]: CategoryDayAvailability
  }
  printers: string[]
  branch?: {
    _id: string
    name: string
    address: any
  }
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

export interface CategoryDayAvailability {
  type: 'All Day' | 'Specific Times' | 'Not Available'
  startTime: string | null
  endTime: string | null
} 