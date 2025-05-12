"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function getAuthenticatedUser() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const JWT_SECRET = process.env.SECRET_ACCESS_TOKEN || "your-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

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
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}
