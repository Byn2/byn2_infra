"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/util";
import {
  ArrowLeft,
  ArrowUp,
  Calendar,
  Download,
  ExternalLink,
} from "lucide-react";

interface Transaction {
  _id: string;
  amount: number;
  fee: number;
  currency: string;
  source: string;
  status: string;
  type: string;
  reference?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export default function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  //   const { toast } = useToast()
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedTransactions, setRelatedTransactions] = useState<Transaction[]>(
    []
  );
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setIsLoading(true);
        const resolvedParams = await params;
        setTransactionId(resolvedParams.id);
        // In a real app, you would fetch from your API
        // For demo purposes, we'll simulate data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample transaction data
        const sampleTransaction: Transaction = {
          _id: resolvedParams.id,
          amount: 38000,
          fee: 950,
          currency: "USD",
          source: "Rachel's Computer Shop",
          status: "success",
          type: "payment",
          reference: "INV-2023-001",
          createdAt: new Date().toISOString(),
          metadata: {
            customerName: "Rachel Smith",
            customerEmail: "rachel@example.com",
            items: [
              { name: "Laptop", price: 32000, quantity: 1 },
              { name: "Mouse", price: 3000, quantity: 2 },
            ],
          },
        };

        setTransaction(sampleTransaction);

        // Sample related transactions
        const sampleRelatedTransactions: Transaction[] = [
          {
            _id: "tx_1001",
            amount: 5000,
            fee: 125,
            currency: "USD",
            source: "Rachel's Computer Shop",
            status: "success",
            type: "payment",
            reference: "INV-2023-002",
            createdAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "tx_1002",
            amount: 12000,
            fee: 300,
            currency: "USD",
            source: "Rachel's Computer Shop",
            status: "pending",
            type: "payment",
            reference: "INV-2023-003",
            createdAt: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];

        setRelatedTransactions(sampleRelatedTransactions);
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to load transaction details",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [params]);

  const handleDownloadReceipt = () => {
    // toast({
    //   title: "Download Started",
    //   description: "Your receipt is being downloaded",
    // })
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex animate-pulse flex-col space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-4 h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Transaction Not Found</h2>
          <p className="mb-4 text-gray-500">
            The transaction you're looking for doesn't exist or has been
            removed.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="ml-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Transaction Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            View details for transaction #{transactionId || 'Loading...'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
              <CardDescription>Details about this transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between rounded-lg bg-[#FAF7F2] p-4 dark:bg-gray-800">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-2xl font-bold text-[#01133B]">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
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
                      <ArrowUp className="mr-1 h-3 w-3 rotate-180" />
                    )}
                    {transaction.status}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Transaction ID
                    </p>
                    <p className="font-mono">{transaction._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Reference
                    </p>
                    <p>{transaction.reference || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="capitalize">{transaction.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Source</p>
                    <p>{transaction.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fee</p>
                    <p>{formatCurrency(transaction.fee)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Net Amount
                    </p>
                    <p>
                      {formatCurrency(transaction.amount - transaction.fee)}
                    </p>
                  </div>
                </div>
              </div>

              {transaction.metadata && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Additional Information
                    </h3>
                    {transaction.metadata.customerName && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Customer
                        </p>
                        <p>{transaction.metadata.customerName}</p>
                        {transaction.metadata.customerEmail && (
                          <p className="text-sm text-gray-500">
                            {transaction.metadata.customerEmail}
                          </p>
                        )}
                      </div>
                    )}
                    {transaction.metadata.items && (
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-500">
                          Items
                        </p>
                        <div className="rounded-md border">
                          <div className="grid grid-cols-3 border-b bg-muted p-2 text-xs font-medium">
                            <div>Item</div>
                            <div className="text-right">Price</div>
                            <div className="text-right">Total</div>
                          </div>
                          <div className="divide-y">
                            {transaction.metadata.items.map(
                              (item: any, index: number) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-3 p-2 text-sm"
                                >
                                  <div>
                                    {item.name}{" "}
                                    {item.quantity > 1 && `(x${item.quantity})`}
                                  </div>
                                  <div className="text-right">
                                    {formatCurrency(item.price)}
                                  </div>
                                  <div className="text-right">
                                    {formatCurrency(
                                      item.price * (item.quantity || 1)
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDownloadReceipt}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Transactions</CardTitle>
              <CardDescription>
                Other transactions with this source
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatedTransactions.length > 0 ? (
                <div className="space-y-4">
                  {relatedTransactions.map((relatedTx) => (
                    <div
                      key={relatedTx._id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium">
                          {formatCurrency(relatedTx.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(relatedTx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`mr-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            relatedTx.status === "success"
                              ? "bg-green-100 text-green-800"
                              : relatedTx.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {relatedTx.status}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            router.push(
                              `/dashboard/transaction/${relatedTx._id}`
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  No related transactions found
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Available actions for this transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              {transaction.status === "pending" && (
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Check Status
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                View in Merchant Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
