"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ChevronDown, Building2, Bitcoin, Smartphone, Loader2 } from "lucide-react"
import Link from "next/link"

// Define currency types and exchange rates
type Currency = "USD" | "SLL"

interface ExchangeRates {
  [key: string]: {
    symbol: string
    rate: number
  }
}

const exchangeRates: ExchangeRates = {
  USD: { symbol: "$", rate: 1 },
  SLL: { symbol: "Le", rate: 19500 },
}

export default function WithdrawPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("58,000")
  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [walletAddress, setWalletAddress] = useState("")
  const [bankName, setBankName] = useState("United Bank of Africa (UBA)")
  const [accountNumber, setAccountNumber] = useState("5674-665557-6543434")
  const [ibanNumber, setIbanNumber] = useState("5674-665557-6543434")
  const [mobileMoneyOption, setMobileMoneyOption] = useState("self")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [baseCurrency, setBaseCurrency] = useState<Currency>("SLL")

  // Calculate converted amount based on exchange rates
  const calculateConvertedAmount = (inputAmount: string, from: Currency, to: Currency): string => {
    try {
      // Remove commas and convert to number
      const numericAmount = Number.parseFloat(inputAmount.replace(/,/g, ""))

      if (isNaN(numericAmount)) {
        return "0"
      }

      // Convert from source currency to USD (as base), then to target currency
      const amountInUSD = numericAmount / exchangeRates[from].rate
      const convertedAmount = amountInUSD * exchangeRates[to].rate

      // Format with commas
      return convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    } catch (error) {
      console.error("Error calculating converted amount:", error)
      return "0"
    }
  }

  const handleWithdraw = async () => {
    // Validation for mobile money
    if (paymentMethod === "mobile" && mobileMoneyOption === "other" && !phoneNumber) {
      toast("Error", {
        description: "Please enter a valid phone number",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would call your API here
      if (paymentMethod === "mobile") {
        // Call Mobile Money withdrawal API
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // In a real implementation, you would make an actual API call
          toast("Success", {
            description: `Your withdrawal request of ${exchangeRates[baseCurrency].symbol}${calculateConvertedAmount(amount, currency, baseCurrency)} has been initiated`,
          })
        } catch (error) {
          throw new Error("Failed to process mobile money withdrawal")
        }
      } else {
        // Existing bank/crypto withdrawal logic
        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast("Success", {
          description: "Withdrawal initiated successfully",
        })
      }
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to process withdrawal",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transaction</h1>

        <div className="mt-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <Link href="/dashboard/transaction/send" className="pb-2 text-gray-500 hover:text-gray-700">
              Send Money
            </Link>
            <Link href="/dashboard/transaction/deposit" className="pb-2 text-gray-500 hover:text-gray-700">
              Deposit Funds
            </Link>
            <Link
              href="/dashboard/transaction/withdraw"
              className="border-b-2 border-[#01133B] pb-2 font-medium text-[#01133B]"
            >
              Withdraw Funds
            </Link>
            <Link href="/dashboard/transaction/history" className="pb-2 text-gray-500 hover:text-gray-700">
              Transaction History
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-[#F8F7F2] p-6">
        <h2 className="mb-4 text-sm font-medium">Payment method</h2>
        <div className="flex">
          <div className="flex flex-col space-y-4">
            <div
              className={`flex cursor-pointer items-center space-x-4 border-l-4 ${
                paymentMethod === "bank"
                  ? "border-l-[#01133B] bg-white p-4 shadow-sm"
                  : "border-l-transparent bg-transparent p-4"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                <Building2 className="h-6 w-6 text-[#01133B]" />
              </div>
              <div>
                <h3 className="font-medium">Bank Transfer</h3>
                <p className="text-xs text-gray-500">1-3 days</p>
                <p className="text-xs text-gray-500">$100,000 Max</p>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-center space-x-4 border-l-4 ${
                paymentMethod === "crypto"
                  ? "border-l-[#01133B] bg-white p-4 shadow-sm"
                  : "border-l-transparent bg-transparent p-4"
              }`}
              onClick={() => setPaymentMethod("crypto")}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                <Bitcoin className="h-6 w-6 text-[#01133B]" />
              </div>
              <div>
                <h3 className="font-medium">Crypto</h3>
                <p className="text-xs text-gray-500">Instant</p>
                <p className="text-xs text-gray-500">$1,000,000 Max</p>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-center space-x-4 border-l-4 ${
                paymentMethod === "mobile"
                  ? "border-l-[#01133B] bg-white p-4 shadow-sm"
                  : "border-l-transparent bg-transparent p-4"
              }`}
              onClick={() => setPaymentMethod("mobile")}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                <Smartphone className="h-6 w-6 text-[#01133B]" />
              </div>
              <div>
                <h3 className="font-medium">Mobile Money</h3>
                <p className="text-xs text-gray-500">Instant</p>
                <p className="text-xs text-gray-500">$50,000 Max</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6 pt-0 bg-white p-4 ml-6">
            <div className="col-span-3 rounded-lg bg-white p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Input Amount</Label>
                  <div className="mt-1 flex items-center">
                    <div className="flex w-full items-center rounded-md border border-gray-300">
                      <div className="relative flex items-center border-r px-3 py-2">
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as Currency)}
                          className="appearance-none bg-transparent pr-6 focus:outline-none"
                        >
                          <option value="USD">{exchangeRates.USD.symbol}</option>
                          <option value="SLL">{exchangeRates.SLL.symbol}</option>
                        </select>
                        <ChevronDown className="absolute right-0 h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 border-0 bg-transparent px-3 py-2 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {exchangeRates[baseCurrency].symbol}
                      {calculateConvertedAmount(amount, currency, baseCurrency)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>Base Currency:</span>
                      <select
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value as Currency)}
                        className="rounded border border-gray-200 bg-transparent px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="USD">USD</option>
                        <option value="SLL">SLL</option>
                      </select>
                    </div>
                  </div>
                </div>

                {paymentMethod === "bank" ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">Bank Name</Label>
                      <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="United Bank of Africa (UBA)"
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Account Number</Label>
                      <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="5674-665557-6543434"
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">IBAN Number</Label>
                      <Input
                        value={ibanNumber}
                        onChange={(e) => setIbanNumber(e.target.value)}
                        placeholder="5674-665557-6543434"
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : paymentMethod === "crypto" ? (
                  <div className="space-y-2">
                    <Label className="text-sm">Enter Solana Wallet Address</Label>
                    <Input
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="FtxUXFfH8BUFGWcH@hboUxmJJP67JqjhDpBGbeCzVv"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500">
                      Make sure you input the correct wallet address. Transactions are irreversible.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">Withdraw To</Label>
                      <select
                        value={mobileMoneyOption}
                        onChange={(e) => setMobileMoneyOption(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01133B]"
                      >
                        <option value="self">Self (Your registered number)</option>
                        <option value="other">Other Mobile Number</option>
                      </select>
                    </div>

                    {mobileMoneyOption === "other" && (
                      <div className="space-y-2">
                        <Label className="text-sm">Mobile Number</Label>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter mobile number (e.g., +232712345678)"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="col-span-2 rounded-lg bg-[#F8F7F2] p-6 mt-4">
              <h3 className="mb-4 text-sm font-medium">Transaction Preview</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-lg font-medium">
                    Amount: {exchangeRates[baseCurrency].symbol}
                    {calculateConvertedAmount(amount, currency, baseCurrency)}
                  </p>
                  <p className="text-sm">Fee: Free</p>
                  <p className="text-sm text-gray-500">
                    Exchange Rate: 1 {currency} = {exchangeRates[baseCurrency].rate / exchangeRates[currency].rate}{" "}
                    {baseCurrency}
                  </p>
                </div>

                <div className="pt-2">
                  {paymentMethod === "bank" ? (
                    <>
                      <p className="text-sm font-medium">Destination: Bank Account</p>
                      <p className="text-sm">Bank: {bankName}</p>
                      <p className="text-sm">Account Number: {accountNumber}</p>
                      <p className="text-sm">IBAN Number: {ibanNumber}</p>
                    </>
                  ) : paymentMethod === "crypto" ? (
                    <>
                      <p className="text-sm font-medium">Destination: Crypto Wallet</p>
                      <p className="text-sm">Wallet: {walletAddress || "Not specified"}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        Destination:{" "}
                        {mobileMoneyOption === "self" ? "Your Registered Number" : phoneNumber || "Not specified"}
                      </p>
                      <p className="text-sm">Withdrawal Method: Mobile Money</p>
                      <p className="text-sm">Processing Time: Instant</p>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    {paymentMethod === "bank"
                      ? "Note: This transaction may take up to 3 business days to complete."
                      : paymentMethod === "crypto"
                        ? "Note: Crypto withdrawals are usually processed within 30 minutes."
                        : "Note: Mobile Money withdrawals are processed instantly."}
                  </p>
                </div>

                {paymentMethod === "mobile" && mobileMoneyOption === "other" && !phoneNumber && (
                  <p className="text-xs text-red-500">Please enter a valid phone number before proceeding.</p>
                )}

                <Button
                  onClick={handleWithdraw}
                  disabled={isLoading || (paymentMethod === "mobile" && mobileMoneyOption === "other" && !phoneNumber)}
                  className="mt-4 w-full bg-[#01133B] hover:bg-[#523526]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
