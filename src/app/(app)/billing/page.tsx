"use client";

import { CustomerPortalComponent } from "@runonatlas/next/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const SUCCESS_URL = `${DEFAULT_BASE_URL}/billing`;

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage subscription plans, invoices, and payment methods.
        </p>
      </section>
      <Card className="border-none shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Atlas customer portal
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <CustomerPortalComponent successUrl={SUCCESS_URL} />
        </CardContent>
      </Card>
    </div>
  );
}
