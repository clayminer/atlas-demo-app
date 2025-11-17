"use client";

import {
  LayoutDashboard,
  CreditCard,
  Settings,
  BadgeDollarSign,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: BadgeDollarSign,
  },
  {
    title: "Account",
    href: "/account",
    icon: Settings,
  },
] as const;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar items={NAV_ITEMS} />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
