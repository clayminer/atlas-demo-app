"use client";

import { PropsWithChildren, useCallback, useMemo } from "react";
import { AtlasProvider } from "@runonatlas/next/client";
import { useAuth } from "@/components/auth/auth-context";
import { ATLAS_USER_HEADER_KEY } from "@/lib/atlas/constants";

function buildDemoEmail(username: string | undefined | null) {
  if (!username) {
    return null;
  }
  const normalized = username.trim().toLowerCase().replace(/\s+/g, ".");
  return `${normalized}@demo-atlas.app`;
}

export function AtlasClientProvider({ children }: PropsWithChildren) {
  const { user, isHydrated } = useAuth();
  const email = useMemo(() => buildDemoEmail(user?.username), [user?.username]);

  const loginCallback = useCallback(() => {
    window.location.href = "/login";
  }, []);

  const getAdditionalRequestHeaders = useCallback(async () => {
    if (!user) {
      return {};
    }
    return {
      [ATLAS_USER_HEADER_KEY]: user.username,
      "x-customer-name": user.username,
      ...(email ? { "x-customer-email": email } : {}),
    };
  }, [user, email]);

  return (
    <AtlasProvider
      userId={user?.username ?? null}
      userName={user?.username ?? null}
      userEmail={email}
      isUserLoading={!isHydrated}
      loginCallback={loginCallback}
      getAdditionalRequestHeaders={getAdditionalRequestHeaders}
    >
      {children}
    </AtlasProvider>
  );
}
