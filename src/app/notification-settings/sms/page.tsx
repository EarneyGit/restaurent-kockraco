import PageLayout from "@/components/layout/page-layout"

export default function SmsPage() {
  // Sample data for SMS settings (empty for now)
  const smsSettings = {
    twilioSid: "",
    twilioToken: "",
    twilioFromNumber: "",
    enableSmsNotifications: false
  }

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">SMS Settings</h1>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Twilio SID
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Twilio SID"
                defaultValue={smsSettings.twilioSid}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Twilio Token
              </label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Twilio Token"
                defaultValue={smsSettings.twilioToken}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                <span className="text-red-500 mr-1">*</span>
                Twilio From Number
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter Twilio From Number"
                defaultValue={smsSettings.twilioFromNumber}
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-500"
                  defaultChecked={smsSettings.enableSmsNotifications}
                />
                <span className="ml-2 text-sm">Enable SMS Notifications</span>
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