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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Key, Link, Plus, RefreshCw, Trash, Webhook } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/util";
import { toast } from "sonner";
import {
  generateApiKey,
  toggleApiKeyStatus,
  deleteApiKey,
  createWebhook,
  toggleWebhookStatus,
  testWebhook,
  deleteWebhook,
  updateCustomDomain,
} from "./actions";

interface ApiKey {
  _id: string;
  name: string;
  key: string;
  active: boolean;
  createdAt: string;
  lastUsed?: string;
}

interface WebhookEndpoint {
  _id: string;
  url: string;
  secret: string;
  active: boolean;
  events: string[];
  createdAt: string;
}

export default function MerchantPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(true);
  const [settings, setSettings] = useState({
    hostedPaymentUrl: "",
    customDomain: "",
  });
  const [newKeyName, setNewKeyName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState([
    "payment.success",
    "payment.failed",
  ]);
  const [newDomain, setNewDomain] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [newWebhook, setNewWebhook] = useState<WebhookEndpoint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);

  useEffect(() => {
    fetchApiKeysData();
    fetchWebhooksData();
    fetchSettingsData();
  }, []);

  const fetchApiKeysData = async () => {
    try {
      setIsLoadingKeys(true);
      const response = await fetch("/api/v1/developer/api-keys");
      const data = await response.json();

      if (response.ok) {
        setApiKeys(data.apiKeys);
      } else {
        toast("Error", {
          description: "Failed to load API keys",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to load API keys",
      });
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const fetchWebhooksData = async () => {
    try {
      setIsLoadingWebhooks(true);
      const response = await fetch("/api/v1/developer/webhooks");
      const data = await response.json();
      if (response.ok) {
        setWebhooks(data.webhooks);
      } else {
        toast("Error", {
          description: "Failed to load Webhooks",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to load Webhooks",
      });
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

  const fetchSettingsData = async () => {
    try {
      const response = await fetch("api/v1/developer/settings");
      const data = await response.json();
      // if (result.success) {
      //   setSettings(result.settings)
      // } else {
      //   toast("Error", {
      //     description: result.error || "Failed to load Settings",
      //   })
      // }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to load Settings",
      });
    }
  };

  const handleGenerateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast("Error", {
        description: "Please enter a name for your API key",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateApiKey(newKeyName);
      //@ts-ignore
      if (result.success) {
        //@ts-ignore
        setNewKey(result.key);
        await fetchApiKeysData();
        toast("Success", {
          description: "API key generated successfully",
        });
      } else {
        toast("Error", {
          //@ts-ignore
          description: result.error || "Failed to generate API key",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to generate API key",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast("Error", {
        description: "Please enter a URL for your webhook",
      });
      return;
    }

    setIsCreatingWebhook(true);
    try {
      const result = await createWebhook(newWebhookUrl, newWebhookEvents);
      //@ts-ignore
      if (result.success) {
        //@ts-ignore
        setNewWebhook(result.webhook);
        await fetchWebhooksData();
        toast("Success", {
          description: "Webhook created successfully",
        });
      } else {
        toast("Error", {
          //@ts-ignore
          description: result.error || "Failed to create webhook",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to create webhook",
      });
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const handleToggleApiKeyStatus = async (id: string, active: boolean) => {
    try {
      const result = await toggleApiKeyStatus(id, active);
      //@ts-ignore
      if (result.success) {
        await fetchApiKeysData();
        toast("Success", {
          description: active ? "API key activated" : "API key deactivated",
        });
      } else {
        toast("Error", {
          //@ts-ignore
          description: result.error || "Failed to update API key",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to update API key",
      });
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      const result = await deleteApiKey(id);
      //@ts-ignore
      if (result.success) {
        await fetchApiKeysData();
        toast("Success", {
          description: "API key deleted successfully",
        });
      } else {
        toast("Error", {
          //@ts-ignore
          description: result.error || "Failed to delete API key",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to delete API key",
      });
    }
  };

  const handleToggleWebhookStatus = async (id: string, active: boolean) => {
    try {
      const result = await toggleWebhookStatus(id, active);
      //@ts-ignore
      if (result.success) {
        await fetchWebhooksData();
        toast("Success", {
          description: active ? "Webhook activated" : "Webhook deactivated",
        });
      } else {
        toast("Error", {
          //@ts-ignore
          description: result.error || "Failed to update webhook",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to update webhook",
      });
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const result = await deleteWebhook(id);
      //@ts-ignore
      if (result.success) {
        await fetchWebhooksData();
        toast("Success", {
          description: "Webhook deleted successfully",
        });
      } else {
        toast("Error", {
          //@ts-ignore
          description: result.error || "Failed to delete webhook",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to delete webhook",
      });
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      const result = await testWebhook(id);
      toast(result.success ? "Success" : "Failed", {
        description: result.message,
      });
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to test webhook",
      });
    }
  };

  const handleUpdateCustomDomain = async () => {
    try {
      const result = await updateCustomDomain(newDomain);
      if (result.success) {
        await fetchSettingsData();
        toast("Success", {
          description: "Custom domain updated successfully",
        });
      } else {
        toast("Error", {
          description: result.error || "Failed to update custom domain",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to update custom domain",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied", {
      description: "Copied to clipboard successfully",
    });
  };


  return (
    <div className="container py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Developer Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your integration with Byn2 payment system
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for integrating with the Byn2 payment system
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#66432E] hover:bg-[#523526]">
                      <Plus className="mr-2 h-4 w-4" /> Create New API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Add a name for your API key to help identify its usage.
                      </DialogDescription>
                    </DialogHeader>
                    {newKey ? (
                      <div className="space-y-4">
                        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Make sure to copy your API key now. You won't be
                            able to see it again!
                          </p>
                        </div>
                        <div className="rounded-md border bg-muted p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium">Your API Key:</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(newKey)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="break-all rounded-md bg-background p-2 text-xs font-mono">
                            {newKey}
                          </p>
                        </div>
                        <Button onClick={() => setNewKey(null)}>Done</Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="key-name">API Key Name</Label>
                            <Input
                              id="key-name"
                              placeholder="e.g., Production API Key"
                              value={newKeyName}
                              onChange={(e) => setNewKeyName(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleGenerateApiKey}
                            disabled={isGenerating}
                            className="bg-[#66432E] hover:bg-[#523526]"
                          >
                            {isGenerating ? "Generating..." : "Generate Key"}
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingKeys ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#66432E]"></div>
                    <p>Loading API keys...</p>
                  </div>
                ) : apiKeys.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-10 text-center">
                    <Key className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium">
                      No API keys found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Create your first API key to start integrating with Byn2.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey._id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{apiKey.name}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(apiKey.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={apiKey.active}
                                onCheckedChange={(checked) =>
                                  handleToggleApiKeyStatus(apiKey._id, checked)
                                }
                              />
                              <span className="text-sm">
                                {apiKey.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteApiKey(apiKey._id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center">
                            <code className="mr-2 text-xs font-mono text-gray-600">
                              {apiKey.key.substring(0, 10)}...
                              {apiKey.key.substring(apiKey.key.length - 4)}
                            </code>
                            {apiKey.lastUsed && (
                              <p className="text-xs text-gray-500">
                                Last used: {formatDate(apiKey.lastUsed)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>
                    Set up webhooks to receive real-time notifications about
                    events
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#66432E] hover:bg-[#523526]">
                      <Plus className="mr-2 h-4 w-4" /> Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Webhook Endpoint</DialogTitle>
                      <DialogDescription>
                        Enter the URL where you want to receive webhook
                        notifications.
                      </DialogDescription>
                    </DialogHeader>
                    {newWebhook ? (
                      <div className="space-y-4">
                        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Save your webhook secret! You won't be able to see
                            it again.
                          </p>
                        </div>
                        <div className="rounded-md border bg-muted p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium">
                              Webhook Secret:
                            </p>
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
                        <Button onClick={() => setNewWebhook(null)}>
                          Done
                        </Button>
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
                              Your endpoint must be publicly accessible and use
                              HTTPS (except for localhost during development).
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Events to receive</Label>
                            <div className="space-y-2">
                              {[
                                {
                                  id: "payment.success",
                                  label: "Payment Successful",
                                },
                                {
                                  id: "payment.failed",
                                  label: "Payment Failed",
                                },
                                {
                                  id: "payment.pending",
                                  label: "Payment Pending",
                                },
                                {
                                  id: "refund.success",
                                  label: "Refund Successful",
                                },
                              ].map((event) => (
                                <div
                                  key={event.id}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={event.id}
                                    checked={newWebhookEvents.includes(
                                      event.id
                                    )}
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
                            onClick={handleCreateWebhook}
                            disabled={isCreatingWebhook}
                            className="bg-[#66432E] hover:bg-[#523526]"
                          >
                            {isCreatingWebhook
                              ? "Creating..."
                              : "Create Webhook"}
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingWebhooks ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#66432E]"></div>
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
                                  handleToggleWebhookStatus(
                                    webhook._id,
                                    checked
                                  )
                                }
                              />
                              <span className="text-sm">
                                {webhook.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTestWebhook(webhook._id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteWebhook(webhook._id)}
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
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Checkout Settings</CardTitle>
              <CardDescription>
                Configure your hosted payment page and custom domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Hosted Payment URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={settings.hostedPaymentUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(settings.hostedPaymentUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    This is your default hosted payment page URL. Customers will
                    be redirected here to complete their payment.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Custom Domain (Optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="pay.yourdomain.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={handleUpdateCustomDomain}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Configure a custom domain for your hosted payment page.
                    You'll need to set up DNS records.
                  </p>
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-2">
                    <Link className="h-5 w-5 text-[#66432E]" />
                    <h3 className="font-medium">Integration Code Snippet</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Add this code to your website to redirect customers to the
                      payment page:
                    </p>
                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-xs dark:bg-gray-800">
                      {`<script>
  document.getElementById('pay-button').addEventListener('click', function() {
    fetch('https://api.byn2.com/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: 'YOUR_API_KEY',
        amount: 1000, // Amount in cents
        customerId: 'customer_123',
        reference: 'order_123'
      })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = data.paymentUrl;
    });
  });
</script>`}
                    </pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      copyToClipboard(
                        document.querySelector("pre")?.textContent || ""
                      )
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
