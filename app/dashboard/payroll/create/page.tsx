"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { createPayroll, savePayrollDraft } from "../actions"

// Update the Employee type to include payment method and details
type Employee = {
  id: number
  name: string
  position: string
  salary: number
  bonus: number
  deductions: number
  netPay: number
  paymentMethod: "Byn2" | "Bank"
  paymentDetails: {
    mobileNumber?: string
    accountName?: string
    accountNumber?: string
    bankName?: string
    routingNumber?: string
  }
}

export default function CreatePayrollPage() {
  const router = useRouter()

  // Form state
  const [payrollName, setPayrollName] = useState("")
  const [payrollType, setPayrollType] = useState("regular")
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date())
  const [payPeriodStart, setPayPeriodStart] = useState<Date | undefined>(new Date())
  const [payPeriodEnd, setPayPeriodEnd] = useState<Date | undefined>(new Date())
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("monthly")
  const [notes, setNotes] = useState("")

  // Update the initial employees state to include payment method and details
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Doe",
      position: "Software Engineer",
      salary: 5000,
      bonus: 0,
      deductions: 500,
      netPay: 4500,
      paymentMethod: "Byn2",
      paymentDetails: {
        mobileNumber: "+1234567890",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Product Manager",
      salary: 6000,
      bonus: 0,
      deductions: 600,
      netPay: 5400,
      paymentMethod: "Bank",
      paymentDetails: {
        accountName: "Jane Smith",
        accountNumber: "1234567890",
        bankName: "First National Bank",
        routingNumber: "987654321",
      },
    },
    {
      id: 3,
      name: "Michael Johnson",
      position: "Designer",
      salary: 4500,
      bonus: 0,
      deductions: 450,
      netPay: 4050,
      paymentMethod: "Byn2",
      paymentDetails: {
        mobileNumber: "+9876543210",
      },
    },
  ])

  // Initialize form state with server actions
  const [createFormState, createFormAction] = useFormState(createPayroll, {
    errors: {},
    message: null,
  })

  const [draftFormState, draftFormAction] = useFormState(savePayrollDraft, {
    errors: {},
    message: null,
  })

  // Show toast for form errors and handle redirects
  useEffect(() => {
    if (createFormState.errors?._form) {
      toast.error("Error", {
        description: createFormState.errors._form[0],
      })
    }

    if (draftFormState.errors?._form) {
      toast.error("Error", {
        description: draftFormState.errors._form[0],
      })
    }

    // Handle success messages
    if (createFormState.message) {
      toast.success("Success", {
        description: createFormState.message,
      })
    }

    if (draftFormState.message) {
      toast.success("Success", {
        description: draftFormState.message,
      })
    }

    // Handle redirects
    if (createFormState.success && createFormState.redirectTo) {
      router.push(createFormState.redirectTo)
    }

    if (draftFormState.success && draftFormState.redirectTo) {
      router.push(draftFormState.redirectTo)
    }
  }, [createFormState, draftFormState, router])

  // Update the handleAddEmployee function to include payment method and details
  const handleAddEmployee = () => {
    const newId = employees.length > 0 ? Math.max(...employees.map((emp) => emp.id)) + 1 : 1
    setEmployees([
      ...employees,
      {
        id: newId,
        name: "",
        position: "",
        salary: 0,
        bonus: 0,
        deductions: 0,
        netPay: 0,
        paymentMethod: "Byn2",
        paymentDetails: {
          mobileNumber: "",
        },
      },
    ])
  }

  // Update the handleEmployeeChange function to handle payment method and details
  const handleEmployeeChange = (id: number, field: string, value: string | number) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.id === id) {
        if (field === "paymentMethod") {
          // Reset payment details when switching payment method
          const paymentDetails =
            value === "Byn2"
              ? { mobileNumber: "" }
              : {
                  accountName: "",
                  accountNumber: "",
                  bankName: "",
                  routingNumber: "",
                }

          return {
            ...emp,
            [field]: value,
            paymentDetails,
          }
        } else if (field.startsWith("paymentDetails.")) {
          // Handle nested payment details fields
          const detailField = field.split(".")[1]
          return {
            ...emp,
            paymentDetails: {
              ...emp.paymentDetails,
              [detailField]: value,
            },
          }
        } else {
          const updatedEmp = { ...emp, [field]: value }

          // Recalculate net pay if salary, bonus, or deductions change
          if (field === "salary" || field === "bonus" || field === "deductions") {
            const salary = field === "salary" ? Number(value) : emp.salary
            const bonus = field === "bonus" ? Number(value) : emp.bonus
            const deductions = field === "deductions" ? Number(value) : emp.deductions
            updatedEmp.netPay = salary + bonus - deductions
          }

          return updatedEmp
        }
      }
      return emp
    })

    setEmployees(updatedEmployees)
  }

  const handleRemoveEmployee = (id: number) => {
    setEmployees(employees.filter((employee) => employee.id !== id))
  }

  const calculateTotalPayroll = () => {
    return employees.reduce((sum, emp) => sum + emp.netPay, 0)
  }

  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/payroll" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Payroll</h1>
          <p className="text-sm text-gray-500">Set up a new payroll for your employees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="space-y-6 lg:col-span-2">
          <form action={createFormAction}>
            {/* Hidden field to store employees data as JSON */}
            <input type="hidden" name="employeesData" value={JSON.stringify(employees)} />
            <input type="hidden" name="totalAmount" value={calculateTotalPayroll()} />

            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-medium">Payroll Details</h2>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2" htmlFor="payroll-name">
                    Payroll Name
                  </Label>
                  <Input
                    id="payroll-name"
                    name="payrollName"
                    placeholder="e.g., June 2024 Monthly Payroll"
                    value={payrollName}
                    onChange={(e) => setPayrollName(e.target.value)}
                    aria-describedby="payroll-name-error"
                  />
                  {createFormState.errors?.payrollName && (
                    <p id="payroll-name-error" className="mt-1 text-sm text-red-500">
                      {createFormState.errors.payrollName[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2" htmlFor="payroll-type">
                    Payroll Type
                  </Label>
                  <Select name="payrollType" value={payrollType} onValueChange={setPayrollType}>
                    <SelectTrigger id="payroll-type">
                      <SelectValue placeholder="Select payroll type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Payroll</SelectItem>
                      <SelectItem value="bonus">Bonus Payroll</SelectItem>
                      <SelectItem value="commission">Commission Payroll</SelectItem>
                      <SelectItem value="contractor">Contractor Payments</SelectItem>
                    </SelectContent>
                  </Select>
                  {createFormState.errors?.payrollType && (
                    <p className="mt-1 text-sm text-red-500">{createFormState.errors.payrollType[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2" htmlFor="payment-date">
                      Payment Date
                    </Label>
                    <input
                      type="hidden"
                      name="paymentDate"
                      value={paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !paymentDate && "text-muted-foreground",
                          )}
                          aria-describedby="payment-date-error"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {paymentDate ? format(paymentDate, "PP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {createFormState.errors?.paymentDate && (
                      <p id="payment-date-error" className="mt-1 text-sm text-red-500">
                        {createFormState.errors.paymentDate[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="pay-period-start">
                      Pay Period Start
                    </Label>
                    <input
                      type="hidden"
                      name="payPeriodStart"
                      value={payPeriodStart ? format(payPeriodStart, "yyyy-MM-dd") : ""}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !payPeriodStart && "text-muted-foreground",
                          )}
                          aria-describedby="pay-period-start-error"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {payPeriodStart ? format(payPeriodStart, "PP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={payPeriodStart} onSelect={setPayPeriodStart} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {createFormState.errors?.payPeriodStart && (
                      <p id="pay-period-start-error" className="mt-1 text-sm text-red-500">
                        {createFormState.errors.payPeriodStart[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2" htmlFor="pay-period-end">
                      Pay Period End
                    </Label>
                    <input
                      type="hidden"
                      name="payPeriodEnd"
                      value={payPeriodEnd ? format(payPeriodEnd, "yyyy-MM-dd") : ""}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !payPeriodEnd && "text-muted-foreground",
                          )}
                          aria-describedby="pay-period-end-error"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {payPeriodEnd ? format(payPeriodEnd, "PP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={payPeriodEnd} onSelect={setPayPeriodEnd} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {createFormState.errors?.payPeriodEnd && (
                      <p id="pay-period-end-error" className="mt-1 text-sm text-red-500">
                        {createFormState.errors.payPeriodEnd[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input type="hidden" name="isRecurring" value={isRecurring.toString()} />
                      <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                      <Label className="mb-2" htmlFor="recurring">
                        Recurring Payroll
                      </Label>
                    </div>
                  </div>
                </div>

                {isRecurring && (
                  <div>
                    <Label className="mb-2" htmlFor="recurring-frequency">
                      Frequency
                    </Label>
                    <Select name="recurringFrequency" value={recurringFrequency} onValueChange={setRecurringFrequency}>
                      <SelectTrigger id="recurring-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                    {createFormState.errors?.recurringFrequency && (
                      <p className="mt-1 text-sm text-red-500">{createFormState.errors.recurringFrequency[0]}</p>
                    )}
                  </div>
                )}

                <div>
                  <Label className="mb-2" htmlFor="notes">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes about this payroll"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-20"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Employees</h2>
                <Button type="button" variant="outline" size="sm" onClick={handleAddEmployee}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </div>

              {createFormState.errors?.employees && (
                <p className="mb-4 text-sm text-red-500">{createFormState.errors.employees[0]}</p>
              )}

              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">{employee.name || "New Employee"}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleRemoveEmployee(employee.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="mb-2" htmlFor={`employee-name-${employee.id}`}>
                          Employee Name
                        </Label>
                        <Input
                          id={`employee-name-${employee.id}`}
                          value={employee.name}
                          onChange={(e) => handleEmployeeChange(employee.id, "name", e.target.value)}
                          placeholder="Employee Name"
                        />
                      </div>
                      <div>
                        <Label className="mb-2" htmlFor={`employee-position-${employee.id}`}>
                          Position
                        </Label>
                        <Input
                          id={`employee-position-${employee.id}`}
                          value={employee.position}
                          onChange={(e) => handleEmployeeChange(employee.id, "position", e.target.value)}
                          placeholder="Position"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <Label className="mb-2" htmlFor={`employee-salary-${employee.id}`}>
                          Base Salary
                        </Label>
                        <Input
                          id={`employee-salary-${employee.id}`}
                          type="number"
                          value={employee.salary}
                          onChange={(e) => handleEmployeeChange(employee.id, "salary", Number(e.target.value))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label className="mb-2" htmlFor={`employee-bonus-${employee.id}`}>
                          Bonus
                        </Label>
                        <Input
                          id={`employee-bonus-${employee.id}`}
                          type="number"
                          value={employee.bonus}
                          onChange={(e) => handleEmployeeChange(employee.id, "bonus", Number(e.target.value))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label className="mb-2" htmlFor={`employee-deductions-${employee.id}`}>
                          Deductions
                        </Label>
                        <Input
                          id={`employee-deductions-${employee.id}`}
                          type="number"
                          value={employee.deductions}
                          onChange={(e) => handleEmployeeChange(employee.id, "deductions", Number(e.target.value))}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <div className="mb-4">
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <Label className="mb-2">Payment Method</Label>
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`payment-method-${employee.id}`} className="text-sm text-gray-500">
                                {employee.paymentMethod === "Byn2" ? "Byn2" : "Bank"}
                              </Label>
                              <Switch
                                id={`payment-method-${employee.id}`}
                                checked={employee.paymentMethod === "Bank"}
                                onCheckedChange={(checked) =>
                                  handleEmployeeChange(employee.id, "paymentMethod", checked ? "Bank" : "Byn2")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {employee.paymentMethod === "Byn2" ? (
                        <div>
                          <Label className="mb-2" htmlFor={`mobile-number-${employee.id}`}>
                            Mobile Number
                          </Label>
                          <Input
                            id={`mobile-number-${employee.id}`}
                            value={employee.paymentDetails.mobileNumber || ""}
                            onChange={(e) =>
                              handleEmployeeChange(employee.id, "paymentDetails.mobileNumber", e.target.value)
                            }
                            placeholder="Enter mobile number"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label className="mb-2" htmlFor={`account-name-${employee.id}`}>
                              Account Name
                            </Label>
                            <Input
                              id={`account-name-${employee.id}`}
                              value={employee.paymentDetails.accountName || ""}
                              onChange={(e) =>
                                handleEmployeeChange(employee.id, "paymentDetails.accountName", e.target.value)
                              }
                              placeholder="Account holder name"
                            />
                          </div>
                          <div>
                            <Label className="mb-2" htmlFor={`account-number-${employee.id}`}>
                              Account Number
                            </Label>
                            <Input
                              id={`account-number-${employee.id}`}
                              value={employee.paymentDetails.accountNumber || ""}
                              onChange={(e) =>
                                handleEmployeeChange(employee.id, "paymentDetails.accountNumber", e.target.value)
                              }
                              placeholder="Account number"
                            />
                          </div>
                          <div>
                            <Label className="mb-2" htmlFor={`bank-name-${employee.id}`}>
                              Bank Name
                            </Label>
                            <Input
                              id={`bank-name-${employee.id}`}
                              value={employee.paymentDetails.bankName || ""}
                              onChange={(e) =>
                                handleEmployeeChange(employee.id, "paymentDetails.bankName", e.target.value)
                              }
                              placeholder="Bank name"
                            />
                          </div>
                          <div>
                            <Label className="mb-2" htmlFor={`routing-number-${employee.id}`}>
                              Routing Number
                            </Label>
                            <Input
                              id={`routing-number-${employee.id}`}
                              value={employee.paymentDetails.routingNumber || ""}
                              onChange={(e) =>
                                handleEmployeeChange(employee.id, "paymentDetails.routingNumber", e.target.value)
                              }
                              placeholder="Routing number"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Net Pay</p>
                        <p className="font-medium">${employee.netPay.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="hidden lg:block">{/* This is just a placeholder for layout purposes */}</div>
          </form>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Payroll Summary</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Payroll Name</p>
                <p className="font-medium">{payrollName || "New Payroll"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payroll Type</p>
                <p className="font-medium capitalize">{payrollType} Payroll</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium">{paymentDate ? format(paymentDate, "MMM dd yyyy") : "Apr 25 2025"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Pay Period</p>
                <p className="font-medium">
                  {payPeriodStart && payPeriodEnd
                    ? `${payPeriodStart ? format(payPeriodStart, "MMM dd yyyy") : "May 25 2025"} to ${
                        payPeriodEnd ? format(payPeriodEnd, "MMM dd yyyy") : "Jun 25 2025"
                      }`
                    : "Not set"}
                </p>
              </div>

              {isRecurring && (
                <div>
                  <p className="text-sm text-gray-500">Recurring</p>
                  <p className="font-medium capitalize">{recurringFrequency}</p>
                </div>
              )}

              <div className="pt-4">
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="font-medium">{employees.length}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Total Payroll Amount</p>
                <p className="text-xl font-bold">${calculateTotalPayroll().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-[#DCE1EC] p-6">
            <h2 className="mb-4 text-lg font-medium">Actions</h2>

            <div className="space-y-4">
              <form action={draftFormAction}>
                {/* Hidden fields for draft form */}
                <input type="hidden" name="employeesData" value={JSON.stringify(employees)} />
                <input type="hidden" name="totalAmount" value={calculateTotalPayroll()} />
                <input type="hidden" name="payrollName" value={payrollName} />
                <input type="hidden" name="payrollType" value={payrollType} />
                <input type="hidden" name="paymentDate" value={paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""} />
                <input
                  type="hidden"
                  name="payPeriodStart"
                  value={payPeriodStart ? format(payPeriodStart, "yyyy-MM-dd") : ""}
                />
                <input
                  type="hidden"
                  name="payPeriodEnd"
                  value={payPeriodEnd ? format(payPeriodEnd, "yyyy-MM-dd") : ""}
                />
                <input type="hidden" name="isRecurring" value={isRecurring.toString()} />
                <input type="hidden" name="recurringFrequency" value={recurringFrequency} />
                <input type="hidden" name="notes" value={notes} />

                <Button type="submit" variant="outline" className="w-full border-[#01133B] text-[#01133B]">
                  Save as Draft
                </Button>
              </form>

              <form action={createFormAction}>
                {/* Hidden fields for process form */}
                <input type="hidden" name="employeesData" value={JSON.stringify(employees)} />
                <input type="hidden" name="totalAmount" value={calculateTotalPayroll()} />
                <input type="hidden" name="payrollName" value={payrollName} />
                <input type="hidden" name="payrollType" value={payrollType} />
                <input type="hidden" name="paymentDate" value={paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""} />
                <input
                  type="hidden"
                  name="payPeriodStart"
                  value={payPeriodStart ? format(payPeriodStart, "yyyy-MM-dd") : ""}
                />
                <input
                  type="hidden"
                  name="payPeriodEnd"
                  value={payPeriodEnd ? format(payPeriodEnd, "yyyy-MM-dd") : ""}
                />
                <input type="hidden" name="isRecurring" value={isRecurring.toString()} />
                <input type="hidden" name="recurringFrequency" value={recurringFrequency} />
                <input type="hidden" name="notes" value={notes} />

                <Button type="submit" className="w-full bg-[#01133B] hover:bg-[#523526]">
                  Process Payroll
                </Button>
              </form>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>
                Note: Processing payroll will initiate payments to all employees based on the information provided. Make
                sure all details are correct before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
