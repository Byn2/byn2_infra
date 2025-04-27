"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BarChart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/util";

interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  source: string;
  status: string;
  createdAt: string;
}

interface ChartData {
  month: string;
  balance: number;
  spending: number;
}

export default function DashboardPage() {
  // const { toast } = useToast()
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch balance
        const balanceResponse = await fetch("/api/business/balance");
        if (!balanceResponse.ok) throw new Error("Failed to fetch balance");
        const balanceData = await balanceResponse.json();
        setBalance(balanceData.balance);

        // Fetch recent transactions
        const transactionsResponse = await fetch(
          "/api/business/transactions?limit=5"
        );
        if (!transactionsResponse.ok)
          throw new Error("Failed to fetch transactions");
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.transactions);

        // Generate sample chart data for now
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const chartData = months.map((month) => ({
          month,
          balance: Math.random() * 25000 + 5000,
          spending: Math.random() * 15000 + 3000,
        }));
        setChartData(chartData);
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to load dashboard data",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickTransferContacts = [
    { id: 1, name: "Add", image: "/simple-plus.png" },
    { id: 2, name: "Rachel", image: "/serene-gaze.png" },
    { id: 3, name: "Ramzatu", image: "/serene-hijabi.png" },
    { id: 4, name: "Regina", image: "/serene-gaze.png" },
    { id: 5, name: "Jawad", image: "/thoughtful-gaze.png" },
    {
      id: 6,
      name: "Mahawa",
      image: "/placeholder.svg?height=40&width=40&query=african woman",
    },
  ];

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">
          here is your latest update for the last 7 days
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1"></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Take Loan
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Deposit
          </Button>
          <Button className="flex items-center gap-2 bg-[#01133B] text-white hover:bg-[#523526]">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#FAF7F2]">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-[#01133B]" />
              <CardTitle className="text-lg font-medium text-[#01133B]">
                Your Balance
              </CardTitle>
            </div>
            <div className="ml-auto rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
              +2.8% vs Last Week
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[200px]" />
            ) : (
              <div className="text-4xl font-bold text-[#01133B]">
                {formatCurrency(balance || 347000)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#FAF7F2]">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-[#01133B]" />
              <CardTitle className="text-lg font-medium text-[#01133B]">
                Total Spent
              </CardTitle>
            </div>
            <div className="ml-auto rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
              +2.8% vs Last Week
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[200px]" />
            ) : (
              <div className="text-4xl font-bold text-[#01133B]">
                {formatCurrency(37000)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Quick Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-around gap-4">
              {quickTransferContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <img
                      src={contact.image || "/placeholder.svg"}
                      alt={contact.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs">{contact.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Monthly Expense Chart
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-500">balance</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                <span className="text-xs text-gray-500">Spenditure</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <div className="flex h-full items-end space-x-2">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="mx-auto flex h-[200px] flex-col items-center justify-end space-y-1">
                      <div
                        className="w-full rounded-t bg-gray-300"
                        style={{ height: `${(data.balance / 30000) * 100}%` }}
                      ></div>
                      <div
                        className="w-full rounded-t bg-gray-500"
                        style={{ height: `${(data.spending / 30000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs">{data.month}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Transaction History
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <ArrowUpRight className="h-3 w-3" />
              All
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 text-sm font-medium text-gray-500">
              <div>Transaction ID</div>
              <div>Business Name</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Type</div>
            </div>
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 items-center py-2">
                    <div className="text-sm">#153587</div>
                    <div className="text-sm">Rachel's Computer Shop</div>
                    <div className="text-sm">Jan 26, 2023</div>
                    <div className="text-sm font-medium">$ 38,000</div>
                    <div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          i % 3 === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : i % 3 === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {i % 3 === 0
                          ? "Send"
                          : i % 3 === 1
                          ? "Deposit"
                          : "Withdraw"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>9</span>
            <span>per page</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 min-w-[2rem] px-2 font-medium"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <span>of 1 pages</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { ChevronLeft, ChevronRight, Send } from "lucide-react";
