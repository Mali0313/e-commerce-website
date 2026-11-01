import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Percent,
  TrendingUp,
} from 'lucide-react';
import { getProducts, getCategories } from '@/lib/data/store';
import { ProductCard } from '@/components/products/ProductCard';
import { HeroBannerCarousel } from '@/components/home/HeroBannerCarousel';

export default function HomePage() {
  const categories = getCategories();
  const allProducts = getProducts({ sort: 'newest' });
  const featuredProducts = allProducts.filter((p) => p.is_featured).slice(0, 8);
  const bestSellers = [...allProducts]
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, 8);
  const newArrivals = allProducts.slice(0, 8);

  return (
    <div className="space-y-10 sm:space-y-14 pb-16 bg-gray-50/60 font-sans">
      {/* DARAZ / AMAZON / TRENDIFY STYLE GIANT HERO BANNER CAROUSEL */}
      <HeroBannerCarousel />

      {/* Category Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                Shop by Department
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 ml-4.5 mt-0.5 font-medium">
              Curated everyday essentials for family, home, and tech in Pakistan
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src={cat.image_url || 'https://placehold.co/400x300'}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-5">
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-400">
                  Explore
                </span>
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-orange-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5 hidden sm:block">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                Featured Highlights
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Top rated customer favorites with verified delivery
              </p>
            </div>
          </div>
          <Link
            href="/products?featured=true"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>Browse More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Flash Sale Banner Strip (Trendify Warm Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-orange-500/30">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="bg-amber-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Exclusive Ramadan & Eid Coupon
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Save Extra 20% With Code:{' '}
              <span className="text-amber-300 font-mono underline decoration-amber-400">BAZAAR20</span>
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl font-medium">
              Apply at checkout on any order over Rs. 3,000. Combine with free nationwide shipping on orders over Rs. 5,000!
            </p>
          </div>

          <Link
            href="/products"
            className="z-10 px-7 py-4 bg-white text-gray-950 hover:bg-orange-50 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 shrink-0"
          >
            Use Voucher Now &rarr;
          </Link>

          {/* Decorative background glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                Best Selling in Pakistan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Most ordered by Pakistani shoppers this month
              </p>
            </div>
          </div>
          <Link
            href="/products?sort=popularity"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>See Ranking</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                Fresh New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Latest lifestyle drops, electronics and streetwear essentials
              </p>
            </div>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View All New</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
