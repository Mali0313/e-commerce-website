import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 sm:py-32 text-center space-y-5">
      <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs font-black text-2xl">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
        Page or Product Not Found
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
        The item or page you are looking for may have been moved, renamed, or is temporarily out of stock in our Pakistani warehouse.
      </p>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4 text-orange-500" />
          <span>Browse Bazaar</span>
        </Link>
      </div>
    </div>
  );
}

