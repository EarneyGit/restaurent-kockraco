import PageLayout from "@/components/layout/page-layout"

export default function EmailTemplatesPage() {
  // Empty data for "No data" state
  const emailTemplates = []

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Email templates</h1>
        </div>
        
        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center space-x-2">
            <span className="text-xl">+</span>
            <span>Add email template</span>
          </button>
        </div>

        {/* Email Templates Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500" />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Send to</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created at</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emailTemplates.length > 0 ? (
                  emailTemplates.map((template, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500" />
                      </td>
                      <td className="px-6 py-4 text-sm">{template.id}</td>
                      <td className="px-6 py-4 text-sm">{template.sendTo}</td>
                      <td className="px-6 py-4 text-sm">{template.createdAt}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <svg className="w-20 h-20 text-gray-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                            <path d="M3 9h18"></path>
                            <circle cx="12" cy="15" r="1"></circle>
                          </svg>
                        </div>
                        <div className="text-gray-500 text-lg">No data</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <div>Restroman UK support team</div>
        <div className="text-blue-500">Tel: +998 94 123 45 67</div>
      </div>
    </PageLayout>
  )
} 