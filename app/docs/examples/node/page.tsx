export default function NodejsExamplePage() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Node.js Integration Examples</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Complete examples of integrating Byn2 payments with Node.js
        applications.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Basic Setup</h2>
          <p className="mb-4">First, install the required dependencies:</p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="language-bash">
              npm install express axios dotenv body-parser
            </code>
          </pre>

          <p className="mt-4 mb-4">
            Create a .env file to store your API keys:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="language-bash">
              Byn2_API_KEY=Byn2_your_api_key
              Byn2_WEBHOOK_SECRET=whsec_your_webhook_secret
            </code>
          </pre>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Byn2 Client Implementation
          </h2>
          <p className="mb-4">
            Create a file named <code>Byn2-client.js</code> with the following
            code:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="language-javascript">{`// Byn2-client.js
  const axios = require('axios');
  require('dotenv').config();
  
  class Byn2Client {
    constructor(apiKey = process.env.Byn2_API_KEY) {
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
  
    async listPayments(limit = 10, offset = 0, status = null) {
      try {
        let url = \`\${this.baseUrl}/payment/list?limit=\${limit}&offset=\${offset}\`;
        if (status) {
          url += \`&status=\${status}\`;
        }
        
        const response = await axios.get(url, { data: { apiKey: this.apiKey } });
        return response.data;
      } catch (error) {
        console.error('Error listing payments:', error.response?.data || error.message);
        throw error;
      }
    }
  
    async refundPayment(transactionId, amount, reason = '') {
      try {
        const response = await axios.post(\`\${this.baseUrl}/payment/refund\`, {
          apiKey: this.apiKey,
          transactionId,
          amount,
          reason
        });
        
        return response.data;
      } catch (error) {
        console.error('Error refunding payment:', error.response?.data || error.message);
        throw error;
      }
    }
  }
  
  module.exports = Byn2Client;`}</code>
          </pre>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Express.js Server Example
          </h2>
          <p className="mb-4">
            Create a file named <code>server.js</code> with the following code:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="language-javascript">{`// server.js
  const express = require('express');
  const bodyParser = require('body-parser');
  const crypto = require('crypto');
  const Byn2Client = require('./Byn2-client');
  require('dotenv').config();
  
  const app = express();
  const port = process.env.PORT || 3000;
  const Byn2Client = new Byn2Client();
  
  // Middleware
  app.use(bodyParser.json());
  app.use(express.static('public'));
  
  // Use raw body parser for webhook route
  app.use('/webhooks/Byn2', bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));
  
  // Routes
  app.post('/api/payments', async (req, res) => {
    try {
      const { amount, customerId, description, metadata } = req.body;
      
      if (!amount || !customerId) {
        return res.status(400).json({ error: 'Amount and customerId are required' });
      }
      
      const payment = await Byn2Client.createPayment(amount, customerId, description, metadata);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/payments/:id', async (req, res) => {
    try {
      const payment = await Byn2Client.getPayment(req.params.id);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/payments', async (req, res) => {
    try {
      const { limit = 10, offset = 0, status } = req.query;
      const payments = await Byn2Client.listPayments(limit, offset, status);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/refunds', async (req, res) => {
    try {
      const { transactionId, amount, reason } = req.body;
      
      if (!transactionId || !amount) {
        return res.status(400).json({ error: 'TransactionId and amount are required' });
      }
      
      const refund = await Byn2Client.refundPayment(transactionId, amount, reason);
      res.json(refund);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Webhook handler
  app.post('/webhooks/Byn2', (req, res) => {
    const signature = req.headers['x-Byn2-signature'];
    const webhookSecret = process.env.Byn2_WEBHOOK_SECRET;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(req.rawBody).digest('hex');
    
    if (signature !== digest) {
      console.error('Invalid webhook signature');
      return res.status(401).send('Invalid signature');
    }
    
    // Process the webhook event
    const event = req.body;
    
    switch (event.type) {
      case 'payment.success':
        console.log('Payment succeeded:', event.data.id);
        // Update order status, send confirmation email, etc.
        break;
        
      case 'payment.failed':
        console.log('Payment failed:', event.data.id);
        // Notify customer, update order status, etc.
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    // Return a 200 response to acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
  });
  
  // Start server
  app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
  });`}</code>
          </pre>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Frontend Integration Example
          </h2>
          <p className="mb-4">
            Create a file named <code>public/index.html</code> with the
            following code:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="language-html">{`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Byn2 Payment Example</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
      }
      input, button {
        padding: 8px;
        font-size: 16px;
      }
      button {
        background-color: #01133B;
        color: white;
        border: none;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 4px;
      }
      button:hover {
        background-color: #523526;
      }
      .result {
        margin-top: 20px;
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <h1>Byn2 Payment Example</h1>
    
    <form id="payment-form">
      <div class="form-group">
        <label for="amount">Amount (in cents)</label>
        <input type="number" id="amount" required placeholder="e.g., 5000 for $50.00">
      </div>
      
      <div class="form-group">
        <label for="customer-id">Customer ID</label>
        <input type="text" id="customer-id" required placeholder="e.g., customer_123">
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" id="description" placeholder="e.g., Payment for order #12345">
      </div>
      
      <button type="submit">Create Payment</button>
    </form>
    
    <div id="result" class="result" style="display: none;"></div>
    
    <script>
      document.getElementById('payment-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const amount = document.getElementById('amount').value;
        const customerId = document.getElementById('customer-id').value;
        const description = document.getElementById('description').value;
        
        try {
          const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: parseInt(amount),
              customerId,
              description,
              metadata: {
                source: 'web-demo'
              }
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to create payment');
          }
          
          const resultElement = document.getElementById('result');
          resultElement.innerHTML = '<h3>Payment Created</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          resultElement.style.display = 'block';
        } catch (error) {
          const resultElement = document.getElementById('result');
          resultElement.innerHTML = '<h3>Error</h3><p>' + error.message + '</p>';
          resultElement.style.display = 'block';
        }
      });
    </script>
  </body>
  </html>`}</code>
          </pre>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Running the Example</h2>
          <p className="mb-4">To run the example:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Save all the files in your project directory</li>
            <li>
              Install the dependencies with <code>npm install</code>
            </li>
            <li>
              Start the server with <code>node server.js</code>
            </li>
            <li>
              Open your browser to <code>http://localhost:3000</code>
            </li>
          </ol>
          <p className="mt-4">
            You can now create test payments and see the responses from the Byn2
            API.
          </p>
        </section>
      </div>
    </div>
  );
}
