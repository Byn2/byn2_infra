"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowLeft, Download, Printer, Edit } from "lucide-react"
import { toast } from "sonner"

interface Employee {
  id: number
  name: string
  position: string
  salary: number
  bonus: number
  deductions: number
  netPay: number
  paymentMethod: string
  paymentDetails: {
    mobileNumber?: string
    accountName?: string
    accountNumber?: string
    bankName?: string
    routingNumber?: string
  }
}

interface Payroll {
  id: string
  name: string
  payrollType: string
  paymentDate: string
  payPeriod: {
    startDate: string
    endDate: string
  }
  isRecurring: boolean
  recurringFrequency: string
  notes: string
  status: string
  totalAmount: number
  employees: Employee[]
}

export default function PayrollViewPage() {
  const params = useParams()
  const router = useRouter()
  const [payroll, setPayroll] = useState<Payroll | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/v1/payroll/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch payroll")
        }

        const data = await response.json()
        const payrollData = data.data
        setPayroll(payrollData.payroll)
        setEmployees(payrollData.employees)
      } catch (error) {
        console.error("Error fetching payroll:", error)
        toast.error("Failed to load payroll details")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPayroll()
    }
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    router.push(`/dashboard/payroll/${params.id}/edit`)
  }

  const handleDownloadPDF = () => {
    toast.info("Generating PDF...", {
      description: "Your download will start shortly.",
    })
    // In a real implementation, this would generate and download a PDF
  }

  if (isLoading) {
    return (
      <div className="container p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading payroll details...</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!payroll) {
    return (
      <div className="container p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Payroll not found</h1>
        </div>
        <p>The requested payroll could not be found or you don't have permission to view it.</p>
      </div>
    )
  }

  return (
    <div className="container p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{payroll.name}</h1>
            <p className="text-sm text-gray-500">Payroll ID: {payroll.id}</p>
          </div>
        </div>
        <div className="flex space-x-2 print:hidden">
          {payroll.status.toLowerCase() !== "completed" && (
            <Button onClick={handleEdit} variant="outline" className="border-[#01133B] text-[#01133B]">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button onClick={handlePrint} variant="outline" className="border-[#01133B] text-[#01133B]">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-[#01133B] hover:bg-[#523526]">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(payroll.status)}>{payroll.status}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Payment Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{format(new Date(payroll.paymentDate), "MMMM d, yyyy")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">${payroll.totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Pay Period</h3>
              <p className="mb-4">
                {format(new Date(payroll.payPeriod.startDate), "MMM d, yyyy")} -{" "}
                {format(new Date(payroll.payPeriod.endDate), "MMM d, yyyy")}
              </p>

              <h3 className="text-sm font-medium text-gray-500 mb-1">Payroll Type</h3>
              <p className="mb-4 capitalize">{payroll.payrollType}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Recurring</h3>
              <p className="mb-4">{payroll.isRecurring ? `Yes (${payroll.recurringFrequency})` : "No"}</p>

              <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
              <p className="mb-4">{payroll.notes || "No notes"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employees ({employees.length})</CardTitle>
          <p className="text-sm text-gray-500">Total: ${payroll.totalAmount.toLocaleString()}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Salary</th>
                  <th className="px-4 py-3">Bonus</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net Pay</th>
                  <th className="px-4 py-3">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee.id} className={index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}>
                    <td className="px-4 py-4 text-sm">{employee.name}</td>
                    <td className="px-4 py-4 text-sm">{employee.position}</td>
                    <td className="px-4 py-4 text-sm">${employee.salary.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">${employee.bonus.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">${employee.deductions.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm font-medium">${employee.netPay.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">
                      <div>
                        <span className="font-medium">{employee.paymentMethod}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          {employee.paymentMethod === "Byn2" && employee.paymentDetails.mobileNumber && (
                            <span>Mobile: {employee.paymentDetails.mobileNumber}</span>
                          )}
                          {employee.paymentMethod === "Bank" && (
                            <>
                              <div>{employee.paymentDetails.bankName}</div>
                              <div>Acc: {employee.paymentDetails.accountNumber}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={5} className="px-4 py-4 text-right font-medium">
                    Total
                  </td>
                  <td className="px-4 py-4 font-bold">${payroll.totalAmount.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
