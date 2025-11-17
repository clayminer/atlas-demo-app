"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/auth-context";
import { useCustomerFeatures, useCustomerInfo, usePricingModel } from "@runonatlas/react";
import {
  AI_INSIGHTS_FEATURE_SLUG,
  findFeatureCreditAllocation,
  findFeatureCreditPrice,
} from "@/lib/atlas/credit";

export function Topbar() {
  const { user, logout } = useAuth();
  const {
    pricingModel,
    isLoading: isPricingLoading,
    error: pricingError,
  } = usePricingModel();
  const {
    features,
    isLoading: isFeaturesLoading,
    error: featuresError,
  } = useCustomerFeatures();
  const { user: customerInfo } = useCustomerInfo();

  const lastLoggedRef = useRef<string | null>(null);

  useEffect(() => {
    if (isPricingLoading) {
      return;
    }

    const snapshot = JSON.stringify(
      {
        pricingModel,
        pricingError: pricingError ? pricingError.message : null,
      },
      null,
      2,
    );

    if (snapshot === lastLoggedRef.current) {
      return;
    }

    console.log("Atlas pricing model", pricingModel, pricingError);
    lastLoggedRef.current = snapshot;
  }, [isPricingLoading, pricingModel, pricingError]);

  const creditPrice = useMemo(
    () =>
      findFeatureCreditPrice({
        featureSlug: AI_INSIGHTS_FEATURE_SLUG,
        customerFeatures: features ?? undefined,
        pricingModel,
      }),
    [features, pricingModel],
  );

  const creditAllocation = useMemo(
    () =>
      findFeatureCreditAllocation({
        featureSlug: AI_INSIGHTS_FEATURE_SLUG,
        customerFeatures: features ?? undefined,
        pricingModel,
        customerInfo,
      }),
    [features, pricingModel, customerInfo],
  );

  useEffect(() => {
    if (isFeaturesLoading) {
      return;
    }
    console.log("Atlas customer features", features, featuresError);
    if (creditPrice !== null) {
      console.log(`Credit price for ${AI_INSIGHTS_FEATURE_SLUG}:`, creditPrice);
    }
    if (creditAllocation !== null) {
      console.log(`Credit allocation for ${AI_INSIGHTS_FEATURE_SLUG}:`, creditAllocation);
    }
    console.log("Atlas customer info", customerInfo);
  }, [features, featuresError, isFeaturesLoading, creditPrice, creditAllocation, customerInfo]);

  const initials = user?.username
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
        <div>
          <p className="text-sm font-medium leading-tight text-muted-foreground">
            Welcome back,
          </p>
          <p className="text-base font-semibold leading-tight">
            {user?.username ?? "Guest"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="hidden h-6 md:block" />
        <div className="hidden items-center gap-3 md:flex">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={user?.username} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-tight">
              {user?.username ?? "Unknown User"}
            </p>
            <p className="text-xs text-muted-foreground">Demo Tenant</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/billing">Manage billing</Link>
          </Button>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
