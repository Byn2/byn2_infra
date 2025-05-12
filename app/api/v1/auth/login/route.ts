import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import passport from "passport"
import { initializePassport } from "@/lib/passport-config"
import { IUser } from "@/types/user"

// Initialize Passport
initializePassport()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const isMobile = body.platform === "mobile" || request.headers.get("x-platform") === "mobile"

    // Create a promise to handle the passport authentication
    const authResult = await new Promise((resolve, reject) => {
      passport.authenticate("local-login", { session: false }, (err: any, data: any, info: any) => {
        if (err) return reject(err)
        if (!data) return reject(new Error(info?.message || "Authentication failed"))
        resolve(data)
      })({ body }) // Pass request body to passport
    })

    // TypeScript type assertion
    const { user, accessToken } = authResult as { user: IUser; accessToken: string }

    // For web clients, set cookie
    if (!isMobile) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: "auth_token",
        value: accessToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    // Return the user and token (token is important for mobile clients)
    return NextResponse.json({
      user,
      // Always include the token in the response for mobile clients
      ...(isMobile && { accessToken }),
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
