"use client";

import { Button } from "@/components/ui/button";
import { LoginScreen } from "@/components/login-screen";
import { useMockAuth } from "@/lib/mock-auth";
import dynamicImport from "next/dynamic";
import { Crown } from 'lucide-react';
import { useState, useEffect } from "react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const AtlasButtons = dynamicImport(() => import("@/components/atlas-buttons").then(mod => ({ default: mod.AtlasButtons })), {
  ssr: false,
  loading: () => (
    <div className="flex gap-4 justify-center items-center">
      <Button variant="outline" disabled>Loading...</Button>
      <Button variant="outline" disabled>Loading...</Button>
      <Button variant="outline" disabled>Loading...</Button>
    </div>
  )
});

const DiceRollsFeature = dynamicImport(() => import("@/components/dice-rolls-feature").then(mod => ({ default: mod.DiceRollsFeature })), {
  ssr: false,
  loading: () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px'
      }}>🎲</div>
      <div>Loading dice rolls...</div>
    </div>
  )
});

const PricingSection = dynamicImport(() => import("@/components/pricing-section").then(mod => ({ default: mod.PricingSection })), {
  ssr: false,
  loading: () => (
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
      <div>Loading pricing...</div>
    </div>
  )
});

const CustomerPortalButton = dynamicImport(() => import("@/components/customer-portal-button").then(mod => ({ default: mod.CustomerPortalButton })), {
  ssr: false,
  loading: () => (
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
      }}
    >
      Loading...
    </button>
  )
});

export default function Home() {
  const { user, logout, isLoading } = useMockAuth();
  const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'portal'>('features');

  useEffect(() => {
    // Check URL params for tab selection (used after successful checkout)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'portal') {
        setActiveTab('portal');
        // Clean up URL without reloading
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Welcome, <span style={{ color: '#667eea' }}>{user.name}</span>!
          </h1>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <button
              onClick={logout}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '6px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveTab('features')}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'features' ? '#667eea' : 'transparent',
                color: activeTab === 'features' ? 'white' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'pricing' ? '#667eea' : 'transparent',
                color: activeTab === 'pricing' ? 'white' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'portal' ? '#667eea' : 'transparent',
                color: activeTab === 'portal' ? 'white' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Customer Portal
            </button>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'features' ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: '48px'
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
                Atlas Protected Features
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Access to these features is determined by your user plan.
              </p>
            </div>
            <AtlasButtons onUpgradeClick={() => setActiveTab('pricing')} />
            
            {/* Dice Rolls Feature Section */}
            <div style={{
              marginTop: '48px'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Limit-Based Feature Demo
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  This feature demonstrates Atlas usage limits and tracking.
                </p>
              </div>
              <DiceRollsFeature onUpgradeClick={() => setActiveTab('pricing')} />
            </div>
          </div>
        ) : activeTab === 'pricing' ? (
          <PricingSection />
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: '48px'
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
                Customer Portal
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Manage your subscription and billing information.
              </p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <CustomerPortalButton />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}