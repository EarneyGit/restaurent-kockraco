import PageLayout from "@/components/layout/page-layout"

export default function EmailProviderPage() {
  // Sample data for email providers
  const emailProviders = [
    {
      fromSite: "single.foodyman.org",
      fromTo: "jmacmiller12@gmail.com",
      active: true,
      createdAt: "14-03-2025 14:59"
    }
  ]

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Email providers</h1>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center space-x-2">
            <span className="text-xl">+</span>
            <span>Add email provider</span>
          </button>
        </div>

        {/* Email Providers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">From Site</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">From to</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Active</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created at</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emailProviders.map((provider, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{provider.fromSite}</td>
                    <td className="px-6 py-4 text-sm">{provider.fromTo}</td>
                    <td className="px-6 py-4">
                      <div className="flex">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            defaultChecked={provider.active} 
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer-focus:ring-4 peer-focus:ring-blue-100 
                            bg-gray-200 peer-checked:bg-blue-500 
                            after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                            after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                            after:transition-all peer-checked:after:translate-x-5"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{provider.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 rounded-full bg-blue-100 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="p-1 rounded-full bg-red-100 text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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