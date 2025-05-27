"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from '@/contexts/auth-context'
import { 
  LayoutDashboard, 
  ShoppingCart,
  ClipboardList,
  Settings,
  BarChart,
  Bell,
  MessageSquare,
  Users,
  Percent,
  Gift,
  HelpCircle,
  ChevronDown,
  FileText,
  CircleDollarSign,
  Utensils,
  Clock,
  BuildingIcon
} from "lucide-react"

function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  
  const [expandedMenus, setExpandedMenus] = useState({
    orders: false,
    menus: false,
    marketing: false,
    settings: false,
    help: false,
    branches: false
  });

  type MenuKey = keyof typeof expandedMenus;

  const toggleMenu = (menu: MenuKey) => {
    // Close all menus first, then toggle the clicked menu
    const allClosed = Object.keys(expandedMenus).reduce((acc, key) => {
      acc[key as MenuKey] = false;
      return acc;
    }, {} as Record<MenuKey, boolean>);
    
    // If the menu is already open, just close it (like a toggle)
    // If it's closed, open it while keeping others closed
    setExpandedMenus({
      ...allClosed,
      [menu]: !expandedMenus[menu]
    });
  };

  // Check if user is superadmin
  const isSuperAdmin = user?.role === 'superadmin' || user?.roleDetails?.slug === 'superadmin'

  return (
    <div className="flex flex-col h-full bg-[#121831] text-white">
      {/* Logo Header */}
      <div className="py-4 px-4 border-b border-blue-900 flex justify-start items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">Restroman UK</span>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname === "/" ? "bg-blue-900 bg-opacity-30" : "hover:bg-blue-900 hover:bg-opacity-20"
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          {/* Orders */}
          <div>
            <button
              onClick={() => toggleMenu('orders')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
            >
              <Bell className="mr-3 h-5 w-5" />
              Orders
              <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandedMenus.orders ? 'transform rotate-180' : ''}`} />
            </button>

            {expandedMenus.orders && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/orders/live"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Live Orders
                </Link>
              </div>
            )}
          </div>

          {/* Menus */}
          <div>
            <button
              onClick={() => toggleMenu('menus')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Menus
              <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandedMenus.menus ? 'transform rotate-180' : ''}`} />
            </button>

            {expandedMenus.menus && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/menus/menu-setup"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Menu Setup
                </Link>
                <Link
                  href="/menus/stock-control"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Stock Control
                </Link>
                <Link
                  href="/menus/price-changes"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Price Changes
                </Link>
              </div>
            )}
        </div>

          {/* Reports */}
            <Link
            href="/reports"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname === "/reports" ? "bg-blue-900 bg-opacity-30" : "hover:bg-blue-900 hover:bg-opacity-20"
            }`}
            >
            <BarChart className="mr-3 h-5 w-5" />
            Reports
            </Link>

          {/* Branch Management - Only for SuperAdmin */}
          {isSuperAdmin && (
            <div>
              <button
                onClick={() => toggleMenu('branches')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith('/branches') ? "bg-blue-900 bg-opacity-30" : "hover:bg-blue-900 hover:bg-opacity-20"
                }`}
              >
                <BuildingIcon className="mr-3 h-5 w-5" />
                Branch Management
                <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandedMenus.branches ? 'transform rotate-180' : ''}`} />
              </button>

              {expandedMenus.branches && (
                <div className="pl-10 space-y-1 mt-1">
                  <Link
                    href="/branches"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/branches" ? "bg-blue-900 bg-opacity-30" : "hover:bg-blue-900 hover:bg-opacity-20"
                    }`}
                  >
                    All Branches
                  </Link>
                  <Link
                    href="/branches/settings"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/branches/settings" ? "bg-blue-900 bg-opacity-30" : "hover:bg-blue-900 hover:bg-opacity-20"
                    }`}
                  >
                    Branch Settings
                  </Link>
                  <Link
                    href="/branches/analytics"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/branches/analytics" ? "bg-blue-900 bg-opacity-30" : "hover:bg-blue-900 hover:bg-opacity-20"
                    }`}
                  >
                    Branch Analytics
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Marketing */}
          <div>
            <button
              onClick={() => toggleMenu('marketing')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Marketing
              <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandedMenus.marketing ? 'transform rotate-180' : ''}`} />
            </button>

            {expandedMenus.marketing && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/marketing/one-off-push"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  One-off Push Msgs
                </Link>
                <Link
                  href="/marketing/repeating-push"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Repeating Push Msgs
                </Link>
                <Link
                  href="/marketing/sms-email"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  SMS/Email Msgs
                </Link>
                <Link
                  href="/marketing/customers"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Customers
                </Link>
                <Link
                  href="/marketing/business-offers"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
            >
                  Business Offers
                </Link>
                <Link
                  href="/marketing/discounts"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Discounts
                </Link>
              </div>
            )}
        </div>

          {/* Settings */}
          <div>
            <button
              onClick={() => toggleMenu('settings')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
              <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandedMenus.settings ? 'transform rotate-180' : ''}`} />
            </button>

            {expandedMenus.settings && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/settings/outlets"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Outlets
                </Link>
                <Link
                  href="/settings/ordering-times"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Ordering Times
                </Link>
                <Link
                  href="/settings/delivery-charges"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Delivery Charges
                </Link>
                <Link
                  href="/settings/service-charges"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Service Charges
                </Link>
                <Link
                  href="/settings/payments"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Payments
                </Link>
                <Link
                  href="/settings/table-ordering"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Table Ordering
                </Link>
              </div>
            )}
          </div>

          {/* Help */}
          <div>
            <button
              onClick={() => toggleMenu('help')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Help
              <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${expandedMenus.help ? 'transform rotate-180' : ''}`} />
            </button>

            {expandedMenus.help && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/help/videos"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
                >
                  Help Videos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 