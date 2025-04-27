export default function SecurityGuidePage() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Security Best Practices</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Learn how to secure your integration with Byn2 and protect sensitive
        payment data.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">API Key Security</h2>
          <p className="mb-4">
            Your API keys are the keys to your kingdom. Protect them with these
            best practices:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Never expose API keys in client-side code or public repositories
            </li>
            <li>
              Store API keys in environment variables or a secure key management
              system
            </li>
            <li>
              Use different API keys for development and production environments
            </li>
            <li>Rotate API keys periodically and immediately if compromised</li>
            <li>
              Limit API key permissions to only what's necessary for each
              integration
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Webhook Security</h2>
          <p className="mb-4">
            Secure your webhook endpoints to prevent unauthorized access and
            ensure data integrity:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Always verify webhook signatures using your webhook secret</li>
            <li>Use HTTPS for all webhook endpoints</li>
            <li>Implement rate limiting to prevent abuse</li>
            <li>Validate and sanitize all incoming webhook data</li>
            <li>Store webhook secrets securely, separate from your codebase</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Data Protection</h2>
          <p className="mb-4">Protect sensitive payment and customer data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Never store full credit card numbers or CVV codes</li>
            <li>Encrypt sensitive data at rest and in transit</li>
            <li>Implement proper access controls for payment data</li>
            <li>Regularly audit and clean up unnecessary data</li>
            <li>
              Comply with relevant data protection regulations (GDPR, CCPA,
              etc.)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Secure Coding Practices
          </h2>
          <p className="mb-4">
            Follow these secure coding practices to minimize vulnerabilities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Validate and sanitize all user inputs</li>
            <li>Use parameterized queries to prevent SQL injection</li>
            <li>
              Implement proper error handling without exposing sensitive
              information
            </li>
            <li>Keep dependencies and libraries up to date</li>
            <li>Follow the principle of least privilege for all components</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Infrastructure Security
          </h2>
          <p className="mb-4">
            Secure your infrastructure to protect your payment processing
            system:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use HTTPS for all communications</li>
            <li>Implement proper network segmentation</li>
            <li>Use firewalls and intrusion detection systems</li>
            <li>Regularly update and patch all systems</li>
            <li>Implement logging and monitoring for security events</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Fraud Prevention</h2>
          <p className="mb-4">
            Protect your business and customers from fraud:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Implement address verification (AVS) and CVV checks</li>
            <li>Use 3D Secure for additional authentication when available</li>
            <li>Monitor for suspicious transaction patterns</li>
            <li>Implement velocity checks to detect rapid-fire transactions</li>
            <li>Use Byn2's built-in fraud detection tools</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Compliance</h2>
          <p className="mb-4">
            Ensure your payment processing complies with relevant regulations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintain PCI DSS compliance if handling card data</li>
            <li>Comply with local financial regulations</li>
            <li>Implement proper KYC (Know Your Customer) procedures</li>
            <li>Keep accurate records for auditing purposes</li>
            <li>
              Stay informed about regulatory changes affecting payment
              processing
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Security Checklist</h2>
          <p className="mb-4">
            Use this checklist to ensure you've covered the key security
            aspects:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              API keys are stored securely and not exposed in client-side code
            </li>
            <li>
              Webhook signatures are verified for all incoming webhook requests
            </li>
            <li>Sensitive data is encrypted at rest and in transit</li>
            <li>Input validation is implemented for all user inputs</li>
            <li>HTTPS is used for all communications</li>
            <li>Systems and dependencies are regularly updated</li>
            <li>Proper logging and monitoring are in place</li>
            <li>Fraud prevention measures are implemented</li>
            <li>Compliance with relevant regulations is maintained</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
