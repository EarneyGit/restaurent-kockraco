"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, ChevronLeft, Mail, Phone } from "lucide-react";
import { BaseUrl } from "@/lib/config";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
}

interface BranchInfo {
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  _id: string;
  name: string;
  id: string;
}

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    id: string;
  };
  quantity: number;
  price: number;
  _id: string;
  addons: any[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  id: string;
}

interface Order {
  products: OrderItem[] | undefined;
  _id: string;
  orderNumber: string;
  user?: User;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  totalAmount: number;
  status: "new" | "in-progress" | "complete";
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  branchId: BranchInfo;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt?: string;
}

export default function LiveOrdersPage() {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "new" | "in-progress" | "complete"
  >("new");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);

  // Map UI status to API status
  const getApiStatus = (uiStatus: "new" | "in-progress" | "complete") => {
    switch (uiStatus) {
      case "new":
        return "pending";
      case "in-progress":
        return "processing";
      case "complete":
        return "completed";
      default:
        return "pending";
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Map frontend status to API status
      let apiStatus = "";
      switch (activeTab) {
        case "new":
          apiStatus = "pending";
          break;
        case "in-progress":
          apiStatus = "processing";
          break;
        case "complete":
          apiStatus = "completed";
          break;
        default:
          apiStatus = "pending";
      }

      const response = await api.get(`/orders?status=${apiStatus}`);
      const data = response.data;
      if (data.success) {
        // Map API status back to UI status
        const mappedOrders = data.data.map((order: any) => ({
          ...order,
          status: activeTab, // Use the UI status instead of API status
        }));
        setOrders(mappedOrders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      const data = response.data;
      if (data.success) {
        setSelectedOrder({
          ...data.data,
          status: activeTab, // Maintain consistent status mapping
        });
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (err) {
      toast.error("Error fetching order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    fetchOrderDetails(order._id);
  };

  console.log("orders", orders);
  useEffect(() => {
    fetchOrders();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    return () => clearInterval(interval);
  }, [activeTab]); // Added activeTab as dependency to refetch when tab changes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    logout();
  };

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDetailedDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add a helper function to safely calculate total items
  const calculateTotalItems = (items: OrderItem[] | undefined) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleMenu}
        >
          <div
            className="w-64 h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <Button variant="ghost" onClick={toggleMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate("/orders/today")}
                  >
                    Today's Orders
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate("/orders/search")}
                  >
                    Search orders
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate("/orders/take-offline")}
                  >
                    Take items offline
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate("/orders/settings")}
                  >
                    Restaurant Settings
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate("/orders/lead-times")}
                  >
                    Change lead times
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Left Panel - Orders List */}
      <div className="w-80 border-r bg-white flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-medium">Live Orders</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleNavigate("/")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Order Tabs */}
        <div className="border-b bg-white">
          <div className="flex">
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 flex-1",
                activeTab === "new"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab("new")}
            >
              New
            </button>
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 flex-1",
                activeTab === "in-progress"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab("in-progress")}
            >
              In Progress
            </button>
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 flex-1",
                activeTab === "complete"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab("complete")}
            >
              Complete
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {activeTab === "new" && "No new orders"}
              {activeTab === "in-progress" && "No orders in progress"}
              {activeTab === "complete" && "No completed orders"}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedOrder?._id === order._id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">
                      {order.user?.name || "Guest"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.deliveryMethod || "N/A"}
                    </div>
                    {order.deliveryMethod === "delivery" &&
                      order.deliveryAddress && (
                        <div className="text-sm text-gray-600 mt-1">
                          {[
                            order.deliveryAddress.street,
                            order.deliveryAddress.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "No address provided"}
                        </div>
                      )}
                    <div className="text-sm text-gray-500 mt-1">
                      Branch: {order.branchId?.name || "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      £{(order.totalAmount || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-pink-500">
                      {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Order #{order.orderNumber || "N/A"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Order Details */}
      <div className="flex-1 bg-gray-50">
        <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
          <div className="flex items-center gap-4">
            <span className="font-medium">Order Details</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Admin user</span>
          </div>
        </header>

        {detailsLoading ? (
          <div className="p-6 text-center text-gray-500">
            Loading order details...
          </div>
        ) : selectedOrder ? (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-medium">
                    Order No: {selectedOrder.orderNumber}
                  </h2>
                  <div className="mt-2 text-gray-600">
                    {selectedOrder.deliveryMethod}
                    <br />
                    Status: {selectedOrder.status}
                    <br />
                    Created: {formatDetailedDate(selectedOrder.createdAt)}
                    <br />
                    Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm">
                      {(selectedOrder.user?.name || 'Guest').split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="font-medium">{selectedOrder.user?.name || 'Guest'}</div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.branchId.name}
                  </div>
                </div>
              </div>

              {selectedOrder.deliveryMethod === 'delivery' && selectedOrder.deliveryAddress && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Delivery Address</h3>
                  <p className="text-gray-600">
                    {[
                      selectedOrder.deliveryAddress.street,
                      selectedOrder.deliveryAddress.city,
                      selectedOrder.deliveryAddress.state
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {selectedOrder.user && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedOrder.user.email}
                    </div>
                    {selectedOrder.user.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedOrder.user.phone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-2">Items</th>
                      <th className="pb-2 text-center">Quantity</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.products || selectedOrder.items || []).map((item: OrderItem) => (
                      <tr key={item._id} className="border-t">
                        <td className="py-2">
                          <div>{item.product?.name || 'Unknown Product'}</div>
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">£{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t">
                      <td colSpan={2} className="py-2 text-right font-medium">Total</td>
                      <td className="py-2 text-right font-medium">£{selectedOrder.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Select an order to view details
          </div>
        )}
      </div>
    </div>
  );
}
