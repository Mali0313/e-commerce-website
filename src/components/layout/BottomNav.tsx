'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CategoryDrawer } from './CategoryDrawer';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { user } = useAuth();
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Hide bottom nav on admin pages or checkout to keep checkout focused
  if (pathname.startsWith('/admin') || pathname === '/checkout') {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.2)] text-white"
      >
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              'flex flex-col items-center justify-center min-h-[44px] text-xs font-semibold transition-colors',
              pathname === '/'
                ? 'text-orange-400 font-bold'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <Home className="w-5 h-5 mb-1" />
            <span>Home</span>
          </Link>

          {/* Categories */}
          <button
            type="button"
            onClick={() => setIsCategoryDrawerOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center min-h-[44px] text-xs font-semibold transition-colors cursor-pointer',
              pathname.startsWith('/category')
                ? 'text-orange-400 font-bold'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <Grid className="w-5 h-5 mb-1" />
            <span>Categories</span>
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-semibold text-gray-400 hover:text-white relative transition-colors cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-1" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-black text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>

          {/* Account */}
          <Link
            href={user ? '/account' : '/login'}
            className={cn(
              'flex flex-col items-center justify-center min-h-[44px] text-xs font-semibold transition-colors',
              pathname.startsWith('/account') || pathname === '/login'
                ? 'text-orange-400 font-bold'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <User className="w-5 h-5 mb-1" />
            <span>{user ? 'Dashboard' : 'Login'}</span>
          </Link>
        </div>
      </nav>

      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
    </>
  );
}
