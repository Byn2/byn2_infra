import type React from "react";
import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsHeader } from "@/components/docs/header";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Byn2 API Documentation",
  description: "Comprehensive documentation for the Byn2 Payment API",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <DocsHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <DocsSidebar />
          </ScrollArea>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            {children}
            <div className="flex justify-between border-t border-border pt-6 mt-10">
              <div className="text-sm text-muted-foreground">
                Last updated: April 25, 2024
              </div>
              <a href="#top" className="text-sm text-primary hover:underline">
                Back to top
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
