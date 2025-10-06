"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
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
  BuildingIcon,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  ChevronFirst,
  ChevronsLeft,
  ChevronsRight,
  Hamburger,
} from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";

function Sidebar() {
  const pathname = usePathname() || "";
  const { user } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  // Responsive state management
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size and auto-shrink on mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);

      // Auto-collapse on mobile/tablet
      if (mobile || tablet) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [expandedMenus, setExpandedMenus] = useState({
    orders: false,
    menus: false,
    marketing: false,
    settings: false,
    help: false,
    branches: false,
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
      [menu]: !expandedMenus[menu],
    });
  };

  // Check if user is superadmin
  const isSuperAdmin =
    user?.role === "superadmin" || user?.roleDetails?.slug === "superadmin";

  return (
    <div
      className={`flex flex-col h-full bg-[#121831] text-white transition-all duration-300 ${
        isCollapsed ? "fixed w-16" : "w-64"
      }`}
    >
      {/* Logo Header */}
      <div className="py-4 px-4 border-b border-blue-900 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
            <Hamburger size={18} className="text-yellow-800" />
          </div>
          {!isCollapsed && (
            <p className="text-lg font-semibold uppercase text-white flex flex-col">
              Rasoie
              {/* <sp>Indian Restaurant</sp> */}
            </p>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-0.5 hover:bg-blue-200 hover:bg-opacity-30 rounded transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-5 w-5 ml-2.5 text-yellow-700" />
          ) : (
            <ChevronsLeft className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname === "/"
                ? "bg-blue-900 bg-opacity-30"
                : "hover:bg-blue-900 hover:bg-opacity-20"
            }`}
            title={isCollapsed ? "Dashboard" : ""}
          >
            <LayoutDashboard
              className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`}
            />
            {!isCollapsed && "Dashboard"}
          </Link>

          {/* Orders */}
          <div>
            <button
              onClick={() => toggleMenu("orders")}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
              title={isCollapsed ? "Orders" : ""}
            >
              <Bell className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && (
                <>
                  Orders
                  <ChevronDown
                    className={`ml-auto h-5 w-5 transition-transform ${
                      expandedMenus.orders ? "transform rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {expandedMenus.orders && !isCollapsed && (
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
              onClick={() => toggleMenu("menus")}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
              title={isCollapsed ? "Menus" : ""}
            >
              <ClipboardList
                className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`}
              />
              {!isCollapsed && (
                <>
                  Menus
                  <ChevronDown
                    className={`ml-auto h-5 w-5 transition-transform ${
                      expandedMenus.menus ? "transform rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {expandedMenus.menus && !isCollapsed && (
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
              pathname === "/reports"
                ? "bg-blue-900 bg-opacity-30"
                : "hover:bg-blue-900 hover:bg-opacity-20"
            }`}
            title={isCollapsed ? "Reports" : ""}
          >
            <BarChart className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && "Reports"}
          </Link>

          {/* Branch Management - Only for SuperAdmin */}
          {isSuperAdmin && (
            <div>
              <button
                onClick={() => toggleMenu("branches")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith("/branches")
                    ? "bg-blue-900 bg-opacity-30"
                    : "hover:bg-blue-900 hover:bg-opacity-20"
                }`}
                title={isCollapsed ? "Branch Management" : ""}
              >
                <BuildingIcon
                  className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`}
                />
                {!isCollapsed && (
                  <>
                    Branch Management
                    <ChevronDown
                      className={`ml-auto h-5 w-5 transition-transform ${
                        expandedMenus.branches ? "transform rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {expandedMenus.branches && !isCollapsed && (
                <div className="pl-10 space-y-1 mt-1">
                  <Link
                    href="/branches"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/branches"
                        ? "bg-blue-900 bg-opacity-30"
                        : "hover:bg-blue-900 hover:bg-opacity-20"
                    }`}
                  >
                    All Branches
                  </Link>
                  <Link
                    href="/branches/settings"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/branches/settings"
                        ? "bg-blue-900 bg-opacity-30"
                        : "hover:bg-blue-900 hover:bg-opacity-20"
                    }`}
                  >
                    Branch Settings
                  </Link>
                  <Link
                    href="/branches/analytics"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/branches/analytics"
                        ? "bg-blue-900 bg-opacity-30"
                        : "hover:bg-blue-900 hover:bg-opacity-20"
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
              onClick={() => toggleMenu("marketing")}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
              title={isCollapsed ? "Marketing" : ""}
            >
              <MessageSquare
                className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`}
              />
              {!isCollapsed && (
                <>
                  Marketing
                  <ChevronDown
                    className={`ml-auto h-5 w-5 transition-transform ${
                      expandedMenus.marketing ? "transform rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {expandedMenus.marketing && !isCollapsed && (
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
              onClick={() => toggleMenu("settings")}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
              title={isCollapsed ? "Settings" : ""}
            >
              <Settings className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && (
                <>
                  Settings
                  <ChevronDown
                    className={`ml-auto h-5 w-5 transition-transform ${
                      expandedMenus.settings ? "transform rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {expandedMenus.settings && !isCollapsed && (
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
              onClick={() => toggleMenu("help")}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-900 hover:bg-opacity-20"
              title={isCollapsed ? "Help" : ""}
            >
              <HelpCircle className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && (
                <>
                  Help
                  <ChevronDown
                    className={`ml-auto h-5 w-5 transition-transform ${
                      expandedMenus.help ? "transform rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {expandedMenus.help && !isCollapsed && (
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
  );
}

export default Sidebar;
