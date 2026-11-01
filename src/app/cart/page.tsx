'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
    freeShippingRemaining,
    progressToFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
          You haven&apos;t added any Pakistani apparel, mobile gadgets, or home items yet. Start shopping to fill it with great deals!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md transition-all"
        >
          <span>Explore Bazaar Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6">
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      {/* Free Shipping Progress Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 text-orange-950 font-bold text-xs sm:text-sm mb-2">
          <Truck className="w-5 h-5 text-orange-500 shrink-0" />
          {freeShippingRemaining > 0 ? (
            <span>
              Add <strong className="text-orange-600">{formatPrice(freeShippingRemaining)}</strong> more to get <strong>FREE Delivery</strong> across Pakistan!
            </span>
          ) : (
            <span className="text-orange-600">🎉 Great news! Your order qualifies for FREE nationwide shipping!</span>
          )}
        </div>
        <div className="w-full bg-orange-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-orange-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xs divide-y overflow-hidden">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.variant_id ?? 'def'}`}
              className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="space-y-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-bold text-sm sm:text-base text-gray-900 hover:text-orange-600 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  {item.variant_title && (
                    <p className="text-xs text-gray-500 font-medium">Variant: {item.variant_title}</p>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-black text-orange-900">
                      {formatPrice(item.price)}
                    </span>
                    {item.compare_at_price && item.compare_at_price > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.compare_at_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-50">
                <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                    className="p-2 hover:bg-gray-200 text-gray-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                    className="p-2 hover:bg-gray-200 text-gray-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="block font-black text-sm sm:text-base text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.product_id, item.variant_id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="space-y-6">
          {/* Coupon Input Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <Tag className="w-4 h-4 text-orange-500" />
              <span>Have a Promo Coupon?</span>
            </div>

            {couponCode ? (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-orange-900 block">Active: {couponCode}</span>
                  <span className="text-orange-600">{couponMessage}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 p-2.5 text-xs border border-gray-300 rounded-xl uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-orange-600 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            <p className="text-[11px] text-gray-400">
              Hint: Try coupon <strong className="text-orange-600">WELCOME10</strong> for 10% off or <strong className="text-orange-600">BAZAAR500</strong> for Rs. 500 off.
            </p>
          </div>

          {/* Cost Summary Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base border-b pb-3">Order Summary</h3>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping (Nationwide Pakistan)</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? (
                    <span className="text-orange-500 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-base font-black text-orange-950">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 text-center"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Manual verification via Bank Transfer, Easypaisa & JazzCash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
