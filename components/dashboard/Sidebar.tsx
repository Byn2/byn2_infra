"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  BookOpen,
  DollarSign,
  History,
  Home,
  LogOut,
  Send,
  Settings,
  Wallet,
  FileText,
  BookMarked,
  Menu,
  X,
  PiggyBank,
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
          <Link href="/dashboard" className="flex items-center space-x-2 relative size-10  overflow-hidden">
            <Image src="/logo.png" alt="Byn2 Logo" fill
          className="object-cover transition-transform duration-300 group-hover"/>
           
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
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed}
        />

        {/* TRANSACTIONS */}
        <SidebarSection
          title="Transaction"
          links={[
            {
              href: "/dashboard/transaction/send",
              icon: <Send className="h-5 w-5" />,
              label: "Send Money",
            },
            {
              href: "/dashboard/transaction/deposit",
              icon: <Wallet className="h-5 w-5" />,
              label: "Deposit Funds",
            },
            {
              href: "/dashboard/transaction/withdraw",
              icon: <DollarSign className="h-5 w-5" />,
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

        <SidebarSection
          title="Merchant"
          links={[
            {
              href: "/dashboard/merchant/api-keys",
              icon: <DollarSign className="h-5 w-5" />,
              label: "Api Keys",
            },
            {
              href: "/dashboard/merchant/webhooks",
              icon: <BookMarked className="h-5 w-5" />,
              label: "Webhooks",
            },
          ]}
          open={open.merchant}
          toggle={() => toggleSection("merchant")}
          collapsed={collapsed}
          pathname={pathname}
        />

        {/* Standalone Links */}
        <SidebarLink
          href="/dashboard/transactions"
          icon={<FileText className="h-5 w-5" />}
          label="Transactions"
          active={pathname.includes("/transactions")}
          collapsed={collapsed}
        />
        <SidebarLink
          href="/dashboard/staking"
          icon={<PiggyBank className="h-5 w-5" />}
          label="Staking"
          active={pathname.includes("/staking")}
          collapsed={collapsed}
        />
        <SidebarLink
          href="/dashboard/payroll"
          icon={<PiggyBank className="h-5 w-5" />}
          label="Payroll"
          active={pathname.includes("/payroll")}
          collapsed={collapsed}
        />
        <SidebarLink
          href="/dashboard/invoices"
          icon={<FileText className="h-5 w-5" />}
          label="Invoices"
          active={pathname.includes("/invoices")}
          collapsed={collapsed}
        />

        <SidebarLink
          href="/dashboard/address-book"
          icon={<BookOpen className="h-5 w-5" />}
          label="Address Book"
          active={pathname.includes("/address-book")}
          collapsed={collapsed}
        />
        {/* <SidebarLink
          href="/dashboard/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Setting"
          active={pathname.includes("/settings")}
          collapsed={collapsed}
        />

        <SidebarLink
          href="/logout"
          icon={<LogOut className="h-5 w-5" />}
          label="Logout"
          active={false}
          collapsed={collapsed}
        /> */}
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
          ? "bg-[#EFE8DD] text-[#01133B] dark:bg-gray-800 dark:text-white"
          : "text-gray-600 hover:bg-[#EFE8DD] hover:text-[#01133B] dark:text-gray-400 dark:hover:bg-gray-800"
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
