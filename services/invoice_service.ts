//@ts-nocheck
//@ts-ignore
import * as InvoiceRepo from '../repositories/invoice_repo';
import * as InvoiceItemRepo from '../repositories/invoice_item_repo';
import  InvoiceCounter  from '../models/invoice_counter';


export async function createOrUpdateInvoice(data: any, session?: any) {
  const { items, ...invoiceData } = data;

  if (!invoiceData.invoiceNumber) {
    invoiceData.invoiceNumber = await generateInvoiceNumber(); // Replace with your logic
  }

  const invoice = await InvoiceRepo.createOrUpdateInvoice(invoiceData,session);

  if (items && items.length > 0) {
    const itemData = items.map((item) => ({
      ...item,
      invoiceId: invoice.id,
    }));

     // 1. Get all existing items for this invoice
     const existingItems = await InvoiceItemRepo.getInvoiceItems(invoice.id);
     const existingItemIds = existingItems.map(item => item.id.toString());
 
     // 2. Get the incoming item IDs
     const incomingItemIds = itemData.filter(i => i.id).map(i => i.id.toString());
 
     // 3. Find items to delete (present in DB but missing in incoming)
     const itemsToDelete = existingItemIds.filter(id => !incomingItemIds.includes(id));
 
     // 4. Delete missing items
     for (const itemId of itemsToDelete) {
       await InvoiceItemRepo.deleteInvoiceItem(itemId, session);
     }
 
     // 5. Upsert (create/update) current items
     for (const item of itemData) {
       await InvoiceItemRepo.createOrUpdateInvoiceItem(item, session);
     }
    
   
  }

  return invoice;

}

export async function getInvoices(status = 'all', skip = 0, limit = 20) {
  return await InvoiceRepo.getInvoices(status, skip, limit);
}

export async function getInvoice(id: string) {
  return await InvoiceRepo.getInvoice(id);
}

export async function getUpcomingInvoices(limit = 5) {
  return await InvoiceRepo.getUpcomingInvoices(limit);
}

export async function getInvoiceByBusinessId(
  businessId: string,
  options: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}
) {
  return await InvoiceRepo.getInvoiceByBusinessId(businessId, options);
}

export async function deleteInvoice(id: string, session: any) {
  await InvoiceRepo.deleteInvoice(id, session);
  await InvoiceItemRepo.deleteInvoiceItem(id, session);
}


export async function generateInvoiceNumber(): Promise<string> {
  const counter = await InvoiceCounter.findByIdAndUpdate(
    'invoiceNumber',
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return `INV-${counter.sequence_value}`;
}


// async function generateInvoiceNumber() {
//   const timestamp = Date.now().toString().slice(-6);
//   const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
//   return `INV-${timestamp}-${random}`;
// }
