//@ts-nocheck
//@ts-ignore
import * as PayrollRepo from "../repositories/payroll_repo";
import * as PayrollEmployeeRepo from "../repositories/payroll_employee_repo";

export async function storePayroll(data: any, session?: any) {
  return await PayrollRepo.storePayroll(data, session);
}

export async function createOrUpdatePayroll(data: any, session?: any) {
  const { employees, ...payrollData } = data;

  const payroll = await PayrollRepo.createOrUpdatePayroll(
    {
      ...payrollData,
      employeeCount: employees.length,
    },
    session
  );

  if (employees && employees.length > 0) {
    const employeeData = employees.map((employee: any) => ({
      ...employee,
      payroll_id: payroll._id,
    }));

    // 1. Get all existing employees for this payroll
    const existingEmployees = await PayrollEmployeeRepo.getPayrollEmployees(payroll._id);
    const existingEmployeeIds = existingEmployees.map(emp => emp._id.toString());

    // 2. Get the incoming employee IDs
    const incomingEmployeeIds = employeeData.filter(e => e._id).map(e => e._id.toString());

    // 3. Find employees to delete (present in DB but missing in incoming)
    const employeesToDelete = existingEmployeeIds.filter(id => !incomingEmployeeIds.includes(id));

    // 4. Delete missing employees
    for (const empId of employeesToDelete) {
      await PayrollEmployeeRepo.deletePayrollEmployeeById(empId, session);
    }

    // 5. Upsert (create/update) current employees
    for (const emp of employeeData) {
      await PayrollEmployeeRepo.createOrUpdatePayrollEmployee(emp, session);
    }
  }

  return payroll;
}


export async function getPayrolls(status = "all", skip = 0, limit = 20) {
  return await PayrollRepo.getPayrolls(status, skip, limit);
}

export async function getPayrollByBusinessId(businessId: string) {
  return await PayrollRepo.getPayrollByBusinessId(businessId);
}

export async function getPayroll(id: string) {
  const payroll =  await PayrollRepo.getPayroll(id);

  if (!payroll) {
    return null;
  }

  const employees = await PayrollEmployeeRepo.getPayrollEmployees(payroll._id);
  
  return {
    payroll,
    employees,
  };
}

export async function getUpcomingPayrolls(limit = 5) {
  return await PayrollRepo.getUpcomingPayrolls(limit);
}
