"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Play, RefreshCcw, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";
import { ATLAS_USER_HEADER_KEY } from "@/lib/atlas/constants";

type StepStatus = "pending" | "running" | "completed";

type AgentStep = {
  title: string;
  description: string;
  duration: number;
};

const STEPS: AgentStep[] = [
  {
    title: "Identify ICP segments",
    description: "Scanning CRM, product usage, and firmographic data to map high-fit profiles.",
    duration: 1600,
  },
  {
    title: "Qualify & prioritize targets",
    description: "Filtering by intent signals, active contracts, and open opportunities.",
    duration: 1500,
  },
  {
    title: "Compose outreach sequences",
    description: "Drafting multi-channel messaging tailored to each persona and pain point.",
    duration: 1800,
  },
  {
    title: "Connect on LinkedIn",
    description: "Scheduling connection requests and noting recent activity for personalization.",
    duration: 1700,
  },
  {
    title: "Automate follow-up tasks",
    description: "Queuing reminder emails, call tasks, and Slack nudges for the sales pod.",
    duration: 1600,
  },
  {
    title: "Book qualified meetings",
    description: "Routing warm leads to AEs, reserving time slots, and logging CRM notes.",
    duration: 1800,
  },
];

type StepView = AgentStep & { status: StepStatus };

function buildInitialSteps(): StepView[] {
  return STEPS.map((step) => ({
    ...step,
    status: "pending",
  }));
}

export function LeadGenAgentCard({ className }: { className?: string }) {
  const [steps, setSteps] = useState<StepView[]>(() => buildInitialSteps());
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [runId, setRunId] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const { user } = useAuth();

  const isRunning = activeIndex !== -1;

  useEffect(() => {
    if (activeIndex === -1 || activeIndex >= STEPS.length) {
      return;
    }

    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === activeIndex) {
            return { ...step, status: "completed" };
          }
          if (idx === activeIndex + 1) {
            return { ...step, status: "running" };
          }
          return step;
        }),
      );

      if (activeIndex + 1 < STEPS.length) {
        setActiveIndex(activeIndex + 1);
      } else {
        setActiveIndex(-1);
        setIsComplete(true);
      }
    }, STEPS[activeIndex].duration);

    return () => {
      clearTimeout(timer);
    };
  }, [activeIndex, runId]);

  const initializeRun = () => {
    setSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? "running" : "pending",
      })),
    );
    setActiveIndex(0);
    setIsComplete(false);
    setStartedAt(new Date());
    setRunId((prev) => prev + 1);
  };

  const startRun = async () => {
    if (isRunning || isAuthorizing) {
      return;
    }

    setSetupError(null);

    if (!user?.username) {
      setSetupError("You need to be signed in to run the agent.");
      return;
    }

    setIsAuthorizing(true);
    try {
      const response = await fetch("/api/lead-gen-agent", {
        method: "POST",
        headers: {
          [ATLAS_USER_HEADER_KEY]: user.username,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "" }));
        const message =
          body.error ||
          (response.status === 403
            ? "Upgrade your plan to unlock the lead generation agent."
            : "Unable to start the agent right now.");
        setSetupError(message);
        return;
      }

      initializeRun();
      window.dispatchEvent(new CustomEvent("atlas-credit-consumed"));
    } catch (error) {
      console.error("Failed to authorize lead gen agent run", error);
      setSetupError("Unable to start the agent right now.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const resetRun = () => {
    setSteps(buildInitialSteps());
    setActiveIndex(-1);
    setIsComplete(false);
    setStartedAt(null);
  };

  const completionSummary = useMemo(() => {
    if (!isComplete || !startedAt) {
      return null;
    }
    const durationSeconds = Math.max(
      Math.round((Date.now() - startedAt.getTime()) / 1000),
      1,
    );
    return {
      durationSeconds,
      meetingsBooked: 1,
      followUpsScheduled: 12,
    };
  }, [isComplete, startedAt]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Lead generation agent</CardTitle>
            <CardDescription>
              Orchestrates end-to-end outbound motions for your ICP.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isComplete ? (
              <Button variant="outline" size="sm" onClick={resetRun}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            ) : null}
            <Button
              onClick={startRun}
              size="sm"
              disabled={isRunning || isAuthorizing}
            >
              <Play className="mr-2 h-4 w-4" />
              {isRunning ? "Agent running" : isAuthorizing ? "Authorizing..." : "Start agent"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-5">
        {setupError ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {setupError}
            <div className="mt-2 text-xs text-destructive/80">
              <Button asChild size="xs" variant="secondary" className="bg-background">
                <Link href="/pricing">View pricing options</Link>
              </Button>
            </div>
          </div>
        ) : null}
        <div className="space-y-3">
          {steps.map((step) => {
            const status = step.status;
            const icon =
              status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : status === "running" ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Target className="h-5 w-5 text-muted-foreground" />
              );

            return (
              <div
                key={step.title}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-3 text-sm",
                  status === "running" && "border-primary/40 bg-primary/5",
                  status === "completed" && "border-emerald-200 bg-emerald-50/60",
                )}
              >
                <div className="mt-0.5 shrink-0">{icon}</div>
                <div className="space-y-1">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        {completionSummary ? (
          <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Agent run completed in {completionSummary.durationSeconds} seconds.
            Scheduled {completionSummary.followUpsScheduled} follow-ups and booked{" "}
            {completionSummary.meetingsBooked} new meetings.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
