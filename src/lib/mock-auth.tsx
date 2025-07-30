"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MockUser {
  id: string;
  name: string;
  email: string;
}

interface MockAuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

const mockUsers: Record<string, MockUser> = {
  user1: { id: 'user1', name: 'User One', email: 'user1@example.com' },
  user2: { id: 'user2', name: 'User Two', email: 'user2@example.com' },
  user3: { id: 'user3', name: 'User Three', email: 'user3@example.com' },
};

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUserId = localStorage.getItem('mockAuthUserId');
    if (storedUserId) {
      // Create user object from stored ID (either predefined or custom)
      const user = mockUsers[storedUserId] || {
        id: storedUserId,
        name: `Custom User (${storedUserId})`,
        email: `${storedUserId}@example.com`
      };
      setUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    // Create user object (either predefined or custom)
    const user = mockUsers[userId] || {
      id: userId,
      name: `Custom User (${userId})`,
      email: `${userId}@example.com`
    };
    setUser(user);
    localStorage.setItem('mockAuthUserId', userId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockAuthUserId');
  };

  const getToken = async (): Promise<string | null> => {
    // Return a mock token that includes the user ID
    const token = user ? `mock-token-${user.id}` : null;
    console.log('🔑 Mock Auth - getToken called, user:', user?.id, 'token:', token);
    return token;
  };

  return (
    <MockAuthContext.Provider value={{ user, isLoading, login, logout, getToken }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}