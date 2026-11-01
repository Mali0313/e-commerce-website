'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-store';
import { ProductCard } from '@/components/products/ProductCard';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();

  const favoriteProducts = INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between border-b pb-6 mb-8">
        <div>
          <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-semibold">Wishlist</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <Link
          href="/products"
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          Explore More Items
        </Link>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Click the heart icon on any kurta, power bank, lawn suit or beauty item to save it here for later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {favoriteProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

