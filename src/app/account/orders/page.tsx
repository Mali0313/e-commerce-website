'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, CheckCircle, Truck, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/lib/data/store';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const allOrders = getOrders();

  // In demo/user mode, show orders matching user email or guest demo orders
  const orders = allOrders.filter(
    (o) => !user || o.user_id === user.id || o.shipping_address.email === user.email || !o.user_id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Link href="/account" className="hover:text-orange-600">Account</Link>
            <span>/</span>
            <span className="text-gray-700 font-semibold">Orders</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Order History & Tracking
          </h1>
          <p className="text-xs text-gray-500">
            View real-time status, courier tracking, and verification receipts
          </p>
        </div>

        <Link
          href="/products"
          className="self-start sm:self-auto px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No orders yet</h3>
          <p className="text-xs text-gray-500 mb-6">
            When you purchase items on BazaarHub, your orders and tracking timelines will appear here.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isVerified = order.status === 'payment_verified';
            const isShipped = order.status === 'shipped';
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5 sm:p-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-900 bg-orange-50 px-2.5 py-1 rounded-md">
                      #{order.order_number}
                    </span>
                    <span className="text-xs text-gray-400 ml-3">
                      Placed on {formatDateTime(order.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        order.status === 'delivered'
                          ? 'bg-orange-100 text-orange-900'
                          : order.status === 'shipped'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'payment_verified'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>

                    <Link
                      href={`/order-confirmation/${order.order_number}`}
                      className="px-3.5 py-1.5 border border-gray-300 hover:border-orange-500 hover:text-orange-600 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details & Receipt</span>
                    </Link>
                  </div>
                </div>

                {/* Progress Tracking Timeline */}
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs font-bold text-gray-500">
                    <div className="text-orange-600">1. Order Placed ✓</div>
                    <div className={isVerified || isShipped || isDelivered ? 'text-orange-600' : ''}>
                      2. Payment Verified {isVerified || isShipped || isDelivered ? '✓' : '...'}
                    </div>
                    <div className={isShipped || isDelivered ? 'text-orange-600' : ''}>
                      3. Dispatched {isShipped || isDelivered ? '✓' : '...'}
                    </div>
                    <div className={isDelivered ? 'text-orange-600' : ''}>
                      4. Delivered {isDelivered ? '🎉' : '...'}
                    </div>
                  </div>
                </div>

                {/* Tracking Info if Shipped */}
                {order.tracking_number && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-900 block">
                        Courier: {order.courier_name || 'TCS Express'}
                      </span>
                      <span className="text-blue-700 font-mono">
                        Tracking #: {order.tracking_number}
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-600 font-medium">
                      Estimated Delivery: 2-3 Days
                    </span>
                  </div>
                )}

                {/* Items preview */}
                <div className="divide-y text-xs">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
                          <Image
                            src={item.image_url || 'https://placehold.co/100x100'}
                            alt={item.product_title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.product_title}</p>
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">{formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <span className="text-gray-500">
                    Paid via:{' '}
                    <strong className="text-gray-900 uppercase">
                      {order.payments?.[0]?.payment_method.replace('_', ' ') || 'Manual Transfer'}
                    </strong>
                  </span>
                  <span className="text-sm font-black text-orange-950">
                    Total: {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

