"use client"

import { useState } from "react"
import Link from "next/link"
import PageLayout from "@/components/layout/page-layout"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { Eye } from "lucide-react"

export default function PaymentsPage() {
  const [allowCashPayments, setAllowCashPayments] = useState(true)
  const [disableDeliveryCash, setDisableDeliveryCash] = useState(false)
  const [disableTableCash, setDisableTableCash] = useState(false)

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Payments</h1>
          <p className="text-gray-600 mb-6">
            Enable and manage your payment processing settings to start accepting credit and debit card payments
            through your app.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credit/Debit Card Rates */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Credit / Debit Card Rates</h2>
                <div className="flex gap-2">
                  <Image src="/visa.png" alt="Visa" width={40} height={25} />
                  <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
                  <Image src="/amex.png" alt="American Express" width={40} height={25} />
                  <Image src="/apple-pay.png" alt="Apple Pay" width={40} height={25} />
                  <Image src="/google-pay.png" alt="Google Pay" width={40} height={25} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-semibold">2%</p>
                  <p className="text-sm text-gray-500">(2.40% Inc. VAT @ 20%)</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">0p</p>
                  <p className="text-sm text-gray-500">(0p Inc. VAT @ 20%)</p>
                </div>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/settings/payments/payouts" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">Payouts</h3>
                <p className="text-sm text-gray-500">View and manage your payouts</p>
              </Link>

              <Link href="/settings/payments/refunds" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">Refunds</h3>
                <p className="text-sm text-gray-500">View and manage your order refunds</p>
              </Link>

              <Link href="/settings/payments/account" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">Account Profile</h3>
                <p className="text-sm text-gray-500">View and update your account profile</p>
              </Link>

              <Link href="/settings/payments/vat" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">VAT Report</h3>
                <p className="text-sm text-gray-500">Download a VAT report</p>
              </Link>

              <Link href="/settings/payments/cash-transactions" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow col-span-2">
                <h3 className="font-medium mb-2">Cash Transaction Fee Report</h3>
                <p className="text-sm text-gray-500">Download cash transaction fees report</p>
              </Link>
            </div>
          </div>

          {/* Cash Payment Settings */}
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Allow Cash Payments</h3>
                  <p className="text-sm text-gray-500">Enable or disable cash payments for all orders</p>
                </div>
                <Switch 
                  checked={allowCashPayments} 
                  onCheckedChange={setAllowCashPayments}
                />
              </div>

              {allowCashPayments && (
                <>
                  <div className="flex items-center justify-between pl-4 border-l-2 border-gray-200">
                    <div>
                      <h3 className="font-medium">Disable Cash Payments for Delivery Orders</h3>
                      <p className="text-sm text-gray-500">Prevent customers from paying cash for delivery orders</p>
                    </div>
                    <Switch 
                      checked={disableDeliveryCash} 
                      onCheckedChange={setDisableDeliveryCash}
                    />
                  </div>

                  <div className="flex items-center justify-between pl-4 border-l-2 border-gray-200">
                    <div>
                      <h3 className="font-medium">Disable Cash Payments for Table Orders</h3>
                      <p className="text-sm text-gray-500">Prevent customers from paying cash for table orders</p>
                    </div>
                    <Switch 
                      checked={disableTableCash} 
                      onCheckedChange={setDisableTableCash}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 