//@ts-ignore
//@ts-nocheck
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as payrollService from "@/services/payroll_service";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";
import { getAuthenticatedUser } from "@/lib/middleware/get-auth-user";

// Define validation schema for payroll update
const PayrollSchema = z.object({
  payroll_id: z.string().min(1, "Payroll ID is required"),
  payrollName: z.string().min(3, "Payroll name must be at least 3 characters"),
  payrollType: z.enum(["regular", "bonus", "commission", "contractor"]),
  paymentDate: z.string().min(1, "Payment date is required"),
  payPeriodStart: z.string().min(1, "Pay period start date is required"),
  payPeriodEnd: z.string().min(1, "Pay period end date is required"),
  isRecurring: z.string().transform((val) => val === "true"),
  recurringFrequency: z.string().optional(),
  notes: z.string().optional(),
  employeesData: z.string().min(1, "Employee data is required"),
  totalAmount: z.string().transform((val) => Number(val)),
});

// Define the return type for the server actions
type ActionReturn = {
  errors?: {
    [key: string]: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

// Update payroll action
export async function updatePayroll(
  prevState: ActionReturn,
  formData: FormData
): Promise<ActionReturn> {
  const authUser = await getAuthenticatedUser();

  if ("user" in authUser === false) return authUser;
  const session = await startTransaction();
  try {
    // Validate form data
    const validatedFields = PayrollSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { employeesData } = validatedFields.data;

    // Parse employees data
    const employees = JSON.parse(employeesData);

    // Validate employees
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return {
        errors: {
          employees: ["At least one employee is required"],
        },
      };
    }

    console.log(JSON.parse(employeesData));

    const validatedData = validatedFields.data;

    const transformedData = {
      business_id: authUser.user.id,
      payroll_id: validatedData.payroll_id,
      totalAmount: validatedData.totalAmount,
      name: validatedData.payrollName,
      payrollType: validatedData.payrollType, // make sure it matches the database expected value
      paymentDate: validatedData.paymentDate,
      payPeriod: {
        startDate: validatedData.payPeriodStart,
        endDate: validatedData.payPeriodEnd,
      },
      isRecurring: validatedData.isRecurring,
      recurringFrequency: validatedData.recurringFrequency,
      notes: validatedData.notes,
      employees: JSON.parse(employeesData),
      status: "Processing",
    };

    await payrollService.createOrUpdatePayroll(transformedData, session);

    await commitTransaction(session);

    // Revalidate the payroll list page
    revalidatePath("/dashboard/payroll");

    // Return success
    return {
      errors: {},
      message: "Payroll updated successfully",
      success: true,
      redirectTo: "/dashboard/payroll",
    };
  } catch (error) {
    await abortTransaction(session);
    console.error("Error updating payroll:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      
    };
  }
}

// Save payroll draft action
export async function savePayrollDraft(
  prevState: ActionReturn,
  formData: FormData
): Promise<ActionReturn> {

  const authUser = await getAuthenticatedUser();

  if ("user" in authUser === false) return authUser;
  const session = await startTransaction();

  try {
    console.log(formData);
     // Validate form data
     const validatedFields = PayrollSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    


    const { employeesData } = validatedFields.data;

    // Parse employees data
    const employees = JSON.parse(employeesData);

    // Validate employees
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return {
        errors: {
          employees: ["At least one employee is required"],
        },
      };
    }

    console.log(JSON.parse(employeesData));

    const validatedData = validatedFields.data;

    const transformedData = {
      business_id: authUser.user.id,
      payroll_id: validatedData.payroll_id,
      totalAmount: validatedData.totalAmount,
      name: validatedData.payrollName,
      payrollType: validatedData.payrollType, // make sure it matches the database expected value
      paymentDate: validatedData.paymentDate,
      payPeriod: {
        startDate: validatedData.payPeriodStart,
        endDate: validatedData.payPeriodEnd,
      },
      isRecurring: validatedData.isRecurring,
      recurringFrequency: validatedData.recurringFrequency,
      notes: validatedData.notes,
      employees: JSON.parse(employeesData),
      status: "Draft",
    };
    //console.log(transformedData);
   await payrollService.createOrUpdatePayroll(transformedData, session);

    await commitTransaction(session);

    // Revalidate the payroll list page
    revalidatePath("/dashboard/payroll");

    // Return success
    return {
      errors: {},
      message: "Payroll draft saved successfully",
      success: true,
      redirectTo: "/dashboard/payroll",
    };
  } catch (error) {
    await abortTransaction(session);
    console.error("Error saving payroll draft:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    };
  }
}
