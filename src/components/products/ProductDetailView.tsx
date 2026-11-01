'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Share2,
  Check,
  AlertCircle,
  Plus,
  Minus,
  MessageSquare,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { addReview } from '@/lib/data/store';

interface ProductDetailViewProps {
  product: Product;
  initialReviews: Review[];
}

export function ProductDetailView({ product, initialReviews }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'img-def', product_id: product.id, image_url: 'https://placehold.co/600x600', alt_text: product.title, display_order: 1, is_primary: true }];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant selection
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Active pricing and stock
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAt = selectedVariant
    ? selectedVariant.compare_at_price
    : product.compare_at_price;
  const currentStock = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;
  const discountPercent = calculateDiscount(currentPrice, currentCompareAt);

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      error('This item is currently out of stock.');
      return;
    }

    addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      title: product.title,
      variant_title: selectedVariant ? selectedVariant.title : null,
      price: currentPrice,
      compare_at_price: currentCompareAt,
      quantity,
      image_url: images[selectedImageIndex]?.image_url || images[0].image_url,
      slug: product.slug,
      stock_quantity: currentStock,
    });

    success(`Added ${quantity}x "${product.title}" to cart!`);
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) return;
    addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      title: product.title,
      variant_title: selectedVariant ? selectedVariant.title : null,
      price: currentPrice,
      compare_at_price: currentCompareAt,
      quantity,
      image_url: images[selectedImageIndex]?.image_url || images[0].image_url,
      slug: product.slug,
      stock_quantity: currentStock,
    });
    router.push('/checkout');
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          url: window.location.href,
        });
      } catch {
        // Fallback copy
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      error('Please provide your name and review comments.');
      return;
    }

    const newRev = addReview({
      product_id: product.id,
      user_id: `usr-${Date.now()}`,
      order_id: null,
      rating: reviewRating,
      title: 'Verified Customer Review',
      comment: reviewComment,
      photo_url: null,
      is_verified_purchase: true,
      is_approved: true,
      user_name: `${reviewName} (Verified Customer)`,
    });

    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
    setShowReviewForm(false);
    success('Thank you! Your review has been published.');
  };

  // Unique sizes and colors if variants exist
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];

  // JSON-LD structured data for Google SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: images.map((i) => i.image_url),
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'BazaarHub',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: currentPrice,
      availability: currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: Math.max(1, reviewsList.length),
    },
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden shadow-xs">
            <Image
              src={images[selectedImageIndex]?.image_url || images[0].image_url}
              alt={product.title}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-lg shadow-sm">
                SAVE {discountPercent}%
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-gray-700 hover:text-rose-600 hover:bg-white'
              }`}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-orange-500 ring-2 ring-orange-500/30'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={`${product.title} thumb ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Info */}
        <div className="space-y-6">
          <div>
            {/* Rating & SKU */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold ml-1 text-gray-900">{product.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span className="text-orange-600 font-semibold underline cursor-pointer">
                  {reviewsList.length} verified ratings
                </span>
              </div>
              <span>SKU: {selectedVariant?.sku || product.sku || 'BH-PROD'}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-medium">Bazaar Special Price</span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-orange-900">
                  {formatPrice(currentPrice)}
                </span>
                {currentCompareAt && currentCompareAt > currentPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(currentCompareAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status Badge */}
            <div>
              {currentStock <= 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Out of Stock
                </span>
              ) : currentStock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Only {currentStock} left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-xs font-bold">
                  <Check className="w-3.5 h-3.5" />
                  In Stock (Ready to Ship)
                </span>
              )}
            </div>
          </div>

          {/* Variant Selection if available */}
          {variants.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                Choose Variant / Color / Size:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold ring-2 ring-orange-500/30'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-xs truncate">{v.title}</p>
                    <p className="text-xs text-orange-600 font-bold mt-1">{formatPrice(v.price)}</p>
                    <span className="text-[10px] text-gray-400">
                      {v.stock_quantity > 0 ? `${v.stock_quantity} left` : 'Out of stock'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Quantity:
            </span>
            <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-gray-500">
              Total: <strong className="text-gray-900">{formatPrice(currentPrice * quantity)}</strong>
            </span>
          </div>

          {/* Action CTA Buttons (Desktop) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              disabled={currentStock <= 0}
              onClick={handleAddToCart}
              className="flex-1 py-4 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              disabled={currentStock <= 0}
              onClick={handleBuyNow}
              className="flex-1 py-4 px-6 bg-slate-950 hover:bg-black disabled:bg-gray-400 text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Zap className="w-5 h-5 text-orange-400" />
              <span>Buy Now (Express)</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-4 border border-gray-200 rounded-2xl text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center"
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery & Trust Guarantee Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>2-4 days express courier across Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Manual payment with TID verification</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-orange-600 shrink-0" />
              <span>7-day easy return window</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Product Overview & Specifications
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-12 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Customer Ratings & Reviews
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">{product.rating.toFixed(1)} / 5.0</span>
              <span className="text-xs text-gray-400">({reviewsList.length} reviews)</span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-5 py-2.5 bg-orange-50 text-orange-900 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 self-start transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-orange-600" />
            <span>Write a Customer Review</span>
          </button>
        </div>

        {/* Review Form Modal/Card */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 bg-white border border-orange-200 rounded-2xl shadow-md mb-8 max-w-xl space-y-4 animate-fade-in"
          >
            <h3 className="text-sm font-bold text-gray-900">Share Your Experience with this Item</h3>
            <p className="text-xs text-gray-500">
              Only verified customers with a delivered parcel can submit reviews.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Rating</label>
              <div className="flex gap-1.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Name & City</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="e.g. Bilal Khan (Rawalpindi)"
                className="w-full text-xs p-2.5 border rounded-xl focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Review</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe fabric, battery life, packaging or delivery speed..."
                className="w-full text-xs p-2.5 border rounded-xl focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2.5 border text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.length === 0 ? (
            <p className="text-sm text-gray-500 col-span-2">
              No reviews yet. Be the first Pakistani customer to review this item!
            </p>
          ) : (
            reviewsList.map((rev) => (
              <div key={rev.id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                    Verified Buyer ✓
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{rev.title || 'Review'}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                <p className="text-[11px] text-gray-400 pt-1">
                  By {rev.user_name || 'Customer'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-500 font-semibold block">Total Price</span>
          <span className="text-base font-black text-orange-900">
            {formatPrice(currentPrice * quantity)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentStock <= 0}
            onClick={handleAddToCart}
            className="py-2.5 px-4 bg-orange-500 active:bg-orange-600 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            disabled={currentStock <= 0}
            onClick={handleBuyNow}
            className="py-2.5 px-4 bg-slate-950 active:bg-black disabled:bg-gray-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </>
  );
}
