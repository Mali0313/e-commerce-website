'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.price, product.compare_at_price);
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://placehold.co/400x500';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock_quantity <= 0) return;

    const variant = product.variants?.[0];
    addItem({
      product_id: product.id,
      variant_id: variant?.id ?? null,
      title: product.title,
      variant_title: variant ? variant.title : null,
      price: variant ? variant.price : product.price,
      compare_at_price: variant ? variant.compare_at_price : product.compare_at_price,
      quantity: 1,
      image_url: primaryImage,
      slug: product.slug,
      stock_quantity: variant ? variant.stock_quantity : product.stock_quantity,
    });

    success(`Added "${product.title}" to your cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    success(
      isFavorited
        ? `Removed "${product.title}" from wishlist`
        : `Saved "${product.title}" to wishlist`
    );
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Image Container */}
      <div className="relative aspect-4/5 w-full bg-gray-50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
        </Link>

        {/* Badges: Discount & Stock */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-orange-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.stock_quantity <= 0 ? (
            <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Out of Stock
            </span>
          ) : product.stock_quantity <= 5 ? (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Only {product.stock_quantity} Left!
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isFavorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-gray-600 hover:text-orange-600 hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            disabled={product.stock_quantity <= 0}
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{product.stock_quantity <= 0 ? 'Out of Stock' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mb-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold ml-1 text-gray-800">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400 text-[11px]">({product.reviews_count})</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-orange-600 line-clamp-2 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Mobile Add to Cart */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-gray-950">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Tap-friendly Add button */}
          <button
            type="button"
            disabled={product.stock_quantity <= 0}
            onClick={handleQuickAdd}
            className="sm:hidden w-9 h-9 rounded-xl bg-orange-50 text-orange-600 active:bg-orange-500 active:text-white flex items-center justify-center transition-colors"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
