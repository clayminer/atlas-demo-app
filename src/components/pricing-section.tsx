"use client";

import { PricingComponent } from "@runonatlas/next/client";
import { useEffect, useState } from "react";

export function PricingSection() {
  const [isClient, setIsClient] = useState(false);
  const [PricingComp, setPricingComp] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import PricingComponent only on client side to avoid SSR issues
    import("@runonatlas/next/client").then((module) => {
      setPricingComp(() => module.PricingComponent);
    });
  }, []);

  if (!isClient || !PricingComp) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        margin: '32px 0'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          Loading pricing...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      padding: '48px',
      margin: '32px 0'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '48px'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Choose Your Plan
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Select the perfect plan for your needs
        </p>
      </div>
      
      <PricingComp
        successUrl={`${window.location.origin}/?tab=portal`}
      />
    </div>
  );
}