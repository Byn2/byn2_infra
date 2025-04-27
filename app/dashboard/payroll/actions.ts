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

// Define the employee schema
const EmployeeSchema = z.object({
  name: z.string().min(1, "Employee name is required"),
  position: z.string().optional(),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  bonus: z.coerce.number().min(0, "Bonus must be a positive number"),
  deductions: z.coerce.number().min(0, "Deductions must be a positive number"),
  netPay: z.coerce.number(),
  paymentMethod: z.enum(["Byn2", "Bank"]),
  paymentDetails: z.object({
    mobileNumber: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    routingNumber: z.string().optional(),
  }),
});

// Define the payroll schema
const PayrollSchema = z.object({
  payrollName: z.string().min(1, "Payroll name is required"),
  payrollType: z.enum(["regular", "bonus", "commission", "contractor"]),
  paymentDate: z.string().min(1, "Payment date is required"),
  payPeriodStart: z.string().min(1, "Pay period start date is required"),
  payPeriodEnd: z.string().min(1, "Pay period end date is required"),
  isRecurring: z.boolean().optional(),
  totalAmount: z.coerce
    .number()
    .min(0, "Total amount must be a positive number"),
  recurringFrequency: z
    .enum(["weekly", "biweekly", "monthly", "quarterly"])
    .optional(),
  notes: z.string().optional(),
  employees: z.array(EmployeeSchema),
});

export type PayrollFormState = {
  errors?: {
    payrollName?: string[];
    payrollType?: string[];
    paymentDate?: string[];
    payPeriodStart?: string[];
    payPeriodEnd?: string[];
    recurringFrequency?: string[];
    employees?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
  redirectTo?: string;
};

export async function createPayroll(
  prevState: PayrollFormState,
  formData: FormData
): Promise<PayrollFormState> {
  const authUser = await getAuthenticatedUser();

  if ("user" in authUser === false) return authUser;

  // Extract and parse the employees JSON data
  const employeesJson = formData.get("employeesData") as string;
  let employees = [];
  const session = await startTransaction();
  let committed = false; // track if we already committed

  try {
    employees = JSON.parse(employeesJson);
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to parse employee data"],
      },
    };
  }

  // Prepare the data for validation
  const rawFormData = {
    totalAmount: formData.get("totalAmount"),
    payrollName: formData.get("payrollName"),
    payrollType: formData.get("payrollType"),
    paymentDate: formData.get("paymentDate"),
    payPeriodStart: formData.get("payPeriodStart"),
    payPeriodEnd: formData.get("payPeriodEnd"),
    isRecurring: formData.get("isRecurring") === "true",
    recurringFrequency: formData.get("recurringFrequency"),
    notes: formData.get("notes"),
    employees,
  };

  // Validate the form data
  const validationResult = PayrollSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;

    return {
      errors: {
        ...errors,
        _form: errors._form || [],
      },
    };
  }

  const validatedData = validationResult.data;

  const transformedData = {
    business_id: authUser.user.id,
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
    employees: validatedData.employees,
    status: "Processing",
  };

  try {
    await payrollService.createOrUpdatePayroll(transformedData, session);

    await commitTransaction(session);
    committed = true;

    revalidatePath("/dashboard/payroll");
    return {
      success: true,
      redirectTo: "/dashboard/payroll",
      message: "Payroll processed successfully",
    };
  } catch (error) {
    if (error && error.digest?.startsWith("NEXT_REDIRECT")) {
      return {}; // Do nothing, just return empty object to stop processing here
    }

    console.log(error);
    if (!committed) {
      await abortTransaction(session);
    }
    return {
      errors: {
        _form: ["Failed to create payroll. Please try again."],
      },
    };
  }
}

export async function savePayrollDraft(
  prevState: PayrollFormState,
  formData: FormData
): Promise<PayrollFormState> {
  const authUser = await getAuthenticatedUser();

  if ("user" in authUser === false) return authUser;
  // Extract and parse the employees JSON data
  const session = await startTransaction();
  const employeesJson = formData.get("employeesData") as string;
  let employees = [];

  try {
    employees = JSON.parse(employeesJson);
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to parse employee data"],
      },
    };
  }

  const rawFormData = {
    totalAmount: formData.get("totalAmount"),
    payrollName: formData.get("payrollName"),
    payrollType: formData.get("payrollType"),
    paymentDate: formData.get("paymentDate"),
    payPeriodStart: formData.get("payPeriodStart"),
    payPeriodEnd: formData.get("payPeriodEnd"),
    isRecurring: formData.get("isRecurring") === "true",
    recurringFrequency: formData.get("recurringFrequency"),
    notes: formData.get("notes"),
    employees,
  };

  const validationResult = PayrollSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;

    return {
      errors: {
        ...errors,
        _form: errors._form || [],
      },
    };
  }

  const validatedData = validationResult.data;

  const transformedData = {
    business_id: authUser.user.id,
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
    employees: validatedData.employees,
    status: "Draft",
  };

  try {
    await payrollService.createOrUpdatePayroll(transformedData, session);

    await commitTransaction(session);

    // Success! Revalidate the payroll list page and redirect
    revalidatePath("/dashboard/payroll");

    return {
      success: true,
      redirectTo: "/dashboard/payroll",
      message: "Payroll saved as draft successfully",
    };
  } catch (error) {
    await abortTransaction(session);
    return {
      errors: {
        _form: ["Failed to save draft. Please try again."],
      },
    };
  }
}
