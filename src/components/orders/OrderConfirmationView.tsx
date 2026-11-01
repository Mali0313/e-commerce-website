'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Copy,
  Upload,
  Clock,
  ShieldCheck,
  Building,
  Smartphone,
  AlertTriangle,
  ArrowRight,
  FileText,
  Printer,
} from 'lucide-react';
import { Order, PaymentSettings } from '@/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { submitPaymentProof } from '@/lib/data/store';

interface OrderConfirmationViewProps {
  order: Order;
  paymentSetting?: PaymentSettings;
}

export function OrderConfirmationView({ order: initialOrder, paymentSetting }: OrderConfirmationViewProps) {
  const { success, error: toastError } = useToast();
  const [order, setOrder] = useState<Order>(initialOrder);

  const existingPayment = order.payments?.[0];
  const [transactionId, setTransactionId] = useState(existingPayment?.transaction_id || '');
  const [proofPreview, setProofPreview] = useState<string | null>(existingPayment?.proof_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti fails in some environments
    }
  }, []);

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    success('Account number copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastError('Image file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toastError('Please enter your Transaction ID (TID) from your banking SMS or receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = submitPaymentProof(
        order.id,
        transactionId.trim(),
        proofPreview || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
      );

      if (updated) {
        setOrder({ ...updated });
        success('Payment verification details submitted! Our accounts team will review within 1-2 hours.');
      }
    } catch (e: any) {
      toastError('Failed to submit proof. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = () => {
    switch (order.status) {
      case 'payment_verified':
        return (
          <span className="bg-orange-100 text-orange-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-orange-500" />
            Payment Verified
          </span>
        );
      case 'processing':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            Packing & Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            🚚 Dispatched with {order.courier_name}
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-orange-100 text-orange-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            🎉 Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
            Cancelled
          </span>
        );
      case 'pending_payment':
      default:
        return (
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending Payment Proof
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Success Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
        <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Thank You! Your Order Has Been Placed.
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Order Reference: <strong className="text-orange-900 font-mono text-base font-bold">#{order.order_number}</strong>
        </p>
        <div className="flex justify-center pt-1">{statusBadge()}</div>
      </div>

      {/* Payment Instructions Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {paymentSetting?.method_key === 'bank_transfer' ? (
                <Building className="w-5 h-5 text-orange-600" />
              ) : (
                <Smartphone className="w-5 h-5 text-orange-600" />
              )}
              <span>{paymentSetting?.method_title || 'Payment Instructions'}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Please transfer the exact amount within <strong>48 hours</strong> to guarantee your inventory reservation.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Payable Amount</span>
            <span className="text-xl sm:text-2xl font-black text-orange-900">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-orange-50/60 rounded-2xl border border-orange-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Account Title:
            </span>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {paymentSetting?.account_title || 'BazaarHub Online Store'}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Bank / Provider:
            </span>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {paymentSetting?.bank_name || 'Bank Account'}
            </p>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 block">
                Account Number / IBAN:
              </span>
              <p className="font-mono text-sm sm:text-base font-bold text-orange-950">
                {paymentSetting?.account_number || 'PK36MEZN0001000102938475'}
              </p>
            </div>
            <button
              onClick={() => handleCopyAccount(paymentSetting?.account_number || 'PK36MEZN0001000102938475')}
              className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="sm:col-span-2 text-xs text-gray-600 leading-relaxed pt-1">
            <strong>How to pay:</strong> {paymentSetting?.instructions}
          </div>
        </div>

        {/* Form: Submit TID & Upload Receipt Screenshot */}
        <form onSubmit={handleProofSubmit} className="space-y-4 pt-2">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-orange-600" />
            <span>Submit Your Payment Verification Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Transaction ID (TID / Trx ID) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. MEZ-987654321 or 11-digit Trx ID"
                className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono uppercase"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Found in your mobile banking app or telecom confirmation SMS.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Payment Receipt Screenshot (Optional but speeds up verification)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
              />
            </div>
          </div>

          {proofPreview && (
            <div className="p-3 bg-gray-50 rounded-xl border flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-white shrink-0">
                <Image
                  src={proofPreview}
                  alt="Proof preview"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">Receipt screenshot attached</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Saving Proof...' : 'Submit Payment Proof'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="py-3 px-4 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary & Shipping Address */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-gray-900 text-base border-b pb-3">
          Order Items & Delivery Address
        </h3>

        <div className="divide-y">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border shrink-0">
                  <Image
                    src={item.image_url || 'https://placehold.co/100x100'}
                    alt={item.product_title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.product_title}</p>
                  <p className="text-gray-400 text-xs">
                    Qty: {item.quantity} {item.variant_title ? `• ${item.variant_title}` : ''}
                  </p>
                </div>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t text-xs">
          <div>
            <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Shipping Address:
            </h4>
            <p className="text-gray-900 font-semibold">{order.shipping_address.full_name}</p>
            <p className="text-gray-600">{order.shipping_address.street_address}</p>
            <p className="text-gray-600">
              {order.shipping_address.city}, {order.shipping_address.province}
            </p>
            <p className="text-gray-600 mt-1">Phone: {order.shipping_address.phone}</p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <div className="flex justify-between sm:justify-end gap-6 text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-gray-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-gray-900">
                {order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between sm:justify-end gap-6 text-orange-600 font-semibold">
                <span>Discount ({order.coupon_code}):</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between sm:justify-end gap-6 text-base font-black text-orange-950 pt-2 border-t">
              <span>Grand Total:</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
