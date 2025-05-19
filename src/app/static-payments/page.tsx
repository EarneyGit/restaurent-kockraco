export default function StaticPaymentsPage() {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-medium mb-6">Static Payments Page</h1>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveryman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order total price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1090</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Delivery Delivery</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$ 3,323.99</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <p>This is a static test version of the payments page</p>
    </div>
  )
} 