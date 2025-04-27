"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileUp, BarChart } from "lucide-react";

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample invoice data
  const invoices = [
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Processing",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Completed",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Overdue",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Requested",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Completed",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Processing",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Overdue",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
    {
      id: "#123456",
      client: "Easy Solar",
      status: "Requested",
      startDate: "10/05/24",
      dueDate: "10/08/24",
      amount: "$123,000",
    },
  ];

  // Filter invoices based on active tab
  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true;
    return invoice.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "requested":
        return "bg-blue-100 text-blue-800";
      case "unpaid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/invoices/dashboard">
            <Button
              variant="outline"
              className="border-[#01133B] text-[#01133B]"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/invoices/create">
            <Button className="bg-[#01133B] hover:bg-[#523526]">
              Create Invoice
            </Button>
          </Link>
          <Button variant="outline" className="border-[#01133B] text-[#01133B]">
            <FileUp className="mr-2 h-4 w-4" />
            Import Invoice
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-1">
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
                activeTab === "completed"
                  ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                8
              </span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "overdue"
                  ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue{" "}
              <span className="ml-1 rounded-full bg-red-200 px-2 py-0.5 text-xs">
                3
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
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                3
              </span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "requested"
                  ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("requested")}
            >
              Requested{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                2
              </span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "unpaid"
                  ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("unpaid")}
            >
              Unpaid{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                0
              </span>
            </button>
          </div>
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-gray-500">
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Take Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}
                >
                  <td className="px-4 py-4 text-sm">{invoice.id}</td>
                  <td className="px-4 py-4 text-sm">{invoice.client}</td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">{invoice.startDate}</td>
                  <td className="px-4 py-4 text-sm">{invoice.dueDate}</td>
                  <td className="px-4 py-4 text-sm">{invoice.amount}</td>
                  <td className="px-4 py-4 text-sm">
                    <Button
                      size="sm"
                      className="bg-[#01133B] hover:bg-[#523526] text-xs"
                    >
                      Make Payment
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredInvoices.length} of {invoices.length} invoices
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
