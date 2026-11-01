'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight, Layers, Tag, ShieldCheck, HelpCircle } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/data/mock-store';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryDrawer({ isOpen, onClose }: CategoryDrawerProps) {
  const pathname = usePathname();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-orange-600 text-white">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-200" />
              <h2 className="text-base font-bold">Categories & Deals</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-orange-100 hover:text-white hover:bg-orange-500 rounded-full transition-colors"
              aria-label="Close categories"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Browse Departments
              </p>
              <div className="space-y-1">
                {INITIAL_CATEGORIES.map((cat) => {
                  const isCatActive = pathname === `/category/${cat.slug}`;
                  return (
                    <div key={cat.id} className="border-b border-gray-100 last:border-0 pb-2">
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={onClose}
                        className={`flex items-center justify-between py-2 px-2.5 rounded-lg text-sm transition-colors ${
                          isCatActive
                            ? 'bg-orange-500 text-white font-bold shadow-xs'
                            : 'font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ChevronRight className={`w-4 h-4 ${isCatActive ? 'text-white' : 'text-gray-400'}`} />
                      </Link>

                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-4 pr-1 py-1 space-y-1">
                          {cat.subcategories.map((sub) => {
                            const isSubActive = pathname === `/category/${sub.slug}`;
                            return (
                              <Link
                                key={sub.id}
                                href={`/category/${sub.slug}`}
                                onClick={onClose}
                                className={`block py-1.5 px-2 rounded text-xs transition-colors ${
                                  isSubActive
                                    ? 'bg-orange-500 text-white font-bold shadow-xs'
                                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                                }`}
                              >
                                • {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Quick Shortcuts
              </p>
              <div className="space-y-1 text-sm">
                <Link
                  href="/products?featured=true"
                  onClick={onClose}
                  className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium"
                >
                  <Tag className="w-4 h-4 text-orange-500" />
                  <span>Featured Deals</span>
                </Link>
                <Link
                  href="/shipping-policy"
                  onClick={onClose}
                  className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>Delivery & Policies</span>
                </Link>
                <Link
                  href="/faq"
                  onClick={onClose}
                  className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium"
                >
                  <HelpCircle className="w-4 h-4 text-orange-500" />
                  <span>Help & FAQs</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 text-center">
            BazaarHub Pakistan — Delivering nationwide via TCS, Leopards & PostEx.
          </div>
        </div>
      </div>
    </div>
  );
}
