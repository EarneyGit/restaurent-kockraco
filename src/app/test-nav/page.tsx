export default function TestNavPage() {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-medium mb-6">Test Navigation</h1>
      
      <div className="grid gap-4">
        <h2 className="text-xl font-medium mt-4">Test Pages</h2>
        <ul className="grid gap-2 pl-4">
          <li>
            <a href="/static-payments" className="text-blue-500 hover:underline">
              Static Payments Page
            </a>
          </li>
          <li>
            <a href="/hello" className="text-blue-500 hover:underline">
              Hello Test Page
            </a>
          </li>
          <li>
            <a href="/cache-clearer" className="text-blue-500 hover:underline">
              Clear Cache & Go To Deliveryman Payments
            </a>
          </li>
          <li>
            <a href="/deliveryman-payments/completed?t=123" className="text-blue-500 hover:underline">
              Simplified Deliveryman Completed Payments
            </a>
          </li>
          <li>
            <a href="/" className="text-blue-500 hover:underline">
              Back to Home
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
} 