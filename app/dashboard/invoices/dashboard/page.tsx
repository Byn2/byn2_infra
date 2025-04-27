"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function InvoiceDashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample transaction data
  const transactions = [
    {
      id: "#153587",
      date: "Jan 28, 2023",
      amount: "300",
      installments: "3",
      status: "Successful",
    },
    {
      id: "#153587",
      date: "Jan 28, 2023",
      amount: "300",
      installments: "3",
      status: "Pending",
    },
    {
      id: "#153587",
      date: "Jan 28, 2023",
      amount: "300",
      installments: "3",
      status: "Rejected",
    },
    {
      id: "#153587",
      date: "Jan 28, 2023",
      amount: "300",
      installments: "3",
      status: "Pending",
    },
    {
      id: "#153587",
      date: "Jan 28, 2023",
      amount: "300",
      installments: "3",
      status: "Rejected",
    },
    {
      id: "#153587",
      date: "Jan 28, 2023",
      amount: "300",
      installments: "3",
      status: "Successful",
    },
  ];

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Invoice Dashboard</h1>
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                4 overdue payments
              </h2>
              <p className="text-3xl font-bold">$16,000</p>
              <p className="text-sm text-gray-500">as of 4 May 2024</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-100 p-1">
              <div className="h-full w-full rounded-full bg-yellow-400"></div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Total Amount Spent
              </h2>
              <p className="text-3xl font-bold">$16,000</p>
              <p className="text-sm text-gray-500">/ $12000</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 p-1">
              <div className="h-full w-full rounded-full bg-green-400"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium">Transaction History</h2>
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
              16
            </span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "successful"
                ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("successful")}
          >
            Successful{" "}
            <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
              8
            </span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "pending"
                ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending{" "}
            <span className="ml-1 rounded-full bg-yellow-200 px-2 py-0.5 text-xs">
              5
            </span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "rejected"
                ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected{" "}
            <span className="ml-1 rounded-full bg-red-200 px-2 py-0.5 text-xs">
              3
            </span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-gray-500">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Total Installments</th>
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
                  <td className="px-4 py-4 text-sm">{transaction.amount}</td>
                  <td className="px-4 py-4 text-sm">
                    {transaction.installments}
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
            transactions
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">1</span>
            <span className="text-sm text-gray-500">of 2 pages</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
