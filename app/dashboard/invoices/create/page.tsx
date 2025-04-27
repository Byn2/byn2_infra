"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2, Save, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InvoiceItem {
  id: number;
  description: string;
  price: string;
  quantity: string;
  total: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [issuedDate, setIssuedDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [installments, setInstallments] = useState(1);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", price: "", quantity: "", total: 0 },
  ]);

  const handleAddItem = () => {
    const newId =
      invoiceItems.length > 0
        ? Math.max(...invoiceItems.map((item) => item.id)) + 1
        : 1;
    setInvoiceItems([
      ...invoiceItems,
      { id: newId, description: "", price: "", quantity: "", total: 0 },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total if price or quantity changes
          if (field === "price" || field === "quantity") {
            const price =
              Number.parseFloat(field === "price" ? value : item.price) || 0;
            const quantity =
              Number.parseInt(field === "quantity" ? value : item.quantity) ||
              0;
            updatedItem.total = price * quantity;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSaveAsDraft = () => {
    // Logic to save as draft
    router.push("/dashboard/invoices");
  };

  const handleSendInvoice = () => {
    // Logic to send invoice
    router.push("/dashboard/invoices");
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <p className="text-gray-500">Invoice Number: #123456</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Invoice Form */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="recipient-email">Recipient Email</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="Enter recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="invoice-description">Invoice Description</Label>
            <Input
              id="invoice-description"
              placeholder="Enter invoice description"
              value={invoiceDescription}
              onChange={(e) => setInvoiceDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issued-date">Issued on</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issuedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issuedDate ? format(issuedDate, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issuedDate}
                    onSelect={setIssuedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="due-date">Due on</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="installments">Number of Installments:</Label>
              <div className="flex items-center mt-2">
                <Input
                  id="installments"
                  type="number"
                  min="1"
                  className="w-16"
                  value={installments}
                  onChange={(e) =>
                    setInstallments(Number.parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-8">
              <input
                type="checkbox"
                id="recurring"
                className="h-4 w-4"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <Label htmlFor="recurring" className="text-sm">
                This is a recurring invoice
              </Label>
            </div>
          </div>

          <div>
            <Label>Invoice Items</Label>
            <div className="mt-2 space-y-4">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Price (Le)</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Total Price</div>
                <div className="col-span-1"></div>
              </div>

              {invoiceItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(item.id, "price", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="text"
                      placeholder="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, "quantity", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input type="text" value={item.total.toString()} readOnly />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={invoiceItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAddItem}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>

              <div className="flex justify-between pt-4 border-t">
                <div className="font-medium">Tax:</div>
                <div>0</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>Total Amount:</div>
                <div>Le {calculateTotal().toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="additional-notes">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              placeholder="Enter any additional notes or terms"
              className="h-24"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - Invoice Preview */}
        <div className="bg-[#FAF7F2] rounded-lg p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Invoice Number: #123456</h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500">Bill to</h3>
              <p className="font-medium">{companyName || "Company Name"}</p>
              <p className="text-sm">42 Soldier St, Freetown</p>
              <p className="text-sm">{recipientEmail || "email@gmail.com"}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500">Bill from</h3>
              <p className="font-medium">Company Name</p>
              <p className="text-sm">42 Soldier St, Freetown</p>
            </div>

            <div className="mb-6 flex justify-between text-sm">
              <div>
                <p>
                  Issued On:{" "}
                  {issuedDate
                    ? format(issuedDate, "MMM dd yyyy")
                    : "May 24 2024"}
                </p>
                <p>Number of Installments: {installments}</p>
              </div>
              <div>
                <p>
                  Due On:{" "}
                  {dueDate ? format(dueDate, "MMM dd yyyy") : "June 24 2024"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Invoice Item</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Qty</th>
                    <th className="text-left py-2">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description || "#15267"}</td>
                      <td className="py-2">{item.price || "100"}</td>
                      <td className="py-2">{item.quantity || "1"}</td>
                      <td className="py-2">Le {item.total || 2000}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right font-bold">
              Total Amount: Le {calculateTotal().toLocaleString() || "4,000"}
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>
                Our invoice application streamlines your billing process with a
                comprehensive solution for managing invoices effortlessly, while
                easily tracking payment statuses. Generate detailed financial
                reports to gain insights into your business performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={handleSaveAsDraft}>
          <Save className="mr-2 h-4 w-4" /> Save as Draft
        </Button>
        <Button
          className="bg-[#01133B] hover:bg-[#523526]"
          onClick={handleSendInvoice}
        >
          <Send className="mr-2 h-4 w-4" /> Send
        </Button>
      </div>
    </div>
  );
}
