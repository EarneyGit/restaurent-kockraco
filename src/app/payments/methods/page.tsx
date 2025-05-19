import PageLayout from "@/components/layout/page-layout"

export default function PaymentMethodsPage() {
  // Sample data for payment methods
  const paymentMethods = [
    { id: 1, title: "wallet", active: true },
    { id: 2, title: "cash", active: true },
    { id: 3, title: "paytabs", active: true },
    { id: 4, title: "flutterWave", active: true },
    { id: 5, title: "paystack", active: true },
    { id: 6, title: "mercado-pago", active: true },
    { id: 7, title: "razorpay", active: false },
    { id: 8, title: "stripe", active: true }
  ]

  return (
    <PageLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payments</h1>

        {/* Payment Methods List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Active</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method) => (
                <tr key={method.id} className="border-b">
                  <td className="px-6 py-4 text-sm">{method.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={method.active} 
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer-focus:ring-4 peer-focus:ring-blue-100 
                          ${method.active ? 'bg-blue-500' : 'bg-gray-200'} 
                          after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                          after:transition-all peer-checked:after:translate-x-5`}></div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-sm text-center text-gray-500 mt-6">
          <span>Restroman UK support team </span>
          <a href="#" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 