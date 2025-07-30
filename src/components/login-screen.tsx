"use client";

import { useMockAuth } from "@/lib/mock-auth";
import { useState } from "react";

const users = [
  {
    id: 'user1',
    name: 'User 1',
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      color: 'white',
      padding: '20px 40px',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
      minWidth: '200px',
    }
  },
  {
    id: 'user2',
    name: 'User 2', 
    style: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      border: 'none',
      color: 'white',
      padding: '20px 40px',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(240, 147, 251, 0.3)',
      minWidth: '200px',
    }
  },
  {
    id: 'user3',
    name: 'User 3',
    style: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      border: 'none',
      color: 'white',
      padding: '20px 40px',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(79, 172, 254, 0.3)',
      minWidth: '200px',
    }
  },
];

export function LoginScreen() {
  const { login } = useMockAuth();
  const [customUserId, setCustomUserId] = useState('');

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    const originalShadow = users.find(u => u.id === e.currentTarget.dataset.userId)?.style.boxShadow || '';
    e.currentTarget.style.boxShadow = originalShadow;
  };

  const handleCustomLogin = () => {
    if (customUserId.trim()) {
      login(customUserId.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCustomLogin();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Choose a User
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#6b7280',
          marginBottom: '48px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Select a user profile to test Atlas features
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '48px'
        }}>
          {users.map((user) => (
            <button
              key={user.id}
              data-user-id={user.id}
              onClick={() => login(user.id)}
              style={user.style}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {user.name} Login
            </button>
          ))}
        </div>

        {/* Custom User Login Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Custom User Login
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Enter a custom user ID to test with
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <input
              type="text"
              placeholder="Enter User ID (e.g., custom-user-123)"
              value={customUserId}
              onChange={(e) => setCustomUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleCustomLogin}
              disabled={!customUserId.trim()}
              style={{
                background: customUserId.trim() 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : '#e5e7eb',
                border: 'none',
                color: customUserId.trim() ? 'white' : '#9ca3af',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: customUserId.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: customUserId.trim() 
                  ? '0 4px 15px rgba(16, 185, 129, 0.3)' 
                  : 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (customUserId.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (customUserId.trim()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              Login with Custom User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}