'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Boxes, AlertTriangle, Check, Plus, Minus, Search, ArrowUpRight } from 'lucide-react';
import { getAllProductsAdmin, saveProduct } from '@/lib/data/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminInventoryPage() {
  const { success } = useToast();
  const [products, setProducts] = useState<Product[]>(getAllProductsAdmin());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowOnly, setFilterLowOnly] = useState(false);

  const handleAdjustStock = (p: Product, delta: number) => {
    const newQty = Math.max(0, p.stock_quantity + delta);
    saveProduct({
      id: p.id,
      stock_quantity: newQty,
    });
    setProducts(getAllProductsAdmin());
    success(`Updated ${p.title} stock to ${newQty}.`);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLow = !filterLowOnly || p.stock_quantity <= 5;
    return matchSearch && matchLow;
  });

  const lowStockCount = products.filter((p) => p.stock_quantity <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time variant and SKU stock levels with automatic reduction on verified orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} Low Stock (≤5)</span>
          </div>
          <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
            <span>{outOfStockCount} Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter inventory by title or SKU..."
            className="w-full text-xs p-2.5 pl-9 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={filterLowOnly}
            onChange={(e) => setFilterLowOnly(e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded"
          />
          <span>Show Low & Depleted Stock Only</span>
        </label>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">SKU / Item</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Threshold Status</th>
                <th className="p-4 text-right">Adjust Stock Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const isDepleted = p.stock_quantity === 0;
                const isLow = p.stock_quantity <= 5 && p.stock_quantity > 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border shrink-0">
                          <Image
                            src={p.images?.[0]?.image_url || 'https://placehold.co/100x100'}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.title}</p>
                          <p className="font-mono text-[10px] text-gray-400">SKU: {p.sku || 'BH-01'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-gray-900">{formatPrice(p.price)}</td>

                    <td className="p-4">
                      <span className="text-base font-black text-gray-900">
                        {p.stock_quantity}
                      </span>{' '}
                      <span className="text-[10px] text-gray-400">units</span>
                    </td>

                    <td className="p-4">
                      {isDepleted ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-[10px] animate-pulse">
                          Low Stock Warning
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-900 rounded-full font-bold text-[10px]">
                          Optimal Stock
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-2xs">
                        <button
                          onClick={() => handleAdjustStock(p, -5)}
                          className="px-2.5 py-1.5 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                          title="Reduce 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, -1)}
                          className="px-2 py-1.5 hover:bg-gray-200 text-gray-700 transition-colors"
                          title="Reduce 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-bold text-xs bg-white py-1.5 border-x">
                          {p.stock_quantity}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(p, 1)}
                          className="px-2 py-1.5 hover:bg-gray-200 text-gray-700 transition-colors"
                          title="Add 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, 10)}
                          className="px-2.5 py-1.5 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                          title="Add 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

