"use client";

import { PricingComponent } from "@runonatlas/next/client";

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const SUCCESS_URL = `${DEFAULT_BASE_URL}/dashboard`;

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Explore atlas-powered plan options and upgrade directly from the app.
        </p>
      </section>
      <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
        <PricingComponent successUrl={SUCCESS_URL} />
      </div>
    </div>
  );
}
