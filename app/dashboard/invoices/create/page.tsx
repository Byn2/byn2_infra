"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Calendar, Plus, Trash2 } from "lucide-react"
import { createInvoice } from "../actions"

interface InvoiceItem {
  description: string
  price: string
  quantity: string
  total: string
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState("#123456")
  const [companyName, setCompanyName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [invoiceDescription, setInvoiceDescription] = useState("")
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [installmentCount, setInstallmentCount] = useState(1)
  const [isRecurring, setIsRecurring] = useState(false)
  const [notes, setNotes] = useState("")
  const [taxRate, setTaxRate] = useState("0")
  const [currency, setCurrency] = useState("SL")

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: "", price: "", quantity: "", total: "0" },
  ])

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", price: "", quantity: "", total: "0" }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...invoiceItems]
    newItems.splice(index, 1)
    setInvoiceItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...invoiceItems]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate total if price or quantity changes
    if (field === "price" || field === "quantity") {
      const price = Number.parseFloat(newItems[index].price) || 0
      const quantity = Number.parseFloat(newItems[index].quantity) || 0
      newItems[index].total = (price * quantity).toString()
    }

    setInvoiceItems(newItems)
  }

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0)
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return subtotal * (Number.parseFloat(taxRate) / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSaveAsDraft = async () => {
    await handleSubmit("draft")
  }

  const handleSendInvoice = async () => {
    await handleSubmit("requested")
  }

  const handleSubmit = async (status: string) => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!companyName) {
        throw new Error("Company name is required")
      }
      if (!recipientName) {
        throw new Error("Recipient name is required")
      }
      if (!recipientEmail) {
        throw new Error("Recipient email is required")
      }
      if (!issuedDate) {
        throw new Error("Issued date is required")
      }
      if (!dueDate) {
        throw new Error("Due date is required")
      }
      if (invoiceItems.length === 0 || !invoiceItems[0].description) {
        throw new Error("At least one invoice item is required")
      }

      // Create form data
      const formData = new FormData()
      formData.append("companyName", companyName)
      formData.append("recipientName", recipientName)
      formData.append("recipientAddress", recipientAddress)
      formData.append("recipientEmail", recipientEmail)
      formData.append("recipientPhone", recipientPhone)
      formData.append("description", invoiceDescription)
      formData.append("issuedDate", issuedDate)
      formData.append("dueDate", dueDate)
      formData.append("installmentCount", installmentCount.toString())
      formData.append("isRecurring", isRecurring ? "on" : "off")
      formData.append("notes", notes)
      formData.append("status", status === "draft" ? "Requested" : "Requested")
      formData.append("taxRate", taxRate)
      formData.append("currency", currency)

      // Add invoice items
      formData.append("itemCount", invoiceItems.length.toString())
      invoiceItems.forEach((item, index) => {
        formData.append(`item[${index}].description`, item.description)
        formData.append(`item[${index}].price`, item.price)
        formData.append(`item[${index}].quantity`, item.quantity)
        formData.append(`item[${index}].total`, item.total)
      })

      // Submit the form
      const result = await createInvoice(formData)
      console.log(result)

      //@ts-ignore
      if (result.success) {
        toast( "Success", {
          description: status === "draft" ? "Invoice saved as draft" : "Invoice sent",
        });

        //@ts-ignore
        router.push(result.redirectTo);
      } else {
        //@ts-ignore
        throw new Error(result.error || "Failed to create invoice")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast("Error", {
        description: (error as Error).message || "Failed to create invoice",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4">
              <Label className="mb-2" htmlFor="invoice-number">Invoice Number: {invoiceNumber}</Label>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2" htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium">Recipient Details</h3>

                <div>
                  <Label className="mb-2" htmlFor="recipient-name">Name</Label>
                  <Input
                    id="recipient-name"
                    placeholder="Enter recipient name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="mb-2" htmlFor="recipient-address">Address</Label>
                  <Input
                    id="recipient-address"
                    placeholder="Enter recipient address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2" htmlFor="recipient-email">Email</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="Enter recipient email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="mb-2" htmlFor="recipient-phone">Phone</Label>
                  <Input
                    id="recipient-phone"
                    placeholder="Enter recipient phone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2" htmlFor="invoice-description">Invoice Description</Label>
                <Input
                  id="invoice-description"
                  placeholder="Enter invoice description"
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2" htmlFor="issued-date">Issued on</Label>
                  <div className="relative">
                    <Input
                      id="issued-date"
                      type="date"
                      value={issuedDate}
                      onChange={(e) => setIssuedDate(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label className="mb-2" htmlFor="due-date">Due on</Label>
                  <div className="relative">
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <Label className="mb-2" htmlFor="installment-count">Number of Installments:</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="installment-count"
                      type="number"
                      min="1"
                      value={installmentCount}
                      onChange={(e) => setInstallmentCount(Number.parseInt(e.target.value))}
                      className="w-16"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label className="mb-2 text-sm" htmlFor="recurring">
                    This is a recurring invoice
                  </Label>
                </div>
              </div>

              <div>
                <Label className="mb-2" htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-[#66432E] focus:outline-none focus:ring-[#66432E]"
                >
                  <option value="SL">SL (Leone)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Invoice Items</h2>

            <div className="mb-4 grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Price ({currency})</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Total Price</div>
              <div className="col-span-1"></div>
            </div>

            {invoiceItems.map((item, index) => (
              <div key={index} className="mb-2 grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="0"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input type="text" placeholder="0" value={item.total} readOnly />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {invoiceItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" className="mt-2" onClick={handleAddItem}>
              <Plus className="mr-1 h-4 w-4" /> Add Item
            </Button>

            <div className="mt-4 flex justify-end space-x-4 border-t pt-4">
              <div className="text-right">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>
                    {currency} {calculateSubtotal().toLocaleString()}
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">Tax Rate:</span>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-16 text-right"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>
                    {currency} {calculateTax().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span>
                    {currency} {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <Label className="mb-2" htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or terms"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 h-24"
            />
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="rounded-lg border bg-[#FAF7F2] p-6">
          <div className="mb-6 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Invoice Number: {invoiceNumber}</h2>

            <div className="mb-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bill to</h3>
                <p className="font-medium">{recipientName || "Recipient Name"}</p>
                <p className="text-sm">{recipientAddress || "42 Soldier St, Freetown"}</p>
                <p className="text-sm">{recipientEmail || "client@example.com"}</p>
                <p className="text-sm">{recipientPhone || "+232 76123456"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Bill from</h3>
                <p className="font-medium">{companyName || "Your Company"}</p>
                <p className="text-sm">42 Soldier St, Freetown</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Issued On: {issuedDate ? new Date(issuedDate).toLocaleDateString() : ""}
                  </h3>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Due On: {dueDate ? new Date(dueDate).toLocaleDateString() : ""}
                  </h3>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Number of Installments: {installmentCount}</h3>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-gray-500">Invoice Item</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs">
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.filter((item) => item.description).length > 0 ? (
                    invoiceItems
                      .filter((item) => item.description)
                      .map((item, index) => (
                        <tr key={index} className="border-b text-sm">
                          <td className="py-2">{item.description}</td>
                          <td className="py-2">
                            {currency} {item.price}
                          </td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2 text-right">
                            {currency} {item.total}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <>
                      <tr className="border-b text-sm">
                        <td className="py-2">Sample Item</td>
                        <td className="py-2">{currency} 100</td>
                        <td className="py-2">1</td>
                        <td className="py-2 text-right">{currency} 100</td>
                      </tr>
                    </>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">
                      Subtotal:
                    </td>
                    <td className="pt-2 text-right">
                      {currency} {calculateSubtotal().toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-1 text-right font-medium">
                      Tax ({taxRate}%):
                    </td>
                    <td className="pt-1 text-right">
                      {currency} {calculateTax().toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-1 text-right font-medium">
                      Total:
                    </td>
                    <td className="pt-1 text-right font-bold">
                      {currency} {calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {notes && (
              <div className="mt-4 border-t pt-4">
                <h3 className="mb-2 text-sm font-medium text-gray-500">Notes</h3>
                <p className="text-sm text-gray-600">{notes}</p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Our invoice application streamlines your billing process with a comprehensive solution for creating and
              managing invoices effortlessly, while easily tracking payment statuses. Generate detailed financial
              reports to gain insights into your business performance.
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="border-[#66432E] text-[#66432E]"
            >
              Save as Draft
            </Button>
            <Button onClick={handleSendInvoice} disabled={isLoading} className="bg-[#66432E] hover:bg-[#523526]">
              {isLoading ? "Processing..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
