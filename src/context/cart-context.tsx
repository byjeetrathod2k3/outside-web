'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { calculateOrderGst, OrderTaxBreakdown, CartItemInput } from '@/lib/gst';

export interface CartItem {
  id: string; // e.g. "drop_001-WOMEN-M"
  dropId: string;
  variantId: string;
  title: string;
  fit: 'WOMEN' | 'MEN' | 'UNISEX';
  size: string;
  quantity: number;
  unitPricePaise: number;
  maxStock: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  buyerStateCode: string;
  setBuyerStateCode: (code: string) => void;
  taxBreakdown: OrderTaxBreakdown;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [buyerStateCode, setBuyerStateCode] = useState('24'); // Default Gujarat (24)
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('outside_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedState = localStorage.getItem('outside_buyer_state');
      if (savedState) {
        setBuyerStateCode(savedState);
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('outside_cart', JSON.stringify(items));
        localStorage.setItem('outside_buyer_state', buyerStateCode);
      } catch (e) {
        console.warn('Could not save cart to localStorage', e);
      }
    }
  }, [items, buyerStateCode, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.dropId}-${newItem.fit}-${newItem.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        const updatedQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock);
        return prev.map((i) => (i.id === id ? { ...i, quantity: updatedQty } : i));
      }
      return [...prev, { ...newItem, id }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(qty, i.maxStock) } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Real-time GST calculation
  const cartItemInputs: CartItemInput[] = items.map((i) => ({
    title: i.title,
    fit: i.fit,
    size: i.size,
    unitPricePaise: i.unitPricePaise,
    quantity: i.quantity,
  }));

  const taxBreakdown = calculateOrderGst(cartItemInputs, buyerStateCode);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemsCount,
        buyerStateCode,
        setBuyerStateCode,
        taxBreakdown,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
