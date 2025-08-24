'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PrinterIcon, RefreshCw } from 'lucide-react'
import { reportService } from '@/services/report.service'
import branchService from '@/services/branch.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'

interface BranchOption {
  value: string;
  label: string;
}

export default function OutletsReportPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState(true)

  const { user } = useAuth()

  // Report data
  const [reportData, setReportData] = useState<{
    branch: { id: string; name: string; address: any };
    period: { startDate: string; endDate: string };
    summary: {
      totalOrders: number;
      totalSales: number;
      averageOrderValue: number;
      totalCustomers: number;
    };
    orderTypeBreakdown: Array<{
      _id: string;
      count: number;
      revenue: number;
    }>;
    topProducts: Array<{
      _id: string;
      name: string;
      quantity: number;
      revenue: number;
    }>;
  } | null>(null)

  // Fetch branches based on user role
  const fetchBranches = async () => {
    setLoadingBranches(true)
    try {
      // If user is staff or manager, they can only see their own branch
      if (user?.role === 'staff' || user?.role === 'manager') {
        const myBranchResponse = await branchService.getMyBranch()
        if (myBranchResponse.success && myBranchResponse.data) {
          setBranches([{
            value: myBranchResponse.data._id,
            label: myBranchResponse.data.name
          }])
          setSelectedBranch(myBranchResponse.data._id)
        }
      } else {
        // Admin/Superadmin can see all branches
        const response = await branchService.getBranches()
        if (response.success && response.data) {
          const branchOptions = response.data.map(branch => ({
            value: branch._id,
            label: branch.name
          }))
          setBranches(branchOptions)
          if (branchOptions.length > 0) {
            setSelectedBranch(branchOptions[0].value)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      toast.error('Failed to fetch branches. Please try again.')
    } finally {
      setLoadingBranches(false)
    }
  }

  // Fetch report data
  const fetchReportData = async () => {
    if (!selectedBranch) return
    
    setLoading(true)
    try {
      const response = await reportService.getOutletReport(selectedBranch, selectedPeriod)
      
      if (response.success && response.data) {
        setReportData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      toast.error('Failed to fetch report data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  useEffect(() => {
    if (selectedBranch) {
      fetchReportData()
    }
  }, [selectedBranch, selectedPeriod])

  const handleRefresh = () => {
    fetchReportData()
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Outlets Report</h1>
        <div className="flex gap-4 items-center no-print">
          {loadingBranches ? (
            <Skeleton className="h-10 w-[200px]" />
          ) : (
            <Select
              value={selectedBranch}
              onValueChange={setSelectedBranch}
              disabled={branches.length === 1} // Disable if user can only see one branch
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="bg-white"
            disabled={loading || !selectedBranch}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            className="bg-white"
            disabled={!reportData}
          >
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {reportData && (
        <>
          {/* Branch Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">
              {reportData.branch.name} - {formatDate(reportData.period.startDate)} to {formatDate(reportData.period.endDate)}
            </h2>
            {reportData.branch.address && (
              <p className="text-sm text-gray-600">
                {reportData.branch.address.street}, {reportData.branch.address.city}, {reportData.branch.address.state} {reportData.branch.address.postalCode}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Summary</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold">{reportData.summary.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className="text-2xl font-semibold">£{reportData.summary.totalSales.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Order</p>
                  <p className="text-2xl font-semibold">£{reportData.summary.averageOrderValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-semibold">{reportData.summary.totalCustomers}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Type Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Order Type Breakdown</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : reportData.orderTypeBreakdown.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Type</th>
                      <th className="text-right py-2">Orders</th>
                      <th className="text-right py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.orderTypeBreakdown.map((type) => (
                      <tr key={type._id} className="border-b">
                        <td className="py-2 capitalize">{type._id}</td>
                        <td className="text-right py-2">{type.count}</td>
                        <td className="text-right py-2">£{type.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No order data available</p>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Top Products</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : reportData.topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-right py-2">Quantity</th>
                      <th className="text-right py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topProducts.map((product) => (
                      <tr key={product._id} className="border-b">
                        <td className="py-2">{product.name}</td>
                        <td className="text-right py-2">{product.quantity}</td>
                        <td className="text-right py-2">£{product.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No product data available</p>
            )}
          </div>
        </>
      )}

      {!loading && !reportData && selectedBranch && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No report data available for the selected period</p>
        </div>
      )}
    </>
  )
}