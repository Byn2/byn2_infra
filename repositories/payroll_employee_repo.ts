import PayrollEmployee from "../models/payroll_employee";

const projection = {
  _id: 1,
  payrollId: 1,
  name: 1,
  position: 1,
  salary: 1,
  bonus: 1,
  deductions: 1,
  netPay: 1,
  status: 1,
  paymentMethod: 1,
  paymentDetails: 1,
  createdAt: 1,
  updatedAt: 1,
};

export async function storePayrollEmployee(data: any, options = {}) {
  const payrollEmployee = new PayrollEmployee(data);
  return await payrollEmployee.save(options);
}

export async function createOrUpdatePayrollEmployee(data: any, options = {}) {
  if (data._id) {
    return await PayrollEmployee.findByIdAndUpdate(data._id, data, {
      new: true,
      upsert: true,
      ...options,
    });
  } else {
    const payrollEmployee = new PayrollEmployee(data);
    return await payrollEmployee.save(options);
  }
}

export async function getPayrollEmployees(payrollId: string) {
  return await PayrollEmployee.find({ payroll_id: payrollId }).select(
    projection
  );
}

export async function deletePayrollEmployeeById(id: string, options = {}) {
  return await PayrollEmployee.findByIdAndDelete(id, options);
}
