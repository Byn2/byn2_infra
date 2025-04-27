// lib/middleware/verifyTokenApp.ts
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { connectDB } from "../db";

export async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cookieHeader = request.headers.get("cookie");

  let token = null;

  if (authHeader) {
    token = authHeader;
  } else if (cookieHeader && cookieHeader.includes("auth_token=")) {
    token = cookieHeader.split("auth_token=")[1].split(";")[0];
  }

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!) as {
      id: string;
    };
    connectDB();
    const authUser = await User.findById(decoded.id);

    if (!authUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (authUser.account_deletion_requested) {
      return NextResponse.json(
        {
          message:
            "Your account is scheduled for deletion and is no longer accessible.",
        },
        { status: 403 }
      );
    }

    // return the user so the handler can use it
    return { user: authUser };
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token", err },
      { status: 401 }
    );
  }
}
