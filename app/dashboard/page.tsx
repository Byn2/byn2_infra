"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowUpRight, BarChart, ChevronLeft, ChevronRight, DollarSign, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { Alert, AlertDescription } from "@/components/ui/alert"

interface Transaction {
  _id: string
  amount: number
  currency: string
  type: string
  status: string
  createdAt: string
  description?: string
  recipient?: {
    name?: string
    business?: string
  }
}

interface BalanceResponse {
  address: string;
  fiat: number;
  usdc: number;
}

interface ChartData {
  month: string
  balance: number
  spending: number
}

export default function DashboardPage() {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch balance from the new endpoint
        const response = await fetch("/api/v1/wallet/balance")
        const data = await response.json();

        if (response.ok) {
          setBalance(data.wallet)
        } else {
          // toast("Error", {
          //   description: "Failed to load API keys",
          // });
        }
        // console.log(balanceResponse.body)
        // if (!balanceResponse.ok) throw new Error("Failed to fetch balance")
        // const balanceData = await balanceResponse.json()
        // setBalance(balanceData.balance)

        // Fetch recent transactions from the new endpoint
        const transactionsResponse = await fetch("/api/v1/transaction/my-transactions?limit=5")
        if (!transactionsResponse.ok) throw new Error("Failed to fetch transactions")
        const transactionsData = await transactionsResponse.json()
        setRecentTransactions(transactionsData.transactions || [])

        // Generate sample chart data for now
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const chartData = months.map((month) => ({
          month,
          balance: Math.random() * 25000 + 5000,
          spending: Math.random() * 15000 + 3000,
        }))
        setChartData(chartData)
      } catch (error) {
        console.error("Dashboard data fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load dashboard data")
        // toast({
        //   title: "Error",
        //   description: "Failed to load dashboard data",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickTransferContacts = [
    { id: 1, name: "Add", image: "/simple-plus.png" },
    { id: 2, name: "Rachel", image: "/serene-gaze.png" },
    { id: 3, name: "Ramzatu", image: "/serene-hijabi.png" },
    { id: 4, name: "Regina", image: "/serene-gaze.png" },
    { id: 5, name: "Jawad", image: "/thoughtful-portrait.png" },
    { id: 6, name: "Mahawa", image: "/serene-african-woman.png" },
  ]

  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-11 p-4 sm:p-6 md:p-8 lg:p-11 w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-800">Overview</h1>
          <p className="text-base sm:text-lg font-normal text-gray-500">
            here is your latest update for the last 7 days
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5">
          <Button
            variant="outline"
            className="flex-1 md:flex-none min-w-0 sm:min-w-32 gap-2 rounded border border-[#66432E] px-2 sm:px-3.5 py-2 sm:py-2.5 text-sm sm:text-lg font-semibold text-[#66432E]"
          >
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Take Loan</span>
            <span className="sm:hidden">Loan</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 md:flex-none min-w-0 sm:min-w-32 gap-2 rounded border border-[#66432E] px-2 sm:px-3.5 py-2 sm:py-2.5 text-sm sm:text-lg font-semibold text-[#66432E]"
          >
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Deposit</span>
            <span className="sm:hidden">Deposit</span>
          </Button>
          <Button className="flex-1 md:flex-none min-w-0 sm:min-w-32 gap-1 rounded bg-[#66432E] px-2 sm:px-3.5 py-2 sm:py-2.5 text-sm font-semibold text-white">
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Send</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-5 md:gap-6 lg:gap-7 w-full">
        {/* Balance Card */}
        <div className="relative flex flex-col w-full lg:w-1/3 items-start justify-between rounded-[20px] bg-[#FAF7F2] px-4 sm:px-5 py-5 sm:py-7">
          <div className="flex flex-col gap-3 sm:gap-5 w-full">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500" />
              <span className="text-xl sm:text-2xl font-normal leading-loose text-gray-500">Your Balance</span>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-700">
              ${balance ? balance.toLocaleString() : "347,000"}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 sm:gap-2.5 mt-4 self-end">
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-1 py-0.5">
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
              <span className="text-xs sm:text-sm font-semibold leading-none text-green-600">2.8%</span>
            </div>
            <span className="text-xs sm:text-sm font-normal text-gray-500">VS Last Week</span>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="relative flex flex-col w-full lg:w-1/3 items-start justify-between rounded-[20px] bg-[#FAF7F2] px-4 sm:px-5 py-5 sm:py-7">
          <div className="flex flex-col gap-3 sm:gap-5 w-full">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <BarChart className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500" />
              <span className="text-xl sm:text-2xl font-normal leading-loose text-gray-500">Total Spent</span>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-700">$37,000</div>
          </div>
          <div className="flex flex-col items-end gap-1 sm:gap-2.5 mt-4 self-end">
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-1 py-0.5">
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
              <span className="text-xs sm:text-sm font-semibold leading-none text-green-600">2.8%</span>
            </div>
            <span className="text-xs sm:text-sm font-normal text-gray-500">VS Last Week</span>
          </div>
        </div>

        {/* Quick Transfer Card */}
        <div className="flex flex-col w-full lg:w-1/3 gap-3 sm:gap-5 rounded-[20px] bg-[#FAF7F2] px-4 sm:px-5 py-5 sm:py-7">
          <span className="text-xl sm:text-2xl font-normal leading-loose text-gray-500">Quick Transfer</span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {quickTransferContacts.map((contact) => (
              <div key={contact.id} className="flex flex-col items-center gap-1">
                {contact.name === "Add" ? (
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200 outline outline-1 outline-[#66432E]">
                    <span className="text-lg sm:text-xl font-bold text-[#66432E]">+</span>
                  </div>
                ) : (
                  <img
                    src={contact.image || "/placeholder.svg"}
                    alt={contact.name}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                  />
                )}
                <span className="text-xs sm:text-sm font-normal text-gray-500">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-7">
        <div className="flex w-full lg:w-2/3 flex-col gap-3 rounded-[20px] bg-[#FAF7F2] p-3 sm:p-4 md:p-5">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
            <span className="text-base sm:text-lg font-normal text-black">Monthly Expense Chart</span>
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 md:gap-7">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-neutral-300"></div>
                <span className="text-sm sm:text-base md:text-lg font-normal text-black">Balance</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-gray-500"></div>
                <span className="text-sm sm:text-base md:text-lg font-normal text-black">Spending</span>
              </div>
            </div>
          </div>

          <div className="flex h-64 sm:h-80 md:h-96 items-end gap-2 sm:gap-4 md:gap-8 overflow-x-auto">
            <div className="flex flex-col gap-5">
              <span className="text-right text-sm font-medium text-gray-500">30k</span>
              <span className="text-right text-sm font-medium text-gray-500">25k</span>
              <span className="text-right text-sm font-medium text-gray-500">20k</span>
              <span className="text-right text-sm font-medium text-gray-500">15k</span>
              <span className="text-right text-sm font-medium text-gray-500">10k</span>
              <span className="text-right text-sm font-medium text-gray-500">$0</span>
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div className="flex h-60 items-end justify-between rounded-[10px]">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="flex h-full flex-col items-center justify-end">
                      <div
                        className="w-10 rounded bg-gray-300"
                        style={{ height: `${(data.balance / 30000) * 240}px` }}
                      ></div>
                      <div
                        className="w-10 rounded bg-gray-500"
                        style={{ height: `${(data.spending / 30000) * 240}px` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {chartData.map((data, index) => (
                  <div key={index} className="w-10 text-center text-sm font-medium text-gray-500">
                    {data.month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full lg:w-1/3 flex-col justify-between rounded-[20px] bg-[#FAF7F2] p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between overflow-hidden">
            <span className="text-lg font-medium text-gray-800">Paid Loans</span>
            <div className="h-7 w-7 overflow-hidden">
              <span className="text-2xl">⋮</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-end justify-between overflow-hidden p-1">
              <span className="text-7xl font-medium leading-[66px] text-gray-800">2</span>
              <span className="text-xl font-medium text-gray-800">/ 5</span>
            </div>

            <div className="flex items-end justify-between border-t border-black/30 px-1 pt-5">
              <span className="text-xl font-normal text-gray-800">Total</span>
              <div>
                <span className="text-lg font-semibold text-gray-800">$43,000</span>
                <span className="text-xl font-normal text-gray-800"> / $56,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-[#FAF7F2] p-3 sm:p-4 md:p-5 lg:p-7 flex flex-col h-full min-h-[500px]">
        <div className="flex flex-col sm:flex-row sm:h-10 items-start justify-between gap-3 sm:gap-0 mb-4">
          <span className="text-xl sm:text-2xl font-normal leading-loose text-gray-800">Transaction History</span>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-3.5 py-2.5 text-sm font-normal text-gray-500"
            >
              <ArrowUpRight className="h-5 w-5" />
              All
              <ChevronDown className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-3.5 py-2.5 text-sm font-normal text-gray-500"
            >
              Monthly
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-grow overflow-hidden rounded-2xl border border-gray-200">
          {/* Table Header - Fixed */}
          <div className="hidden md:flex border-b border-gray-200 bg-[#FAF7F2] sticky top-0 z-10">
            <div className="flex-1 px-4 sm:px-6 md:px-11 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-medium text-gray-800">
              Transaction ID
            </div>
            <div className="flex-1 px-4 sm:px-6 md:px-11 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-medium text-gray-800">
              Business Name
            </div>
            <div className="flex-1 px-4 sm:px-6 md:px-11 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-medium text-gray-800">
              Date
            </div>
            <div className="flex-1 px-4 sm:px-6 md:px-11 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-medium text-gray-800">
              Amount
            </div>
            <div className="flex-1 px-4 sm:px-6 md:px-11 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-medium text-gray-800">
              Type
            </div>
          </div>

          {/* Scrollable Transaction List */}
          <div className="flex-grow overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex border-b border-gray-200 bg-[#FAF7F2]">
                  <Skeleton className="flex-1 h-16" />
                </div>
              ))
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, i) => (
                <div
                  key={transaction._id || i}
                  className="flex flex-col md:flex-row border-b border-gray-200 bg-[#FAF7F2] p-3 md:p-0 hover:bg-[#F5EFE5] transition-colors duration-150"
                >
                  {/* Mobile view - card style */}
                  <div className="flex flex-col gap-2 md:hidden">
                    <div className="flex justify-between">
                      <span className="font-medium">ID:</span>
                      <span>#{transaction._id.substring(0, 6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Business:</span>
                      <span className="text-right max-w-[60%] truncate">
                        {transaction.recipient?.business || transaction.recipient?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span>$ {transaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Type:</span>
                      <span
                        className={`rounded-full bg-[#F0E6D9] px-2.5 py-0.5 text-xs font-semibold leading-none text-[#66432E]`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </div>

                  {/* Desktop view - table style */}
                  <div className="hidden md:block flex-1 px-4 sm:px-8 md:px-16 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-normal text-gray-600 truncate">
                    #{transaction._id.substring(0, 6)}
                  </div>
                  <div className="hidden md:block flex-1 px-4 sm:px-8 md:px-16 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-normal text-gray-600 truncate">
                    {transaction.recipient?.business || transaction.recipient?.name || "N/A"}
                  </div>
                  <div className="hidden md:block flex-1 px-4 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-normal text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                  <div className="hidden md:block flex-1 px-4 sm:px-10 md:px-20 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base md:text-lg font-normal text-gray-600">
                    $ {transaction.amount.toLocaleString()}
                  </div>
                  <div className="hidden md:flex flex-1 px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 justify-center">
                    <span
                      className={`rounded-full bg-[#F0E6D9] px-2.5 py-0.5 text-xs sm:text-sm font-semibold leading-none text-[#66432E]`}
                    >
                      {transaction.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 sm:py-6 md:py-8 text-center text-sm sm:text-base text-gray-500 flex-grow flex items-center justify-center">
                No transactions found
              </div>
            )}
          </div>

          {/* Pagination - Fixed at bottom */}
          <div className="flex items-center justify-center md:justify-end p-3 sm:p-4 md:p-5 border-t border-gray-200 bg-[#FAF7F2] sticky bottom-0">
            <div className="flex items-center gap-3 sm:gap-5 md:gap-7">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative h-6 sm:h-7 w-10 sm:w-12 rounded bg-[#FAF7F2] shadow-md">
                  <span className="absolute left-[8px] top-0 text-xs sm:text-sm font-semibold text-gray-600">1</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-600"> of 1 pages</span>
              </div>
              <div className="flex items-center">
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm md:text-base">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
