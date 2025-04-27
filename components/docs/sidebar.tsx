"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DocsSidebar({ className, ...props }: DocsSidebarProps) {
  const pathname = usePathname()

  const sections = [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/introduction",
          items: [],
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
          items: [],
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "Authentication",
          href: "/docs#authentication",
          items: [],
        },
        {
          title: "Payments",
          href: "/docs#payments",
          items: [
            {
              title: "Create Payment",
              href: "/docs#create-payment",
            },
            {
              title: "Retrieve Payment",
              href: "/docs#retrieve-payment",
            },
            {
              title: "List Payments",
              href: "/docs#list-payments",
            },
          ],
        },
        {
          title: "Webhooks",
          href: "/docs#webhooks",
          items: [],
        },
        {
          title: "Error Handling",
          href: "/docs#error-handling",
          items: [],
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Integration Guide",
          href: "/docs/guides/integration",
          items: [],
        },
        {
          title: "Webhook Setup",
          href: "/docs/guides/webhooks",
          items: [],
        },
        {
          title: "Security Best Practices",
          href: "/docs/guides/security",
          items: [],
        },
      ],
    },
    {
      title: "Examples",
      items: [
        {
          title: "Node.js",
          href: "/docs/examples/nodejs",
          items: [],
        },
        {
          title: "Python",
          href: "/docs/examples/python",
          items: [],
        },
        {
          title: "PHP",
          href: "/docs/examples/php",
          items: [],
        },
        {
          title: "cURL",
          href: "/docs/examples/curl",
          items: [],
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "FAQ",
          href: "/docs#faq",
          items: [],
        },
        {
          title: "API Status",
          href: "/docs/api-status",
          items: [],
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
  ]

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        {sections.map((section) => (
          <div key={section.title} className="px-3 py-2">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">{section.title}</h4>
            {section.items.length > 0 && (
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {section.items.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                        pathname === item.href ? "font-medium text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                    {item.items?.length > 0 && (
                      <div className="ml-4 grid grid-flow-row auto-rows-max text-sm">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                              pathname === subItem.href ? "font-medium text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
