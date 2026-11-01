'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';
import { validateCoupon } from '@/lib/data/store';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  couponMessage: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  itemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  progressToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bazaarhub_cart_v1';
const COUPON_STORAGE_KEY = 'bazaarhub_coupon_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const standardShipping = 250;
  const freeShippingThreshold = 5000;

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch (e) {
      console.error('Failed to parse cart storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to write cart storage', e);
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (couponCode) {
        localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to write coupon storage', e);
    }
  }, [couponCode, isHydrated]);

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Re-evaluate coupon when subtotal changes
  useEffect(() => {
    if (couponCode && subtotal > 0) {
      const res = validateCoupon(couponCode, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discount);
        setCouponMessage(res.message);
      } else {
        setDiscountAmount(0);
        setCouponMessage(res.message);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, couponCode]);

  // Shipping calculation
  const shippingFee = items.length === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : standardShipping;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product_id === item.product_id && (i.variant_id ?? null) === (item.variant_id ?? null)
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(
          item.stock_quantity,
          next[existingIndex].quantity + item.quantity
        );
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
        };
        return next;
      }

      const newItem: CartItem = {
        ...item,
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      return [...prev, newItem];
    });

    setIsCartDrawerOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product_id === productId && (i.variant_id ?? null) === (variantId ?? null))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product_id === productId && (i.variant_id ?? null) === (variantId ?? null)) {
          return { ...i, quantity: Math.min(i.stock_quantity, quantity) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  const applyCoupon = (code: string): boolean => {
    const res = validateCoupon(code, subtotal);
    if (res.valid) {
      setCouponCode(code.trim().toUpperCase());
      setDiscountAmount(res.discount);
      setCouponMessage(res.message);
      return true;
    } else {
      setCouponMessage(res.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        shippingFee,
        discountAmount,
        total,
        couponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
        itemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        freeShippingThreshold,
        freeShippingRemaining,
        progressToFreeShipping,
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
