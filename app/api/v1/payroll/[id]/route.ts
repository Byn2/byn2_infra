import * as payrollService from "@/services/payroll_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;
  const { id } = await params;

  if ("user" in auth === false) return auth;

  try {
    const payroll = await payrollService.getPayroll(id);

    return NextResponse.json({ data: payroll });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
