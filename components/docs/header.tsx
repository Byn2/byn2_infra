"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/dashboard/ThemeSwitcher";

export function DocsHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <img src="/logo.png" alt="Byn2 Logo" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Byn2 Docs</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/docs"
              className={`flex items-center text-sm font-medium ${
                pathname === "/docs" ? "text-foreground" : "text-foreground/60"
              } transition-colors hover:text-foreground/80`}
            >
              API Reference
            </Link>
            <Link
              href="/docs/guides"
              className={`flex items-center text-sm font-medium ${
                pathname.startsWith("/docs/guides")
                  ? "text-foreground"
                  : "text-foreground/60"
              } transition-colors hover:text-foreground/80`}
            >
              Guides
            </Link>
            <Link
              href="/docs/examples"
              className={`flex items-center text-sm font-medium ${
                pathname.startsWith("/docs/examples")
                  ? "text-foreground"
                  : "text-foreground/60"
              } transition-colors hover:text-foreground/80`}
            >
              Examples
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="w-full md:w-[200px] pl-8 md:focus:w-[300px] transition-all"
            />
          </div>
          <ThemeSwitcher />
          <Button
            variant="default"
            className="hidden md:flex bg-[#01133B] hover:bg-[#523526]"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
}
