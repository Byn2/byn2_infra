"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { ChevronDown, Copy, Building2, Bitcoin, Loader2 } from "lucide-react"
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

// Define interface for API response
interface USSDResponse {
  success: boolean
  data?: {
    ussdCode: string
    reference: string
    expiresAt: string
  }
  error?: string
}

export default function DepositPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("58,000")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [baseCurrency, setBaseCurrency] = useState<Currency>("SLL")
  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [mobileMoneyOption, setMobileMoneyOption] = useState("self")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [ussdCode, setUssdCode] = useState("")
  const [ussdReference, setUssdReference] = useState("")
  const [ussdExpiry, setUssdExpiry] = useState("")
  const [walletAddress, setWalletAddress] = useState("FtxUXFfH8BUFGWcH@hboUxmJJP67JqjhDpBGbeCzVv")
  const [ussdCodeGenerated, setUssdCodeGenerated] = useState(false)

  // Function to calculate converted amount
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
      return convertedAmount.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
    } catch (error) {
      console.error("Error calculating converted amount:", error)
      return "0"
    }
  }

  // Get the converted amount for display
  const convertedAmount = calculateConvertedAmount(amount, currency, baseCurrency)

  const handleDeposit = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast("Success", {
        description: "Deposit initiated successfully",
      })
    } catch (error) {
      toast("Error", {
        description: "Failed to process deposit",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast("Copied", {
      description: "Copied to clipboard successfully",
    })
  }

  const generateUSSDCode = async () => {
    // Validation for phone number when "other" is selected
    if (mobileMoneyOption === "other" && !phoneNumber) {
      toast("Error", {
        description: "Please enter a valid phone number",
      })
      return
    }

    setIsLoading(true)
    try {
      // Prepare request payload
      const payload = {
        amount: Number.parseFloat(amount.replace(/,/g, "")),
        currency,
        baseCurrency,
        depositing_number: phoneNumber,
      }

      // Make API call
      const response = await fetch("/api/v1/monime/deposit/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      console.log(result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate USSD code")
      }

      // Extract USSD code from response
      if (result) {
        setUssdCode(result.ussd)
        setUssdCodeGenerated(true)

        toast("USSD Code Generated", {
          description: "Your USSD code has been generated successfully",
        })
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("USSD generation error:", error)
      toast("Error", {
        description: "Failed to generate payment code",
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
            <Link
              href="/dashboard/transaction/deposit"
              className="border-b-2 border-[#66432E] pb-2 font-medium text-[#66432E]"
            >
              Deposit Funds
            </Link>
            <Link href="/dashboard/transaction/withdraw" className="pb-2 text-gray-500 hover:text-gray-700">
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
                  ? "border-l-[#66432E] bg-white p-4 shadow-sm"
                  : "border-l-transparent bg-transparent p-4"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                <Building2 className="h-6 w-6 text-[#66432E]" />
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
                  ? "border-l-[#66432E] bg-white p-4 shadow-sm"
                  : "border-l-transparent bg-transparent p-4"
              }`}
              onClick={() => setPaymentMethod("crypto")}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                <Bitcoin className="h-6 w-6 text-[#66432E]" />
              </div>
              <div>
                <h3 className="font-medium">Crypto</h3>
                <p className="text-xs text-gray-500">Instant</p>
                <p className="text-xs text-gray-500">$1,000,000 Max</p>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-center space-x-4 border-l-4 ${
                paymentMethod === "mobileMoney"
                  ? "border-l-[#66432E] bg-white p-4 shadow-sm"
                  : "border-l-transparent bg-transparent p-4"
              }`}
              onClick={() => {
                setPaymentMethod("mobileMoney")
                setUssdCodeGenerated(false)
                setUssdCode("")
                setUssdReference("")
                setUssdExpiry("")
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-[#66432E]"
                >
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Mobile Money</h3>
                <p className="text-xs text-gray-500">Instant</p>
                <p className="text-xs text-gray-500">$50,000 Max</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6 pt-0 bg-white p-4 ml-6">
            {paymentMethod === "bank" ? (
              <>
                <div className="col-span-3 rounded-lg bg-white p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Input Amount</Label>
                      <div className="mt-1 flex items-center">
                        <div className="flex w-full items-center rounded-md border border-gray-300">
                          <div className="flex items-center border-r px-3 py-2">
                            <select
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value as Currency)}
                              className="appearance-none bg-transparent pr-6 focus:outline-none"
                            >
                              <option value="USD">{exchangeRates.USD.symbol}</option>
                              <option value="SLL">{exchangeRates.SLL.symbol}</option>
                            </select>
                            <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
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
                          {exchangeRates[baseCurrency].symbol} {convertedAmount}
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

                    <div className="space-y-2">
                      <Label className="text-sm">Bank Name</Label>
                      <Input value="United Bank of Africa (UBA)" readOnly className="mt-1 bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Account Number</Label>
                      <Input value="5674-665557-6543434" readOnly className="mt-1 bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">IBAN Number</Label>
                      <Input value="5674-665557-6543434" readOnly className="mt-1 bg-gray-50" />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 rounded-lg bg-[#F8F7F2] p-6 mt-4">
                  <h3 className="mb-4 text-sm font-medium">Transaction Preview</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-medium">
                        Amount: {exchangeRates[baseCurrency].symbol} {convertedAmount}
                      </p>
                      <p className="text-sm">Fee: Free</p>
                      <p className="text-sm text-gray-500">
                        Exchange Rate: 1 {currency} ={" "}
                        {(exchangeRates[baseCurrency].rate / exchangeRates[currency].rate).toLocaleString()}{" "}
                        {baseCurrency}
                      </p>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium">Destination: MOCHA UBA Bank Account</p>
                      <p className="text-sm">Account Number: 5674-665557-6543434</p>
                      <p className="text-sm">IBAN Number: 12345678910</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-gray-500">
                        Note: This transaction may take up to 3 business days to complete.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText("5674-665557-6543434")
                        toast({
                          title: "Copied",
                          description: "Account number copied to clipboard",
                        })
                      }}
                      className="mt-4 w-full"
                    >
                      Copy Account Details
                    </Button>
                  </div>
                </div>
              </>
            ) : paymentMethod === "crypto" ? (
              <>
                <div className="col-span-3 rounded-lg bg-white p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium">Transaction Details</h3>
                    <p className="text-sm mt-2">Send USDC to your Mocha wallet (Solana)</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm break-all">{walletAddress}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Copy the wallet address or scan the QR code with your wallet to deposit funds
                    </p>

                    <Button
                      variant="secondary"
                      className="mt-4 bg-[#66432E] text-white hover:bg-[#523526]"
                      onClick={() => copyToClipboard(walletAddress)}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy wallet address
                    </Button>
                  </div>
                </div>

                <div className="col-span-2 rounded-lg bg-[#F8F7F2] p-6 mt-4 flex items-center justify-center">
                  <div className="h-32 w-32 bg-white border border-gray-200">
                    <img src="/abstract-qr-code.png" alt="QR Code" className="h-full w-full" />
                  </div>
                </div>
              </>
            ) : (
              paymentMethod === "mobileMoney" && (
                <>
                  <div className="col-span-3 rounded-lg bg-white p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Input Amount</Label>
                        <div className="mt-1 flex items-center">
                          <div className="flex w-full items-center rounded-md border border-gray-300">
                            <div className="flex items-center border-r px-3 py-2">
                              <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as Currency)}
                                className="appearance-none bg-transparent pr-6 focus:outline-none"
                              >
                                <option value="USD">{exchangeRates.USD.symbol}</option>
                                <option value="SLL">{exchangeRates.SLL.symbol}</option>
                              </select>
                              <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
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
                            {exchangeRates[baseCurrency].symbol} {convertedAmount}
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

                      <div className="space-y-2">
                        <Label className="text-sm">Deposit To</Label>
                        <select
                          value={mobileMoneyOption}
                          onChange={(e) => {
                            setMobileMoneyOption(e.target.value)
                            setUssdCodeGenerated(false)
                            setUssdCode("")
                            setUssdReference("")
                            setUssdExpiry("")
                          }}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#66432E]"
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
                            onChange={(e) => {
                              setPhoneNumber(e.target.value)
                              setUssdCodeGenerated(false)
                              setUssdCode("")
                              setUssdReference("")
                              setUssdExpiry("")
                            }}
                            placeholder="Enter mobile number (e.g., +232712345678)"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 rounded-lg bg-[#F8F7F2] p-6 mt-4">
                    <h3 className="mb-4 text-sm font-medium">Transaction Preview</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-medium">
                          Amount: {exchangeRates[baseCurrency].symbol} {convertedAmount}
                        </p>
                        <p className="text-sm">Fee: Free</p>
                        <p className="text-sm text-gray-500">
                          Exchange Rate: 1 {currency} ={" "}
                          {(exchangeRates[baseCurrency].rate / exchangeRates[currency].rate).toLocaleString()}{" "}
                          {baseCurrency}
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm font-medium">
                          Destination:{" "}
                          {mobileMoneyOption === "self" ? "Your Registered Number" : phoneNumber || "Enter a number"}
                        </p>
                        {ussdCodeGenerated && (
                          <>
                            <p className="text-sm font-medium mt-2">USSD Code:</p>
                            <p className="text-sm bg-white p-2 rounded border border-gray-200 mt-1">{ussdCode}</p>
                            {ussdReference && <p className="text-xs text-gray-500 mt-1">Reference: {ussdReference}</p>}
                            {ussdExpiry && (
                              <p className="text-xs text-gray-500">Expires: {new Date(ussdExpiry).toLocaleString()}</p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-gray-500">
                          {ussdCodeGenerated
                            ? "Note: After copying the USSD code, dial it on your phone. Follow the prompts to complete the deposit. The funds will appear in your account instantly after the transaction is confirmed."
                            : "Note: Click 'Send' to generate a USSD code for this transaction."}
                        </p>
                      </div>
                      {mobileMoneyOption === "other" && !phoneNumber && ussdCodeGenerated === false && (
                        <p className="text-xs text-red-500 mt-2">
                          Please enter a valid phone number before generating the USSD code.
                        </p>
                      )}
                      {!ussdCodeGenerated ? (
                        <Button
                          variant="default"
                          className="mt-4 w-full bg-[#66432E] text-white hover:bg-[#523526]"
                          onClick={generateUSSDCode}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </>
                          ) : (
                            "Send"
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => copyToClipboard(ussdCode)} className="mt-4 w-full">
                          Copy USSD Code
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
