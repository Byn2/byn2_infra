import Invoice from '../models/invoice';

const projection = {
  _id: 1,
  invoiceNumber: 1,
  business_id: 1,
  companyName: 1,
  description: 1,
  recipientEmail: 1,
  'recipientDetails.name': 1,
  'recipientDetails.email': 1,
  'recipientDetails.phone': 1,
  'recipientDetails.address': 1,
  issuedDate: 1,
  dueDate: 1,
  status: 1,
  amount: 1,
  currency: 1,
  installments: 1,
  notes: 1,
  createdAt: 1,
  updatedAt: 1,
  createdBy: 1,
};


export async function storeInvoice(data, options = {}) {
  const invoice = new Invoice(data);
  return await invoice.save(options);
}

export async function createOrUpdateInvoice(data, options = {}) {
  console.log("update", data);
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

export async function getInvoice(id: string) {
  return await Invoice.findById(id, projection);
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
  const { page = 1, limit = 10, status, search } = options;

  const query: any = { business_id: businessId };

  if (status) {
    query.status = status;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { invoiceNumber: regex },
      { companyName: regex },
      { "recipientDetails.name": regex },
      { "recipientDetails.email": regex },
    ];
  }

  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find(query).select(projection).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Invoice.countDocuments(query),
  ]);

  return {
    data: invoices,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
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

export async function deleteInvoice(id: string, options = {}) {
  return await Invoice.findByIdAndDelete(id, options);
}
