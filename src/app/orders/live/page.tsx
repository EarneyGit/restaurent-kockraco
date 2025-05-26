"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, ChevronLeft, Mail, Phone, Clock, User } from "lucide-react";
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
  
  // Order type filters
  const [showCollection, setShowCollection] = useState(true);
  const [showDelivery, setShowDelivery] = useState(true);
  const [showTableOrdering, setShowTableOrdering] = useState(true);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await api.put(`/orders/${orderId}`, { status: newStatus });
      const data = response.data;
      if (data.success) {
        toast.success(`Order ${newStatus === 'processing' ? 'accepted' : newStatus === 'cancelled' ? 'rejected' : 'updated'} successfully`);
        // Refresh orders list
        fetchOrders();
        // Clear selected order if it was updated
        setSelectedOrder(null);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      toast.error("Error updating order status");
    }
  };

  const handleOrderClick = (order: Order) => {
    fetchOrderDetails(order._id);
  };

  const handleAcceptOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder._id, 'processing');
    }
  };

  const handleRejectOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder._id, 'cancelled');
    }
  };

  const handleReadyOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder._id, 'completed');
    }
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder._id, 'cancelled');
    }
  };

  const handlePrintOrder = () => {
    toast.success("Print order functionality - Coming soon!");
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

  // Filter orders based on delivery method and toggle states
  const filteredOrders = orders.filter((order) => {
    if (order.status !== activeTab) return false;
    
    const deliveryMethod = order.deliveryMethod?.toLowerCase();
    
    if (deliveryMethod === 'pickup' && !showCollection) return false;
    if (deliveryMethod === 'delivery' && !showDelivery) return false;
    if (deliveryMethod === 'dine_in' && !showTableOrdering) return false;
    
    return true;
  });

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

  const getDeliveryMethodDisplay = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'pickup':
        return 'Collection';
      case 'delivery':
        return 'Delivery';
      case 'dine_in':
        return 'Table Ordering';
      default:
        return method || 'N/A';
    }
  };

  // Add a helper function to safely calculate total items
  const calculateTotalItems = (items: OrderItem[] | undefined) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
      <div className="w-80 lg:w-96 border-r bg-white flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-medium text-lg">Live Orders</span>
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
            
          </div>
        </header>

        {/* Order Tabs */}
        <div className="border-b bg-white">
          <div className="flex">
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 flex-1",
                activeTab === "new"
                  ? "border-emerald-500 text-emerald-600 bg-emerald-50"
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
                  ? "border-emerald-500 text-emerald-600 bg-emerald-50"
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
                  ? "border-emerald-500 text-emerald-600 bg-emerald-50"
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
                className={cn(
                  "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedOrder?._id === order._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                )}
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-lg mb-1">
                      {order.user?.name || "Guest"}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {getDeliveryMethodDisplay(order.deliveryMethod)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      £{(order.totalAmount || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-pink-500 mt-1">
                      {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Order Details */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Top Toggle Buttons */}
        <div className="bg-white border-b p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-lg">Order Details</span>
            <Button className="flex gap-2" variant="ghost" size="sm" onClick={() => handleNavigate("/")}>
            Exit <X className="h-4 w-4" /> 
            </Button>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant={showCollection ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCollection(!showCollection)}
              className={cn(
                "px-6 py-2",
                showCollection ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
              )}
            >
              Collection
            </Button>
            <Button
              variant={showDelivery ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDelivery(!showDelivery)}
              className={cn(
                "px-6 py-2",
                showDelivery ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
              )}
            >
              Delivery
            </Button>
            <Button
              variant={showTableOrdering ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTableOrdering(!showTableOrdering)}
              className={cn(
                "px-6 py-2",
                showTableOrdering ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
              )}
            >
              Table Ordering
            </Button>
          </div>
        </div>

        {/* Order Details Content */}
        <div className="flex-1 overflow-y-auto">
          {detailsLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading order details...
            </div>
          ) : selectedOrder ? (
            <div className="p-6 max-w-4xl mx-auto">
              {/* Order Number */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h1 className="text-2xl font-bold text-emerald-600 mb-2">
                  Order No: {selectedOrder.orderNumber}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatDetailedDate(selectedOrder.createdAt)}</span>
                </div>
              </div>

           <div className="flex bg-white items-start justify-between">
               {/* Delivery Type & Address */}
               <div className=" rounded-lg shadow-sm p-6 mb-4">
                <h2 className="text-lg font-semibold mb-3">
                  {getDeliveryMethodDisplay(selectedOrder.deliveryMethod)}
                </h2>
                {selectedOrder.deliveryMethod === 'delivery' && selectedOrder.deliveryAddress && (
                  <div className="text-gray-600">
                    <p className="font-medium mb-1">Delivery Address</p>
                    <p>
                      {[
                        selectedOrder.deliveryAddress.street,
                        selectedOrder.deliveryAddress.city,
                        selectedOrder.deliveryAddress.state
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                <div className="mt-3 text-sm text-gray-500">
                  Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </div>
              </div>
              {activeTab === "in-progress" && (
                <div className="flex gap-3 p-6 mb-4 justify-center">
                  <Button
                    onClick={handleReadyOrder}
                    size="lg"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Ready
                  </Button>
                  <Button
                    onClick={handleCancelOrder}
                    variant="outline"
                    size="lg"
                    className="px-6 py-3 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePrintOrder}
                    variant="outline"
                    size="lg"
                    className="px-6 py-3 border-gray-500 text-gray-500 hover:bg-gray-50"
                  >
                    Print Order
                  </Button>
                </div>
              )}
                        {/* Action Buttons */}
                        {activeTab === "new" && (
                <div className="flex gap-3 p-6 mb-4 justify-center">
                  <Button
                    onClick={handleRejectOrder}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleAcceptOrder}
                    size="lg"
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Accept
                  </Button>
                </div>
              )}
           </div>
              {/* Items */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h3 className="text-lg font-semibold mb-4">Items</h3>
                <div className="space-y-3">
                  {(selectedOrder.products || selectedOrder.items || []).map((item: OrderItem) => (
                    <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium">{item.product?.name || 'Unknown Product'}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold text-emerald-600">£{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{selectedOrder.user?.name || 'Guest'}</div>
                    {selectedOrder.user && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {selectedOrder.user.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {selectedOrder.user.email}
                          </div>
                        )}
                        {selectedOrder.user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {selectedOrder.user.phone}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

    

            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <div className="text-lg mb-2">Select an order to view details</div>
              <div className="text-sm">Choose an order from the list to see detailed information</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
