"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { useToast } from "@/components/ui/use-toast"
import Link from "next/link";
import { formatCurrency } from "@/lib/util";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";

interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  source: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function TransactionHistoryPage() {
  //   const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [period, setPeriod] = useState("30days");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your API with pagination
        // For demo purposes, we'll simulate data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample data
        const sampleTransactions: Transaction[] = Array.from(
          { length: 50 },
          (_, i) => ({
            _id: `tx_${i + 1000}`,
            amount: Math.floor(Math.random() * 10000) / 100,
            currency: "USD",
            source: [
              "Bank Transfer",
              "Card Payment",
              "Crypto Deposit",
              "Byn2 Transfer",
            ][Math.floor(Math.random() * 4)],
            status: ["success", "pending", "failed"][
              Math.floor(Math.random() * 3)
            ],
            type: ["payment", "deposit", "withdrawal"][
              Math.floor(Math.random() * 3)
            ],
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
        );

        setTransactions(sampleTransactions);
        setTotalPages(Math.ceil(sampleTransactions.length / 10));
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to load transactions",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by status
    if (filter !== "all" && transaction.status !== filter) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !transaction.source.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Paginate transactions
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const handleExport = () => {
    // toast({
    //   title: "Export Started",
    //   description: "Your transaction history is being exported",
    // });
  };

  return (
    <div className="container space-y-8 py-8">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">
            Transaction History
          </h2>

          <p>View and manage your transaction history</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-4 border-b border-gray-200">
        <div className="flex space-x-8">
          <Link
            href="/dashboard/transaction/send"
            className="pb-2 text-gray-500 hover:text-gray-700"
          >
            Send Money
          </Link>
          <Link
            href="/dashboard/transaction/deposit"
            className="pb-2 text-gray-500 hover:text-gray-700"
          >
            Deposit Funds
          </Link>
          <Link
            href="/dashboard/transaction/withdraw"
            className="pb-2 text-gray-500 hover:text-gray-700"
          >
            Withdraw Funds
          </Link>
          <Link
            href="/dashboard/transaction/history"
            className="border-b-2 border-[#01133B] pb-2 font-medium text-[#01133B]"
          >
            Transaction History
          </Link>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All transactions</SelectItem>
                  <SelectItem value="success">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {transaction._id}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.type}
                      </TableCell>
                      <TableCell>{transaction.source}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transaction.status === "success"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                        >
                          {transaction.status === "success" ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : transaction.status === "pending" ? (
                            <Calendar className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {transaction.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>
                Showing {paginatedTransactions.length} of{" "}
                {filteredTransactions.length} transactions
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
