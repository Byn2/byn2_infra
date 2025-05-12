"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileUp, BarChart, Trash2, Edit, Eye } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { deleteInvoice, type Invoice } from "./actions"

interface InvoiceWithId extends Invoice {
  id: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [invoices, setInvoices] = useState<InvoiceWithId[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

  // Fetch invoices
  const fetchInvoices = async () => {
    setIsLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", "10")
      if (activeTab !== "all") params.append("status", activeTab)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/v1/invoice?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch invoices")
      }

      const result = await response.json()
      setInvoices(result.invoices)
      setPagination(result.pagination)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
      toast("Error", {
        description: "Failed to fetch invoices. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchInvoices()
  }

  // Handle delete
  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!invoiceToDelete) return

    try {
      const result = await deleteInvoice(invoiceToDelete)

      //@ts-ignore
      if (result.success) {
        toast("Success", {
          description: "Invoice deleted successfully",
        })
        fetchInvoices()
      } else {
        //@ts-ignore
        throw new Error(result.error || "Failed to delete invoice")
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast("Error", {
        description: (error as Error).message || "Failed to delete invoice",
      })
    } finally {
      setDeleteDialogOpen(false)
      setInvoiceToDelete(null)
    }
  }

  // Fetch invoices on initial load and when dependencies change
  useEffect(() => {
    fetchInvoices()
  }, [activeTab, currentPage])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  // Count invoices by status
  const getStatusCounts = () => {
    const counts = {
      all: 0,
      completed: 0,
      overdue: 0,
      processing: 0,
      requested: 0,
      unpaid: 0,
    }

    // If we're still loading or don't have pagination data, return empty counts
    if (isLoading || !pagination) return counts

    // Set the total count
    counts.all = pagination.total

    // For the specific status counts, we'll use the current data we have
    // In a real app, you might want to fetch these counts from the API
    invoices.forEach((invoice) => {
      const status = invoice.status?.toLowerCase() || ""
      if (counts.hasOwnProperty(status)) {
        counts[status as keyof typeof counts]++
      }
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/invoices/dashboard">
            <Button variant="outline" className="border-[#66432E] text-[#66432E]">
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/invoices/create">
            <Button className="bg-[#66432E] hover:bg-[#523526]">Create Invoice</Button>
          </Link>
          <Button variant="outline" className="border-[#66432E] text-[#66432E]">
            <FileUp className="mr-2 h-4 w-4" />
            Import Invoice
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "rounded-md bg-[#F8F7F2] text-[#66432E]" : "text-gray-500"}`}
              onClick={() => handleTabChange("all")}
            >
              All <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{statusCounts.all}</span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "completed" ? "rounded-md bg-[#F8F7F2] text-[#66432E]" : "text-gray-500"}`}
              onClick={() => handleTabChange("completed")}
            >
              Completed{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{statusCounts.completed}</span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "overdue" ? "rounded-md bg-[#F8F7F2] text-[#66432E]" : "text-gray-500"}`}
              onClick={() => handleTabChange("overdue")}
            >
              Overdue <span className="ml-1 rounded-full bg-red-200 px-2 py-0.5 text-xs">{statusCounts.overdue}</span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "processing" ? "rounded-md bg-[#F8F7F2] text-[#66432E]" : "text-gray-500"}`}
              onClick={() => handleTabChange("processing")}
            >
              Processing{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{statusCounts.processing}</span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "requested" ? "rounded-md bg-[#F8F7F2] text-[#66432E]" : "text-gray-500"}`}
              onClick={() => handleTabChange("requested")}
            >
              Requested{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{statusCounts.requested}</span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "unpaid" ? "rounded-md bg-[#F8F7F2] text-[#66432E]" : "text-gray-500"}`}
              onClick={() => handleTabChange("unpaid")}
            >
              Unpaid <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{statusCounts.unpaid}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-9 w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-gray-500">
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issued Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    </td>
                  </tr>
                ))
              ) : invoices.length > 0 ? (
                // Render invoices
                invoices.map((invoice, index) => (
                  <tr key={invoice._id} className={index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}>
                    <td className="px-4 py-4 text-sm">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-4 text-sm">{invoice.companyName}</td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(invoice.status || "")}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">{new Date(invoice.issuedDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm">
                      Le {invoice.amount && invoice.amount.total ? invoice.amount.total.toLocaleString() : "0"}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/invoices/${invoice._id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/invoices/${invoice._id}/edit`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => invoice._id && handleDeleteClick(invoice._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // No invoices found
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && pagination && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {invoices.length} of {pagination.total} invoices
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{pagination.page}</span>
              <span className="text-sm text-gray-500">of {pagination.totalPages} pages</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage >= pagination.totalPages}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
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
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
