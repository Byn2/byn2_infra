import * as invoiceService from "@/services/invoice_service";
import * as invoiceItemService from "@/services/invoice-item.service";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

// GET a specific invoice by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const auth = await verifyToken(request);

    if ("user" in auth === false) return auth;

  try {

    const { id } = params

    const invoiceData = await invoiceService.getInvoice(id);
    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    
    const invoiceItems = await invoiceItemService.getInvoiceItemsByInvoiceId(id);

    // if (!invoiceItems) {
    //   return NextResponse.json({ error: "Invoice items not found" }, { status: 404 });
    // }

    return NextResponse.json({ invoice: invoiceData, items: invoiceItems }, { status: 200 })
  } catch (error) {
    console.error(`Error fetching invoice ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}