import PageLayout from "@/components/layout/page-layout"

export default function EmailPage() {
  // Sample data for email settings (empty for now)
  const emailSettings = {
    emailHost: "",
    emailPort: "",
    emailUsername: "",
    emailPassword: "",
    emailEncryption: "tls",
    emailFromAddress: "",
    emailFromName: "",
    enableEmailNotifications: false
  }

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Email Settings</h1>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Email Host
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Email Host"
                defaultValue={emailSettings.emailHost}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Email Port
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Email Port"
                defaultValue={emailSettings.emailPort}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Email Username
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Email Username"
                defaultValue={emailSettings.emailUsername}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Email Password
              </label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Email Password"
                defaultValue={emailSettings.emailPassword}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Email Encryption
              </label>
              <select 
                className="w-full p-2 border rounded-md"
                defaultValue={emailSettings.emailEncryption}
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                From Address
              </label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter From Email Address"
                defaultValue={emailSettings.emailFromAddress}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                From Name
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter From Name"
                defaultValue={emailSettings.emailFromName}
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-500"
                  defaultChecked={emailSettings.enableEmailNotifications}
                />
                <span className="ml-2 text-sm">Enable Email Notifications</span>
              </label>
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