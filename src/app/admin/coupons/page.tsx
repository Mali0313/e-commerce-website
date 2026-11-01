'use client';

import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Edit2, Check, X, Tag } from 'lucide-react';
import { getAllCoupons, saveCoupon, deleteCoupon } from '@/lib/data/store';
import { Coupon } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminCouponsPage() {
  const { success, error: toastError } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(getAllCoupons());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1500);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(500);
  const [usageLimit, setUsageLimit] = useState<number | undefined>(500);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(1500);
    setMaxDiscount(500);
    setUsageLimit(500);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue <= 0) {
      toastError('Please enter a valid coupon code and discount value.');
      return;
    }

    const saved = saveCoupon({
      id: editingCoupon?.id,
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrderAmount),
      max_discount: maxDiscount ? Number(maxDiscount) : null,
      usage_limit: usageLimit ? Number(usageLimit) : null,
      is_active: true,
    });

    setCoupons(getAllCoupons());
    setIsModalOpen(false);
    success(`Coupon ${saved.code} saved successfully!`);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      deleteCoupon(id);
      setCoupons(getAllCoupons());
      success(`Coupon "${code}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Coupons & Promo Codes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Create percentage discounts, fixed vouchers, and free shipping triggers for Pakistani shoppers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order Amount</th>
                <th className="p-4">Max Cap</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-black text-orange-950 text-sm bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                      {c.code}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-gray-900">
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}% OFF`
                      : formatPrice(c.discount_value)}
                  </td>

                  <td className="p-4 text-gray-700 font-medium">
                    {c.min_order_amount > 0 ? formatPrice(c.min_order_amount) : 'No Minimum'}
                  </td>

                  <td className="p-4 text-gray-700 font-medium">
                    {c.max_discount ? formatPrice(c.max_discount) : 'Unlimited'}
                  </td>

                  <td className="p-4 text-gray-500">
                    {c.times_used} {c.usage_limit ? `/ ${c.usage_limit}` : 'times'}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active
                          ? 'bg-orange-100 text-orange-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4 animate-fade-in text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-gray-900">Create New Promo Voucher</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. EIDSPECIAL"
                className="w-full p-2.5 border rounded-xl font-mono uppercase tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed PKR (Rs.)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Value ({discountType === 'percentage' ? '%' : 'Rs.'})
                </label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Min Order Amount (PKR)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Max Discount Cap (PKR)</label>
                <input
                  type="number"
                  value={maxDiscount || ''}
                  onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 500"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="border-t pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

