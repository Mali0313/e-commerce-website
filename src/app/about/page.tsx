import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, HeartHandshake, ShieldCheck, Truck, Users, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | BazaarHub Pakistan',
  description: 'Learn about BazaarHub, Pakistan’s premier online bazaar for affordable everyday lifestyle essentials.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-900 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Our Story & Mission</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Your Everyday Bazaar, Online.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Bringing the vibrant energy, reliable variety, and unbeatable value of Pakistan&apos;s traditional bazaars directly to your smartphone.
        </p>
      </div>

      {/* Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-16/9 sm:aspect-21/9 shadow-lg border border-gray-200">
        <Image
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80"
          alt="BazaarHub Pakistan Team"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
          <p className="text-white text-base sm:text-xl font-bold max-w-lg">
            Empowering Pakistani households with trustworthy products, transparent prices, and personal customer service.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Honest Bazaar Prices</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We partner directly with leading Pakistani textile mills, leather craftsmen, and tech importers in Lahore, Karachi, and Sialkot to eliminate middleman margins.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Verified Manual Payments</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Zero card compromise risks. You pay directly into our Meezan Bank corporate account or official Easypaisa & JazzCash wallets, with human review within minutes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Nationwide Delivery</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            From Karachi to Khyber, we dispatch daily via TCS, Leopards, and PostEx, offering flat Rs. 250 shipping and free shipping on orders over Rs. 5,000.
          </p>
        </div>
      </div>

      {/* Values Callout */}
      <div className="bg-orange-50 border border-orange-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-orange-950">Join Thousands of Happy Pakistani Shoppers</h2>
        <p className="text-xs sm:text-sm text-orange-900 max-w-xl mx-auto">
          Experience stress-free shopping with 7-day hassle-free returns and dedicated WhatsApp support.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <span>Explore Our Bazaar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

