import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureProtect } from "@runonatlas/next/client";
import { Lock, ShieldCheck } from "lucide-react";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { LeadGenAgentCard } from "@/components/dashboard/leadgen-agent-card";

const METRICS = [
  { label: "Active users", value: "1,248", description: "+12% vs last week" },
  { label: "Monthly revenue", value: "$84,200", description: "+8% vs target" },
  { label: "Support tickets", value: "32", description: "5 open high priority" },
];

const FEATURE_TIERS = [
  {
    title: "Core analytics",
    tier: "Basic feature",
    featureSlug: "basic-entitlement",
    description:
      "Everything you need to keep a pulse on account health and usage.",
    highlights: ["Unified KPI dashboard", "CSV exports", "Email summaries"],
    ctaLabel: "Included today",
    ctaVariant: "secondary" as const,
  },
  {
    title: "Predictive insights",
    tier: "Premium feature",
    featureSlug: "pro-entitlement",
    description:
      "Unlock leadership reports with AI-driven forecasts and alerts.",
    highlights: [
      "AI anomaly detection",
      "Automated playbooks",
      "Priority support",
    ],
    ctaLabel: "Start trial",
    ctaVariant: "default" as const,
  },
  {
    title: "Compliance workspace",
    tier: "Enterprise feature",
    featureSlug: "enterprise-entitlement1",
    description:
      "Purpose-built governance controls for regulated organizations.",
    highlights: [
      "Audit-ready exports",
      "SSO & SCIM",
      "Dedicated success manager",
    ],
    ctaLabel: "Talk to sales",
    ctaVariant: "outline" as const,
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          High-level snapshot of your workspace health and customer activity.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {METRICS.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {FEATURE_TIERS.map((feature) => {
          const cardContent = (
            <Card className="flex flex-col justify-between">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {feature.title}
                </CardTitle>
                <CardDescription className="uppercase tracking-wide">
                  {feature.tier}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <ul className="space-y-2 text-sm">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/80" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Included today
                </Button>
              </CardFooter>
            </Card>
          );

          const lockedCard = (
            <Card className="flex flex-col justify-between border-dashed">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-destructive" />
                  {feature.title}
                </CardTitle>
                <CardDescription className="uppercase tracking-wide">
                  {feature.tier}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enable the {feature.tier.toLowerCase()} to unlock{" "}
                  {feature.title.toLowerCase()} for this workspace.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full justify-center">
                  <Link href="/pricing">Upgrade now</Link>
                </Button>
              </CardFooter>
            </Card>
          );

          return (
            <FeatureProtect
              key={feature.featureSlug}
              features={[feature.featureSlug]}
              disallowedFallback={lockedCard}
            >
              {cardContent}
            </FeatureProtect>
          );
        })}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <AiInsightsCard className="h-full" />
        <FeatureProtect
          features={["lead-gen-agent2"]}
          disallowedFallback={(
            <Card className="flex h-full flex-col justify-between border-dashed">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-destructive" />
                  Lead generation agent
                </CardTitle>
                <CardDescription className="uppercase tracking-wide">
                  Usage-based feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Turn on the lead generation agent to automate ICP research and outbound
                  sequences for your sales team.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full justify-center">
                  <Link href="/pricing">Upgrade now</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        >
          <LeadGenAgentCard className="h-full" />
        </FeatureProtect>
      </section>
    </div>
  );
}
