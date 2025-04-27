import * as InvoiceRepo from '../repositories/invoice_repo';

export async function storeInvoice(data, session?) {
  return await InvoiceRepo.storeInvoice(data, session);
}

export async function createOrUpdateInvoice(data, session?) {
  return await InvoiceRepo.createOrUpdateInvoice(data, session);
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
