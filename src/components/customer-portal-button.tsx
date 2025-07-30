"use client";

import { CustomerPortalComponent } from "@runonatlas/next/client";
import { useEffect, useState } from "react";

export function CustomerPortalButton() {
  const [isClient, setIsClient] = useState(false);
  const [CustomerPortalComp, setCustomerPortalComp] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import CustomerPortalComponent only on client side to avoid SSR issues
    import("@runonatlas/next/client").then((module) => {
      setCustomerPortalComp(() => module.CustomerPortalComponent);
    });
  }, []);

  useEffect(() => {
    // Always run this effect, but only add styles when component is ready
    if (!isClient || !CustomerPortalComp) {
      return;
    }

    // Add global styles for Atlas components after they load
    const style = document.createElement('style');
    style.textContent = `
      /* Target Atlas customer portal cards to make them full width and stacked */
      .atlas-customer-portal > * > div,
      .atlas-customer-portal [class*="card"],
      .atlas-customer-portal > div > div {
        width: 100% !important;
        max-width: none !important;
        margin-bottom: 24px !important;
        display: block !important;
      }
      
      /* Target Atlas customer portal container */
      .atlas-customer-portal > div {
        display: flex !important;
        flex-direction: column !important;
        gap: 24px !important;
        width: 100% !important;
      }
      
      /* Override any inline styles */
      .atlas-customer-portal * {
        max-width: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [isClient, CustomerPortalComp]);

  if (!isClient || !CustomerPortalComp) {
    return (
      <button
        disabled
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'not-allowed',
          opacity: 0.6,
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        Loading...
      </button>
    );
  }

  return (
    <div 
      className="atlas-customer-portal"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <CustomerPortalComp
        successUrl={`${window.location.origin}/?tab=portal`}
      />
    </div>
  );
}