'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PackageCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { getOrderById } from '@/lib/data/store';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = orderNumber.trim().toUpperCase();
    if (!cleanNum) {
      setErrorMsg('Please enter your order number');
      return;
    }

    const order = getOrderById(cleanNum);
    if (!order) {
      setErrorMsg(`No order found matching "${cleanNum}". Please verify your order confirmation SMS or email.`);
      return;
    }

    router.push(`/order-confirmation/${order.order_number}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <PackageCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Track Your BazaarHub Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your order reference number (e.g. <strong>BH-10021</strong>) to check verification, courier tracking, or submit payment receipt.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Order Reference Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="BH-10021"
                className="w-full text-sm p-3.5 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono uppercase"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>Find My Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-gray-50 rounded-2xl border text-xs text-gray-500 space-y-1 text-center">
          <p>Need help finding your order number?</p>
          <p>
            Chat with our customer service on WhatsApp at{' '}
            <strong className="text-orange-600">+92 300 1234567</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
