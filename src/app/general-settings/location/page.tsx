import PageLayout from "@/components/layout/page-layout"

export default function GeneralSettingsLocationPage() {
  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">General settings</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Settings Sidebar */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 border-r">
              <div className="py-4 px-4 font-medium text-gray-700 border-b">Settings</div>
              <div className="py-3 px-4 border-b bg-blue-50 text-blue-700">Location</div>
              <div className="py-3 px-4 border-b hover:bg-gray-50">Default delivery zone</div>
              <div className="py-3 px-4 border-b hover:bg-gray-50">Permission</div>
              <div className="py-3 px-4 border-b hover:bg-gray-50">Auth settings</div>
              <div className="py-3 px-4 border-b hover:bg-gray-50">Reservation</div>
              <div className="py-3 px-4 border-b hover:bg-gray-50">QR-code</div>
              <div className="py-3 px-4 hover:bg-gray-50">Footer</div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-6">
              {/* Google Map Key Input */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-sm">
                    <span className="text-red-500 mr-1">*</span>
                    Google map key
                  </label>
                </div>
                <input 
                  type="text" 
                  defaultValue="AIzaSyC96nZOqHgpWrmDkbNTmgvgBzvfMUQaScI" 
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Map Label */}
              <div className="mb-2">
                <label className="block text-sm">Map</label>
              </div>

              {/* Google Map */}
              <div className="mb-6 border rounded-md overflow-hidden">
                <div className="h-80 relative">
                  {/* Map Type Controls */}
                  <div className="absolute top-2 left-2 z-10 bg-white rounded-md overflow-hidden">
                    <div className="flex text-sm">
                      <button className="px-4 py-1 bg-gray-100 font-medium">Map</button>
                      <button className="px-4 py-1 hover:bg-gray-50">Satellite</button>
                    </div>
                  </div>

                  {/* Map Container */}
                  <div className="w-full h-full bg-gray-200 relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.697149419326096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1656889853425!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      aria-hidden="false" 
                      tabIndex={0}
                    ></iframe>
                    
                    {/* Map Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#000000"/>
                      </svg>
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                    <button className="bg-white p-2 rounded-sm shadow-md">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="bg-white p-2 rounded-sm shadow-md">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Human Icon */}
                  <div className="absolute right-2 bottom-16 bg-white rounded-sm shadow-md">
                    <button className="p-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 20C18 16.6863 15.3137 14 12 14C8.68629 14 6 16.6863 6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Fullscreen Button */}
                  <div className="absolute right-2 top-2 bg-white rounded-sm shadow-md">
                    <button className="p-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H21M21 3V9M21 3L14 10M9 21H3M3 21V15M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Map Footer */}
                <div className="flex justify-between items-center p-1 bg-white text-xs text-gray-500 border-t">
                  <div>Keyboard shortcuts</div>
                  <div className="flex space-x-3">
                    <span>Map data ©2023 Google</span>
                    <span>Terms</span>
                    <span>Report a map error</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-center text-gray-500 my-6">
          <span>Restroman UK support team </span>
          <a href="#" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 