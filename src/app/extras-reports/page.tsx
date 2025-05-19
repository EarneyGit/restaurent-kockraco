import PageLayout from "@/components/layout/page-layout"
import { CalendarIcon, DownloadIcon, BarChartIcon, LineChartIcon, PlusIcon } from "lucide-react"

export default function ExtrasReportsPage() {
  // Sample data for extras table
  const extrasData = [
    { 
      title: "Chilli Cheese Hot Dog",
      barcode: "-",
      price: "$ 32.72",
      quantity: 9,
      status: "Active"
    },
    { 
      title: "Cobb Salad",
      barcode: "-",
      price: "$ 17.20",
      quantity: 1,
      status: "Active"
    },
    { 
      title: "California Roll",
      barcode: "-",
      price: "$ 17.20",
      quantity: 1,
      status: "Active"
    }
  ]

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with date selector */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Extras</h1>
          
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
            <div className="text-sm text-gray-500 mb-2">Item sold</div>
            <div className="text-2xl font-bold">11</div>
            <div className="text-xs text-cyan-500 mt-1">5%</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Net sales</div>
            <div className="text-2xl font-bold">$ 33.56</div>
            <div className="text-xs text-cyan-500 mt-1">5%</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Orders</div>
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-cyan-500 mt-1">5%</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-2"></div>
            <div className="text-2xl font-bold"></div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-lg">Item sold</h2>
            
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
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path 
                      d="M0,200 L0,100 C200,20 400,20 600,60 C800,100 1000,0 1000,0 L1000,200 Z" 
                      fill="#3b82f6" 
                      fillOpacity="0.3"
                    />
                    <path 
                      d="M0,100 C200,20 400,20 600,60 C800,100 1000,0 1000,0" 
                      stroke="#3b82f6" 
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>2025-04-19</span>
              <span>2025-04-21</span>
            </div>
          </div>
        </div>
        
        {/* Extras Table Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-lg">Extras</h2>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 text-sm border rounded-md px-3 py-1 bg-white">
                <DownloadIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
              <div className="flex border rounded-md overflow-hidden">
                <button className="p-1 bg-white hover:bg-gray-50 border-r">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Barcode</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {extrasData.map((extra, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <button className="p-1 mr-2 rounded-md border border-gray-200 hover:bg-gray-100">
                            <PlusIcon className="h-4 w-4" />
                          </button>
                          {extra.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{extra.barcode}</td>
                      <td className="px-4 py-3 text-sm">{extra.price}</td>
                      <td className="px-4 py-3 text-sm">{extra.quantity}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {extra.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2 border-t text-center">
              <button className="p-1 rounded-full bg-blue-500 text-white w-6 h-6 flex items-center justify-center">
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
    </PageLayout>
  )
} 