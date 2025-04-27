"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";

export default function PayrollDashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample transaction data
  const transactions = [
    {
      id: "#PAY-2024-001",
      date: "05/31/2024",
      amount: "$24,500",
      employees: "12",
      status: "Completed",
    },
    {
      id: "#PAY-2024-002",
      date: "06/30/2024",
      amount: "$24,500",
      employees: "12",
      status: "Scheduled",
    },
    {
      id: "#PAY-2024-003",
      date: "06/15/2024",
      amount: "$12,000",
      employees: "8",
      status: "Processing",
    },
    {
      id: "#PAY-2024-005",
      date: "04/30/2024",
      amount: "$24,000",
      employees: "12",
      status: "Completed",
    },
    {
      id: "#PAY-2024-006",
      date: "03/31/2024",
      amount: "$22,000",
      employees: "11",
      status: "Completed",
    },
    {
      id: "#PAY-2024-007",
      date: "03/15/2024",
      amount: "$10,500",
      employees: "7",
      status: "Completed",
    },
  ];

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "scheduled":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Sample upcoming payrolls
  const upcomingPayrolls = [
    {
      id: "#PAY-2024-002",
      name: "June 2024 Monthly Payroll",
      date: "06/30/2024",
      amount: "$24,500",
    },
    {
      id: "#PAY-2024-003",
      name: "Q2 Bonus Payroll",
      date: "06/15/2024",
      amount: "$12,000",
    },
  ];

  return (
    <div className="container p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payroll Dashboard</h1>
          <Link href="/dashboard/payroll">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Payroll
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Overview of your payroll activities and upcoming payments
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Payroll (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-[#01133B]" />
              <div>
                <p className="text-2xl font-bold">$117,500</p>
                <p className="text-xs text-gray-500">+12% from last year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Upcoming Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-6 w-6 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">$36,500</p>
                <p className="text-xs text-gray-500">Next: June 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
              <div>
                <p className="text-2xl font-bold">$81,000</p>
                <p className="text-xs text-gray-500">5 payrolls processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Employees Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-6 w-6 text-[#01133B]" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-500">Active employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium">Payroll History</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-9 w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="mb-4 flex space-x-1">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "all"
                    ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All{" "}
                <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                  6
                </span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "completed"
                    ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed{" "}
                <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                  4
                </span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "scheduled"
                    ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("scheduled")}
              >
                Scheduled{" "}
                <span className="ml-1 rounded-full bg-blue-200 px-2 py-0.5 text-xs">
                  1
                </span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "processing"
                    ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("processing")}
              >
                Processing{" "}
                <span className="ml-1 rounded-full bg-yellow-200 px-2 py-0.5 text-xs">
                  1
                </span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-500">
                    <th className="px-4 py-3">Payroll ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Employees</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}
                    >
                      <td className="px-4 py-4 text-sm">{transaction.id}</td>
                      <td className="px-4 py-4 text-sm">{transaction.date}</td>
                      <td className="px-4 py-4 text-sm">
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {transaction.employees}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                payrolls
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">1</span>
                <span className="text-sm text-gray-500">of 1 page</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.min(1, currentPage + 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Upcoming Payroll</h2>

            <div className="space-y-4">
              {upcomingPayrolls.map((payroll, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{payroll.name}</p>
                      <p className="text-sm text-gray-500">{payroll.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{payroll.amount}</p>
                      <p className="text-sm text-gray-500">{payroll.date}</p>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingPayrolls.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  No upcoming payrolls scheduled
                </p>
              )}

              <div className="pt-2">
                <Link href="/dashboard/payroll/create">
                  <Button className="w-full bg-[#01133B] hover:bg-[#523526]">
                    Schedule New Payroll
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Monthly Payroll Trend</h2>

            <div className="h-48 w-full">
              <div className="flex h-full flex-col justify-between">
                <div className="flex h-36 items-end space-x-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                    (month, i) => (
                      <div
                        key={i}
                        className="flex w-full flex-col items-center"
                      >
                        <div
                          className="w-full bg-[#01133B]"
                          style={{
                            height: `${[40, 50, 65, 75, 85, 60][i]}%`,
                            opacity: [0.5, 0.6, 0.7, 0.8, 0.9, 0.7][i],
                          }}
                        ></div>
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-between pt-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                    (month, i) => (
                      <div key={i} className="text-xs text-gray-500">
                        {month}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
