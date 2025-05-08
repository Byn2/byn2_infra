 "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { deleteInvoice } from "../actions"
import { toast } from "sonner"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const invoiceId = params.id as string

  // Function to fetch invoice by ID
  async function getInvoice(id: string) {
    try {
      const response = await fetch(`/api/v1/invoice/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch invoice")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error)
      throw error
    }
  }

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      setIsLoading(true)
      try {
        const result = await getInvoice(invoiceId)
        setInvoice(result.invoice)
        setItems(result.items || [])
      } catch (error) {
        console.error("Failed to fetch invoice details:", error)
        toast("Error", {
          description: "Failed to fetch invoice details. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (invoiceId) {
      fetchInvoiceDetails()
    }
  }, [invoiceId])

  // Handle delete
  const handleDelete = async () => {
    try {
      const result = await deleteInvoice(invoiceId)

      if (result.success) {
        toast("Success", {
          description: "Invoice deleted successfully",
        })
        router.push("/dashboard/invoices")
      } else {
        throw new Error(result.error || "Failed to delete invoice")
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast("Error", {
        description: (error as Error).message || "Failed to delete invoice",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "requested":
        return "bg-blue-100 text-blue-800"
      case "unpaid":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container p-8">
        <div className="flex animate-pulse flex-col space-y-4">
          <div className="h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="container p-8">
        <div className="rounded-lg border bg-white p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold">Invoice Not Found</h2>
          <p className="mb-6 text-gray-500">The invoice you are looking for does not exist or has been deleted.</p>
          <Link href="/dashboard/invoices">
            <Button className="bg-[#66432E] hover:bg-[#523526]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Destructure the nested objects for easier access
  const { recipientDetails, amount, installments, currency } = invoice || {}
  const { name, address, email, phone } = recipientDetails || {}
  const { subtotal, tax, total } = amount || {}
  const { count, isRecurring } = installments || {}

  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(invoice.status)}`}>
            {invoice.status}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Link href={`/dashboard/invoices/${invoiceId}/edit`}>
            <Button variant="outline" className="border-[#66432E] text-[#66432E]">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button variant="outline" className="text-red-500" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Invoice Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice Number:</span>
                <span>{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Issued Date:</span>
                <span>{new Date(invoice.issuedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date:</span>
                <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Installments:</span>
                <span>{count || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recurring:</span>
                <span>{isRecurring ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Currency:</span>
                <span>{currency || "SL"}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Client Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Company Name:</span>
                <span>{invoice.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient Name:</span>
                <span>{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span>{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span>{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Description:</span>
                <span>{invoice.description}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Invoice Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Price ({currency || "SL"})</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">
                        {currency || "SL"} {typeof item.price === "number" ? item.price.toLocaleString() : item.price}
                      </td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        {currency || "SL"} {typeof item.total === "number" ? item.total.toLocaleString() : item.total}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">
                    Subtotal:
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {currency || "SL"} {typeof subtotal === "number" ? subtotal.toLocaleString() : subtotal || 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">
                    Tax:
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {currency || "SL"} {typeof tax === "number" ? tax.toLocaleString() : tax || 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {currency || "SL"} {typeof total === "number" ? total.toLocaleString() : total || 0}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <h2 className="mb-2 text-lg font-semibold">Additional Notes</h2>
            <p className="rounded-lg bg-gray-50 p-4 text-gray-700">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
