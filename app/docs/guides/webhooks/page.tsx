export default function WebhooksGuidePage() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Webhook Setup Guide</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Learn how to set up and handle webhooks to receive real-time
        notifications from Byn2.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">What are Webhooks?</h2>
          <p className="mb-4">
            Webhooks are HTTP callbacks that allow Byn2 to notify your
            application when events occur in your account. Instead of polling
            our API for updates, webhooks push data to your application as
            events happen.
          </p>
          <p>
            Common webhook events include successful payments, failed payments,
            refunds, and more.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Setting Up Webhooks</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <h3 className="font-medium">
                Create a webhook endpoint in your application
              </h3>
              <p className="text-muted-foreground">
                This should be a publicly accessible URL that can receive POST
                requests.
              </p>
            </li>
            <li>
              <h3 className="font-medium">
                Register the webhook in your Byn2 Dashboard
              </h3>
              <p className="text-muted-foreground">
                Go to the Webhooks section in your Merchant Dashboard and add
                your endpoint URL.
              </p>
            </li>
            <li>
              <h3 className="font-medium">
                Select the events you want to receive
              </h3>
              <p className="text-muted-foreground">
                Choose which events you want to be notified about, such as
                payment.success, payment.failed, etc.
              </p>
            </li>
            <li>
              <h3 className="font-medium">
                Store your webhook secret securely
              </h3>
              <p className="text-muted-foreground">
                When you create a webhook, Byn2 provides a secret key that
                you'll use to verify webhook signatures.
              </p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Handling Webhook Events
          </h2>
          <p className="mb-4">
            When an event occurs, Byn2 will send a POST request to your webhook
            URL with a JSON payload containing event details.
          </p>
          <p className="mb-4">
            Here's an example of how to handle webhook events in a Node.js
            Express application:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="language-javascript">{`
  const express = require('express');
  const crypto = require('crypto');
  const bodyParser = require('body-parser');
  
  const app = express();
  
  // Use JSON parser for webhook requests
  app.use('/webhooks/Byn2', bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));
  
  // Handle webhook events
  app.post('/webhooks/Byn2', (req, res) => {
    const signature = req.headers['x-Byn2-signature'];
    const webhookSecret = process.env.Byn2_WEBHOOK_SECRET;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(req.rawBody).digest('hex');
    
    if (signature !== digest) {
      return res.status(401).send('Invalid signature');
    }
    
    // Process the webhook event
    const event = req.body;
    
    switch (event.type) {
      case 'payment.success':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.id);
        // Update order status, send confirmation email, etc.
        break;
        
      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.id);
        // Notify customer, update order status, etc.
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    // Return a 200 response to acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
  });
  
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  `}</code>
          </pre>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Testing Webhooks</h2>
          <p className="mb-4">
            Testing webhooks can be challenging because they require a publicly
            accessible URL. Here are some options:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Use a tool like ngrok to expose your local development server to
              the internet
            </li>
            <li>Deploy your webhook handler to a staging environment</li>
            <li>
              Use the webhook test feature in the Byn2 Dashboard to send test
              events to your endpoint
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Always verify webhook signatures to ensure the request came from
              Byn2
            </li>
            <li>
              Respond quickly to webhook requests (within 5 seconds) to avoid
              timeouts
            </li>
            <li>Implement idempotency to handle duplicate webhook events</li>
            <li>
              Use a queue system for processing webhook events asynchronously
            </li>
            <li>Implement proper error handling and logging for debugging</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Troubleshooting</h2>
          <p className="mb-4">
            If you're having issues with webhooks, check the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ensure your webhook URL is publicly accessible</li>
            <li>
              Verify that you're using the correct webhook secret for signature
              verification
            </li>
            <li>
              Check your server logs for any errors in your webhook handler
            </li>
            <li>
              Verify that your server is responding with a 200 status code
            </li>
            <li>
              Check the webhook logs in your Byn2 Dashboard for delivery
              attempts and failures
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
