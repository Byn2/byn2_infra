import Invoice from '../models/invoice';

const projection = {
  _id: 1,
  invoiceNumber: 1,
  companyName: 1,
  recipientEmail: 1,
  issuedDate: 1,
  dueDate: 1,
  status: 1,
  amount: 1,
  currency: 1,
  createdBy: 1,
};

export async function storeInvoice(data, options = {}) {
  const invoice = new Invoice(data);
  return await invoice.save(options);
}

export async function createOrUpdateInvoice(data, options = {}) {
  if (data._id) {
    return await Invoice.findByIdAndUpdate(data._id, data, {
      new: true,
      upsert: true,
      ...options,
    });
  } else {
    const invoice = new Invoice(data);
    return await invoice.save(options);
  }
}

export async function getInvoices(status = 'all', skip = 0, limit = 20, options = {}) {
  const query = status !== 'all' ? { status } : {};
  return await Invoice.find(query, projection, {
    skip,
    limit,
    sort: { issuedDate: -1 },
    ...options,
  });
}

export async function getInvoice(id: string, options = {}) {
  return await Invoice.findById(id, projection, options);
}

export async function getUpcomingInvoices(limit = 5, options = {}) {
  return await Invoice.find(
    {
      status: 'Requested',
      dueDate: { $gte: new Date() },
    },
    projection,
    {
      sort: { dueDate: 1 },
      limit,
      ...options,
    }
  );
}
