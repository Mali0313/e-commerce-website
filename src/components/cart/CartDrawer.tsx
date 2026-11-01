'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    freeShippingThreshold,
    freeShippingRemaining,
    progressToFreeShipping,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity backdrop-blur-xs animate-fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-orange-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
              <span className="bg-orange-100 text-orange-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-orange-50 p-3 border-b border-orange-100 text-xs">
            <div className="flex items-center gap-2 text-orange-950 font-medium mb-1.5">
              <Truck className="w-4 h-4 text-orange-500 shrink-0" />
              {freeShippingRemaining > 0 ? (
                <span>
                  Add <strong className="text-orange-600">{formatPrice(freeShippingRemaining)}</strong> more to get <strong>FREE Delivery</strong> across Pakistan!
                </span>
              ) : (
                <span className="text-orange-600 font-bold">🎉 Congratulations! You unlocked FREE Delivery!</span>
              )}
            </div>
            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 bg-orange-500 text-white font-medium text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.product_id}-${item.variant_id ?? 'def'}`} className="py-4 flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-medium text-sm text-gray-900 hover:text-orange-500 line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product_id, item.variant_id)}
                          className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant_title && (
                        <p className="text-xs text-gray-500 mt-0.5">Variant: {item.variant_title}</p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-orange-600">
                          {formatPrice(item.price)}
                        </span>
                        {item.compare_at_price && item.compare_at_price > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.compare_at_price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-gray-700">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50/80 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900 text-base">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Shipping & taxes calculated at checkout. Standard rate is Rs. 250 (Free over Rs. 5,000).
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3 text-center border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
