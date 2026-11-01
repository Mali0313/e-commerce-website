'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  PackageCheck,
  Clock,
  AlertTriangle,
  Users,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { getOrders, getAllProductsAdmin } from '@/lib/data/store';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const orders = getOrders();
  const products = getAllProductsAdmin();

  // Metrics
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingPayments = orders.filter((o) => o.status === 'pending_payment');
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 5);
  const recentOrders = orders.slice(0, 5);

  // 7-day sales breakdown calculation for chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = [
    { day: 'Mon', sales: 12400 },
    { day: 'Tue', sales: 18900 },
    { day: 'Wed', sales: 15200 },
    { day: 'Thu', sales: 24800 },
    { day: 'Fri', sales: 31500 },
    { day: 'Sat', sales: 42100 },
    { day: 'Sun', sales: 38400 },
  ];
  const maxSales = Math.max(...chartData.map((d) => d.sales));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Admin Operations Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Real-time summary of sales, pending manual payments, and Pakistani courier fulfillment.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900">{formatPrice(totalSales)}</p>
          <span className="text-[11px] text-orange-600 font-bold flex items-center gap-1">
            <span>+18.4%</span>
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900">{orders.length}</p>
          <span className="text-[11px] text-blue-700 font-bold flex items-center gap-1">
            <span>Nationwide PK</span>
            <span className="text-gray-400 font-normal">TCS & Leopards</span>
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Pending Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700">{pendingPayments.length}</p>
          <Link
            href="/admin/orders?status=pending_payment"
            className="text-[11px] text-amber-700 hover:underline font-bold flex items-center gap-0.5"
          >
            <span>Review TIDs</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600">{lowStockProducts.length}</p>
          <Link
            href="/admin/inventory"
            className="text-[11px] text-rose-600 hover:underline font-bold flex items-center gap-0.5"
          >
            <span>Restock Variants</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Sales Visual Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Bar Representation */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Weekly Sales Performance</h3>
              <p className="text-xs text-gray-400">Net revenue by day (PKR)</p>
            </div>
            <span className="text-xs font-bold text-orange-900 bg-orange-50 px-2.5 py-1 rounded-full">
              Last 7 Days
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {chartData.map((d) => {
              const heightPercent = Math.round((d.sales / maxSales) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rs. {(d.sales / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full bg-orange-500 group-hover:bg-orange-600 rounded-t-lg transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-semibold text-gray-600">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Shortcuts & System Health */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b pb-3">Quick Actions</h3>

          <div className="space-y-2">
            <Link
              href="/admin/products"
              className="w-full p-3 bg-orange-50 text-orange-950 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-orange-100 transition-colors"
            >
              <span>+ Add New Product</span>
              <ArrowUpRight className="w-4 h-4 text-orange-600" />
            </Link>

            <Link
              href="/admin/orders"
              className="w-full p-3 bg-gray-50 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span>Verify Pending Payments</span>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </Link>

            <Link
              href="/admin/coupons"
              className="w-full p-3 bg-gray-50 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span>Manage Promo Coupons</span>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </Link>

            <Link
              href="/admin/reports"
              className="w-full p-3 bg-gray-50 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span>Export CSV Sales Report</span>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Recent Orders</h3>
            <p className="text-xs text-gray-400">Latest customer orders requiring action</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-orange-600 hover:text-orange-900 font-bold"
          >
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Order</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-gray-900">
                    #{order.order_number}
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-gray-900">{order.shipping_address.full_name}</p>
                    <p className="text-[11px] text-gray-400">{order.shipping_address.city}</p>
                  </td>
                  <td className="p-3.5 uppercase font-medium text-gray-700">
                    {order.payments?.[0]?.payment_method.replace('_', ' ') || 'Bank'}
                  </td>
                  <td className="p-3.5 font-bold text-orange-900">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-orange-100 text-orange-900'
                          : order.status === 'shipped'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'payment_verified'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/admin/orders?search=${order.order_number}`}
                      className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-900 font-bold"
                    >
                      <span>Manage</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

