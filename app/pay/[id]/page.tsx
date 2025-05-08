"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/util";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Smartphone,
  Copy,
  RefreshCw,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types
interface Transaction {
  _id: string;
  status: string;
  amount: number;
  currency: string;
  reference?: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  mobileNumber: string;
  walletBalance: number;
}

interface DepositResponse {
  ussdCode: string;
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  // Flow states
  const [step, setStep] = useState<number>(1); // 1: Auth, 2: Transaction, 3: Result
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auth states
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");

  // Data states
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [depositTab, setDepositTab] = useState<string>("mobile");

  // Mobile Money deposit states
  const [depositInitiated, setDepositInitiated] = useState<boolean>(false);
  const [
    depositResponse,
    setDepositResponse,
  ] = useState<DepositResponse | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState<boolean>(false);
  const [showDepositDialog, setShowDepositDialog] = useState<boolean>(false);

  // Payment validation states
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [paymentData, setPaymentData] = useState<{
    id: string;
    timestamp: string;
  } | null>(null);

  // Validate payment signature on component mount
  useEffect(() => {
    const validatePaymentSignature = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // The URL format is: /pay/{id}.{timestamp}.{token}
        // The full URL parameter contains the entire signature
        const fullSignature = params.id;

        // Call the API route to verify the signature
        const response = await fetch("/api/v1/payment/verify-signature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signature: fullSignature }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Invalid payment signature");
        }

        // Store the extracted data
        setPaymentData(result.data);
        setIsTokenValid(true);

        // Continue with the payment flow
        // Note: We'll fetch payment data after authentication
      } catch (error) {
        console.error("Error validating payment signature:", error);
        setError(error.message || "Invalid payment link");
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validatePaymentSignature();
  }, [params.id]);

  // Request OTP
  const requestOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/auth/otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);

      toast("OTP Sent", {
        description: "A verification code has been sent to your mobile number",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Fetch transaction after successful authentication
      await fetchPaymentData();

      // Move to next step
      setStep(2);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transaction
  const fetchPaymentData = async () => {
    if (!paymentData) {
      setError("Invalid payment data");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/payment/status/${paymentData.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }

      const data = await response.json();

      const fetchedUser: User = {
        ...data.customer.user,
        walletBalance: data.customer.wallet.usdc, // or `fiat` depending on logic
      };

      const fetchedTransaction: Transaction = data.transaction;

      setUser(fetchedUser);
      setTransaction(fetchedTransaction);

      // Use local variables to compare balance
      if (fetchedTransaction.amount > fetchedUser.walletBalance) {
        setInsufficientFunds(true);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError(error.message || "Failed to load payment data");
    } finally {
      setIsLoading(false);
    }
  };

  // Check updated balance
  const checkUpdatedBalance = async () => {
    try {
      setIsCheckingBalance(true);
      setError(null);

      // Fetch updated user data to check if deposit was successful
      const response = await fetch(`/api/v1/wallet/balance`);

      if (!response.ok) {
        throw new Error("Failed to fetch updated balance");
      }

      const data = await response.json();

      // Update user with new balance
      if (user) {
        const updatedUser = {
          ...user,
          walletBalance: data.balance.usdc, // or `fiat` depending on logic
        };

        setUser(updatedUser);

        // Check if balance is now sufficient
        if (transaction && updatedUser.walletBalance >= transaction.amount) {
          setInsufficientFunds(false);
          setDepositInitiated(false);
          setDepositResponse(null);

          toast("Deposit Successful", {
            description: "Your deposit has been processed successfully.",
          });
        } else {
          toast("Deposit Pending", {
            description:
              "Your deposit has not been processed yet. Please try again in a few moments.",
          });
        }
      }
    } catch (error) {
      console.error("Error checking balance:", error);
      toast("Error", {
        description: error.message || "Failed to check balance",
      });
    } finally {
      setIsCheckingBalance(false);
    }
  };

  // Confirm payment
  const confirmPayment = async () => {
    if (!paymentData) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/v1/payment/confirm/${paymentData.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process payment");
      }

      // Update transaction with new status
      setTransaction({
        ...transaction!,
        status: "success",
      });

      // Move to result step
      setStep(3);

      toast("Payment Successful", {
        description: "Your payment has been processed successfully.",
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      setError(error.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel payment
  const cancelPayment = async () => {
    if (!paymentData) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/payment/cancel/${paymentData.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel payment");
      }

      // Update transaction with new status
      setTransaction({
        ...transaction!,
        status: "cancelled",
      });

      // Move to result step
      setStep(3);

      toast("Payment Cancelled", {
        description: "Your payment has been cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling payment:", error);
      setError(error.message || "Failed to cancel payment");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mobile money deposit
  const handleDeposit = async () => {
    if (!user || !transaction) return;

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        transaction_id: transaction._id,
        depositing_number: user.mobileNumber,
      };

      const response = await fetch("/api/v1/monime/deposit/generate-ussd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate deposit");
      }

      // Set deposit response with USSD code
      setDepositResponse({
        ussdCode: data.ussd,
      });

      setDepositInitiated(true);
      setShowDepositDialog(true);

      toast("Deposit Initiated", {
        description: "Please follow the instructions to complete your deposit.",
      });
    } catch (error) {
      console.error("Error initiating deposit:", error);
      setError(error.message || "Failed to initiate deposit");

      toast("Deposit Failed", {
        description: error.message || "Failed to initiate deposit",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy USSD code to clipboard
  const copyUssdCode = () => {
    if (depositResponse?.ussdCode) {
      navigator.clipboard.writeText(depositResponse.ussdCode);
      toast("Copied to Clipboard", {
        description: "USSD code copied to clipboard",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src="/logo.png" alt="Byn2 Logo" className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Authentication Required"}
            {step === 2 && "Payment Confirmation"}
            {step === 3 &&
              (transaction?.status === "success"
                ? "Payment Successful"
                : "Payment Cancelled")}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Please authenticate to continue with your payment"}
            {step === 2 && "Review and confirm your payment details"}
            {step === 3 &&
              (transaction?.status === "success"
                ? "Your payment has been processed successfully"
                : "Your payment has been cancelled")}
          </CardDescription>

          {/* Progress indicator */}
          <div className="mt-4">
            <Progress value={step * 33.33} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Authentication</span>
              <span>Confirmation</span>
              <span>Complete</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isTokenValid === false ? (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="mb-4 h-16 w-16 text-red-500" />
              <p className="text-center text-lg font-medium">
                Invalid Payment Link
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                This payment link is invalid or has expired. Please contact the
                merchant for a new payment link.
              </p>
            </div>
          ) : isTokenValid === null ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="mb-4 h-16 w-16 animate-spin text-[#66432E]" />
              <p className="text-center text-lg font-medium">
                Verifying Payment Link
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                Please wait while we verify the payment link...
              </p>
            </div>
          ) : (
            <>
              {/* Existing content for steps 1, 2, and 3 */}
              {step === 1 && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="mobile"
                          placeholder="Enter your mobile number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                        <Button
                          onClick={requestOtp}
                          disabled={isLoading || !mobileNumber}
                          className="bg-[#66432E] hover:bg-[#523526]"
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Send OTP
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                            render={({ slots }) => (
                              <InputOTPGroup>
                                {slots.map((slot, i) => (
                                  <InputOTPSlot key={i} index={i} {...slot} />
                                ))}
                              </InputOTPGroup>
                            )}
                          />
                        </div>
                        <p className="text-center text-sm text-gray-500">
                          Enter the 6-digit code sent to {mobileNumber}
                        </p>
                      </div>
                      <Button
                        onClick={verifyOtp}
                        disabled={isLoading || otp.length !== 6}
                        className="w-full bg-[#66432E] hover:bg-[#523526]"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Verify & Continue
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="w-full"
                      >
                        Use a different number
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && transaction && user && (
                <div className="space-y-6">
                  {/* User info */}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#66432E] flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.mobileNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction details */}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h3 className="mb-2 font-medium">Transaction Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Reference:
                        </span>
                        <span className="font-medium">
                          {transaction.reference || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="font-medium">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Transaction ID:
                        </span>
                        <span className="font-medium text-xs">
                          {transaction._id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet balance */}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Wallet Balance</h3>
                        <p className="text-sm text-gray-500">
                          Available for payment
                        </p>
                      </div>
                      <span className="font-bold text-lg">
                        {formatCurrency(user.walletBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Insufficient funds section */}
                  {insufficientFunds ? (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-amber-800">
                              Insufficient Funds
                            </h3>
                            <p className="text-sm text-amber-700">
                              Your wallet balance is insufficient to complete
                              this payment. Please deposit funds to continue.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Tabs defaultValue="mobile" onValueChange={setDepositTab}>
                        <TabsList className="grid w-full grid-cols-1">
                          <TabsTrigger value="mobile">
                            Mobile Money Deposit
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="mobile" className="space-y-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="h-8 w-8 text-[#66432E]" />
                            <div>
                              <h3 className="font-medium">
                                Mobile Money Deposit
                              </h3>
                              <p className="text-sm text-gray-500">
                                Deposit funds using your mobile money account
                              </p>
                            </div>
                          </div>

                          {depositInitiated ? (
                            <div className="space-y-4">
                              <Button
                                onClick={checkUpdatedBalance}
                                disabled={isCheckingBalance}
                                className="w-full bg-[#66432E] hover:bg-[#523526] flex items-center justify-center"
                              >
                                {isCheckingBalance ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                )}
                                Check Deposit Status
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() => setShowDepositDialog(true)}
                                className="w-full"
                              >
                                View USSD Code Again
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={handleDeposit}
                              disabled={isLoading}
                              className="w-full bg-[#66432E] hover:bg-[#523526]"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Deposit {formatCurrency(transaction.amount)}
                            </Button>
                          )}
                        </TabsContent>
                      </Tabs>

                      <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                        <p className="text-sm text-gray-600">
                          <strong>Note:</strong> Bank and Crypto deposits are
                          only available via the WhatsApp bot or Mobile App.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={confirmPayment}
                        disabled={isLoading}
                        className="w-full bg-[#66432E] hover:bg-[#523526]"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Confirm Payment
                      </Button>
                      <Button
                        onClick={cancelPayment}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Cancel Payment
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && transaction && (
                <div className="flex flex-col items-center justify-center py-4">
                  {transaction.status === "success" ? (
                    <>
                      <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                      <p className="text-center text-lg font-medium">
                        Payment Successful
                      </p>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Your payment of {formatCurrency(transaction.amount)} has
                        been processed successfully.
                      </p>
                      <div className="mt-6 w-full rounded-lg bg-gray-50 p-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Transaction ID:
                          </span>
                          <span className="font-medium text-xs">
                            {transaction._id}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">Date:</span>
                          <span className="font-medium">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="mb-4 h-16 w-16 text-red-500" />
                      <p className="text-center text-lg font-medium">
                        Payment Cancelled
                      </p>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Your payment has been cancelled. No funds have been
                        deducted.
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          {step === 3 && (
            <Button
              onClick={() => window.close()}
              className="w-full bg-[#66432E] hover:bg-[#523526]"
            >
              Close
            </Button>
          )}
          <p className="mt-4 text-center text-xs text-gray-500">
            Secured by Byn2 Payment System
          </p>
        </CardFooter>
      </Card>

      {/* USSD Code Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Mobile Money Deposit</DialogTitle>
            <DialogDescription>
              An SMS has been sent with your payment code. Alternatively, copy
              the code below and follow the instructions on your phone to
              complete the payment.
            </DialogDescription>
          </DialogHeader>

          {depositResponse && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-mono bg-gray-100 p-4 rounded-md w-full text-center">
                  {depositResponse.ussdCode}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={copyUssdCode}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Dial the USSD code above on your phone</li>
                  <li>Follow the prompts to confirm the payment</li>
                  <li>Enter your PIN when requested</li>
                  <li>Wait for confirmation SMS</li>
                  <li>Return to this page and click "Check Deposit Status"</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Reference:</strong> {depositResponse.reference}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDepositDialog(false)}
            >
              Close
            </Button>
            <Button
              className="mt-2 sm:mt-0 bg-[#66432E] hover:bg-[#523526]"
              onClick={() => {
                setShowDepositDialog(false);
                checkUpdatedBalance();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Deposit Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
