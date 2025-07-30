"use client";

import { ReactNode, useEffect, useState } from "react";
import { useMockAuth } from "@/lib/mock-auth";

const loginCallback = () => {
  // This will be handled by our login screen logic
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

export function AtlasClientProvider({ children }: { children: ReactNode }) {
  const { user, getToken, isLoading } = useMockAuth();
  const [isClient, setIsClient] = useState(false);
  const [AtlasProvider, setAtlasProvider] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import AtlasProvider only on client side
    import("@runonatlas/next/client").then((module) => {
      setAtlasProvider(() => module.AtlasProvider);
    });
  }, []);

  // Don't render Atlas components until we're on the client and have the provider
  if (!isClient || !AtlasProvider) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Loading Atlas...</div>
    </div>;
  }

  return (
    <AtlasProvider
      getAuth={getToken}
      loginCallback={loginCallback}
      userId={user?.id || null}
      userEmail={user?.email || null}
      userName={user?.name || null}
      isUserLoading={isLoading}
      apiUrl="/api/atlas-api"
    >
      {children}
    </AtlasProvider>
  );
}