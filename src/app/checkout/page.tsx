'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { createOrder, getPaymentSettings } from '@/lib/data/store';
import { PaymentMethodKey } from '@/types';
import { sendOrderPlacedNotification } from '@/lib/email';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid Pakistani phone number (e.g. 0300-1234567)'),
  province: z.string().min(2, 'Please select your province'),
  city: z.string().min(2, 'Please select or enter your city'),
  streetAddress: z.string().min(8, 'Please enter your complete street and house address'),
  orderNotes: z.string().optional(),
  paymentMethod: z.enum(['bank_transfer', 'easypaisa', 'jazzcash'] as const),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa (KPK)',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir (AJK)',
  'Gilgit-Baltistan',
];

const MAJOR_CITIES: Record<string, string[]> = {
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Jhelum'],
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas'],
  'Khyber Pakhtunkhwa (KPK)': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Dera Ismail Khan'],
  Balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'],
  'Islamabad Capital Territory': ['Islamabad'],
  'Azad Jammu & Kashmir (AJK)': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza'],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, discountAmount, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const paymentSettings = getPaymentSettings();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(PAKISTAN_PROVINCES[0]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      province: PAKISTAN_PROVINCES[0],
      city: 'Lahore',
      streetAddress: '',
      orderNotes: '',
      paymentMethod: 'bank_transfer',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const activeMethodSetting = paymentSettings.find(
        (m) => m.method_key === data.paymentMethod
      );

      const order = createOrder({
        user_id: user?.id || null,
        guest_email: data.email,
        guest_name: data.fullName,
        guest_phone: data.phone,
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        total_amount: total,
        status: 'pending_payment',
        shipping_address: {
          full_name: data.fullName,
          phone: data.phone,
          email: data.email,
          province: data.province,
          city: data.city,
          street_address: data.streetAddress,
          notes: data.orderNotes || '',
        },
        courier_name: null,
        tracking_number: null,
        notes: data.orderNotes || null,
        coupon_code: couponCode || null,
        items: items.map((i) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          order_id: '',
          product_id: i.product_id,
          variant_id: i.variant_id ?? null,
          product_title: i.title,
          variant_title: i.variant_title ?? null,
          price: i.price,
          quantity: i.quantity,
          total: i.price * i.quantity,
          image_url: i.image_url,
        })),
        payments: [
          {
            id: `pay-${Date.now()}`,
            order_id: '',
            payment_method: data.paymentMethod,
            transaction_id: null,
            proof_url: null,
            amount: total,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      });

      // Send email notification with payment instructions
      await sendOrderPlacedNotification(
        order,
        activeMethodSetting?.method_title || data.paymentMethod,
        activeMethodSetting
          ? `${activeMethodSetting.bank_name ? `Bank: ${activeMethodSetting.bank_name} | ` : ''}Title: ${activeMethodSetting.account_title} | Account/IBAN: ${activeMethodSetting.account_number}. ${activeMethodSetting.instructions}`
          : 'Please complete payment using the account details on the confirmation page.'
      );

      clearCart();
      success(`Order #${order.order_number} placed successfully!`);
      router.push(`/order-confirmation/${order.order_number}`);
    } catch (e: any) {
      console.error(e);
      toastError('Could not process order. Please check your information and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-orange-500" />
          <span>Guest Checkout enabled. Safe manual verification across Pakistan.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Customer & Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b pb-4">
                <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Customer & Delivery Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Phone Number (For Courier SMS & Call) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="0300-1234567"
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address (For Payment & Tracking Updates) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="tariq@example.pk"
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Province / Region <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('province')}
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setValue('province', e.target.value);
                      setValue('city', MAJOR_CITIES[e.target.value]?.[0] || '');
                    }}
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer"
                  >
                    {PAKISTAN_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('city')}
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer"
                  >
                    {(MAJOR_CITIES[selectedProvince] || ['Karachi', 'Lahore', 'Islamabad']).map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Complete Street Address (House/Flat#, Street, Sector/Area) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register('streetAddress')}
                    placeholder="e.g. House 24-B, Street 5, Phase 4, DHA"
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.streetAddress && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.streetAddress.message}</p>
                  )}
                </div>

                {/* Order Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('orderNotes')}
                    placeholder="e.g. Leave with security guard or call after 3 PM"
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b pb-4">
                <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Select Manual Payment Method
                  </h2>
                  <p className="text-xs text-gray-500">
                    Transfer money directly using your preferred Pakistani banking or mobile wallet app.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Bank Transfer */}
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-4 transition-all ${
                    selectedPaymentMethod === 'bank_transfer'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="bank_transfer"
                    {...register('paymentMethod')}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-sm text-gray-900">
                        Bank Account Transfer (Meezan / HBL / IBAN)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Instant Raast or IBAN transfer from any Pakistani bank. You will upload the screenshot & TID on the next screen.
                    </p>
                  </div>
                </label>

                {/* Easypaisa */}
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-4 transition-all ${
                    selectedPaymentMethod === 'easypaisa'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="easypaisa"
                    {...register('paymentMethod')}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#00A651]" />
                      <span className="font-bold text-sm text-gray-900">
                        Easypaisa Mobile Wallet
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Fast mobile transfer to our official Easypaisa account (0300-1234567). Enter the 11-digit Trx ID after payment.
                    </p>
                  </div>
                </label>

                {/* JazzCash */}
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-4 transition-all ${
                    selectedPaymentMethod === 'jazzcash'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="jazzcash"
                    {...register('paymentMethod')}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#FF0000]" />
                      <span className="font-bold text-sm text-gray-900">
                        JazzCash Mobile Wallet
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Send to our official JazzCash account (0301-9876543). Enter the 12-digit TID from confirmation SMS.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5 sticky top-24">
            <h3 className="font-bold text-gray-900 text-base border-b pb-3">
              Order Review ({items.length} items)
            </h3>

            {/* Compact items list */}
            <div className="max-h-56 overflow-y-auto divide-y pr-1">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.variant_id ?? 'def'}`}
                  className="py-3 flex items-center gap-3 text-xs"
                >
                  <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                    <p className="text-gray-400">
                      Qty: {item.quantity} {item.variant_title ? `• ${item.variant_title}` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs sm:text-sm pt-2 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? (
                    <span className="text-orange-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-base font-black text-orange-950">
                <span>Total Amount Due</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {isSubmitting ? (
                <span>Generating Order...</span>
              ) : (
                <>
                  <span>Place Order & View Payment Info</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-[11px] text-orange-950 leading-snug">
              ℹ️ After placing your order, you will be shown the exact account details and given 48 hours to upload your Transaction ID (TID) and receipt screenshot.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
