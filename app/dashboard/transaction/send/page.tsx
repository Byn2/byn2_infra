"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Coffee, Building2, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { sendByn2Transfer, sendBankTransfer } from "./actions"

interface Contact {
  _id: string
  name: string
  // Add other contact properties as needed
}

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

export default function SendMoneyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOnlineSearching, setIsOnlineSearching] = useState(false)
  const [amount, setAmount] = useState("1")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [baseCurrency, setBaseCurrency] = useState<Currency>("SLL")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Byn2")
  const [transferType, setTransferType] = useState("local")
  const [bankAddress, setBankAddress] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ibanNumber, setIbanNumber] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([]) // Placeholder for fetched contacts
  const [onlineSearchResults, setOnlineSearchResults] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const allContacts = [...contacts, ...onlineSearchResults]
  const selectedContactName = allContacts.find((contact) => contact._id === selectedContact)?.name || "Not Selected"
  const [searchQuery, setSearchQuery] = useState("")

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
      return convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    } catch (error) {
      console.error("Error calculating converted amount:", error)
      return "0"
    }
  }

  // Get the formatted amount for display
  const formattedAmount = amount ? `${exchangeRates[currency].symbol} ${amount}` : ""

  // Get the converted amount for display
  const convertedAmount = calculateConvertedAmount(amount, currency, baseCurrency)

  // Placeholder for fetching contacts from the database
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/v1/contact")
        if (!response.ok) {
          throw new Error("Failed to fetch contacts")
        }
        const data = await response.json()
        console.log("Data: ", data.contacts)
        setContacts(data.contacts)
      } catch (error) {
        console.error("Error fetching contacts:", error)
        toast("Error loading contacts", {
          description: "Please try again later.",
        })
      }
    }
    fetchContacts()
  }, [])

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedContact) {
        throw new Error("Please select a recipient")
      }

      if (!amount || isNaN(Number(amount.replace(/,/g, "")))) {
        throw new Error("Please enter a valid amount")
      }

      let result

      if (paymentMethod === "Byn2") {
        result = await sendByn2Transfer({
          amount: Number(amount.replace(/,/g, "")),
          currency,
          baseCurrency,
          notes,
          recipient: selectedContact,
        })
      } else {
        // Validate bank transfer fields
        if (!bankName) throw new Error("Bank name is required")
        if (!accountNumber) throw new Error("Account number is required")
        if (transferType === "international" && !ibanNumber) throw new Error("IBAN number is required")

        result = await sendBankTransfer({
          amount: Number(amount.replace(/,/g, "")),
          currency,
          baseCurrency,
          bankAddress,
          bankName,
          accountNumber,
          ibanNumber,
          transferType,
          recipient: selectedContact,
        })
      }

      if (result.error) {
        throw new Error(result.error)
      }

      toast("Transfer successful", {
        description: "Your money has been sent.",
      })

      // Reset form
      setAmount("")
      setNotes("")
      setBankAddress("")
      setBankName("")
      setAccountNumber("")
      setIbanNumber("")
    } catch (error: any) {
      toast("Transfer failed", {
        description: error.message || "Please check your details and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnlineSearch = useCallback(async (query: string) => {
    setIsOnlineSearching(true)
    setOnlineSearchResults([]) // Clear previous results
    try {
      const response = await fetch(`/api/v1/user/search?term=${query}`)
      if (!response.ok) {
        throw new Error("Online search failed")
      }
      const data = await response.json()
      console.log(data)
      // Assuming the API returns an array of contacts
      setOnlineSearchResults(data || [])
    } catch (error) {
      toast("Error searching online", {
        description: "Please try again later. ",
      })
      setOnlineSearchResults([])
    } finally {
      setIsOnlineSearching(false)
    }
  }, [])

  const filteredContacts = allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    // Debounce the search query
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        // Check if the searchQuery matches any local contacts
        const hasLocalMatch = contacts.some((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

        if (!hasLocalMatch) {
          handleOnlineSearch(searchQuery)
        } else {
          setOnlineSearchResults([]) // Clear online search results if there's a local match
        }
      } else {
        setOnlineSearchResults([]) // Clear online search results if the search query is empty
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId) // Cleanup timeout on unmount or query change
  }, [searchQuery, contacts, handleOnlineSearch])

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transaction</h1>

        <div className="mt-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <Link
              href="/dashboard/transaction/send"
              className="border-b-2 border-[#01133B] pb-2 font-medium text-[#01133B]"
            >
              Send Money
            </Link>
            <Link href="/dashboard/transaction/deposit" className="pb-2 text-gray-500 hover:text-gray-700">
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
        <form onSubmit={handleSendMoney}>
          <div className="flex">
            <div className="flex flex-col space-y-4">
              <div
                className={`flex cursor-pointer items-center space-x-4 border-l-4 ${
                  paymentMethod === "Byn2"
                    ? "border-l-[#01133B] bg-white p-4 shadow-sm"
                    : "border-l-transparent bg-transparent p-4"
                }`}
                onClick={() => setPaymentMethod("Byn2")}
              >
                <div className="flex h-12 w-12 items-center justify-center bg-[#F8F7F2]">
                  <Coffee className="h-6 w-6 text-[#01133B]" />
                </div>
                <div>
                  <h3 className="font-medium">Byn2</h3>
                  <p className="text-xs text-gray-500">Instant</p>
                  <p className="text-xs text-gray-500">$1,000,000 Max</p>
                </div>
              </div>

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
                  <p className="text-xs text-gray-500">1 - 3 days</p>
                  <p className="text-xs text-gray-500">$100,000 Max</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-6 pt-0 bg-white p-4">
              <div className="col-span-3 rounded-lg bg-white p-6">
                {transferType === "international" && (
                  <div className="mb-4 flex rounded-md bg-gray-100">
                    <button
                      type="button"
                      className={`flex-1 rounded-md py-2 text-center text-sm ${
                        transferType === "local" ? "bg-white shadow-sm" : ""
                      }`}
                      onClick={() => setTransferType("local")}
                    >
                      Local Transfer
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-md py-2 text-center text-sm ${
                        transferType === "international" ? "bg-[#01133B] text-white" : ""
                      }`}
                      onClick={() => setTransferType("international")}
                    >
                      International Transfer
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm" htmlFor="recipient">
                      Customer
                    </Label>
                    <Select onValueChange={setSelectedContact} name="recipient">
                      <SelectTrigger className="w-full flex items-center justify-between rounded-md border border-gray-300 px-3 py-2">
                        <SelectValue placeholder="Select or Add a Contact" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="relative p-2 p-r">
                          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="search"
                            placeholder="Search contacts..."
                            className="pl-8 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        {filteredContacts.map((contact) => (
                          <SelectItem key={contact._id} value={contact._id}>
                            {contact.name}
                          </SelectItem>
                        ))}
                        {isOnlineSearching && (
                          <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching online...
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm" htmlFor="amount">
                      Input Amount
                    </Label>
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
                          name="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="flex-1 border-0 bg-transparent px-3 py-2 focus:outline-none focus:ring-0"
                          required
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

                  {paymentMethod === "Byn2" ? (
                    <div>
                      <Label className="text-sm" htmlFor="notes">
                        Notes
                      </Label>
                      <Textarea
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Payment for the 10 computers supplied last week."
                        className="mt-1 h-32"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label className="text-sm" htmlFor="bankAddress">
                          Bank Address
                        </Label>
                        <Input
                          name="bankAddress"
                          value={bankAddress}
                          onChange={(e) => setBankAddress(e.target.value)}
                          placeholder="Freetown, Sierra Leone"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm" htmlFor="bankName">
                          Bank Name
                        </Label>
                        <Input
                          name="bankName"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="United Bank of Africa (UBA)"
                          className="mt-1"
                          required={paymentMethod === "bank"}
                        />
                      </div>

                      <div>
                        <Label className="text-sm" htmlFor="accountNumber">
                          Account Number
                        </Label>
                        <Input
                          name="accountNumber"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="5674-665557-6543434"
                          className="mt-1"
                          required={paymentMethod === "bank"}
                        />
                      </div>

                      {transferType === "international" && (
                        <div>
                          <Label className="text-sm" htmlFor="ibanNumber">
                            IBAN Number
                          </Label>
                          <Input
                            name="ibanNumber"
                            value={ibanNumber}
                            onChange={(e) => setIbanNumber(e.target.value)}
                            placeholder="5674-665557-6543434"
                            className="mt-1"
                            required={paymentMethod === "bank" && transferType === "international"}
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
                      Amount: {exchangeRates[baseCurrency].symbol} {convertedAmount}
                    </p>
                    <p className="text-sm">
                      {transferType === "international"
                        ? `Fee (1%): ${exchangeRates[baseCurrency].symbol}${(Number(convertedAmount.replace(/,/g, "")) * 0.01).toLocaleString()}`
                        : `Fee: Free`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Exchange Rate: 1 {currency} ={" "}
                      {(exchangeRates[baseCurrency].rate / exchangeRates[currency].rate).toLocaleString()}{" "}
                      {baseCurrency}
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium">Recipient: {selectedContactName}</p>
                    <p className="text-sm">Duration: {paymentMethod === "Byn2" ? "Instant" : "1-3 days"}</p>
                  </div>

                  {paymentMethod === "bank" && (
                    <div className="pt-2">
                      <p className="text-sm font-medium">
                        Destination: {transferType === "international" ? "Business" : "Byn2"} UBA Bank Account
                      </p>
                      <p className="text-sm">Account Number: {accountNumber}</p>
                      <p className="text-sm">IBAN number: {ibanNumber}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-xs text-gray-500">
                      {paymentMethod === "Byn2"
                        ? `Note: ${notes}`
                        : "Note: This transaction may take up to 3 business days to complete."}
                    </p>
                  </div>

                  <Button type="submit" disabled={isLoading} className="mt-4 w-full bg-[#01133B] hover:bg-[#523526]">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
