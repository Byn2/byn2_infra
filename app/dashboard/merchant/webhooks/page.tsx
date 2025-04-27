"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Plus, RefreshCw, Trash, Webhook } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/util";

interface WebhookEndpoint {
  _id: string;
  url: string;
  secret: string;
  active: boolean;
  events: string[];
  createdAt: string;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(true);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState([
    "payment.success",
    "payment.failed",
  ]);
  const [newWebhook, setNewWebhook] = useState<WebhookEndpoint | null>(null);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setIsLoadingWebhooks(true);
      const response = await fetch("/api/merchant/webhooks");
      if (!response.ok) throw new Error("Failed to fetch webhooks");
      const data = await response.json();
      setWebhooks(data.webhookEndpoints || []);
    } catch (error) {
      console.error(error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to load webhooks",
      //     variant: "destructive",
      //   })
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

  const createWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      //   toast({
      //     title: "Error",
      //     description: "Please enter a URL for your webhook",
      //     variant: "destructive",
      //   })
      return;
    }

    setIsCreatingWebhook(true);
    try {
      const response = await fetch("/api/merchant/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: newWebhookUrl,
          events: newWebhookEvents,
        }),
      });

      if (!response.ok) throw new Error("Failed to create webhook");

      const data = await response.json();
      setNewWebhook(data.webhook);
      await fetchWebhooks();

      //   toast({
      //     title: "Success",
      //     description: "Webhook created successfully",
      //   })
    } catch (error) {
      console.error(error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to create webhook",
      //     variant: "destructive",
      //   })
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const toggleWebhookStatus = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/merchant/webhooks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) throw new Error("Failed to update webhook");

      await fetchWebhooks();

      //   toast({
      //     title: "Success",
      //     description: active ? "Webhook activated" : "Webhook deactivated",
      //   })
    } catch (error) {
      console.error(error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to update webhook",
      //     variant: "destructive",
      //   })
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      const response = await fetch(`/api/merchant/webhooks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete webhook");

      await fetchWebhooks();

      //   toast({
      //     title: "Success",
      //     description: "Webhook deleted successfully",
      //   })
    } catch (error) {
      console.error(error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to delete webhook",
      //     variant: "destructive",
      //   })
    }
  };

  const testWebhook = async (id: string) => {
    try {
      const response = await fetch("/api/payment/webhook-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhookId: id }),
      });

      if (!response.ok) throw new Error("Failed to test webhook");

      const data = await response.json();

      //   toast({
      //     title: data.success ? "Success" : "Failed",
      //     description: data.message,
      //     variant: data.success ? "default" : "destructive",
      //   })
    } catch (error) {
      console.error(error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to test webhook",
      //     variant: "destructive",
      //   })
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // toast({
    //   title: "Copied",
    //   description: "Copied to clipboard",
    // })
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#01133B] hover:bg-[#523526]">
              <Plus className="mr-2 h-4 w-4" /> Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Webhook Endpoint</DialogTitle>
              <DialogDescription>
                Enter the URL where you want to receive webhook notifications.
              </DialogDescription>
            </DialogHeader>
            {newWebhook ? (
              <div className="space-y-4">
                <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Save your webhook secret! You won't be able to see it again.
                  </p>
                </div>
                <div className="rounded-md border bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">Webhook Secret:</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(newWebhook.secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="break-all rounded-md bg-background p-2 text-xs font-mono">
                    {newWebhook.secret}
                  </p>
                </div>
                <Button onClick={() => setNewWebhook(null)}>Done</Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://example.com/webhooks/byn2"
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Your endpoint must be publicly accessible and use HTTPS
                      (except for localhost during development).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Events to receive</Label>
                    <div className="space-y-2">
                      {[
                        { id: "payment.success", label: "Payment Successful" },
                        { id: "payment.failed", label: "Payment Failed" },
                        { id: "payment.pending", label: "Payment Pending" },
                        { id: "refund.success", label: "Refund Successful" },
                      ].map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={event.id}
                            checked={newWebhookEvents.includes(event.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWebhookEvents([
                                  ...newWebhookEvents,
                                  event.id,
                                ]);
                              } else {
                                setNewWebhookEvents(
                                  newWebhookEvents.filter(
                                    (id) => id !== event.id
                                  )
                                );
                              }
                            }}
                            className="h-4 w-4 rounded"
                          />
                          <Label htmlFor={event.id} className="text-sm">
                            {event.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={createWebhook}
                    disabled={isCreatingWebhook}
                    className="bg-[#01133B] hover:bg-[#523526]"
                  >
                    {isCreatingWebhook ? "Creating..." : "Create Webhook"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Set up webhooks to receive real-time notifications about events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingWebhooks ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#01133B]"></div>
                <p>Loading webhooks...</p>
              </div>
            ) : webhooks.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <Webhook className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium">
                  No webhooks configured
                </h3>
                <p className="text-sm text-gray-500">
                  Add a webhook endpoint to receive real-time event
                  notifications.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook._id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium truncate max-w-md">
                          {webhook.url}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(webhook.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={webhook.active}
                            onCheckedChange={(checked) =>
                              toggleWebhookStatus(webhook._id, checked)
                            }
                          />
                          <span className="text-sm">
                            {webhook.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testWebhook(webhook._id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deleteWebhook(webhook._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
