"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, ChevronDown, LogOut, Edit, Calendar } from "lucide-react"
import ProfileModal from "../ui/profile-modal"
import LanguageModal from "../ui/language-modal"
import NotificationPanel from "../ui/notification-panel"
import { 
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts"

// Sample data for charts
const orderData = {
  week: [
    { name: "Mon", orders: 3 },
    { name: "Tue", orders: 2 },
    { name: "Wed", orders: 5 },
    { name: "Thu", orders: 3 },
    { name: "Fri", orders: 2 },
    { name: "Sat", orders: 1 },
    { name: "Sun", orders: 2 }
  ],
  month: [
    { name: "Week 1", orders: 12 },
    { name: "Week 2", orders: 8 },
    { name: "Week 3", orders: 15 },
    { name: "Week 4", orders: 10 }
  ],
  year: [
    { name: "Jan", orders: 30 },
    { name: "Feb", orders: 25 },
    { name: "Mar", orders: 35 },
    { name: "Apr", orders: 28 },
    { name: "May", orders: 32 },
    { name: "Jun", orders: 38 },
    { name: "Jul", orders: 42 },
    { name: "Aug", orders: 35 },
    { name: "Sep", orders: 30 },
    { name: "Oct", orders: 25 },
    { name: "Nov", orders: 32 },
    { name: "Dec", orders: 45 }
  ]
}

const salesData = {
  week: [
    { name: "Mon", amount: 1200 },
    { name: "Tue", amount: 850 },
    { name: "Wed", amount: 2100 },
    { name: "Thu", amount: 1300 },
    { name: "Fri", amount: 1800 },
    { name: "Sat", amount: 2400 },
    { name: "Sun", amount: 1700 }
  ],
  month: [
    { name: "Week 1", amount: 5200 },
    { name: "Week 2", amount: 6100 },
    { name: "Week 3", amount: 5800 },
    { name: "Week 4", amount: 7300 }
  ],
  year: [
    { name: "Jan", amount: 15200 },
    { name: "Feb", amount: 12500 },
    { name: "Mar", amount: 18200 },
    { name: "Apr", amount: 16800 },
    { name: "May", amount: 17500 },
    { name: "Jun", amount: 19300 },
    { name: "Jul", amount: 21200 },
    { name: "Aug", amount: 18500 },
    { name: "Sep", amount: 16200 },
    { name: "Oct", amount: 17800 },
    { name: "Nov", amount: 19500 },
    { name: "Dec", amount: 24200 }
  ]
}

// Status data for pie chart
const orderStatusData = [
  { name: "New", value: 12, color: "#3B82F6" },
  { name: "Out", value: 0, color: "#F59E0B" },
  { name: "Delivered", value: 2, color: "#22C55E" },
  { name: "Accepted", value: 0, color: "#93C5FD" },
  { name: "Ready", value: 0, color: "#86EFAC" },
  { name: "Canceled", value: 2, color: "#EF4444" }
]

function Dashboard() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week") // week, month, year
  const [orderChartPeriod, setOrderChartPeriod] = useState<"week" | "month" | "year">("week")
  const [statusChartPeriod, setStatusChartPeriod] = useState<"week" | "month" | "year">("week")
  const [salesChartPeriod, setSalesChartPeriod] = useState<"week" | "month" | "year">("week")
  const [todoChartPeriod, setTodoChartPeriod] = useState<"week" | "month" | "year">("week")
  const [topProductsPeriod, setTopProductsPeriod] = useState<"week" | "month" | "year">("week")
  const [topCustomersPeriod, setTopCustomersPeriod] = useState<"week" | "month" | "year">("week")
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLButtonElement>(null)

  // Get language display code
  const getLanguageDisplay = () => {
    switch(language) {
      case "en": return "EN"
      case "fr": return "FR"
      case "es": return "ES"
      case "de": return "DE"
      case "ru": return "RU"
      default: return "EN"
    }
  }

  // Get total orders based on time period
  const getTotalOrders = () => {
    return orderData[timePeriod].reduce((sum, item) => sum + item.orders, 0)
  }

  // Get total sales based on time period
  const getTotalSales = () => {
    return salesData[timePeriod].reduce((sum, item) => sum + item.amount, 0).toFixed(2)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Logout logic would go here
    console.log("Logging out...")
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    console.log("Language changed to:", newLanguage)
  }

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  return (
    <div className="p-8">
      {/* Time Period Selector */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
          <button 
            className={`px-4 py-2 text-sm rounded-md ${timePeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            onClick={() => setTimePeriod('week')}
          >Week</button>
          <button 
            className={`px-4 py-2 text-sm rounded-md ${timePeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            onClick={() => setTimePeriod('month')}
          >Month</button>
          <button 
            className={`px-4 py-2 text-sm rounded-md ${timePeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            onClick={() => setTimePeriod('year')}
          >Year</button>
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-md p-2 bg-white">
            <span className="text-sm mr-2">2023-04-30</span>
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="mx-2">→</span>
            <span className="text-sm mr-2">2023-05-30</span>
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Order Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">Total orders</h3>
          <p className="text-2xl font-bold mt-2">18</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="h-5 w-5 text-amber-500">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">New orders</h3>
          <p className="text-2xl font-bold mt-2">12</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-500">➕</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">Accepted orders</h3>
          <p className="text-2xl font-bold mt-2">0</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-500">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">Ready orders</h3>
          <p className="text-2xl font-bold mt-2">0</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-500">✓</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="col-span-1">
          <button className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            All orders
          </button>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">Out for delivery orders</h3>
          <p className="text-2xl font-bold mt-2">0</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-500">🚚</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">Delivered orders</h3>
          <p className="text-2xl font-bold mt-2 text-blue-500">2</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-500">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative">
          <h3 className="text-sm font-medium text-gray-500">Cancelled orders</h3>
          <p className="text-2xl font-bold mt-2 text-red-500">2</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500">❌</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order statistics overview</h3>
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${orderChartPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setOrderChartPeriod('week')}
              >Week</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${orderChartPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setOrderChartPeriod('month')}
              >Month</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${orderChartPeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setOrderChartPeriod('year')}
              >Year</button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="text-2xl font-bold text-blue-500 mr-2">
              {getTotalOrders()}
            </div>
            <div className="text-sm text-gray-500">Total orders</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderData[orderChartPeriod]} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order status statistics</h3>
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${statusChartPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setStatusChartPeriod('week')}
              >Week</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${statusChartPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setStatusChartPeriod('month')}
              >Month</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${statusChartPeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setStatusChartPeriod('year')}
              >Year</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={false}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                  <tspan x="50%" dy="-5" fontSize="24" fontWeight="bold">
                    16
                  </tspan>
                  <tspan x="50%" dy="20" fontSize="12">
                    Orders
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">New</span>
              <span className="ml-auto font-medium">12</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600">Out</span>
              <span className="ml-auto font-medium">0</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Delivered</span>
              <span className="ml-auto font-medium">2</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
              <span className="text-sm text-gray-600">Accepted</span>
              <span className="ml-auto font-medium">0</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-300 mr-2"></div>
              <span className="text-sm text-gray-600">Ready</span>
              <span className="ml-auto font-medium">0</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600">Canceled</span>
              <span className="ml-auto font-medium">2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Total sales overview</h3>
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${salesChartPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setSalesChartPeriod('week')}
              >Week</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${salesChartPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setSalesChartPeriod('month')}
              >Month</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${salesChartPeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setSalesChartPeriod('year')}
              >Year</button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="text-2xl font-bold text-blue-500 mr-2">$ {getTotalSales()}</div>
            <div className="text-sm text-gray-500">Total sales</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData[salesChartPeriod]} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">To-do list</h3>
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${todoChartPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTodoChartPeriod('week')}
              >Week</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${todoChartPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTodoChartPeriod('month')}
              >Month</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${todoChartPeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTodoChartPeriod('year')}
              >Year</button>
            </div>
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              placeholder="Write your note..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
              Add
            </button>
          </div>
          <div className="mt-6 text-center text-gray-500">
            No todo
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Top selling products</h3>
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${topProductsPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTopProductsPeriod('week')}
              >Week</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${topProductsPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTopProductsPeriod('month')}
              >Month</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${topProductsPeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTopProductsPeriod('year')}
              >Year</button>
            </div>
          </div>
          <div className="flex justify-end text-sm text-gray-500 mb-2">
            5 / Page
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              <img src="https://via.placeholder.com/60" alt="California Roll" className="w-12 h-12 object-cover rounded-md mr-3" />
              <div>
                <h4 className="font-medium text-gray-800">California Roll</h4>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-500">Sales: 1</div>
              </div>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              <img src="https://via.placeholder.com/60" alt="Chilli Cheese Hot Dog" className="w-12 h-12 object-cover rounded-md mr-3" />
              <div>
                <h4 className="font-medium text-gray-800">Chilli Cheese Hot Dog</h4>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-500">Sales: 1</div>
              </div>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              <img src="https://via.placeholder.com/60" alt="Cobb Salad" className="w-12 h-12 object-cover rounded-md mr-3" />
              <div>
                <h4 className="font-medium text-gray-800">Cobb Salad</h4>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-500">Sales: 1</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Top customers</h3>
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden p-1">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${topCustomersPeriod === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTopCustomersPeriod('week')}
              >Week</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${topCustomersPeriod === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTopCustomersPeriod('month')}
              >Month</button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${topCustomersPeriod === 'year' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                onClick={() => setTopCustomersPeriod('year')}
              >Year</button>
            </div>
          </div>
          <div className="flex justify-end text-sm text-gray-500 mb-2">
            5 / Page
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                <img src="https://ui-avatars.com/api/?name=User+Demo&background=4F46E5&color=fff" alt="User Demo" className="rounded-full" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">User Demo</h4>
                <p className="text-xs text-gray-500">1268545685</p>
              </div>
              <div className="ml-auto text-right">
                <div className="font-medium text-gray-800">$ 17.20</div>
                <div className="text-xs text-gray-500">Orders: 1</div>
              </div>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                <img src="https://ui-avatars.com/api/?name=Branch+1&background=E5E7EB&color=000" alt="Branch 1" className="rounded-full" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Branch-1 Githubit</h4>
                <p className="text-xs text-gray-500">9989119026</p>
              </div>
              <div className="ml-auto text-right">
                <div className="font-medium text-gray-800">$ 16.36</div>
                <div className="text-xs text-gray-500">Orders: 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-center text-gray-500 my-6">
        <span>Restroman UK support team 123456789</span>
      </div>

      {isProfileModalOpen && (
        <ProfileModal 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      )}

      {isLanguageModalOpen && (
        <LanguageModal 
          onClose={() => setIsLanguageModalOpen(false)}
          onSave={handleLanguageChange}
          selectedLanguage={language}
        />
      )}

      {isNotificationOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30">
          <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default Dashboard