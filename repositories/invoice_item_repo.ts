// @ts-nocheck
import InvoiceItem from '../models/invoice-item';

const projection = {
  _id: 1,
  invoiceId: 1,
  description: 1,
  price: 1,
  quantity: 1,
  total: 1,
};

export async function storeInvoiceItem(data: any, options = {}) {
  const invoiceItem = new InvoiceItem(data);
  return await invoiceItem.save(options);
}

export async function createOrUpdateInvoiceItem(data: any, options = {}) {
  if (data._id) {
    return await InvoiceItem.findByIdAndUpdate(data._id, data, {
      new: true,
      upsert: true,
      ...options,
    });
  } else {
    const invoiceItem = new InvoiceItem(data);
    return await invoiceItem.save(options);
  }
}

export async function getInvoiceItems(invoiceId: string) {
  return await InvoiceItem.find({ invoiceId }).select(projection);
}

export async function getInvoiceItemsByInvoiceId(invoiceId: string) {
  return await InvoiceItem.find({ invoiceId }).select(projection);
}

export async function deleteInvoiceItem(id: string, options = {}) {
  return await InvoiceItem.findByIdAndDelete(id, options);
}
