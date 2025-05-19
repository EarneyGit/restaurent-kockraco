import { CalendarIcon, BarChart3Icon, LineChart, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function OverviewPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Overview</h1>
        
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

      <h2 className="font-medium text-lg mb-4">Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Total sales</div>
          <div className="text-2xl font-bold">$ 33.56</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Orders</div>
          <div className="text-2xl font-bold">2</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Canceled orders price</div>
          <div className="text-2xl font-bold">$ 14,382.56</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Total tax</div>
          <div className="text-2xl font-bold">$ 0.26</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Delivered avg</div>
          <div className="text-2xl font-bold">$ 22.10</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Delivery fee</div>
          <div className="text-2xl font-bold">$ 7.34</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">Charts</h2>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-50">Day</button>
          <div className="flex border rounded-md overflow-hidden">
            <button className="p-1 bg-white hover:bg-gray-50 border-r">
              <BarChart3Icon className="h-4 w-4" />
            </button>
            <button className="p-1 bg-white hover:bg-gray-50">
              <LineChart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Net Sales</h3>
          <div className="h-60 flex items-center justify-center border-t border-b py-4">
            <div className="w-full h-full bg-gradient-to-t from-blue-100 to-blue-50 relative">
              <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-blue-500 opacity-75 rounded-tl-md"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>2025-04-29</span>
            <span>2025-04-27</span>
            <span>2025-04-24</span>
            <span>2025-04-21</span>
            <span>2025-04-19</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Orders</h3>
          <div className="h-60 flex items-center justify-center border-t border-b py-4">
            <div className="w-full h-full bg-gradient-to-t from-blue-100 to-blue-50 relative">
              <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-blue-500 opacity-75 rounded-tl-md"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>2025-04-29</span>
            <span>2025-04-27</span>
            <span>2025-04-24</span>
            <span>2025-04-21</span>
            <span>2025-04-19</span>
          </div>
        </div>
      </div>
      
      <h2 className="font-medium text-lg mb-4">Leaderboards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <h3 className="font-medium p-4 border-b">Top categories</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item sold</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Net sales</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Orders</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Cake</td>
                  <td className="px-4 py-3 text-sm">4</td>
                  <td className="px-4 py-3 text-sm">$ 96.52</td>
                  <td className="px-4 py-3 text-sm">4</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Salads</td>
                  <td className="px-4 py-3 text-sm">5</td>
                  <td className="px-4 py-3 text-sm">$ 86.50</td>
                  <td className="px-4 py-3 text-sm">4</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Fast Foods</td>
                  <td className="px-4 py-3 text-sm">10</td>
                  <td className="px-4 py-3 text-sm">$ 18.00</td>
                  <td className="px-4 py-3 text-sm">3</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Hot dishes</td>
                  <td className="px-4 py-3 text-sm">15</td>
                  <td className="px-4 py-3 text-sm">$ 312.26</td>
                  <td className="px-4 py-3 text-sm">3</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Pizza</td>
                  <td className="px-4 py-3 text-sm">5</td>
                  <td className="px-4 py-3 text-sm">$ 45.00</td>
                  <td className="px-4 py-3 text-sm">1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 border-t text-center">
            <button className="p-1 rounded-full bg-blue-500 text-white">
              <span>1</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <h3 className="font-medium p-4 border-b">Top products</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item sold</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Net sales</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Orders</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Chili Cheese Hot Dog</td>
                  <td className="px-4 py-3 text-sm">9</td>
                  <td className="px-4 py-3 text-sm">$ 16.20</td>
                  <td className="px-4 py-3 text-sm">2</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Kyle Bartlik</td>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="px-4 py-3 text-sm">$ 28.28</td>
                  <td className="px-4 py-3 text-sm">1</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Juliet</td>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="px-4 py-3 text-sm">$ 21.42</td>
                  <td className="px-4 py-3 text-sm">1</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Barry</td>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="px-4 py-3 text-sm">$ 28.28</td>
                  <td className="px-4 py-3 text-sm">1</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Verona</td>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="px-4 py-3 text-sm">$ 18.54</td>
                  <td className="px-4 py-3 text-sm">1</td>
                </tr>
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
        <Link href="#" className="text-blue-500">123456789</Link>
      </div>
    </div>
  )
} 