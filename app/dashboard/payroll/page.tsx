//@ts-ignore
//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  BarChart,
  Plus,
  Download,
  Eye,
  Edit,
} from "lucide-react";
import { toast } from "sonner"
import { format } from "date-fns"

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try{
        const response = await fetch("/api/v1/payroll");
        const data = await response.json();
        console.log("Data: ", data.payrolls)
        setPayrolls(data.payrolls);

      }catch(e){
        console.error("Error fetching contacts:", e)
        toast("Error loading contacts", {
          description: "Please try again later.",
        })
      }
    }
    fetchPayrolls();
  }, []);

  // Filter payrolls based on active tab
  const filteredPayrolls = payrolls.filter((payroll) => {
    if (activeTab === "all") return true;
    return payroll.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-sm text-gray-500">
            Manage employee payroll and scheduled payments
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard/payroll/dashboard">
            <Button
              variant="outline"
              className="border-[#01133B] text-[#01133B]"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/payroll/create">
            <Button className="bg-[#01133B] hover:bg-[#523526]">
              <Plus className="mr-2 h-4 w-4" />
              Create Payroll
            </Button>
          </Link>
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
                8
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
                5
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
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "draft"
                  ? "rounded-md bg-[#F8F7F2] text-[#01133B]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("draft")}
            >
              Draft{" "}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                1
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search payrolls"
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
                <th className="px-4 py-3">Payroll ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Employees</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayrolls.map((payroll, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}
                >
                  <td className="px-4 py-4 text-sm">{payroll.id}</td>
                  <td className="px-4 py-4 text-sm">{payroll.name}</td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        payroll.status
                      )}`}
                    >
                      {payroll.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm"> {payroll.paymentDate ? format(payroll.paymentDate, "MMM dd yyyy") : ""}</td>
                  <td className="px-4 py-4 text-sm">{payroll.employeeCount}</td>
                  <td className="px-4 py-4 text-sm">{payroll.totalAmount}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/payroll/${payroll._id}`}>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      </Link>
                      {(payroll.status === "Draft" ||
                        payroll.status === "Scheduled") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/dashboard/payroll/${payroll._id}/edit`}>
                          <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredPayrolls.length} of {payrolls.length} payrolls
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
              onClick={() => setCurrentPage(Math.min(1, currentPage + 1))}
              disabled={currentPage === 1}
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
