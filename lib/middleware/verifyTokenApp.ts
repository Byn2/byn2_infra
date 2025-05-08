// lib/middleware/verifyTokenApp.ts
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import User from "@/models/user";
import BusinessApiKey from "@/models/business-api-key";
import { NextResponse } from "next/server";
import { connectDB } from "../db";

const secret = process.env.SECRET_ACCESS_TOKEN || "your-secret-key"

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

export async function authenticateApiKey(apiKey: string) {
  if (!apiKey) return null;

  try {
    await connectDB();

    // Find business by API key
    const business = await BusinessApiKey.findOne({
      key: apiKey,
      active: true,
    });

    if (!business) return null;

    // Find user (business owner or linked account)
    const user = await User.findOne({ _id: business.business_id });
    if (!user) return null;

    // Update lastUsed timestamp (if you have apiKeys array in the business model)
    business.lastUsed = new Date();
    await business.save();

    return user;
  } catch (error) {
    console.error("API key authentication error:", error);
    return null;
  }
}


export async function generatePaymentSignature(id: string) {
  const timestamp = Date.now().toString();
  const data = `${id}.${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest().subarray(0, 12).toString('base64url');
  return `${id}.${timestamp}.${hmac}`;
}

export async function verifyPaymentSignature(signature: string) {
  const [id, timestamp, providedHmac] = signature.split('.');
  const data = `${id}.${timestamp}`;
  const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest().subarray(0, 12).toString('base64url');

  const isValid = crypto.timingSafeEqual(Buffer.from(providedHmac, 'base64url'), Buffer.from(expectedHmac, 'base64url'));
  return isValid ? { id, timestamp } : null;
}


