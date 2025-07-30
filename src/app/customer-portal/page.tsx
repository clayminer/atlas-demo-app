"use client";

import { useMockAuth } from "@/lib/mock-auth";
import { LoginScreen } from "@/components/login-screen";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function CustomerPortal() {
  const { user, logout, isLoading } = useMockAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
          Loading...
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
        maxWidth: '800px',
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
            Customer Portal
          </h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              Back to App
            </button>
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

        {/* Portal Content */}
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
              Welcome to Your Customer Portal
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              You have successfully completed the checkout process!
            </p>
          </div>

          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🎉
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Checkout Successful!
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Thank you for your purchase. Your subscription is now active and you can access all the features included in your plan.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              User: <strong>{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}