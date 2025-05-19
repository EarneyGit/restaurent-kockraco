"use client"

import { useState } from 'react'
import PageLayout from "@/components/layout/page-layout"
import DiscountModal from "@/components/marketing/discount-modal"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Discount {
  id?: number
  name: string
  code: string
  allowMultipleCoupons: boolean
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minSpend: number
  maxSpend: number
  outlets: {
    dunfermline: boolean // "Admin user" outlet
    edinburgh: boolean
    glasgow: boolean
  }
  timeDependent: boolean
  startDate: Date | null
  endDate: Date | null
  maxUses: {
    total: number
    perCustomer: number
    perDay: number
  }
  daysAvailable: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  serviceTypes: {
    collection: boolean
    delivery: boolean
    tableOrdering: boolean
  }
  firstOrderOnly: boolean
}

export default function DiscountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | undefined>()
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: 1,
      name: 'First Order Discount',
      code: '20off',
      allowMultipleCoupons: false,
      discountType: 'percentage',
      discountValue: 20,
      minSpend: 15,
      maxSpend: 0,
      outlets: {
        dunfermline: true,
        edinburgh: true,
        glasgow: true,
      },
      timeDependent: true,
      startDate: new Date('2024-08-07'),
      endDate: new Date('2026-07-13'),
      maxUses: {
        total: 0,
        perCustomer: 1,
        perDay: 0,
      },
      daysAvailable: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      serviceTypes: {
        collection: true,
        delivery: true,
        tableOrdering: true,
      },
      firstOrderOnly: true,
    },
    {
      id: 2,
      name: 'Loyalty Points',
      code: '{dynamicallygenerated}',
      allowMultipleCoupons: true,
      discountType: 'fixed',
      discountValue: 5,
      minSpend: 0.01,
      maxSpend: 0,
      outlets: {
        dunfermline: true,
        edinburgh: true,
        glasgow: true,
      },
      timeDependent: true,
      startDate: new Date('2024-08-07'),
      endDate: null,
      maxUses: {
        total: 0,
        perCustomer: 0,
        perDay: 0,
      },
      daysAvailable: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      serviceTypes: {
        collection: true,
        delivery: true,
        tableOrdering: true,
      },
      firstOrderOnly: false,
    },
  ])

  const handleAddDiscount = () => {
    setSelectedDiscount(undefined)
    setIsModalOpen(true)
  }

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount)
    setIsModalOpen(true)
  }

  const handleDeleteDiscount = (id: number) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      setDiscounts(discounts.filter((discount) => discount.id !== id))
    }
  }

  const handleSaveDiscount = (discount: Discount) => {
    if (discount.id) {
      setDiscounts(discounts.map((d) => (d.id === discount.id ? discount : d)))
    } else {
      setDiscounts([...discounts, { ...discount, id: Date.now() }])
    }
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">Discounts</h1>
          <Button
            onClick={handleAddDiscount}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Add Discount
          </Button>
        </div>
        
        {/* Discounts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Min Spend</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="border-b">
                  <td className="px-6 py-4">{discount.name}</td>
                  <td className="px-6 py-4">{discount.code}</td>
                  <td className="px-6 py-4">
                    {discount.discountType === 'percentage'
                      ? `${discount.discountValue}%`
                      : `£${discount.discountValue.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4">
                    {discount.startDate ? format(discount.startDate, 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {discount.endDate ? format(discount.endDate, 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    £{discount.minSpend.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleEditDiscount(discount)}
                        className="text-emerald-500 hover:text-emerald-700"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteDiscount(discount.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No discounts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DiscountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          discount={selectedDiscount}
          onSave={handleSaveDiscount}
        />
      </div>
    </PageLayout>
  )
} 