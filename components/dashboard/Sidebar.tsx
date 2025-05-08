"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Users,
  PiggyBank,
  Send,
  Download,
  Upload,
  History,
  BookOpen,
  Code,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({
    transactions: pathname.startsWith("/dashboard/transaction"),
    loans: pathname.startsWith("/dashboard/loans"),
  });

  const toggleSection = (section: string) => {
    setOpen({ ...open, [section]: !open[section] });
  };

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 h-screen z-50 border-r border-gray-200 bg-[#FAF7F2] dark:border-gray-800 dark:bg-gray-900 transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        "overflow-y-auto" // Ensure the sidebar is scrollable
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Byn2 Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-[#66432E]">Byn2</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <Menu /> : <X />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-4 px-2">
        <SidebarLink
          href="/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed}
        />

        {/* Transactions - Most used feature */}
        <SidebarLink
          href="/dashboard/transactions"
          icon={<ArrowLeftRight className="h-5 w-5" />}
          label="Transactions"
          active={pathname.includes("/transactions")}
          collapsed={collapsed}
        />

        {/* Payroll - Important business function */}
        <SidebarLink
          href="/dashboard/payroll"
          icon={<Users className="h-5 w-5" />}
          label="Payroll"
          active={pathname.includes("/payroll")}
          collapsed={collapsed}
        />

        {/* Invoices - Important business function */}
        <SidebarLink
          href="/dashboard/invoices"
          icon={<Receipt className="h-5 w-5" />}
          label="Invoices"
          active={pathname.includes("/invoices")}
          collapsed={collapsed}
        />

        {/* TRANSACTIONS SECTION */}
        <SidebarSection
          title="Money Transfer"
          links={[
            {
              href: "/dashboard/transaction/send",
              icon: <Send className="h-5 w-5" />,
              label: "Send Money",
            },
            {
              href: "/dashboard/transaction/deposit",
              icon: <Download className="h-5 w-5" />,
              label: "Deposit Funds",
            },
            {
              href: "/dashboard/transaction/withdraw",
              icon: <Upload className="h-5 w-5" />,
              label: "Withdraw Funds",
            },
            {
              href: "/dashboard/transaction/history",
              icon: <History className="h-5 w-5" />,
              label: "History",
            },
          ]}
          open={open.transactions}
          toggle={() => toggleSection("transactions")}
          collapsed={collapsed}
          pathname={pathname}
        />

        {/* Staking - Investment feature */}
        <SidebarLink
          href="/dashboard/staking"
          icon={<PiggyBank className="h-5 w-5" />}
          label="Staking"
          active={pathname.includes("/staking")}
          collapsed={collapsed}
        />

        {/* Address Book - Utility feature */}
        <SidebarLink
          href="/dashboard/address-book"
          icon={<BookOpen className="h-5 w-5" />}
          label="Address Book"
          active={pathname.includes("/address-book")}
          collapsed={collapsed}
        />

        {/* Developer - Technical feature */}
        <SidebarLink
          href="/dashboard/developer"
          icon={<Code className="h-5 w-5" />}
          label="Developer"
          active={pathname.includes("/developer")}
          collapsed={collapsed}
        />
      </nav>
    </div>
  );
}

function SidebarLink({ href, icon, label, active, collapsed }: any) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-[#EFE8DD] text-[#66432E] dark:bg-gray-800 dark:text-white"
          : "text-gray-600 hover:bg-[#EFE8DD] hover:text-[#66432E] dark:text-gray-400 dark:hover:bg-gray-800"
      )}
    >
      {icon}
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}

function SidebarSection({ title, links, toggle, collapsed, pathname }: any) {
  return (
    <div>
      {/* Only show the section title if the sidebar is not collapsed */}
      {!collapsed && (
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-[#EFE8DD] dark:hover:bg-gray-800 rounded-md"
        >
          {title}
          {/* <ChevronDown
            className={clsx(
              "h-4 w-4 transition-transform duration-300",
              open ? "rotate-180" : "rotate-0"
            )}
          /> */}
        </button>
      )}
      {/* Always show the icons, but only display the labels if not collapsed */}
      <div className={clsx("space-y-1", collapsed ? "pl-0" : "pl-4")}>
        {/* Render links (always show icons and labels based on collapsed state) */}
        {links.map((link: any, idx: number) => (
          <SidebarLink
            key={idx}
            href={link.href}
            icon={link.icon}
            label={collapsed ? "" : link.label}
            active={pathname.includes(link.href)}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}
