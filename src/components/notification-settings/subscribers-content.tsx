import React from 'react'

export default function SubscribersContent() {
  // Sample data based on the screenshot
  const subscribers = [
    {
      id: 75,
      title: 'darwish mahmoud',
      email: 'darwishmahmoud5757@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 74,
      title: 'Janarthanan M',
      email: 'jaganmech107@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 73,
      title: 'X3 N',
      email: 'najmidinowxaytali57@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 72,
      title: 'nishant kansagra',
      email: 'nrk1290@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 71,
      title: 'Malik Hakim',
      email: 'malikimnunich@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 70,
      title: 'aman webkorps',
      email: 'amanwebkorps@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 69,
      title: 'Moataz',
      email: 'Moataz.developer@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 68,
      title: 'Jonathan',
      email: 'bahat.jonathan@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 67,
      title: 'Oğuz Yıldız',
      email: 'elfmmo21@gmail.com',
      status: 'Subscriber'
    },
    {
      id: 66,
      title: 'test test',
      email: 'waiter123@githublt.com',
      status: 'Subscriber'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Subscriber</h1>
        
        {/* Filter button - Could be implemented as needed */}
        <button 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscriber.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subscriber.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscriber.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {subscriber.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 mt-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-l-md">
                1
              </span>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                4
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                5
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                8
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
          <div className="ml-4 text-sm text-gray-500">
            10 / page
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Restroman UK support team <span className="text-blue-500">123456789</span></p>
      </div>
    </div>
  )
} 