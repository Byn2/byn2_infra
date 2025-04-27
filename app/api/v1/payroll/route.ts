import * as payrollService from "@/services/payroll_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: Request) {
    console.log('fetch payroll')
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;

  try {
    const payrolls = await payrollService.getPayrollByBusinessId(auth.user._id);

    return NextResponse.json({ payrolls });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}
