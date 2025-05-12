import * as InvoiceItemRepo from '../repositories/invoice_item_repo';

export async function storeInvoiceItem(data: any, session?: any) {
  return await InvoiceItemRepo.storeInvoiceItem(data, session);
}

export async function createOrUpdateInvoiceItem(data: any, session?: any) {
  return await InvoiceItemRepo.createOrUpdateInvoiceItem(data, session);
}

export async function getInvoiceItems(invoiceId: string) {
  return await InvoiceItemRepo.getInvoiceItems(invoiceId);
}

export async function getInvoiceItemsByInvoiceId(invoiceId: string) {
  return await InvoiceItemRepo.getInvoiceItemsByInvoiceId(invoiceId);
}
