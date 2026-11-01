'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, CheckCircle, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function Footer() {
  const { success } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      success('Thank you! You have subscribed to BazaarHub weekly exclusive deals.');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-300 pt-12 pb-24 lg:pb-12 mt-16 font-sans">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Nationwide Delivery</h4>
              <p className="text-xs text-gray-400">2-4 days major cities across PK</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Manual Payment</h4>
              <p className="text-xs text-gray-400">Bank Transfer, Easypaisa, JazzCash</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-gray-400">Hassle-free replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Quality</h4>
              <p className="text-xs text-gray-400">Authentic everyday lifestyle items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30">
                B
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Bazaar<span className="text-orange-500">Hub</span>
                <span className="text-[10px] ml-1.5 bg-amber-400 text-black font-black px-1.5 py-0.5 rounded uppercase">
                  MALL
                </span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-medium">
              BazaarHub is Pakistan&apos;s trusted everyday online bazaar and fashion mall. We curate the best value in streetwear, lawn pret, kitchen appliances, mobile gadgets, and organic skincare with reliable delivery nationwide.
            </p>

            <div className="space-y-2 text-xs text-gray-400 pt-2 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Gulberg III, Lahore, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+92 300 1234567 (24/7 WhatsApp & Calls)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>support@bazaarhub.pk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Shop Departments
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/category/fashion" className="hover:text-orange-400 transition-colors">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link href="/category/home-kitchen" className="hover:text-orange-400 transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/category/mobile-accessories" className="hover:text-orange-400 transition-colors">
                  Mobile Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/beauty-personal-care" className="hover:text-orange-400 transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-orange-400 transition-colors">
                  All 20 Seed Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/track-order" className="hover:text-orange-400 transition-colors">
                  Track Your Parcel
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  About BazaarHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Store Policies
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-orange-400 transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy" className="hover:text-orange-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-orange-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Payment Methods Support Banner */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-b border-slate-800">
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              Join the BazaarHub Newsletter
            </h4>
            <p className="text-xs text-gray-400">
              Receive weekly flash discounts, new streetwear drops, and special vouchers directly in your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="mt-3 flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-orange-500/30 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-xs font-semibold text-gray-400 mb-2">
              Verified Manual Payment Methods Accepted:
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Meezan Bank / IBAN
              </span>
              <span className="px-3 py-1.5 bg-[#00A651]/20 border border-[#00A651]/40 rounded-lg text-xs font-bold text-orange-400">
                Easypaisa
              </span>
              <span className="px-3 py-1.5 bg-[#FF0000]/20 border border-[#FF0000]/40 rounded-lg text-xs font-bold text-rose-400">
                JazzCash
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-2">
              Secure manual verification with Transaction ID & screenshot upload.
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>&copy; {new Date().getFullYear()} BazaarHub.pk. All rights reserved.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Engineered for Pakistani Shoppers with 🧡 across Lahore, Karachi & Islamabad.
          </p>
        </div>
      </div>
    </footer>
  );
}
