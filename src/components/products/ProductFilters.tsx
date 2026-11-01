'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { Category } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
}

export function ProductFilters({ categories, currentCategory }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Active query states
  const activeSort = searchParams.get('sort') || 'newest';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeInStock = searchParams.get('inStock') === 'true';
  const activeFeatured = searchParams.get('featured') === 'true';

  const [minPriceInput, setMinPriceInput] = useState(activeMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(activeMaxPrice);

  const applyParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPriceInput) params.set('minPrice', minPriceInput);
    else params.delete('minPrice');

    if (maxPriceInput) params.set('maxPrice', maxPriceInput);
    else params.delete('maxPrice');

    router.push(`${pathname}?${params.toString()}`);
    setIsOpenMobile(false);
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    router.push(pathname);
    setIsOpenMobile(false);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header for Filter Drawer */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-xs text-orange-600 hover:text-orange-900 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Categories Filter */}
      {!currentCategory && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Departments
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => applyParam('category', cat.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  searchParams.get('category') === cat.slug
                    ? 'bg-orange-50 text-orange-900 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                {searchParams.get('category') === cat.slug && (
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Price Range (PKR)
        </label>
        <form onSubmit={handlePriceFilter} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-gray-400">Min (Rs.)</span>
              <input
                type="number"
                placeholder="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400">Max (Rs.)</span>
              <input
                type="number"
                placeholder="10000"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Availability / In Stock */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Availability
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 hover:text-orange-600">
          <input
            type="checkbox"
            checked={activeInStock}
            onChange={(e) => applyParam('inStock', e.target.checked ? 'true' : null)}
            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
          />
          <span>In Stock Only (Ready to Ship)</span>
        </label>
      </div>

      {/* Featured Deals */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Special</label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 hover:text-orange-600">
          <input
            type="checkbox"
            checked={activeFeatured}
            onChange={(e) => applyParam('featured', e.target.checked ? 'true' : null)}
            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
          />
          <span>Featured Items Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs h-fit sticky top-24">
        {filterContent}
      </aside>

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsIsOpenMobile(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-900 rounded-xl text-xs font-bold border border-orange-200"
        >
          <Filter className="w-4 h-4 text-orange-600" />
          <span>Filter & Price</span>
        </button>

        {/* Mobile Slide-up Drawer */}
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
              onClick={() => setIsOpenMobile(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col p-5 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="font-bold text-gray-900 text-base">Filter Products</h3>
                  <button
                    onClick={() => setIsOpenMobile(false)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="py-4">{filterContent}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  function setIsIsOpenMobile(val: boolean) {
    setIsOpenMobile(val);
  }
}
