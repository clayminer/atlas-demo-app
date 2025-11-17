"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";
import { ATLAS_USER_HEADER_KEY } from "@/lib/atlas/constants";
import Link from "next/link";
import { useCustomerFeatures, usePricingModel } from "@runonatlas/react";
import { AI_INSIGHTS_FEATURE_SLUG, findFeatureCreditPrice } from "@/lib/atlas/credit";

type InsightDataset = {
  id: string;
  title: string;
  summary: string;
  recommendation: string;
  metricLabel: string;
  metricValue: string;
  points: number[];
  color: string;
};

const DATASETS: InsightDataset[] = [
  {
    id: "adoption",
    title: "AI feature adoption is accelerating",
    summary: "Teams enabled AI workflows 32% more than last week.",
    recommendation: "Surface AI onboarding checklist to remaining workspaces.",
    metricLabel: "AI workflow activations",
    metricValue: "+32% WoW",
    points: [28, 30, 34, 32, 36, 38, 41],
    color: "hsl(221 83% 53%)",
  },
  {
    id: "support",
    title: "Support tickets resolved faster",
    summary: "Median resolution time dropped below 3 hours for the first time in Q4.",
    recommendation: "Promote AI suggested responses to the entire premium cohort.",
    metricLabel: "Resolution time",
    metricValue: "2h 48m",
    points: [5.6, 5.1, 4.2, 3.9, 3.4, 3.1, 2.8],
    color: "hsl(142 71% 45%)",
  },
  {
    id: "retention",
    title: "Forecasted churn improves",
    summary: "Predicted churn dipped below the 5% threshold.",
    recommendation: "Target at-risk accounts with concierge check-ins.",
    metricLabel: "Projected churn",
    metricValue: "4.6%",
    points: [7.2, 6.8, 6.3, 5.9, 5.4, 4.9, 4.6],
    color: "hsl(12 88% 57%)",
  },
  {
    id: "usage",
    title: "Usage intensity spikes on Fridays",
    summary: "Atlas flags a recurring usage surge late Fridays across enterprise tenants.",
    recommendation: "Pre-provision capacity and announce Friday AM status posts.",
    metricLabel: "Max API calls",
    metricValue: "512k",
    points: [210, 228, 240, 275, 298, 320, 512],
    color: "hsl(264 83% 60%)",
  },
  {
    id: "upsell",
    title: "Premium upsell score reaches 78",
    summary: "AI propensity model expects 14 high-likelihood upgrades this month.",
    recommendation: "Coordinate success outreach to accounts scoring above 70.",
    metricLabel: "Upgrade probability",
    metricValue: "78 / 100",
    points: [45, 52, 58, 61, 66, 72, 78],
    color: "hsl(19 90% 60%)",
  },
  {
    id: "billing",
    title: "Credit balance trending positive",
    summary: "Customers are repurchasing credits 18 days sooner than last quarter.",
    recommendation: "Introduce auto-reload prompt at 40% balance remaining.",
    metricLabel: "Average top-up cadence",
    metricValue: "18 days sooner",
    points: [54, 52, 49, 45, 41, 37, 32],
    color: "hsl(199 89% 48%)",
  },
  {
    id: "expansion",
    title: "Expansion revenue momentum",
    summary: "Net expansion rate jumped to 129% driven by feature bundle attach.",
    recommendation: "Bundle AI Insights with Priority Support for enterprise pipelines.",
    metricLabel: "Net expansion",
    metricValue: "129%",
    points: [94, 102, 108, 117, 121, 126, 129],
    color: "hsl(47 93% 55%)",
  },
  {
    id: "activation",
    title: "Time-to-value compresses",
    summary: "Median time from signup to first activation is now under 36 hours.",
    recommendation: "Highlight accelerated onboarding in the enterprise playbook.",
    metricLabel: "Time to value",
    metricValue: "35h",
    points: [73, 64, 58, 52, 46, 40, 35],
    color: "hsl(333 85% 58%)",
  },
  {
    id: "engagement",
    title: "Collaboration sessions peak mid-week",
    summary: "Wednesdays drive the highest shared workspace sessions per customer.",
    recommendation: "Schedule webinar drops on Tuesday evenings to prime usage.",
    metricLabel: "Sessions per customer",
    metricValue: "+21%",
    points: [12, 14, 17, 19, 18, 16, 15],
    color: "hsl(182 86% 44%)",
  },
  {
    id: "predictive",
    title: "Predictive anomalies detected",
    summary: "Two enterprise tenants show anomalous spend expected to exceed limits.",
    recommendation: "Enable proactive outreach and confirm upcoming overage coverage.",
    metricLabel: "Anomaly confidence",
    metricValue: "92%",
    points: [40, 42, 41, 48, 52, 57, 63],
    color: "hsl(274 90% 66%)",
  },
];

const GRAPH_WIDTH = 460;
const GRAPH_HEIGHT = 200;

function buildLine(points: number[]) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  return points
    .map((value, index) => {
      const x = (index / (points.length - 1 || 1)) * GRAPH_WIDTH;
      const normalized = (value - min) / range;
      const y = GRAPH_HEIGHT - normalized * GRAPH_HEIGHT;
      return `${x},${y}`;
    })
    .join(" ");
}

type AiInsightsCardProps = {
  className?: string;
};

export function AiInsightsCard({ className }: AiInsightsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [generationCount, setGenerationCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const { features } = useCustomerFeatures();
  const { pricingModel } = usePricingModel();

  const dataset = DATASETS[activeIndex];

  const polylinePoints = useMemo(
    () => buildLine(dataset.points),
    [dataset.points],
  );

  const creditPrice = useMemo(() => {
    const price = findFeatureCreditPrice({
      featureSlug: AI_INSIGHTS_FEATURE_SLUG,
      customerFeatures: features ?? undefined,
      pricingModel,
    });
    return price;
  }, [features, pricingModel]);

  const creditPriceLabel = creditPrice !== null
    ? `${creditPrice} ${creditPrice === 1 ? "credit" : "credits"}`
    : "No credit price";

  const handleGenerate = async () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      if (!user?.username) {
        throw new Error("Missing user session");
      }

      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          [ATLAS_USER_HEADER_KEY]: user.username,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "" }));
        if (response.status === 403) {
          throw new Error(
            body.error ||
              "Looks like you need more AI credits before generating insights.",
          );
        }
        throw new Error(body.error || "Failed to register usage");
      }

      const next = Math.floor(Math.random() * DATASETS.length);
      const nextIndex =
        next === activeIndex ? (activeIndex + 1) % DATASETS.length : next;
      setActiveIndex(nextIndex);
      setGenerationCount((count) => count + 1);
      window.dispatchEvent(new CustomEvent("atlas-credit-consumed"));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to generate insights right now.";

      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const color = dataset.color;
  const gradientId = `insight-gradient-${dataset.id}`;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-1">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">AI insights</CardTitle>
            <p className="text-sm text-muted-foreground">{dataset.title}</p>
          </div>
          <div className="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:items-center">
            <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {creditPriceLabel}
            </div>
            <Button
              onClick={handleGenerate}
              className="w-full gap-2 lg:w-auto"
              variant="default"
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate insights"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {dataset.metricLabel}
            </p>
            <p className="text-3xl font-semibold text-foreground">
              {dataset.metricValue}
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-4">
          <svg
            role="img"
            aria-label={`${dataset.metricLabel} trendline`}
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
            className="h-48 w-full"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke={color}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polylinePoints}
            />
            <polygon
              fill={`url(#${gradientId})`}
              points={`${polylinePoints} ${GRAPH_WIDTH},${GRAPH_HEIGHT} 0,${GRAPH_HEIGHT}`}
            />
            {dataset.points.map((value, idx) => {
              const coords = polylinePoints.split(" ")[idx]?.split(",");
              if (!coords) return null;
              const [x, y] = coords.map(Number);
              return (
                <circle
                  key={`${dataset.id}-${idx}`}
                  cx={x}
                  cy={y}
                  r={idx === dataset.points.length - 1 ? 6 : 4}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{dataset.summary}</p>
          <p className="text-sm font-medium text-foreground">
            Recommendation: {dataset.recommendation}
          </p>
          {errorMessage ? (
            <div
              role="alert"
              className="space-y-3 rounded-md bg-destructive/10 px-3 py-3 text-sm text-destructive"
            >
              <div>{errorMessage}</div>
              <div className="text-xs text-destructive/80">
                Purchase additional AI credits or upgrade your plan to continue
                generating insights.
              </div>
              <div>
                <Button asChild size="sm">
                  <Link href="/pricing">View pricing options</Link>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
      <div className="px-6 pb-5 text-xs text-muted-foreground">
        Insight generation #{generationCount}
      </div>
    </Card>
  );
}
