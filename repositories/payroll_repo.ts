import Payroll from '../models/payroll';

const projection = {
  _id: 1,
  name: 1,
  status: 1,
  payrollType: 1,
  paymentDate: 1,
  payPeriod: 1,
  recurring: 1,
  employeeCount: 1,
  totalAmount: 1,
  currency: 1,
  notes: 1,
  createdBy: 1,
  createdAt: 1,
  updatedAt: 1,
};

export async function storePayroll(data: any, options = {}) {
  const payroll = new Payroll(data);
  return await payroll.save(options);
}

export async function createOrUpdatePayroll(data: any, options = {}) {
  if (data.payroll_id) {
    return await Payroll.findByIdAndUpdate(data.payroll_id, data, {
      new: true,
      upsert: true,
      ...options,
    });
  } else {
    const payroll = new Payroll(data);
    return await payroll.save(options);
  }
}

export async function getPayrolls(status = 'all', skip = 0, limit = 20, options = {}) {
  const query = status !== 'all' ? { status } : {};
  return await Payroll.find(query, projection, {
    skip,
    limit,
    sort: { paymentDate: -1 },
    ...options,
  });
}

export async function getPayroll(id: string) {
  return await Payroll.findById(id).select(projection);
}

export async function getPayrollByBusinessId(businessId: string) {
  return await Payroll.find({ business_id: businessId }, projection);
}

export async function getUpcomingPayrolls(limit = 5, options = {}) {
  return await Payroll.find(
    {
      status: 'Scheduled',
      paymentDate: { $gte: new Date() },
    },
    projection,
    {
      sort: { paymentDate: 1 },
      limit,
      ...options,
    }
  );
}
