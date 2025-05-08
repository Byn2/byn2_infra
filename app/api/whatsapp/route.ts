
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const body = await request.json();

//   const session = await startTransaction();

  try {
   
    console.log(body)

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error) {
    // await abortTransaction(session);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
