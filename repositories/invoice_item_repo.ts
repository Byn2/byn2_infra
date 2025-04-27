import InvoiceItem from '../models/invoice-item';

const projection = {
  _id: 1,
  invoiceId: 1,
  description: 1,
  price: 1,
  quantity: 1,
  total: 1,
};

export async function storeInvoiceItem(data, options = {}) {
  const invoiceItem = new InvoiceItem(data);
  return await invoiceItem.save(options);
}

export async function createOrUpdateInvoiceItem(data, options = {}) {
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

export async function getInvoiceItems(invoiceId: string, options = {}) {
  return await InvoiceItem.find({ invoiceId }, projection, options);
}
