import * as invoiceService from "@/services/invoice_service";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: NextRequest) {

    const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;
    // Mock data - in a real app, this would fetch from a database
    try {
  
      // Get query parameters
      const { searchParams } = request.nextUrl
      const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 10
      const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1
      const status = searchParams.get("status") || undefined
      const search = searchParams.get("search") || undefined
  
      // Mock data - in a real app, this would fetch from a database
      const mockInvoices = await invoiceService.getInvoiceByBusinessId(auth.user._id, {
        limit,
        page,
        status,
        search,
      });

      let invoices = mockInvoices.data || [];
      
   // Filter by status if provided
   if (status) {
    invoices = invoices.filter(
      (invoice) => invoice.status.toLowerCase() === status.toLowerCase()
    );
  }
  
       // Filter by search term if provided
    if (search) {
      invoices = invoices.filter((invoice) => {
        const recipientName = invoice.recipientDetails?.name?.toLowerCase() || "";
        return (
          invoice.invoiceNumber?.toLowerCase().includes(search) ||
          invoice.companyName?.toLowerCase().includes(search) ||
          invoice.recipientEmail?.toLowerCase().includes(search) ||
          recipientName.includes(search) ||
          invoice.description?.toLowerCase().includes(search)
        );
      });
    }
  
     // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedInvoices = invoices.slice(startIndex, startIndex + limit);
  
      return NextResponse.json({
      invoices: paginatedInvoices,
      pagination: {
        total: invoices.length,
        page,
        limit,
        totalPages: Math.ceil(invoices.length / limit),
      },
    });
    } catch (error) {
      console.error("Error fetching invoices:", error)
      return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
    }
  }
