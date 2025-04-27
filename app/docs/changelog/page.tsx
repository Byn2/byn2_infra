export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Changelog</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Stay up to date with the latest changes and improvements to the Byn2
        API.
      </p>

      <div className="space-y-12">
        <div className="relative border-l border-gray-200 pl-8 dark:border-gray-800">
          <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#01133B]"></div>
          <time className="mb-1 text-sm font-normal text-gray-500">
            April 25, 2024
          </time>
          <h3 className="text-lg font-semibold">Version 2.4.0</h3>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="mb-2 font-medium">New Features</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Added support for recurring payments with flexible scheduling
                  options
                </li>
                <li>
                  Introduced new webhook event types for subscription lifecycle
                  events
                </li>
                <li>
                  Added support for partial refunds with detailed reason codes
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Improvements</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Enhanced webhook delivery reliability with automatic retries
                </li>
                <li>Improved error messages for better debugging</li>
                <li>Optimized API response times for high-volume endpoints</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Bug Fixes</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Fixed an issue where webhook signatures could fail validation
                  in certain edge cases
                </li>
                <li>
                  Resolved a bug affecting pagination in the transaction history
                  API
                </li>
                <li>
                  Fixed currency conversion issues for multi-currency accounts
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative border-l border-gray-200 pl-8 dark:border-gray-800">
          <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#01133B]"></div>
          <time className="mb-1 text-sm font-normal text-gray-500">
            March 12, 2024
          </time>
          <h3 className="text-lg font-semibold">Version 2.3.0</h3>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="mb-2 font-medium">New Features</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Added support for mobile money providers in 5 new countries
                </li>
                <li>
                  Introduced new analytics endpoints for transaction insights
                </li>
                <li>
                  Added support for custom checkout pages with branding options
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Improvements</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Enhanced fraud detection algorithms</li>
                <li>Improved documentation with more code examples</li>
                <li>
                  Added more detailed transaction metadata in API responses
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Bug Fixes</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Fixed an issue with timezone handling in transaction reporting
                </li>
                <li>
                  Resolved a bug affecting webhook delivery for certain event
                  types
                </li>
                <li>Fixed API key rotation issues in the merchant dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative border-l border-gray-200 pl-8 dark:border-gray-800">
          <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#01133B]"></div>
          <time className="mb-1 text-sm font-normal text-gray-500">
            February 5, 2024
          </time>
          <h3 className="text-lg font-semibold">Version 2.2.0</h3>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="mb-2 font-medium">New Features</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Added support for cryptocurrency payments (BTC, ETH, USDC)
                </li>
                <li>Introduced new API endpoints for customer management</li>
                <li>
                  Added support for payment links with expiration settings
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Improvements</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Enhanced security with improved API key management</li>
                <li>Optimized webhook delivery performance</li>
                <li>Improved error handling and validation for API requests</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Bug Fixes</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Fixed an issue with decimal handling in certain currencies
                </li>
                <li>
                  Resolved a bug affecting transaction search functionality
                </li>
                <li>Fixed authentication issues with API key rotation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative border-l border-gray-200 pl-8 dark:border-gray-800">
          <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#01133B]"></div>
          <time className="mb-1 text-sm font-normal text-gray-500">
            January 10, 2024
          </time>
          <h3 className="text-lg font-semibold">Version 2.1.0</h3>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="mb-2 font-medium">New Features</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Added support for bulk payments</li>
                <li>Introduced new reporting API endpoints</li>
                <li>
                  Added support for custom metadata on all transaction types
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Improvements</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Enhanced API documentation with interactive examples</li>
                <li>Improved transaction search capabilities</li>
                <li>
                  Added more detailed error messages for failed transactions
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Bug Fixes</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Fixed an issue with webhook signature verification</li>
                <li>Resolved a bug affecting transaction status updates</li>
                <li>
                  Fixed pagination issues in transaction listing endpoints
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative border-l border-gray-200 pl-8 dark:border-gray-800">
          <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#01133B]"></div>
          <time className="mb-1 text-sm font-normal text-gray-500">
            December 5, 2023
          </time>
          <h3 className="text-lg font-semibold">Version 2.0.0</h3>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="mb-2 font-medium">Major Release</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Complete API redesign with improved consistency and developer
                  experience
                </li>
                <li>New authentication system with enhanced security</li>
                <li>Expanded payment methods support across all regions</li>
                <li>
                  New webhook system with improved reliability and signature
                  verification
                </li>
                <li>Comprehensive SDK updates for all supported languages</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Breaking Changes</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  API endpoint paths have changed - see migration guide for
                  details
                </li>
                <li>
                  Authentication method updated to use API keys instead of OAuth
                  tokens
                </li>
                <li>Response formats standardized across all endpoints</li>
                <li>Webhook payload format has changed</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Migration Guide</h4>
              <p className="text-sm text-gray-600 mb-2">
                Please refer to our{" "}
                <a
                  href="/docs/migration-guide"
                  className="text-[#01133B] hover:underline"
                >
                  migration guide
                </a>{" "}
                for detailed instructions on upgrading from v1.x to v2.0.
              </p>
              <p className="text-sm text-gray-600">
                The v1 API will be supported until June 30, 2024, after which
                all requests must use the v2 API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
