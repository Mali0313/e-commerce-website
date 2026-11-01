'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Zap,
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    badge: '✨ MEGA FASHION SALE • UP TO 60% OFF',
    title: 'Autumn & Winter',
    highlight: 'Streetwear Drop',
    subtitle:
      'Heavyweight hoodies, selvedge denim, and oversized statement fits engineered for the modern Pakistani wardrobe.',
    ctaText: 'Explore Drop',
    ctaLink: '/products',
    secondaryCtaText: 'View Flash Deals',
    secondaryCtaLink: '/category/fashion',
    imageUrl:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1800&auto=format&fit=crop&q=85',
  },
  {
    id: 2,
    badge: '✨ RAMADAN & EID FESTIVE PRET',
    title: 'Grand Festive Lawn &',
    highlight: 'Embroidered Kurtas',
    subtitle:
      'Stitched 3-piece digital lawn, Egyptian cotton kurtas & organza dupattas starting from only Rs. 1,699.',
    ctaText: 'Shop Festive Pret',
    ctaLink: '/category/fashion',
    secondaryCtaText: 'View Lawn Deals',
    secondaryCtaLink: '/products',
    imageUrl:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1800&auto=format&fit=crop&q=85',
  },
  {
    id: 3,
    badge: '⚡ TECH MEGA GALA • UP TO 40% OFF',
    title: 'HyperCharge 65W GaN &',
    highlight: 'ANC AirWave Pods',
    subtitle:
      'Super-fast GaN multi-port adapters, 40-hour wireless earbuds & high-capacity 20,000mAh power banks.',
    ctaText: 'Shop Tech Gala',
    ctaLink: '/category/mobile-accessories',
    secondaryCtaText: 'Explore Audio',
    secondaryCtaLink: '/products?category=c0000000-0000-0000-0000-000000000006',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1800&auto=format&fit=crop&q=85',
  },
  {
    id: 4,
    badge: '🍳 FREE DELIVERY OVER RS. 5,000',
    title: 'Granite Cookware Sets &',
    highlight: 'MasterChef Kitchen',
    subtitle:
      'German marble-coated 5-piece cookware, 1.8L stainless steel chai kettles, and silicone tool sets.',
    ctaText: 'Upgrade Kitchen',
    ctaLink: '/category/home-kitchen',
    secondaryCtaText: 'Best Sellers',
    secondaryCtaLink: '/products?sort=popularity',
    imageUrl:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1800&auto=format&fit=crop&q=85',
  },
];

export function HeroBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const active = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full bg-slate-900 pb-4">
      {/* FULL-BLEED / WIDESCREEN HERO BANNER (Matching Reference Image) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4">
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] group flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Images with Cross-Fade */}
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-7000 ease-out"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              {/* Reference-Image Warm Orange Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 via-orange-950/80 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>
          ))}

          {/* Slide Content Overlay */}
          <div className="relative z-20 w-full p-6 sm:p-12 lg:p-16 flex flex-col justify-between h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
            {/* Top Promo Badge (Like "MEGA FASHION SALE • UP TO 60% OFF" in screenshot) */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1.5 bg-orange-500/25 backdrop-blur-md border border-orange-400/50 text-orange-200 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {active.badge}
              </span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="max-w-2xl space-y-3 sm:space-y-4 my-auto">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                {active.title}{' '}
                <span className="text-white block sm:inline">
                  {active.highlight}
                </span>
              </h1>
              <p className="text-xs sm:text-base text-gray-200 line-clamp-3 max-w-xl leading-relaxed font-medium">
                {active.subtitle}
              </p>

              {/* CTAs (Matching "Explore Drop →" & "View Flash Deals" from screenshot) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
                <Link
                  href={active.ctaLink}
                  className="px-6 sm:px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-orange-500/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{active.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={active.secondaryCtaLink}
                  className="px-6 sm:px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {active.secondaryCtaText}
                </Link>
              </div>
            </div>

            {/* Bottom Slider Indicators (Active Orange Bar + Dots) */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? 'w-9 bg-amber-400 shadow-md'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="text-[11px] font-bold text-gray-300 tracking-wider">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </div>
            </div>

            {/* Circular Dark Arrow Controls (Left & Right) */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-xl cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-xl cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Trust Cards Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-3 sm:mt-4">
          <div className="flex items-center gap-3 p-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-white">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black">Rs. 250 Flat Rate</p>
              <p className="text-[11px] text-gray-400">Free over Rs. 5,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-white">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black">Verified Wallets</p>
              <p className="text-[11px] text-gray-400">Easypaisa & JazzCash</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-white">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black">7-Day Easy Returns</p>
              <p className="text-[11px] text-gray-400">Hassle-free exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-white">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black">24/7 Live Support</p>
              <p className="text-[11px] text-gray-400">+92 300 1234567</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
