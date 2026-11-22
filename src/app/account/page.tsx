'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVipAuth } from '@/context/vip-auth-context';
import { useCart } from '@/context/cart-context';
import {
  Crown,
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Sliders,
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Plane,
  Printer,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  LogOut,
  ExternalLink,
  ChevronRight,
  Check,
  Smartphone,
} from 'lucide-react';
import type { VipOrder, VipAddress, VipPaymentMethod } from '@/lib/vip-db';
import { InvoiceModal } from '@/components/account/invoice-modal';
import { TrackingModal } from '@/components/account/tracking-modal';
import { ReturnExchangeModal } from '@/components/account/return-exchange-modal';
import { AddressModal } from '@/components/account/address-modal';
import { PaymentModal } from '@/components/account/payment-modal';
import { TicketModal } from '@/components/account/ticket-modal';

function VipAccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, isLoading, logout, refreshCustomer, openAuthModal, quickLogin } = useVipAuth();
  const { addItem, openCart } = useCart();

  // Active Tab
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<VipOrder | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<VipOrder | null>(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<VipOrder | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<VipAddress | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  // Preferences Form State
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [earlyAlerts, setEarlyAlerts] = useState(true);
  const [preferredFit, setPreferredFit] = useState<'WOMEN' | 'MEN' | 'UNISEX'>('WOMEN');
  const [preferredSize, setPreferredSize] = useState('M');
  const [prefMessage, setPrefMessage] = useState<string | null>(null);
  const [prefLoading, setPrefLoading] = useState(false);

  // Reorder loading state
  const [reorderLoadingId, setReorderLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (customer) {
      setEmailUpdates(customer.preferences?.emailOrderUpdates ?? true);
      setSmsAlerts(customer.preferences?.smsDropAlerts ?? true);
      setEarlyAlerts(customer.preferences?.earlyAccessAlerts ?? true);
      setPreferredFit(customer.preferences?.preferredFit || 'WOMEN');
      setPreferredSize(customer.preferences?.preferredSize || 'M');
    }
  }, [customer]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-[#52504B]">
        <RefreshCw className="w-5 h-5 animate-spin text-[#B82328] mr-2" />
        <span>SYNCHRONIZING ACCOUNT DATA...</span>
      </div>
    );
  }

  // Unauthenticated Fallback View
  if (!customer) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-[#F7F5F0]">
        <div className="max-w-md w-full bg-[#FCFBF8] border border-[#DCD7CC] p-8 sm:p-10 shadow-editorial text-center space-y-6 font-mono">
          <div className="inline-flex p-3 bg-[#EDEAE2] text-[#B82328] border border-[#DCD7CC] rounded-full">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-[#B82328] uppercase font-bold tracking-[0.25em] block">
              ACCOUNT LOGIN REQUIRED
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#111110]">
              My Account
            </h1>
            <p className="text-xs text-[#52504B] font-sans leading-relaxed">
              Sign in to view your orders, download GST tax invoices, track live air shipments, and manage your delivery address book.
            </p>
          </div>

          {/* Quick Demo Login Presets */}
          <div className="p-3 bg-[#EDEAE2]/60 border border-[#DCD7CC] space-y-2 text-left">
            <span className="text-[10px] text-[#52504B] uppercase font-bold tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B82328]" />
              Quick Demo Test Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('elena')}
                className="p-2 bg-white hover:bg-[#EDEAE2] border border-[#DCD7CC] text-left transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-[#111110] block">Elena Vance</span>
                <p className="text-[10px] text-[#52504B] truncate">elena.vance@outside.in</p>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('aarav')}
                className="p-2 bg-white hover:bg-[#EDEAE2] border border-[#DCD7CC] text-left transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-[#111110] block">Aarav Mehta</span>
                <p className="text-[10px] text-[#52504B] truncate">aarav.mehta@outside.in</p>
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>SIGN IN TO ACCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full py-2.5 border border-[#DCD7CC] hover:bg-[#EDEAE2] text-[#111110] text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
            >
              CREATE NEW ACCOUNT
            </button>
          </div>

          <p className="text-[10px] text-[#52504B]">
            Strict User-Level Memory Isolation · Indian DPDP Act 2023 Compliant
          </p>
        </div>
      </div>
    );
  }

  // Handlers
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'New passwords do not match.', isError: true });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/vip/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setPassMessage({ text: 'Password updated successfully.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      refreshCustomer();
    } catch (err: any) {
      setPassMessage({ text: err.message || 'Error updating password', isError: true });
    } finally {
      setPassLoading(false);
    }
  };

  const handle2faToggle = async () => {
    try {
      const res = await fetch('/api/vip/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twoFactorEnabled: !customer.twoFactorEnabled }),
      });
      if (res.ok) {
        refreshCustomer();
      }
    } catch (e) {
      console.warn('Could not toggle 2FA', e);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefLoading(true);
    setPrefMessage(null);
    try {
      const res = await fetch('/api/vip/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrderUpdates: emailUpdates,
          smsDropAlerts: smsAlerts,
          earlyAccessAlerts: earlyAlerts,
          preferredFit,
          preferredSize,
        }),
      });
      if (!res.ok) throw new Error('Failed to update preferences');
      setPrefMessage('Preferences saved to VIP account profile.');
      refreshCustomer();
    } catch (err: any) {
      setPrefMessage(err.message || 'Error updating preferences');
    } finally {
      setPrefLoading(false);
    }
  };

  const handleOneClickReorder = async (order: VipOrder) => {
    setReorderLoadingId(order.id);
    try {
      // Add items to client cart
      order.items.forEach((item) => {
        addItem({
          dropId: item.dropId,
          variantId: `var_${item.dropId}_${item.size}`,
          title: item.title,
          fit: item.fit,
          size: item.size,
          quantity: item.quantity,
          unitPricePaise: item.unitPricePaise,
          maxStock: 10,
          image: item.image,
        });
      });
      openCart();
    } catch (e) {
      console.warn('Reorder failed', e);
    } finally {
      setReorderLoadingId(null);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to remove this address?')) return;
    try {
      await fetch(`/api/vip/addresses?id=${id}`, { method: 'DELETE' });
      refreshCustomer();
    } catch (e) {
      console.warn('Could not delete address', e);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await fetch('/api/vip/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true }),
      });
      refreshCustomer();
    } catch (e) {
      console.warn('Could not set default address', e);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Remove this saved payment instrument?')) return;
    try {
      await fetch(`/api/vip/payments?id=${id}`, { method: 'DELETE' });
      refreshCustomer();
    } catch (e) {
      console.warn('Could not remove payment method', e);
    }
  };

  const handleSetDefaultPayment = async (id: string) => {
    try {
      await fetch('/api/vip/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      refreshCustomer();
    } catch (e) {
      console.warn('Could not set default payment', e);
    }
  };

  const handleMoveWishlistToCart = (dropId: string) => {
    addItem({
      dropId,
      variantId: `var_${dropId}_M`,
      title: 'DROP 001 // BETTER DAYS AHEAD',
      fit: customer.preferences?.preferredFit || 'WOMEN',
      size: customer.preferences?.preferredSize || 'M',
      quantity: 1,
      unitPricePaise: 240000,
      maxStock: 4,
      image: '/images/drops/drop-001-front.jpg',
    });
    openCart();
  };

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'GOLD':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'BLACK_EDITION':
        return 'bg-[#111110] text-[#EDEAE2] border-[#383632]';
      case 'SILVER':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-[#EDEAE2] text-[#111110] border-[#DCD7CC]';
    }
  };

  return (
    <div className="bg-[#F7F5F0] text-[#111110] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Profile Hero Strip */}
        <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 sm:p-8 shadow-editorial relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            
            {/* User Identity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#111110] text-[#FCFBF8] flex items-center justify-center text-xl font-bold border-2 border-[#DCD7CC] shadow-sm flex-shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-display font-black uppercase text-[#111110]">
                    {customer.name}
                  </h1>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-xs border font-bold uppercase bg-emerald-100 text-emerald-900 border-emerald-300">
                    VERIFIED ACCOUNT
                  </span>
                </div>
                <p className="text-xs text-[#52504B]">{customer.email} · {customer.phone}</p>
                <p className="text-[10px] text-[#52504B]">
                  Customer Member Since {new Date(customer.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Quick Metrics & Sign Out */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 md:border-l border-[#DCD7CC] pt-4 md:pt-0 md:pl-8">
              <div className="flex items-center gap-6 text-center">
                <div>
                  <span className="text-[10px] text-[#52504B] uppercase tracking-wider block font-bold">
                    ORDERS
                  </span>
                  <span className="text-xl font-black text-[#111110]">
                    {customer.orders?.length || 0}
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-[#DCD7CC]" />
                <div>
                  <span className="text-[10px] text-[#52504B] uppercase tracking-wider block font-bold">
                    SAVED
                  </span>
                  <span className="text-xl font-black text-[#111110]">
                    {customer.wishlist?.length || 0}
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-[#DCD7CC]" />
                <div>
                  <span className="text-[10px] text-[#52504B] uppercase tracking-wider block font-bold">
                    ADDRESSES
                  </span>
                  <span className="text-xl font-black text-[#111110]">
                    {customer.addresses?.length || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
                className="px-3.5 py-2 border border-[#DCD7CC] hover:bg-[#EDEAE2] text-[11px] font-bold text-[#B82328] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#DCD7CC] scrollbar-none text-xs">
          {[
            { id: 'overview', label: 'Personal Info & Security', icon: User },
            { id: 'orders', label: `Orders & Tracking (${customer.orders?.length || 0})`, icon: Package },
            { id: 'wishlist', label: `Saved Items (${customer.wishlist?.length || 0})`, icon: Heart },
            { id: 'addresses', label: `Address Book (${customer.addresses?.length || 0})`, icon: MapPin },
            { id: 'payments', label: `Payment Methods (${customer.paymentMethods?.length || 0})`, icon: CreditCard },
            { id: 'preferences', label: 'Notification Preferences', icon: Sliders },
            { id: 'concierge', label: `Customer Support (${customer.tickets?.length || 0})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-bold whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-[#111110] bg-[#FCFBF8] text-[#111110] shadow-xs'
                    : 'border-transparent text-[#52504B] hover:text-[#111110] hover:bg-[#EDEAE2]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B82328]' : 'text-[#52504B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT PANELS */}
        <div className="space-y-6">
          
          {/* ========================================================
              TAB 1: OVERVIEW & VIP STATUS & SECURITY
             ======================================================== */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: VIP Status & Perks */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Account Services & Commitments Card */}
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCD7CC]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#B82328]" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[#111110]">
                        Standard Customer Account Services
                      </h2>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ACTIVE
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: 'Complimentary Express Air Dispatch',
                        desc: 'Dispatched within 24 hours from Ahmedabad via BlueDart / Delhivery Air Express to your pincode.',
                      },
                      {
                        title: '7-Day Doorstep Exchanges & Returns',
                        desc: 'Free courier reverse pickup directly from your doorstep with instant RMA generation.',
                      },
                      {
                        title: 'Automated Indian GST Invoicing',
                        desc: 'Download sequential GST tax invoices with registered GSTIN (24AABCO1234F1Z5) and HSN 61091000.',
                      },
                      {
                        title: 'Encrypted Per-User Memory & Cart Persistence',
                        desc: 'Your shopping bag, address book, and saved items persist automatically across all devices.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-[#EDEAE2]/50 border border-[#DCD7CC]/70">
                        <span className="w-5 h-5 rounded-full bg-[#111110] text-[#FCFBF8] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#111110]">{item.title}</p>
                          <p className="text-[10px] text-[#52504B]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[10px] text-[#52504B] flex items-center justify-between">
                    <span>DATA INTEGRITY: DPDP ACT 2023 COMPLIANT</span>
                    <span className="font-bold text-emerald-700">ACCOUNT STATUS: GOOD STANDING</span>
                  </div>
                </div>

                {/* Profile Overview Card */}
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 sm:p-8 space-y-4 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#111110] pb-3 border-b border-[#DCD7CC]">
                    Personal Identity &amp; Contact Info
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC]">
                      <span className="text-[10px] text-[#52504B] uppercase block">FULL LEGAL NAME</span>
                      <span className="font-bold text-[#111110]">{customer.name}</span>
                    </div>

                    <div className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC]">
                      <span className="text-[10px] text-[#52504B] uppercase block">REGISTERED EMAIL</span>
                      <span className="font-bold text-[#111110]">{customer.email}</span>
                    </div>

                    <div className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC]">
                      <span className="text-[10px] text-[#52504B] uppercase block">MOBILE DISPATCH CONTACT</span>
                      <span className="font-bold text-[#111110]">{customer.phone}</span>
                    </div>

                    <div className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC]">
                      <span className="text-[10px] text-[#52504B] uppercase block">SAVED FIT PROFILE</span>
                      <span className="font-bold text-[#111110]">
                        {customer.preferences?.preferredFit} · Size {customer.preferences?.preferredSize}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Security & Password */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 2FA Security Pill */}
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#111110]">
                        Two-Factor Security (2FA)
                      </h3>
                    </div>
                    <button
                      onClick={handle2faToggle}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-colors cursor-pointer ${
                        customer.twoFactorEnabled
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                          : 'bg-[#EDEAE2] text-[#52504B] border-[#DCD7CC] hover:bg-[#DCD7CC]'
                      }`}
                    >
                      {customer.twoFactorEnabled ? '2FA ENABLED' : 'ENABLE 2FA'}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#52504B] leading-relaxed">
                    Protect your limited piece reservations with mandatory SMS / TOTP verification on checkout and login.
                  </p>
                </div>

                {/* Password Update Form */}
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#DCD7CC]">
                    <Lock className="w-4 h-4 text-[#B82328]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#111110]">
                      Update Security Passkey
                    </h3>
                  </div>

                  {passMessage && (
                    <div
                      className={`p-3 text-xs border ${
                        passMessage.isError
                          ? 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {passMessage.text}
                    </div>
                  )}

                  <form onSubmit={handlePasswordUpdate} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#52504B] uppercase font-bold block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#52504B] uppercase font-bold block">
                        New Password (min. 8 characters)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#52504B] uppercase font-bold block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passLoading}
                      className="w-full py-2.5 bg-[#111110] hover:bg-[#B82328] text-white text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {passLoading ? 'UPDATING PASSKEY...' : 'UPDATE PASSKEY'}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 2: ORDER HISTORY & REAL-TIME TRACKING
             ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CC]">
                <div>
                  <h2 className="text-base font-bold uppercase text-[#111110]">
                    Serialized Orders &amp; Invoices ({customer.orders?.length || 0})
                  </h2>
                  <p className="text-xs text-[#52504B]">
                    Sequential GST tax invoices, live air cargo telemetries, and one-click reordering.
                  </p>
                </div>
              </div>

              {(!customer.orders || customer.orders.length === 0) ? (
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-12 text-center space-y-4">
                  <Package className="w-10 h-10 text-[#52504B] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#111110]">NO COMMERCE ORDERS FOUND</p>
                  <p className="text-xs text-[#52504B] max-w-sm mx-auto">
                    You have not secured any serialized drops yet. Explore the active DROP 001 release.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111110] text-[#FCFBF8] text-xs font-bold uppercase tracking-wider hover:bg-[#B82328] transition-colors"
                  >
                    <span>EXPLORE ACTIVE DROP</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {customer.orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#FCFBF8] border border-[#DCD7CC] shadow-sm overflow-hidden"
                    >
                      {/* Order Card Top Bar */}
                      <div className="p-4 sm:p-5 bg-[#EDEAE2]/60 border-b border-[#DCD7CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#111110] text-sm">
                              ORDER {order.orderNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#111110] text-white font-bold">
                              INV: {order.invoiceNumber}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                                order.fulfillmentStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {order.fulfillmentStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#52504B]">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-3 py-1.5 bg-white hover:bg-[#EDEAE2] border border-[#DCD7CC] font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="View Sequential GST Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#B82328]" />
                            <span>PDF INVOICE</span>
                          </button>

                          <button
                            onClick={() => setSelectedTrackingOrder(order)}
                            className="px-3 py-1.5 bg-[#111110] text-[#FCFBF8] hover:bg-[#B82328] font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Track Air Cargo Timeline"
                          >
                            <Plane className="w-3.5 h-3.5" />
                            <span>LIVE TRACKING</span>
                          </button>
                        </div>
                      </div>

                      {/* Itemized List */}
                      <div className="p-4 sm:p-6 divide-y divide-[#DCD7CC]/60">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                            <div className="relative w-16 h-20 bg-[#EDEAE2] border border-[#DCD7CC] flex-shrink-0 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <h4 className="font-bold text-xs sm:text-sm text-[#111110] truncate">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-[#52504B]">
                                Fit: <strong>{item.fit}</strong> · Size: <strong>{item.size}</strong> · Qty: <strong>{item.quantity}</strong>
                              </p>
                              <p className="text-[10px] text-[#52504B]">
                                SKU: {item.sku} · 280 GSM Organic French Terry
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <span className="font-bold text-xs sm:text-sm text-[#111110]">
                                ₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                              </span>
                              <span className="block text-[10px] text-emerald-700 font-bold">
                                5% GST INCLUDED
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Actions & Shipping Destination */}
                      <div className="p-4 sm:p-5 bg-[#EDEAE2]/30 border-t border-[#DCD7CC] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#52504B] uppercase block">SHIPPED TO:</span>
                          <p className="font-bold text-[#111110]">
                            {order.shippingAddress.recipientName} — {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.pincode})
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-center">
                          {order.returnRequested ? (
                            <span className="px-3 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] uppercase">
                              {order.returnDetails?.type} PENDING ({order.returnDetails?.rmaCode})
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedReturnOrder(order)}
                              className="px-3 py-1.5 border border-[#DCD7CC] bg-white hover:bg-[#EDEAE2] text-[11px] font-bold text-[#52504B] hover:text-[#111110] transition-colors cursor-pointer"
                            >
                              7-DAY EXCHANGE / RETURN
                            </button>
                          )}

                          <button
                            onClick={() => handleOneClickReorder(order)}
                            disabled={reorderLoadingId === order.id}
                            className="px-3.5 py-1.5 bg-[#111110] hover:bg-[#B82328] text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${reorderLoadingId === order.id ? 'animate-spin' : ''}`} />
                            <span>1-CLICK REORDER</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ========================================================
              TAB 3: WISHLIST / SAVED ITEMS
             ======================================================== */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CC]">
                <div>
                  <h2 className="text-base font-bold uppercase text-[#111110]">
                    Saved Pieces &amp; Editions ({customer.wishlist?.length || 0})
                  </h2>
                  <p className="text-xs text-[#52504B]">
                    Persisted across your devices and sessions. Monitored for stock thresholds.
                  </p>
                </div>
              </div>

              {(!customer.wishlist || customer.wishlist.length === 0) ? (
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-12 text-center space-y-4">
                  <Heart className="w-10 h-10 text-[#52504B] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#111110]">YOUR SAVED ARCHIVE IS EMPTY</p>
                  <p className="text-xs text-[#52504B] max-w-sm mx-auto">
                    Heart garments in the lookbook, active drop, or vault to monitor real-time edition quantities.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111110] text-[#FCFBF8] text-xs font-bold uppercase tracking-wider hover:bg-[#B82328] transition-colors"
                  >
                    <span>BROWSE CURRENT DROP</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customer.wishlist.map((dropId) => {
                    const isDrop1 = dropId === 'drop_001';
                    const title = isDrop1 ? 'DROP 001 // BETTER DAYS AHEAD' : 'DROP 002 // BOTANICAL ARCHITECTURE';
                    const price = '₹2,400';
                    const image = isDrop1 ? '/images/drops/drop-001-front.jpg' : '/images/drops/drop-002-front.jpg';
                    const stockTag = isDrop1 ? 'ONLY 4 PIECES LEFT IN M' : 'UPCOMING ARCHIVE RELEASE';

                    return (
                      <div
                        key={dropId}
                        className="bg-[#FCFBF8] border border-[#DCD7CC] overflow-hidden group shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative aspect-[3/4] bg-[#EDEAE2]">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#111110] text-[#FCFBF8] text-[9px] font-bold uppercase tracking-wider">
                            {isDrop1 ? 'LIVE EDITION' : 'ARCHIVE UPCOMING'}
                          </span>
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-[#B82328] font-bold block">{stockTag}</span>
                            <h3 className="font-bold text-xs text-[#111110] uppercase">{title}</h3>
                            <p className="text-xs text-[#52504B]">{price} · 280 GSM Organic Cotton</p>
                          </div>

                          <div className="pt-2 border-t border-[#DCD7CC] flex items-center gap-2">
                            <button
                              onClick={() => handleMoveWishlistToCart(dropId)}
                              className="flex-1 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>MOVE TO BAG</span>
                            </button>

                            <Link
                              href={isDrop1 ? '/' : '/vault'}
                              className="p-2 border border-[#DCD7CC] hover:bg-[#EDEAE2] text-[#111110] transition-colors"
                              title="Inspect Garment Story"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ========================================================
              TAB 4: ADDRESS BOOK
             ======================================================== */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CC]">
                <div>
                  <h2 className="text-base font-bold uppercase text-[#111110]">
                    Saved Delivery Addresses ({customer.addresses?.length || 0})
                  </h2>
                  <p className="text-xs text-[#52504B]">
                    Manage shipping and billing locations for one-click express air checkout.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD ADDRESS</span>
                </button>
              </div>

              {(!customer.addresses || customer.addresses.length === 0) ? (
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-12 text-center space-y-4">
                  <MapPin className="w-10 h-10 text-[#52504B] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#111110]">NO SAVED ADDRESSES</p>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111110] text-[#FCFBF8] text-xs font-bold uppercase tracking-wider hover:bg-[#B82328] transition-colors cursor-pointer"
                  >
                    <span>ADD FIRST ADDRESS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customer.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-[#FCFBF8] border p-6 space-y-3 relative shadow-xs ${
                        addr.isDefault ? 'border-[#111110] ring-1 ring-[#111110]' : 'border-[#DCD7CC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#111110] uppercase">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] px-2 py-0.5 bg-[#111110] text-white font-bold uppercase">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingAddress(addr);
                              setAddressModalOpen(true);
                            }}
                            className="text-[11px] font-bold text-[#52504B] hover:text-[#111110] underline"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-[#52504B] hover:text-[#B82328] p-1"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-[#52504B] leading-relaxed">
                        <p className="font-bold text-[#111110]">{addr.recipientName}</p>
                        <p>{addr.streetAddress}</p>
                        <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p>India (State Code: {addr.stateCode || '27'})</p>
                        <p className="pt-1 text-[#111110]">Phone: {addr.phone}</p>
                      </div>

                      {!addr.isDefault && (
                        <div className="pt-2 border-t border-[#DCD7CC]">
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-[#B82328] hover:underline"
                          >
                            Set as Default Delivery Address &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ========================================================
              TAB 5: SAVED PAYMENT METHODS
             ======================================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CC]">
                <div>
                  <h2 className="text-base font-bold uppercase text-[#111110]">
                    Tokenized Payment Instruments ({customer.paymentMethods?.length || 0})
                  </h2>
                  <p className="text-xs text-[#52504B]">
                    Securely tokenized cards and UPI handles complying with RBI card tokenization guidelines.
                  </p>
                </div>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="px-3.5 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD INSTRUMENT</span>
                </button>
              </div>

              {(!customer.paymentMethods || customer.paymentMethods.length === 0) ? (
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-12 text-center space-y-4">
                  <CreditCard className="w-10 h-10 text-[#52504B] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#111110]">NO SAVED PAYMENT METHODS</p>
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111110] text-[#FCFBF8] text-xs font-bold uppercase tracking-wider hover:bg-[#B82328] transition-colors cursor-pointer"
                  >
                    <span>TOKENIZE FIRST INSTRUMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customer.paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className={`bg-[#FCFBF8] border p-6 space-y-3 relative shadow-xs ${
                        pm.isDefault ? 'border-[#111110] ring-1 ring-[#111110]' : 'border-[#DCD7CC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {pm.type === 'UPI' ? (
                            <Smartphone className="w-5 h-5 text-[#B82328]" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-[#111110]" />
                          )}
                          <span className="font-bold text-xs text-[#111110] uppercase">
                            {pm.brand}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {pm.isDefault && (
                            <span className="text-[9px] px-2 py-0.5 bg-[#111110] text-white font-bold uppercase">
                              DEFAULT
                            </span>
                          )}
                          <button
                            onClick={() => handleDeletePayment(pm.id)}
                            className="text-[#52504B] hover:text-[#B82328] p-1"
                            title="Remove Payment Instrument"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-bold text-sm text-[#111110] tracking-wider font-mono">
                          {pm.type === 'CARD' ? `•••• •••• •••• ${pm.last4OrVpa}` : pm.last4OrVpa}
                        </p>
                        <p className="text-[11px] text-[#52504B]">Cardholder: {pm.holderName}</p>
                        {pm.expiryMonth && (
                          <p className="text-[10px] text-[#52504B]">Expires: {pm.expiryMonth}/{pm.expiryYear}</p>
                        )}
                      </div>

                      {!pm.isDefault && (
                        <div className="pt-2 border-t border-[#DCD7CC]">
                          <button
                            onClick={() => handleSetDefaultPayment(pm.id)}
                            className="text-[11px] font-bold text-[#B82328] hover:underline"
                          >
                            Set as Default Instrument &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ========================================================
              TAB 6: PREFERENCES & SIZING
             ======================================================== */}
          {activeTab === 'preferences' && (
            <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
              <div className="pb-3 border-b border-[#DCD7CC]">
                <h2 className="text-base font-bold uppercase text-[#111110]">
                  Communication &amp; Tailoring Preferences
                </h2>
                <p className="text-xs text-[#52504B]">
                  Tailor your drop alert notifications and persistent sizing calibrations.
                </p>
              </div>

              {prefMessage && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
                  {prefMessage}
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="space-y-6">
                
                {/* Notification Toggles */}
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#111110] font-bold block">
                    TELEMETRY &amp; NOTIFICATION TOGGLES
                  </span>

                  <label className="flex items-start gap-3 p-3 bg-[#EDEAE2]/50 border border-[#DCD7CC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailUpdates}
                      onChange={(e) => setEmailUpdates(e.target.checked)}
                      className="w-4 h-4 text-[#B82328] mt-0.5 rounded-none cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111110] block">
                        Sequential Indian GST Invoices via Email
                      </span>
                      <span className="text-[10px] text-[#52504B]">
                        Receive digitally signed PDF invoices immediately upon drop order placement.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#EDEAE2]/50 border border-[#DCD7CC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#B82328] mt-0.5 rounded-none cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111110] block">
                        Air Freight Tracking SMS Updates
                      </span>
                      <span className="text-[10px] text-[#52504B]">
                        Real-time Bluedart / Delhivery flight departure and out-for-delivery notifications.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#EDEAE2]/50 border border-[#DCD7CC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={earlyAlerts}
                      onChange={(e) => setEarlyAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#B82328] mt-0.5 rounded-none cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111110] block">
                        Priority Drop &amp; Restock Alerts
                      </span>
                      <span className="text-[10px] text-[#52504B]">
                        Early access code sent 15 minutes before public drop launch to secure limited serialized pieces.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Sizing Calibration */}
                <div className="space-y-3 pt-2 border-t border-[#DCD7CC]">
                  <span className="text-[11px] uppercase tracking-wider text-[#111110] font-bold block">
                    PERSISTENT FIT &amp; TAILORING PROFILE
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#52504B] uppercase font-bold block">
                        Primary Fit Architecture
                      </label>
                      <select
                        value={preferredFit}
                        onChange={(e: any) => setPreferredFit(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                      >
                        <option value="WOMEN">Women-First Boxy Oversized</option>
                        <option value="MEN">Men Classic Boxy Shoulder</option>
                        <option value="UNISEX">Unisex Relaxed Streetwear</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#52504B] uppercase font-bold block">
                        Default Size Selection
                      </label>
                      <select
                        value={preferredSize}
                        onChange={(e) => setPreferredSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                      >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={prefLoading}
                  className="w-full py-3 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {prefLoading ? 'SAVING PREFERENCES...' : 'SAVE PREFERENCES'}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================
              TAB 7: CUSTOMER SUPPORT & TICKETS
             ======================================================== */}
          {activeTab === 'concierge' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CC]">
                <div>
                  <h2 className="text-base font-bold uppercase text-[#111110]">
                    Customer Support &amp; Studio Inquiries ({customer.tickets?.length || 0})
                  </h2>
                  <p className="text-xs text-[#52504B]">
                    Direct priority communications with our Ahmedabad studio tailoring and logistics team.
                  </p>
                </div>
                <button
                  onClick={() => setTicketModalOpen(true)}
                  className="px-3.5 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>OPEN NEW TICKET</span>
                </button>
              </div>

              {(!customer.tickets || customer.tickets.length === 0) ? (
                <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-12 text-center space-y-4">
                  <MessageSquare className="w-10 h-10 text-[#52504B] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#111110]">NO ACTIVE INQUIRIES OR TICKETS</p>
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111110] text-[#FCFBF8] text-xs font-bold uppercase tracking-wider hover:bg-[#B82328] transition-colors cursor-pointer"
                  >
                    <span>MESSAGE STUDIO CONCIERGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {customer.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-[#FCFBF8] border border-[#DCD7CC] shadow-xs overflow-hidden"
                    >
                      {/* Ticket Header */}
                      <div className="p-4 bg-[#EDEAE2]/70 border-b border-[#DCD7CC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111110]">{ticket.ticketNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-[#111110] text-white font-bold uppercase">
                            {ticket.category}
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
                              ticket.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#52504B]">
                          Logged {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Subject */}
                      <div className="p-4 sm:p-5 border-b border-[#DCD7CC]/60 bg-white">
                        <h4 className="font-bold text-xs text-[#111110] uppercase">
                          {ticket.subject}
                        </h4>
                      </div>

                      {/* Thread Messages */}
                      <div className="p-4 sm:p-6 space-y-4 bg-[#FCFBF8]">
                        {ticket.messages.map((msg) => {
                          const isCustomer = msg.sender === 'CUSTOMER';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-xl p-4 text-xs leading-relaxed border ${
                                  isCustomer
                                    ? 'bg-[#111110] text-[#FCFBF8] border-[#111110]'
                                    : 'bg-[#EDEAE2] text-[#111110] border-[#DCD7CC]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-4 pb-1 mb-1 border-b border-white/20 text-[10px] opacity-75">
                                  <span>{msg.senderName}</span>
                                  <span>{msg.timestamp}</span>
                                </div>
                                <p>{msg.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* MODALS */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      <TrackingModal
        order={selectedTrackingOrder}
        onClose={() => setSelectedTrackingOrder(null)}
      />

      <ReturnExchangeModal
        order={selectedReturnOrder}
        onClose={() => setSelectedReturnOrder(null)}
        onSuccess={() => {
          refreshCustomer();
        }}
      />

      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => {
          setAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSaved={() => refreshCustomer()}
        initialAddress={editingAddress}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSaved={() => refreshCustomer()}
      />

      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        onSaved={() => refreshCustomer()}
      />
    </div>
  );
}

export default function VipAccountDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-[#52504B]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#B82328] mr-2" />
          <span>SYNCHRONIZING SECURE VIP MEMORY...</span>
        </div>
      }
    >
      <VipAccountDashboardContent />
    </Suspense>
  );
}
