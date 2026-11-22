'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { calculateOrderGst, OrderTaxBreakdown, CartItemInput } from '@/lib/gst';
import { useVipAuth } from './vip-auth-context';

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
  updateItemVariant: (oldId: string, newFit: 'WOMEN' | 'MEN' | 'UNISEX', newSize: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  buyerStateCode: string;
  setBuyerStateCode: (code: string) => void;
  buyerPincode: string;
  setBuyerPincode: (pin: string) => void;
  isPincodeModalOpen: boolean;
  openPincodeModal: () => void;
  closePincodeModal: () => void;
  isPrepaidDiscountApplied: boolean;
  togglePrepaidDiscount: () => void;
  prepaidDiscountPaise: number;
  taxBreakdown: OrderTaxBreakdown;
  wishlist: string[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  toggleWishlist: (dropId: string) => void;
  isInWishlist: (dropId: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useVipAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [buyerStateCode, setBuyerStateCode] = useState('24'); // Default Gujarat (24)
  const [buyerPincode, setBuyerPincode] = useState('380015'); // Default Ahmedabad
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isPrepaidDiscountApplied, setIsPrepaidDiscountApplied] = useState(true); // 5% UPI incentive default
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const prevCustomerRef = useRef<string | null>(null);

  // Sync server cart & wishlist when customer logs in
  useEffect(() => {
    if (customer && customer.id !== prevCustomerRef.current) {
      prevCustomerRef.current = customer.id;
      if (Array.isArray(customer.cart) && customer.cart.length > 0) {
        setItems(customer.cart as CartItem[]);
      }
      if (Array.isArray(customer.wishlist) && customer.wishlist.length > 0) {
        setWishlist((prev) => Array.from(new Set([...prev, ...customer.wishlist])));
      }
      // If customer has a default address with state & pincode, auto-fill delivery
      const defaultAddr = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
      if (defaultAddr) {
        if (defaultAddr.stateCode) setBuyerStateCode(defaultAddr.stateCode);
        if (defaultAddr.pincode) setBuyerPincode(defaultAddr.pincode);
      }
    } else if (!customer) {
      prevCustomerRef.current = null;
    }
  }, [customer]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('outside_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedWishlist = localStorage.getItem('outside_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedState = localStorage.getItem('outside_buyer_state');
      if (savedState) {
        setBuyerStateCode(savedState);
      }
      const savedPin = localStorage.getItem('outside_buyer_pin');
      if (savedPin) {
        setBuyerPincode(savedPin);
      }
      const savedPrepaid = localStorage.getItem('outside_prepaid_discount');
      if (savedPrepaid !== null) {
        setIsPrepaidDiscountApplied(savedPrepaid === 'true');
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage & sync to customer backend
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('outside_cart', JSON.stringify(items));
        localStorage.setItem('outside_buyer_state', buyerStateCode);
        localStorage.setItem('outside_buyer_pin', buyerPincode);
        localStorage.setItem('outside_prepaid_discount', String(isPrepaidDiscountApplied));
        localStorage.setItem('outside_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.warn('Could not save cart to localStorage', e);
      }

      // If customer is authenticated, sync persistent cart and wishlist to backend
      if (customer) {
        fetch('/api/vip/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        }).catch((e) => console.warn('Could not sync cart to server:', e));

        fetch('/api/vip/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishlist }),
        }).catch((e) => console.warn('Could not sync wishlist to server:', e));
      }
    }
  }, [items, buyerStateCode, buyerPincode, isPrepaidDiscountApplied, wishlist, isHydrated, customer]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const openPincodeModal = () => setIsPincodeModalOpen(true);
  const closePincodeModal = () => setIsPincodeModalOpen(false);
  const togglePrepaidDiscount = () => setIsPrepaidDiscountApplied((prev) => !prev);

  const toggleWishlist = (dropId: string) => {
    setWishlist((prev) =>
      prev.includes(dropId) ? prev.filter((id) => id !== dropId) : [...prev, dropId]
    );
  };

  const isInWishlist = (dropId: string) => wishlist.includes(dropId);
  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);
  const wishlistCount = wishlist.length;

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

  const updateItemVariant = (
    oldId: string,
    newFit: 'WOMEN' | 'MEN' | 'UNISEX',
    newSize: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === oldId) {
          const newId = `${item.dropId}-${newFit}-${newSize}`;
          return {
            ...item,
            id: newId,
            fit: newFit,
            size: newSize,
          };
        }
        return item;
      })
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

  const rawTaxBreakdown = calculateOrderGst(cartItemInputs, buyerStateCode);

  // 5% Extra UPI/Prepaid discount (Cahoot benchmark)
  const prepaidDiscountPaise = isPrepaidDiscountApplied
    ? Math.round(rawTaxBreakdown.subtotalGrossPaise * 0.05)
    : 0;

  const finalPayableWithDiscount = Math.max(0, rawTaxBreakdown.finalPayablePaise - prepaidDiscountPaise);

  const taxBreakdown: OrderTaxBreakdown = {
    ...rawTaxBreakdown,
    finalPayablePaise: finalPayableWithDiscount,
  };

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
        updateItemVariant,
        clearCart,
        totalItemsCount,
        buyerStateCode,
        setBuyerStateCode,
        buyerPincode,
        setBuyerPincode,
        isPincodeModalOpen,
        openPincodeModal,
        closePincodeModal,
        isPrepaidDiscountApplied,
        togglePrepaidDiscount,
        prepaidDiscountPaise,
        taxBreakdown,
        wishlist,
        wishlistCount,
        isWishlistOpen,
        toggleWishlist,
        isInWishlist,
        openWishlist,
        closeWishlist,
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
