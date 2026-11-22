'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { VipUser } from '@/lib/vip-db';

interface VipAuthContextType {
  customer: VipUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (demoUser: 'elena' | 'aarav') => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    preferredFit?: 'WOMEN' | 'MEN' | 'UNISEX';
    preferredSize?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateCustomerData: (updatedUser: VipUser) => void;
}

const VipAuthContext = createContext<VipAuthContextType | undefined>(undefined);

export function VipAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<VipUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const refreshCustomer = useCallback(async () => {
    try {
      const res = await fetch('/api/vip/auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCustomer(data.user);
          return;
        }
      }
      setCustomer(null);
    } catch (e) {
      console.warn('VIP Auth verification error:', e);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vip/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Authentication rejected' };
      }
      setCustomer(data.user);
      setIsAuthModalOpen(false);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const quickLogin = async (demoUser: 'elena' | 'aarav') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vip/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoQuickLogin: demoUser }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Quick login failed' };
      }
      setCustomer(data.user);
      setIsAuthModalOpen(false);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Quick login failed' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    preferredFit?: 'WOMEN' | 'MEN' | 'UNISEX';
    preferredSize?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vip/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Registration failed' };
      }
      setCustomer(data.user);
      setIsAuthModalOpen(false);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/vip/auth', { method: 'DELETE' });
    } catch (e) {
      console.warn('Logout error:', e);
    } finally {
      setCustomer(null);
      setIsLoading(false);
    }
  };

  const updateCustomerData = (updatedUser: VipUser) => {
    setCustomer(updatedUser);
  };

  return (
    <VipAuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        quickLogin,
        register,
        logout,
        refreshCustomer,
        updateCustomerData,
      }}
    >
      {children}
    </VipAuthContext.Provider>
  );
}

export function useVipAuth() {
  const context = useContext(VipAuthContext);
  if (!context) {
    throw new Error('useVipAuth must be used within a VipAuthProvider');
  }
  return context;
}
