'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowDownUp } from 'lucide-react';

export function ProductSortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs">
      <ArrowDownUp className="w-3.5 h-3.5 text-gray-400" />
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="bg-transparent border-none text-xs font-medium text-gray-800 focus:outline-none cursor-pointer"
        aria-label="Sort products by"
      >
        <option value="newest">Sort: Newest</option>
        <option value="popular">Sort: Popularity / Rating</option>
        <option value="price-asc">Sort: Price (Low to High)</option>
        <option value="price-desc">Sort: Price (High to Low)</option>
      </select>
    </div>
  );
}
