import React from "react"
import { CalendarIcon, DownloadIcon, BarChartIcon, LineChartIcon } from "lucide-react"

export default function OrderReportsContent() {
  // Sample data for orders table
  const ordersData = [
    {
      id: "#4562",
      status: "Completed",
      customer: "John Smith",
      customerType: "Regular",
      products: "Chicken Burger, Fries",
      itemsSold: 2,
      netSales: "$ 24.99"
    },
    {
      id: "#4563",
      status: "Processing",
      customer: "Emily Johnson",
      customerType: "VIP",
      products: "Veggie Pizza, Soft Drink, Salad",
      itemsSold: 3,
      netSales: "$ 32.50"
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with date selector */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Reports</h1>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md p-2 bg-white">
            <span className="text-sm mr-2">2025-03-30</span>
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="mx-2">→</span>
            <span className="text-sm mr-2">2025-04-30</span>
            <CalendarIcon className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Total items sold</div>
          <div className="text-2xl font-bold">5</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Net sales</div>
          <div className="text-2xl font-bold">$ 57.49</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Average order price</div>
          <div className="text-2xl font-bold">$ 28.75</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Total orders</div>
          <div className="text-2xl font-bold">2</div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">Items sold</h2>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-50">Day</button>
            <div className="flex border rounded-md overflow-hidden">
              <button className="p-1 bg-white hover:bg-gray-50 border-r">
                <BarChartIcon className="h-4 w-4" />
              </button>
              <button className="p-1 bg-white hover:bg-gray-50">
                <LineChartIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="h-60 flex items-center justify-center border-t border-b py-4">
            <div className="w-full h-full bg-gradient-to-t from-blue-100 to-blue-50 relative">
              <div className="absolute bottom-0 right-0 w-full h-1/6 bg-blue-500 opacity-75"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>2025-04-19</span>
            <span>2025-04-21</span>
            <span>2025-04-24</span>
            <span>2025-04-27</span>
            <span>2025-04-29</span>
          </div>
        </div>
      </div>
      
      {/* Orders Table Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">Orders</h2>
          
          <button className="flex items-center space-x-1 px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-50">
            <DownloadIcon className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Products</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Items Sold</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Net Sales</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 text-sm">{order.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.customer}</td>
                    <td className="px-4 py-3 text-sm">{order.customerType}</td>
                    <td className="px-4 py-3 text-sm">{order.products}</td>
                    <td className="px-4 py-3 text-sm">{order.itemsSold}</td>
                    <td className="px-4 py-3 text-sm">{order.netSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2 border-t text-center">
            <button className="p-1 rounded-full bg-blue-500 text-white">
              <span>1</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-center text-gray-500 mb-6">
        <span>Restroman UK support team </span>
        <a href="#" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 