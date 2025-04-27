import * as PayrollEmployeeRepo from '../repositories/payroll_employee_repo';

export async function storePayrollEmployee(data, session?) {
  return await PayrollEmployeeRepo.storePayrollEmployee(data, session);
}

export async function createOrUpdatePayrollEmployee(data, session?) {
  return await PayrollEmployeeRepo.createOrUpdatePayrollEmployee(data, session);
}

export async function getPayrollEmployees(payrollId: string) {
  return await PayrollEmployeeRepo.getPayrollEmployees(payrollId);
}
