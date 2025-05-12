//@ts-nocheck
//@ts-ignore
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import passport from "passport"
import { initializePassport } from "@/lib/passport-config"

// Initialize Passport
initializePassport()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const isMobile = body.platform === "mobile" || request.headers.get("x-platform") === "mobile"

    // Create a promise to handle the passport authentication
    const authResult = await new Promise((resolve, reject) => {
      passport.authenticate("local-register", { session: false }, (err: any, data: any, info: any) => {
        if (err) return reject(err)
        if (!data) return reject(new Error(info?.message || "Registration failed"))
        resolve(data)
      })({ body }) // Pass request body to passport
    })

    // TypeScript type assertion
    const { user, accessToken } = authResult as { user: any; accessToken: string }

    // For web clients, set cookie
    if (!isMobile) {
      (await cookies()).set({
        name: "auth_token",
        value: accessToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registered successfully",
      user,
      accessToken,
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
