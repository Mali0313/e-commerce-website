'use client';

import React from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Package, PieChart } from 'lucide-react';
import { getOrders, getAllProductsAdmin, getCategories } from '@/lib/data/store';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminReportsPage() {
  const { success } = useToast();
  const orders = getOrders();
  const products = getAllProductsAdmin();
  const categories = getCategories();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  // Top Selling Products
  const topProducts = [...products]
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, 5);

  // Sales by Category
  const categoryBreakdown = [
    { name: 'Fashion & Pret', sales: 42000, percentage: 40 },
    { name: 'Mobile Accessories', sales: 31500, percentage: 30 },
    { name: 'Home & Kitchen', sales: 21000, percentage: 20 },
    { name: 'Beauty & Skincare', sales: 10500, percentage: 10 },
  ];

  // Orders by Payment Method
  const paymentBreakdown = [
    { method: 'Bank Account Transfer (IBAN)', count: 18, share: '45%' },
    { method: 'Easypaisa Mobile Wallet', count: 14, share: '35%' },
    { method: 'JazzCash Mobile Wallet', count: 8, share: '20%' },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Category,Sales (PKR),Share (%)\n' +
      categoryBreakdown.map((c) => `"${c.name}",${c.sales},${c.percentage}%`).join('\n');

    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `bazaarhub-sales-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Sales report exported to CSV!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Sales & Analytics Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Revenue breakdown, top performing lifestyle categories, and customer wallet preferences.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="self-start sm:self-auto px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Total Gross Volume
          </span>
          <p className="text-2xl font-black text-orange-950">{formatPrice(totalRevenue)}</p>
          <span className="text-[11px] text-orange-600 font-bold">+24% MoM Growth</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Average Order Value (AOV)
          </span>
          <p className="text-2xl font-black text-gray-900">
            {formatPrice(orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0)}
          </p>
          <span className="text-[11px] text-gray-500">Per verified transaction</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Verification Conversion
          </span>
          <p className="text-2xl font-black text-orange-600">92.4%</p>
          <span className="text-[11px] text-orange-600">TID verified within 48h</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Revenue Breakdown by Department</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-800">{cat.name}</span>
                  <span className="text-orange-900 font-bold">{formatPrice(cat.sales)} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Preferred Manual Payment Methods</h3>
          <div className="divide-y text-xs">
            {paymentBreakdown.map((p) => (
              <div key={p.method} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{p.method}</p>
                  <p className="text-gray-400 text-[11px]">{p.count} successful transactions</p>
                </div>
                <span className="font-mono font-black text-orange-900 text-sm">{p.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Lifestyle Products */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Top Selling Lifestyle SKUs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Product Title</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Reviews</th>
                <th className="p-3">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-bold text-gray-900">{p.title}</td>
                  <td className="p-3 font-mono text-gray-600">{p.sku}</td>
                  <td className="p-3 font-bold text-orange-950">{formatPrice(p.price)}</td>
                  <td className="p-3 text-amber-500 font-bold">★ {p.rating}</td>
                  <td className="p-3 text-gray-600">{p.reviews_count} feedback</td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800">{p.stock_quantity} left</span>
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

