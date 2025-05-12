"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as invoiceService from "@/services/invoice_service";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";
import {connectDB} from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/middleware/get-auth-user";


// Define the Invoice interface to match the schema
export interface InvoiceItem {
  _id?: string
  invoiceId?: string
  description: string
  price: number
  quantity: number
  total: number
  createdAt?: string
  updatedAt?: string
}

export interface RecipientDetails {
  name: string
  address?: string
  email: string
  phone?: string
}

export interface InvoiceAmount {
  subtotal: number
  tax: number
  total: number
}

export interface InvoiceInstallments {
  count: number
  isRecurring: boolean
}

export interface Invoice {
  business_id: string
  _id?: string
  invoiceNumber?: string
  companyName: string
  recipientEmail: string
  recipientDetails: RecipientDetails
  description?: string
  issuedDate: string
  dueDate: string
  status?: string
  amount: InvoiceAmount
  currency?: string
  installments: InvoiceInstallments
  notes?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  items: InvoiceItem[]
}

// Fetch all invoices with optional filtering
// export async function getInvoices(
//   options: {
//     page?: number
//     limit?: number
//     status?: string
//     search?: string
//   } = {},
// ) {
//   await connectDB();
//   try {
//     const { page = 1, limit = 10, status, search } = options

//     // Build query parameters
//     const params = new URLSearchParams()
    
//     params.append("page", page.toString())
//     params.append("limit", limit.toString())
//     if (status) params.append("status", status)
//     if (search) params.append("search", search)
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/invoices?${params.toString()}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       })


//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.error || "Failed to fetch invoices")
//     }

//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching invoices:", error)
//     throw error
//   }
// }

// Fetch a specific invoice by ID
// export async function getInvoice(id: string) {
//   try {
//     const response = await fetch(`/api/v1/invoice/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.error || "Failed to fetch invoice")
//     }

//     return await response.json()
//   } catch (error) {
//     console.error(`Error fetching invoice ${id}:`, error)
//     throw error
//   }
// }

// Create a new invoice
export async function createInvoice(formData: FormData) {
  const authUser = await getAuthenticatedUser();

  //@ts-ignore
  if ("user" in authUser === false) return authUser;
  const session = await startTransaction();

  try {
    // Extract and format invoice data from form
    const recipientName = formData.get("recipientName") as string
    const recipientAddress = formData.get("recipientAddress") as string
    const recipientEmail = formData.get("recipientEmail") as string
    const recipientPhone = formData.get("recipientPhone") as string

    // Extract item data
    const itemCount = Number.parseInt(formData.get("itemCount") as string) || 0
    const items: InvoiceItem[] = []

    let subtotal = 0

    for (let i = 0; i < itemCount; i++) {
      const description = formData.get(`item[${i}].description`) as string
      const price = Number.parseFloat(formData.get(`item[${i}].price`) as string) || 0
      const quantity = Number.parseFloat(formData.get(`item[${i}].quantity`) as string) || 0
      const total = price * quantity

      if (description && price && quantity) {
        items.push({
          description,
          price,
          quantity,
          total,
        })

        subtotal += total
      }
    }

    // Calculate tax and total
    const taxRate = Number.parseFloat(formData.get("taxRate") as string) || 0
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax

    const invoiceData: Invoice = {
      business_id: authUser.user._id,
      companyName: formData.get("companyName") as string,
      recipientEmail: recipientEmail,
      recipientDetails: {
        name: recipientName,
        address: recipientAddress,
        email: recipientEmail,
        phone: recipientPhone,
      },
      description: formData.get("description") as string,
      issuedDate: formData.get("issuedDate") as string,
      dueDate: formData.get("dueDate") as string,
      status: (formData.get("status") as string) || "Requested",
      amount: {
        subtotal,
        tax,
        total,
      },
      currency: (formData.get("currency") as string) || "SL",
      installments: {
        count: Number.parseInt(formData.get("installmentCount") as string) || 1,
        isRecurring: formData.get("isRecurring") === "on",
      },
      notes: formData.get("notes") as string,
      items,
    }

    await invoiceService.createOrUpdateInvoice(invoiceData, session);
    await commitTransaction(session);
    // Revalidate the invoices page and redirect
    revalidatePath("/dashboard/invoices")
    return {
      success: true,
      redirectTo: "/dashboard/invoices",
      message: "Payroll processed successfully",
    };
   
  } catch (error) {
    await abortTransaction(session);
    console.error("Error creating invoice:", error)
    return {
      errors: {
        _form: ["Failed to create payroll. Please try again."],
      },
    };
  }
}

// Update an existing invoice
export async function updateInvoice(id: string, formData: FormData) {
  const authUser = await getAuthenticatedUser();

  //@ts-ignore
  if ("user" in authUser === false) return authUser;
  const session = await startTransaction();

  try {
    // Extract and format invoice data from form
    const recipientName = formData.get("recipientName") as string
    const recipientAddress = formData.get("recipientAddress") as string
    const recipientEmail = formData.get("recipientEmail") as string
    const recipientPhone = formData.get("recipientPhone") as string

    // Extract item data
    const itemCount = Number.parseInt(formData.get("itemCount") as string) || 0
    const items: InvoiceItem[] = []

    let subtotal = 0

    for (let i = 0; i < itemCount; i++) {
      const description = formData.get(`item[${i}].description`) as string
      const price = Number.parseFloat(formData.get(`item[${i}].price`) as string) || 0
      const quantity = Number.parseFloat(formData.get(`item[${i}].quantity`) as string) || 0
      const total = price * quantity

      if (description && price && quantity) {
        items.push({
          description,
          price,
          quantity,
          total,
        })

        subtotal += total
      }
    }

    // Calculate tax and total
    const taxRate = Number.parseFloat(formData.get("taxRate") as string) || 0
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax

    const invoiceData: Invoice = {
      _id: id,
      business_id: authUser.user._id,
      companyName: formData.get("companyName") as string,
      recipientEmail: recipientEmail,
      recipientDetails: {
        name: recipientName,
        address: recipientAddress,
        email: recipientEmail,
        phone: recipientPhone,
      },
      description: formData.get("description") as string,
      issuedDate: formData.get("issuedDate") as string,
      dueDate: formData.get("dueDate") as string,
      status: formData.get("status") as string,
      amount: {
        subtotal,
        tax,
        total,
      },
      currency: (formData.get("currency") as string) || "SL",
      installments: {
        count: Number.parseInt(formData.get("installmentCount") as string) || 1,
        isRecurring: formData.get("isRecurring") === "on",
      },
      notes: formData.get("notes") as string,
      items,
    }

    await invoiceService.createOrUpdateInvoice(invoiceData, session);
    await commitTransaction(session);

    revalidatePath("/dashboard/invoices")

    return {
      success: true,
      redirectTo: `/dashboard/invoices`,
      message: "Payroll updated successfully",
    };

  } catch (error) {
    await abortTransaction(session);
    console.error(`Error updating invoice ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

// Delete an invoice
export async function deleteInvoice(id: string) {
  const authUser = await getAuthenticatedUser();

  //@ts-ignore
  if ("user" in authUser === false) return authUser;
  const session = await startTransaction();
  try {
    
    await invoiceService.deleteInvoice(id, session);
    await commitTransaction(session);

    // Revalidate the invoices page
    revalidatePath("/dashboard/invoices")

    return { success: true }
  } catch (error) {
    await abortTransaction(session);
    console.error(`Error deleting invoice ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}
