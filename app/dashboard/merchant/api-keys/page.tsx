"use client"

import { useEffect, useState } from "react"
import { Copy, Key, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/components/ui/use-toast"

interface ApiKey {
  _id: string
  key: string
  createdAt: string
}

export default function ApiKeysPage() {
//   const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch("/api/business/api-keys")
        if (!response.ok) throw new Error("Failed to fetch API keys")
        const data = await response.json()
        setApiKeys(data.apiKeys)
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to load API keys",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiKeys()
  }, [])

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
    //   toast({
    //     title: "Error",
    //     description: "Please enter a name for your API key",
    //     variant: "destructive",
    //   })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/business/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (!response.ok) throw new Error("Failed to generate API key")

      const data = await response.json()
      setNewKey(data.key)

      // Refresh the API keys list
      const keysResponse = await fetch("/api/business/api-keys")
      if (!keysResponse.ok) throw new Error("Failed to fetch API keys")
      const keysData = await keysResponse.json()
      setApiKeys(keysData.apiKeys)

    //   toast({
    //     title: "Success",
    //     description: "API key generated successfully",
    //   })
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to generate API key",
    //     variant: "destructive",
    //   })
    } finally {
      setIsGenerating(false)
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/business/api-keys?id=${keyId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to revoke API key")

      // Remove the key from the state
      setApiKeys(apiKeys.filter((key) => key._id !== keyId))

    //   toast({
    //     title: "Success",
    //     description: "API key revoked successfully",
    //   })
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to revoke API key",
    //     variant: "destructive",
    //   })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // toast({
    //   title: "Copied",
    //   description: "API key copied to clipboard",
    // })
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewKey(null)
    setNewKeyName("")
  }

  return (
    <div className="container space-y-8 py-8">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate API Key</DialogTitle>
              <DialogDescription>Create a new API key to access your business services.</DialogDescription>
            </DialogHeader>
            {newKey ? (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="mb-2 text-sm font-medium">Your API Key:</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 rounded bg-background p-2 text-sm">{newKey}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(newKey)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Make sure to copy your API key now. You won&apos;t be able to see it again!
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">API Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              {newKey ? (
                <Button onClick={closeDialog}>Done</Button>
              ) : (
                <Button onClick={generateApiKey} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for accessing the Business-as-a-Service API</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Key</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading API keys...
                  </TableCell>
                </TableRow>
              ) : apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No API keys found. Generate your first API key to get started.
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey._id}>
                    <TableCell className="font-medium">API Key {apiKey._id.slice(-4)}</TableCell>
                    <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="font-mono">
                          {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(apiKey.key)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => revokeApiKey(apiKey._id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Key className="h-4 w-4" />
            <span>API keys are used to authenticate API requests</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
