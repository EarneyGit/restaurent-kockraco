"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"

interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  mobile: string
  address: string
  postcode: string
}

interface SearchFilters {
  userId: string
  firstname: string
  lastname: string
  email: string
  mobile: string
  postcode: string
}

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [filters, setFilters] = useState<SearchFilters>({
    userId: '',
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    postcode: ''
  })
  
  // Sample customer data
  const [customers] = useState<Customer[]>([
    { id: 1, firstname: 'Graham', lastname: 'Wallace', email: 'graham425@btinternet.com', mobile: '+447971538072', address: '18 Greycraigs, Cairneyhill', postcode: 'KY12 8XL' },
    { id: 2, firstname: 'Natalie', lastname: 'McKenzie', email: 'nataliemckenzie84@hotmail.com', mobile: '+447921334821', address: '23 Whitemyre Court', postcode: 'KY12 9PF' },
    { id: 3, firstname: 'Catherine', lastname: 'Reid', email: 'kayreid5@tiscali.co.uk', mobile: '+447882747524', address: '6 Grampian Road, Rosyth', postcode: 'KY11 2ES' },
    { id: 4, firstname: 'Mike', lastname: 'Brechin', email: 'Mikebrechin@hotmail.com', mobile: '+447956795634', address: '22/6 Springwell Place', postcode: 'EH11 2HY' },
    { id: 5, firstname: 'Catherine', lastname: 'Sheffield', email: 'catherinesheffield@hotmail.com', mobile: '+447915399183', address: 'Hazid Technologies, Pitmedden', postcode: 'KY11 8US' },
    { id: 6, firstname: 'Craig', lastname: 'Fulton', email: 'craigfulton@live.co.uk', mobile: '+447376493007', address: '16 Greycraigs, Cairneyhill', postcode: 'KY12 8XL' },
    { id: 7, firstname: 'Doug', lastname: 'Barr', email: 'dougbarr83@gmail.com', mobile: '+447740981098', address: '32 Sandpiper Gardens', postcode: 'KY11 8LE' },
    { id: 8, firstname: 'Chris', lastname: 'Stewart', email: 'chris.stewart1591@gmail.com', mobile: '+447521082440', address: '287 Broomhead Drive', postcode: 'KY12 9AE' },
    { id: 9, firstname: 'Kristoffer', lastname: 'Grant', email: 'kristoffergrant1875@gmail.com', mobile: '+447566743372', address: '15/6 Murdoch Terrace', postcode: 'EH11 1BD' },
    { id: 10, firstname: 'Heather', lastname: 'Snowie', email: 'heather.snowie@gmail.com', mobile: '+447398021573', address: '22 Maygate', postcode: 'KY12 7NH' },
    { id: 11, firstname: 'David', lastname: 'McGeachie', email: 'd_mcgeachie@hotmail.com', mobile: '+447743113076', address: '1 Redwing Wynd', postcode: 'KY11 8SP' },
    { id: 12, firstname: 'Karen', lastname: 'Harwood', email: 'karen.harwood8@icloud.com', mobile: '+447494203439', address: '36 Craigston Drive', postcode: 'KY12 0XE' },
    { id: 13, firstname: 'Maria', lastname: 'Coutts', email: 'elisa.fisher@hotmail.com', mobile: '+447896465186', address: '69 Wedderburn Crescent', postcode: 'KY11 4RY' },
    { id: 14, firstname: 'Pamela', lastname: 'Kelly', email: 'pamelakelly81@hotmail.com', mobile: '+447782510131', address: '110 Law Road', postcode: 'KY11 4XA' },
    { id: 15, firstname: 'Sam', lastname: 'Etherington', email: 'S.etherington1705@gmail.com', mobile: '+447848795665', address: '22 Osprey Crescent', postcode: 'KY11 8JQ' },
    { id: 16, firstname: 'Katerina', lastname: 'Charalambous', email: 'katerina@amityhospitality.co.uk', mobile: '+447944702979', address: 'Voodoo Tattoo Club, 58 High Street', postcode: 'KY12 7JB' },
    { id: 17, firstname: 'Elisa', lastname: 'Fisher', email: 'elisa.fisher@icloud.com', mobile: '+447896465186', address: '69 Wedderburn Crescent', postcode: 'KY11 4RY' },
    { id: 18, firstname: 'Bengt', lastname: 'Hollaender', email: 'bengt.ove.hollaender@gmail.com', mobile: '+447570022996', address: '12 Woodlands Drive, Crossford', postcode: 'KY12 8QE' },
    { id: 19, firstname: 'Dean', lastname: 'Hynd', email: 'deanhynd1@gmail.com', mobile: '+447807186055', address: '39 Keltyhill Crescent', postcode: 'KY4 0LE' },
    { id: 20, firstname: 'Eilidh', lastname: 'Gover', email: 'eilidhgover@gmail.com', mobile: '+447484221864', address: '16 Canon Lynch Court', postcode: 'KY12 8AU' }
  ])

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Filter customers based on search criteria
    let filtered = customers.filter(customer => {
      return (
        customer.id.toString().includes(filters.userId) &&
        customer.firstname.toLowerCase().includes(filters.firstname.toLowerCase()) &&
        customer.lastname.toLowerCase().includes(filters.lastname.toLowerCase()) &&
        customer.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        customer.mobile.includes(filters.mobile) &&
        customer.postcode.toLowerCase().includes(filters.postcode.toLowerCase())
      )
    })

    setFilteredCustomers(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [filters, itemsPerPage, customers])

  const handleSearch = () => {
    // Trigger the useEffect by updating filters state
    setFilters({ ...filters })
  }

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-medium mb-6">Customers</h1>
        
        {/* Search Filters */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <input 
            type="text" 
            placeholder="User Id" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.userId}
            onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="First name" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.firstname}
            onChange={(e) => setFilters(prev => ({ ...prev, firstname: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Last name" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.lastname}
            onChange={(e) => setFilters(prev => ({ ...prev, lastname: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Email" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.email}
            onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Mobile" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.mobile}
            onChange={(e) => setFilters(prev => ({ ...prev, mobile: e.target.value }))}
          />
          <div className="flex">
            <input 
              type="text" 
              placeholder="Postcode" 
              className="border border-gray-300 rounded-l-md px-3 py-2 text-sm flex-1"
              value={filters.postcode}
              onChange={(e) => setFilters(prev => ({ ...prev, postcode: e.target.value }))}
            />
            <button 
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 rounded-r-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Pagination Controls - Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              &lt;&lt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-sm">of {totalPages}</span>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm">of {filteredCustomers.length}</span>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
        
        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-6 py-3">Firstname</th>
                <th className="px-6 py-3">Lastname</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Mobile</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Postcode</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{customer.firstname}</td>
                  <td className="px-6 py-3 text-sm">{customer.lastname}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{customer.email}</td>
                  <td className="px-6 py-3 text-sm">{customer.mobile}</td>
                  <td className="px-6 py-3 text-sm">{customer.address}</td>
                  <td className="px-6 py-3 text-sm">{customer.postcode}</td>
                  <td className="px-6 py-3 text-sm">
                    <button className="text-teal-500 hover:text-teal-700">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls - Bottom */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              &lt;&lt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-sm">of {totalPages}</span>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm">of {filteredCustomers.length}</span>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            <button 
              className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 