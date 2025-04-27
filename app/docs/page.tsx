"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CodeBlock } from "@/components/docs/code-block";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function DocsPage() {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3"));
    const headingData = elements.map((element) => {
      // Ensure each heading has an ID
      if (!element.id) {
        const id =
          element.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
        element.id = id;
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: element.tagName === "H2" ? 2 : 3,
      };
    });

    setHeadings(headingData);
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_250px]">
        <div>
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold" id="top">
              Byn2 Payment API Documentation
            </h1>
            <p className="text-xl text-muted-foreground">
              Integrate Byn2 payment processing into your application with our
              simple API.
            </p>
          </div>

          <Tabs defaultValue="authentication" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="authentication" className="space-y-8">
              <div className="space-y-4">
                <h2 id="authentication" className="text-2xl font-bold">
                  Authentication
                </h2>
                <p>
                  All requests to the Byn2 API must be authenticated using an
                  API key. You can generate API keys in the{" "}
                  <a
                    href="/dashboard/merchant"
                    className="text-[#01133B] underline"
                  >
                    Merchant Dashboard
                  </a>
                  .
                </p>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Keep your API keys secure. Do not share them in publicly
                    accessible areas such as GitHub, client-side code, etc.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border p-6">
                  <h3
                    id="api-key-authentication"
                    className="mb-4 text-lg font-medium"
                  >
                    API Key Authentication
                  </h3>
                  <p className="mb-4">
                    To authenticate API requests, include your API key in the
                    request body for all payment-related endpoints.
                  </p>

                  <CodeBlock
                    language="bash"
                    title="Example Request"
                    code={`curl -X POST https://api.Byn2.com/payment/initiate \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "Byn2_your_api_key",
    "amount": 1000,
    "customerId": "customer_123"
  }'`}
                  />

                  <h4 className="mt-6 mb-2 font-medium">Response</h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "success": true,
  "transactionId": "tx_123456789",
  "amount": 1000,
  "status": "pending"
}`}
                  />
                </div>

                <div className="rounded-lg border p-6">
                  <h3
                    id="api-key-security"
                    className="mb-4 text-lg font-medium"
                  >
                    API Key Security
                  </h3>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    <li>
                      Never expose your API key in client-side code or public
                      repositories.
                    </li>
                    <li>
                      Each API key has specific permissions. Create separate
                      keys for different services.
                    </li>
                    <li>
                      You can deactivate or delete API keys at any time from the
                      Merchant Dashboard.
                    </li>
                    <li>
                      Rotate your API keys periodically for enhanced security.
                    </li>
                    <li>
                      Use environment variables to store API keys in your
                      applications.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border p-6">
                  <h3
                    id="authentication-errors"
                    className="mb-4 text-lg font-medium"
                  >
                    Authentication Errors
                  </h3>
                  <p className="mb-4">
                    If authentication fails, the API will return a 401
                    Unauthorized response with an error message.
                  </p>

                  <CodeBlock
                    language="json"
                    title="Authentication Error"
                    code={`{
  "error": "Authentication failed",
  "message": "Invalid API key provided",
  "code": "auth_failed"
}`}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-8">
              <div className="space-y-4">
                <h2 id="payments" className="text-2xl font-bold">
                  Payments
                </h2>
                <p>
                  The Payments API allows you to create, retrieve, and manage
                  payments. You can process one-time payments, set up recurring
                  payments, and handle refunds.
                </p>

                <h3 id="create-payment" className="text-xl font-bold mt-8">
                  Create a Payment
                </h3>
                <p className="mb-4">
                  To create a new payment, send a POST request to the{" "}
                  <code>/payment/initiate</code> endpoint.
                </p>

                <CodeBlock
                  language="bash"
                  title="Create Payment Request"
                  code={`curl -X POST https://api.Byn2.com/payment/initiate \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "Byn2_your_api_key",
    "amount": 5000,
    "currency": "USD",
    "customerId": "customer_123",
    "description": "Payment for invoice #12345",
    "metadata": {
      "invoiceId": "inv_12345",
      "orderId": "order_6789"
    }
  }'`}
                />

                <h4 className="mt-6 mb-2 font-medium">Parameters</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Parameter</th>
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-left">Required</th>
                      <th className="py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">apiKey</td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                      <td className="py-2">Your API key</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">amount</td>
                      <td className="py-2">integer</td>
                      <td className="py-2">Yes</td>
                      <td className="py-2">
                        Amount in cents (e.g., 5000 for $50.00)
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">currency</td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">
                        Three-letter ISO currency code (default: USD)
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">customerId</td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                      <td className="py-2">
                        Unique identifier for the customer
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">description</td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Description of the payment</td>
                    </tr>
                    <tr>
                      <td className="py-2">metadata</td>
                      <td className="py-2">object</td>
                      <td className="py-2">No</td>
                      <td className="py-2">
                        Additional data to attach to the payment
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="mt-6 mb-2 font-medium">Response</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "success": true,
  "transactionId": "tx_123456789",
  "amount": 5000,
  "currency": "USD",
  "status": "pending",
  "createdAt": "2024-04-25T12:34:56Z"
}`}
                />

                <h3 id="retrieve-payment" className="text-xl font-bold mt-8">
                  Retrieve a Payment
                </h3>
                <p className="mb-4">
                  To retrieve information about a payment, send a GET request to
                  the <code>/payment/status/{"{id}"}</code> endpoint.
                </p>

                <CodeBlock
                  language="bash"
                  title="Retrieve Payment Request"
                  code={`curl -X GET https://api.Byn2.com/payment/status/tx_123456789 \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "Byn2_your_api_key"
  }'`}
                />

                <h4 className="mt-6 mb-2 font-medium">Response</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "id": "tx_123456789",
  "amount": 5000,
  "currency": "USD",
  "customerId": "customer_123",
  "description": "Payment for invoice #12345",
  "status": "successful",
  "metadata": {
    "invoiceId": "inv_12345",
    "orderId": "order_6789"
  },
  "createdAt": "2024-04-25T12:34:56Z",
  "updatedAt": "2024-04-25T12:35:22Z"
}`}
                />

                <h3 id="list-payments" className="text-xl font-bold mt-8">
                  List Payments
                </h3>
                <p className="mb-4">
                  To retrieve a list of payments, send a GET request to the{" "}
                  <code>/payment/list</code> endpoint.
                </p>

                <CodeBlock
                  language="bash"
                  title="List Payments Request"
                  code={`curl -X GET "https://api.Byn2.com/payment/list?limit=10&status=successful" \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "Byn2_your_api_key"
  }'`}
                />

                <h4 className="mt-6 mb-2 font-medium">Parameters</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Parameter</th>
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-left">Required</th>
                      <th className="py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">limit</td>
                      <td className="py-2">integer</td>
                      <td className="py-2">No</td>
                      <td className="py-2">
                        Maximum number of payments to return (default: 10, max:
                        100)
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">offset</td>
                      <td className="py-2">integer</td>
                      <td className="py-2">No</td>
                      <td className="py-2">
                        Number of payments to skip (default: 0)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">status</td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">
                        Filter by payment status (pending, successful, failed)
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="mt-6 mb-2 font-medium">Response</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "payments": [
    {
      "id": "tx_123456789",
      "amount": 5000,
      "currency": "USD",
        [
    {
      "id": "tx_123456789",
      "amount": 5000,
      "currency": "USD",
      "customerId": "customer_123",
      "description": "Payment for invoice #12345",
      "status": "successful",
      "createdAt": "2024-04-25T12:34:56Z"
    },
    {
      "id": "tx_123456790",
      "amount": 7500,
      "currency": "USD",
      "customerId": "customer_456",
      "description": "Payment for invoice #12346",
      "status": "successful",
      "createdAt": "2024-04-24T10:22:33Z"
    }
  ],
  "total": 45,
  "limit": 10,
  "offset": 0
}`}
                />
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-8">
              <div className="space-y-4">
                <h2 id="webhooks" className="text-2xl font-bold">
                  Webhooks
                </h2>
                <p>
                  Webhooks allow you to receive real-time notifications when
                  events happen in your Byn2 account. Instead of polling our
                  API, webhooks will send HTTP POST requests to your specified
                  URL when events occur.
                </p>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Webhook Security</AlertTitle>
                  <AlertDescription>
                    Always verify webhook signatures to ensure requests are
                    coming from Byn2.
                  </AlertDescription>
                </Alert>

                <h3 id="webhook-setup" className="text-xl font-bold mt-8">
                  Setting Up Webhooks
                </h3>
                <p className="mb-4">
                  You can set up webhooks in the Merchant Dashboard or via the
                  API. Each webhook has a unique secret that is used to sign the
                  webhook payload.
                </p>

                <CodeBlock
                  language="bash"
                  title="Create Webhook Endpoint"
                  code={`curl -X POST https://api.Byn2.com/merchant/webhooks \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "Byn2_your_api_key",
    "url": "https://example.com/webhooks/Byn2",
    "events": ["payment.success", "payment.failed"]
  }'`}
                />

                <h3 id="webhook-events" className="text-xl font-bold mt-8">
                  Webhook Events
                </h3>
                <p className="mb-4">
                  Byn2 can send webhooks for the following events:
                </p>

                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Event</th>
                      <th className="py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">payment.success</td>
                      <td className="py-2">
                        Triggered when a payment is successfully processed
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">payment.failed</td>
                      <td className="py-2">Triggered when a payment fails</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">payment.pending</td>
                      <td className="py-2">
                        Triggered when a payment is created but not yet
                        processed
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">refund.success</td>
                      <td className="py-2">
                        Triggered when a refund is successfully processed
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">api_key.created</td>
                      <td className="py-2">
                        Triggered when a new API key is created
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 id="webhook-payload" className="text-xl font-bold mt-8">
                  Webhook Payload
                </h3>
                <p className="mb-4">
                  When an event occurs, Byn2 will send a POST request to your
                  webhook URL with a JSON payload.
                </p>

                <CodeBlock
                  language="json"
                  title="Example Webhook Payload"
                  code={`{
  "type": "payment.success",
  "data": {
    "id": "tx_123456789",
    "amount": 5000,
    "currency": "USD",
    "customerId": "customer_123",
    "status": "successful",
    "created_at": "2024-04-25T12:34:56Z"
  }
}`}
                />

                <h3 id="webhook-signature" className="text-xl font-bold mt-8">
                  Verifying Webhook Signatures
                </h3>
                <p className="mb-4">
                  To ensure that webhook requests are coming from Byn2, you
                  should verify the signature included in the request headers.
                </p>

                <CodeBlock
                  language="javascript"
                  title="Verify Webhook Signature (Node.js)"
                  code={`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Express.js example
app.post('/webhooks/Byn2', (req, res) => {
  const signature = req.headers['x-Byn2-signature'];
  const payload = req.body;
  const webhookSecret = 'whsec_your_webhook_secret';
  
  if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  const event = payload.type;
  const data = payload.data;
  
  // Handle the event
  switch (event) {
    case 'payment.success':
      // Handle successful payment
      break;
    case 'payment.failed':
      // Handle failed payment
      break;
    default:
      console.log(\`Unhandled event type \${event}\`);
  }
  
  res.status(200).send('Webhook received');
});`}
                />
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-8">
              <div className="space-y-4">
                <h2 id="examples" className="text-2xl font-bold">
                  Code Examples
                </h2>
                <p>
                  Here are some examples of how to integrate with the Byn2 API
                  in different programming languages.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="nodejs">
                    <AccordionTrigger>Node.js</AccordionTrigger>
                    <AccordionContent>
                      <CodeBlock
                        language="javascript"
                        title="Node.js Example"
                        code={`const axios = require('axios');

// Initialize the Byn2 client
class Byn2Client {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.Byn2.com';
  }

  async createPayment(amount, customerId, description = '', metadata = {}) {
    try {
      const response = await axios.post(\`\${this.baseUrl}/payment/initiate\`, {
        apiKey: this.apiKey,
        amount,
        customerId,
        description,
        metadata
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPayment(transactionId) {
    try {
      const response = await axios.get(
        \`\${this.baseUrl}/payment/status/\${transactionId}\`,
        { data: { apiKey: this.apiKey } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Example usage
async function main() {
  const client = new Byn2Client('Byn2_your_api_key');
  
  // Create a payment
  const payment = await client.createPayment(
    5000, // $50.00
    'customer_123',
    'Payment for invoice #12345',
    { invoiceId: 'inv_12345' }
  );
  
  console.log('Payment created:', payment);
  
  // Get payment status
  const paymentStatus = await client.getPayment(payment.transactionId);
  console.log('Payment status:', paymentStatus);
}

main().catch(console.error);`}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="python">
                    <AccordionTrigger>Python</AccordionTrigger>
                    <AccordionContent>
                      <CodeBlock
                        language="python"
                        title="Python Example"
                        code={`import requests

class Byn2Client:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.Byn2.com'
    
    def create_payment(self, amount, customer_id, description='', metadata=None):
        if metadata is None:
            metadata = {}
            
        payload = {
            'apiKey': self.api_key,
            'amount': amount,
            'customerId': customer_id,
            'description': description,
            'metadata': metadata
        }
        
        response = requests.post(f'{self.base_url}/payment/initiate', json=payload)
        response.raise_for_status()
        return response.json()
    
    def get_payment(self, transaction_id):
        payload = {
            'apiKey': self.api_key
        }
        
        response = requests.get(
            f'{self.base_url}/payment/status/{transaction_id}',
            json=payload
        )
        response.raise_for_status()
        return response.json()

# Example usage
def main():
    client = Byn2Client('Byn2_your_api_key')
    
    # Create a payment
    payment = client.create_payment(
        amount=5000,  # $50.00
        customer_id='customer_123',
        description='Payment for invoice #12345',
        metadata={'invoiceId': 'inv_12345'}
    )
    
    print('Payment created:', payment)
    
    # Get payment status
    payment_status = client.get_payment(payment['transactionId'])
    print('Payment status:', payment_status)

if __name__ == '__main__':
    main()`}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="php">
                    <AccordionTrigger>PHP</AccordionTrigger>
                    <AccordionContent>
                      <CodeBlock
                        language="php"
                        title="PHP Example"
                        code={`<?php

class Byn2Client {
    private $apiKey;
    private $baseUrl;
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
        $this->baseUrl = 'https://api.Byn2.com';
    }
    
    public function createPayment($amount, $customerId, $description = '', $metadata = []) {
        $payload = [
            'apiKey' => $this->apiKey,
            'amount' => $amount,
            'customerId' => $customerId,
            'description' => $description,
            'metadata' => $metadata
        ];
        
        $ch = curl_init($this->baseUrl . '/payment/initiate');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($statusCode !== 200) {
            throw new Exception("API request failed with status code: $statusCode");
        }
        
        return json_decode($response, true);
    }
    
    public function getPayment($transactionId) {
        $payload = [
            'apiKey' => $this->apiKey
        ];
        
        $ch = curl_init($this->baseUrl . '/payment/status/' . $transactionId);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($statusCode !== 200) {
            throw new Exception("API request failed with status code: $statusCode");
        }
        
        return json_decode($response, true);
    }
}

// Example usage
$client = new Byn2Client('Byn2_your_api_key');

try {
    // Create a payment
    $payment = $client->createPayment(
        5000, // $50.00
        'customer_123',
        'Payment for invoice #12345',
        ['invoiceId' => 'inv_12345']
    );
    
    echo "Payment created: " . print_r($payment, true) . "\n";
    
    // Get payment status
    $paymentStatus = $client->getPayment($payment['transactionId']);
    echo "Payment status: " . print_r($paymentStatus, true) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>`}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="curl">
                    <AccordionTrigger>cURL</AccordionTrigger>
                    <AccordionContent>
                      <CodeBlock
                        language="bash"
                        title="cURL Examples"
                        code={`#!/bin/bash

# Base URL
BASE_URL="https://api.Byn2.com"
API_KEY="Byn2_your_api_key"

# Create a payment
echo "Creating payment..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "'$API_KEY'",
    "amount": 5000,
    "customerId": "customer_123",
    "description": "Payment for invoice #12345",
    "metadata": {
      "invoiceId": "inv_12345"
    }
  }')

echo "Payment Response: $PAYMENT_RESPONSE"

# Extract transaction ID
TRANSACTION_ID=$(echo $PAYMENT_RESPONSE | grep -o '"transactionId":"[^"]*' | cut -d'"' -f4)
echo "Transaction ID: $TRANSACTION_ID"

# Get payment status
echo -e "\nFetching payment status..."
curl -s -X GET "$BASE_URL/payment/status/$TRANSACTION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "'$API_KEY'"
  }'

# List payments
echo -e "\nListing payments..."
curl -s -X GET "$BASE_URL/payment/list?limit=5&status=successful" \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "'$API_KEY'"
  }'`}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-8">
              <div className="space-y-4">
                <h2 id="faq" className="text-2xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p>Find answers to common questions about the Byn2 API.</p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What payment methods do you accept?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Byn2 supports various payment methods including
                        credit/debit cards, bank transfers, mobile money, and
                        cryptocurrency. The available payment methods may vary
                        by region.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How do I handle failed payments?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        When a payment fails, you'll receive a webhook
                        notification with the event type{" "}
                        <code>payment.failed</code>. The webhook payload will
                        include details about why the payment failed. You can
                        also check the payment status using the{" "}
                        <code>/payment/status/{"{id}"}</code> endpoint.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      What currencies are supported?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Byn2 supports multiple currencies including USD, EUR,
                        GBP, JPY, and many local currencies. For a complete list
                        of supported currencies, please refer to the Currencies
                        section in the API reference.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      How do I process refunds?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        To process a refund, send a POST request to the{" "}
                        <code>/payment/refund</code> endpoint with the
                        transaction ID and the amount to refund. You can refund
                        the full amount or a partial amount.
                      </p>

                      <CodeBlock
                        language="bash"
                        code={`curl -X POST https://api.Byn2.com/payment/refund \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "Byn2_your_api_key",
    "transactionId": "tx_123456789",
    "amount": 5000,
    "reason": "Customer request"
  }'`}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      What are the API rate limits?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The Byn2 API has rate limits to ensure fair usage and
                        system stability. The default rate limit is 100 requests
                        per minute per API key. If you exceed this limit, you'll
                        receive a 429 Too Many Requests response. If you need
                        higher rate limits, please contact our support team.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </div>
    </div>
  );
}
