"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

const LOGIN_ROUTE = "/login";
const DASHBOARD_ROUTE = "/dashboard";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user && pathname !== LOGIN_ROUTE) {
      router.replace(LOGIN_ROUTE);
    }

    if (user && pathname === LOGIN_ROUTE) {
      router.replace(DASHBOARD_ROUTE);
    }
  }, [user, isHydrated, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Preparing your workspace...
      </div>
    );
  }

  if (!user && pathname !== LOGIN_ROUTE) {
    return null;
  }

  return <>{children}</>;
}
