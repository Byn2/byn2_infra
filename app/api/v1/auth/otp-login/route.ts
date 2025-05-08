import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import passport from "passport"
import { initializePassport } from "@/lib/passport-config"
import { IUser } from "@/types/user"

// Initialize Passport once per request (or ensure it's done only once app-wide)
initializePassport()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const isMobile = body.platform === "mobile" || request.headers.get("x-platform") === "mobile"

    // Create a promise to handle the passport authentication
    const authResult = await new Promise((resolve, reject) => {
      passport.authenticate("magic-link", { session: false }, (err, data, info) => {
        if (err) return reject(err)
        if (!data) return reject(new Error(info?.message || "Authentication failed"))
        resolve(data)
      })({ body }) // We override the request object here with a custom body
    })

    const { user, accessToken } = authResult as { user: IUser; accessToken: string }

    if (!isMobile) {
      const cookieStore = cookies()
      cookieStore.set({
        name: "auth_token",
        value: accessToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return NextResponse.json({
      user,
      ...(isMobile && { accessToken }),
    })

  } catch (error) {
    console.error("Magic link login error:", error)
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
