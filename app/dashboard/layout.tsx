"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { Footer } from "@/components/dashboard/Footer"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/auth/session")
        const data = await response.json()

        if (data.user) {
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Failed to fetch user session", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        <Header user={user} />
        <main className="flex-1 p-6">{children}</main>
        <Toaster />
        <Footer />
      </div>
    </div>
  )
}
