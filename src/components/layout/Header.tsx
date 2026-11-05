'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Shield,
  X,
  Sparkles,
  ChevronDown,
  Clock,
  TrendingUp,
  MapPin,
  Flame,
  Zap,
  Ticket,
  Truck,
  Store,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { CategoryDrawer } from './CategoryDrawer';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_CATEGORIES } from '@/lib/data/mock-store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, signOut } = useAuth();

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSearch, setCurrentSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Sync client query search string
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentSearch(window.location.search);
    }
  }, [pathname]);

  // Sync selectedCategory dropdown with current category route
  useEffect(() => {
    if (pathname.startsWith('/category/')) {
      const slug = pathname.replace('/category/', '').split('/')[0];
      if (slug === 'mobile-accessories' || slug === 'earbuds-audio' || slug === 'chargers-powerbanks') {
        setSelectedCategory('mobile-accessories');
      } else if (slug === 'men-fashion' || slug === 'women-fashion' || slug === 'kids-clothing' || slug === 'fashion') {
        setSelectedCategory('fashion');
      } else if (slug === 'home-kitchen') {
        setSelectedCategory('home-kitchen');
      } else if (slug === 'beauty-personal-care') {
        setSelectedCategory('beauty-personal-care');
      }
    } else if (pathname === '/') {
      setSelectedCategory('all');
    }
  }, [pathname]);

  // Live search suggestion filter (Smart multi-word and plural/singular matching)
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase().trim();
      const words = q.split(/\s+/).filter(Boolean);

      const matches = INITIAL_PRODUCTS.filter((p) => {
        const fullText = `${p.title} ${p.description} ${p.sku || ''}`.toLowerCase();
        return (
          fullText.includes(q) ||
          words.every((w) => {
            if (fullText.includes(w)) return true;
            if (w.endsWith('s') && w.length > 3 && fullText.includes(w.slice(0, -1))) return true;
            if (!w.endsWith('s') && fullText.includes(w + 's')) return true;
            return false;
          })
        );
      }).slice(0, 6);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Click outside search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setSuggestions([]);

    if (query) {
      const catParam = selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      router.push(`/products?search=${encodeURIComponent(query)}${catParam}`);
    } else if (selectedCategory !== 'all') {
      router.push(`/category/${encodeURIComponent(selectedCategory)}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0f172a] shadow-lg border-b border-slate-800">
        {/* TOP FLASH DEAL ANNOUNCEMENT BAR (Matching Reference Image) */}
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 font-semibold tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Flash Deal Pill & Text */}
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider shrink-0">
                FLASH DEAL
              </span>
              <span className="truncate">
                Mega Bazaar Festival: Extra 20% OFF with code{' '}
                <strong className="underline decoration-yellow-300 text-yellow-200">
                  BAZAAR20
                </strong>
              </span>
            </div>

            {/* Right Trust Indicators */}
            <div className="hidden md:flex items-center gap-5 text-white/90 text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-300" />
                100% Authentic Guarantee
              </span>
              <span className="text-white/40">|</span>
              <Link
                href={isAdmin ? '/admin' : '/login?role=admin'}
                className="hover:text-yellow-200 transition-colors flex items-center gap-1 font-bold"
              >
                <Store className="w-3.5 h-3.5 text-yellow-300" />
                Seller Center
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION BAR (Deep Slate/Charcoal #0f172a with Orange Accents) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-6">
            {/* Mobile Menu & Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="p-2 -ml-2 text-gray-300 hover:text-white rounded-xl lg:hidden focus:outline-none transition-colors"
                aria-label="Open categories menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo (Trendify / Amazon Mall style) */}
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30 group-hover:bg-orange-600 transition-colors">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                      Bazaar<span className="text-orange-500">Hub</span>
                    </span>
                    <span className="text-[9px] bg-amber-400 text-black font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      MALL
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 tracking-wider font-semibold uppercase mt-1 hidden sm:block">
                    Fashion & Everyday • PK
                  </p>
                </div>
              </Link>
            </div>

            {/* Deliver to Pakistan (Amazon / Trendify style location widget) */}
            <div className="hidden xl:flex items-center gap-2 text-left pl-2 shrink-0 cursor-pointer">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-medium leading-none">Deliver to</p>
                <p className="text-xs font-bold text-white leading-tight">Pakistan 75500</p>
              </div>
            </div>

            {/* EXPANDED WIDE SEARCH BAR (Trendify / Amazon Style) */}
            <div
              ref={searchRef}
              className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-2 relative"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center bg-white rounded-xl overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-orange-500 border border-slate-700"
              >
                {/* Category Selector Pill */}
                <div className="relative border-r border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold shrink-0 transition-colors">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-transparent pl-3 pr-7 py-2.5 cursor-pointer focus:outline-none text-xs font-bold text-gray-800"
                    aria-label="Filter category"
                  >
                    <option value="all">All Categories</option>
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Search Text Input */}
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clothes, jeans, kurtas, earbuds, dresses..."
                    className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Big Orange Search Button */}
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 sm:px-6 py-2.5 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm hover:brightness-105"
                  aria-label="Search products"
                  title="Search products"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Live search suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in text-gray-900">
                  <div className="p-2.5 border-b bg-orange-50/70 flex items-center justify-between text-xs text-gray-700 font-semibold">
                    <span className="flex items-center gap-1.5 text-orange-900">
                      <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                      Matching Products for &quot;{searchQuery}&quot;
                    </span>
                    <span className="bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      {suggestions.length} items
                    </span>
                  </div>
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => {
                          setSuggestions([]);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3.5 p-3 hover:bg-orange-50/60 transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <Image
                            src={p.images?.[0]?.image_url || 'https://placehold.co/100x100'}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 truncate">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-orange-600 font-extrabold">
                              {formatPrice(p.price)}
                            </span>
                            {p.compare_at_price && (
                              <span className="text-[11px] text-gray-400 line-through">
                                {formatPrice(p.compare_at_price)}
                              </span>
                            )}
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded capitalize">
                              {p.category?.name || 'Lifestyle'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}${
                      selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''
                    }`}
                    onClick={() => {
                      setSuggestions([]);
                      setSearchQuery('');
                    }}
                    className="block p-3 text-center text-xs font-bold text-orange-600 bg-gray-50 hover:bg-orange-50 transition-colors"
                  >
                    View all results in BazaarHub &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Right Action Icons (Currency, Returns, Wishlist, Cart, Seller Hub) */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-white">
              {/* Currency Selector (PKR) */}
              <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white cursor-pointer px-2 py-1 rounded">
                <span>PKR (Rs.)</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {/* Returns & Orders (Amazon / Trendify Style) */}
              <Link
                href="/account/orders"
                className="hidden sm:flex flex-col text-left px-2 py-1 hover:text-orange-400 transition-colors relative"
              >
                <span className="text-[10px] text-gray-400 leading-none">Returns</span>
                <span className="text-xs font-bold leading-tight flex items-center gap-1">
                  & Orders
                  <span className="bg-orange-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2">
                    2
                  </span>
                </span>
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-white" />
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-black text-[10px] font-black rounded-full h-4.5 min-w-[18px] px-1 flex items-center justify-center shadow-md">
                    {itemCount}
                  </span>
                </div>
                <span className="hidden sm:inline text-xs font-black text-white">
                  Cart
                </span>
              </button>

              {/* Prominent Dashboard Button (Eye-catching Amber/Orange Pill) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-md shadow-amber-500/30 ring-1 ring-amber-300/60 transition-all hover:scale-105 cursor-pointer shrink-0"
                  aria-label="User Dashboard & Hub"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-950 shrink-0" />
                  <span className="font-extrabold tracking-tight">
                    {isAdmin ? 'Admin Dashboard' : user ? 'My Dashboard' : 'Dashboard'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-900 hidden sm:inline" />
                </button>

                {isAccountDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 text-sm animate-fade-in text-gray-900 ring-1 ring-black/5"
                    onClick={() => setIsAccountDropdownOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b bg-gradient-to-r from-orange-50/80 to-amber-50/50">
                          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Signed in as</p>
                          <p className="font-black text-gray-950 truncate text-sm">
                            {user.full_name || 'Valued Shopper'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>

                        <div className="p-2 space-y-1">
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-3 py-2.5 text-orange-600 font-bold hover:bg-orange-50 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-orange-500" />
                            <div className="text-left">
                              <span className="block leading-tight">Customer Dashboard</span>
                              <span className="text-[11px] font-normal text-gray-500">Profile, addresses & overview</span>
                            </div>
                          </Link>

                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-800 hover:bg-gray-100/80 rounded-xl transition-colors font-semibold text-xs"
                          >
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div className="text-left">
                              <span className="block leading-tight">My Orders & Tracking</span>
                              <span className="text-[11px] font-normal text-gray-500">Live courier & delivery status</span>
                            </div>
                          </Link>

                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-3 py-2.5 bg-amber-50/80 text-amber-950 hover:bg-amber-100/80 rounded-xl transition-colors font-bold text-xs border border-amber-200/80 mt-1"
                            >
                              <Shield className="w-4 h-4 text-amber-600" />
                              <div className="text-left">
                                <span className="block leading-tight">Admin Operations Panel</span>
                                <span className="text-[11px] font-normal text-amber-800">Inventory, sales & TCS logistics</span>
                              </div>
                            </Link>
                          )}
                        </div>

                        <div className="border-t my-1.5" />
                        <div className="px-2">
                          <button
                            onClick={() => signOut()}
                            className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold text-xs flex items-center gap-2 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 text-xs text-gray-600 border-b bg-gray-50/60 font-medium">
                          Welcome to BazaarHub Pakistan!
                        </div>
                        <div className="p-2 space-y-1.5">
                          <Link
                            href="/login"
                            className="block w-full py-2.5 text-center font-black text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-md shadow-orange-500/20"
                          >
                            Customer Dashboard Login
                          </Link>
                          <Link
                            href="/login?role=admin"
                            className="block w-full py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                          >
                            Admin & Seller Console Login
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PERMANENT MOBILE SEARCH BAR */}
          <div ref={mobileSearchRef} className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clothes, lawn, earbuds, cookware..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-24 py-2.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-18 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  aria-label="Clear search text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {/* Clickable Mobile Search Button */}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Go</span>
              </button>
            </form>
          </div>
        </div>

        {/* SUB-NAVIGATION BAR (Dark Slate #1e293b with Dynamic Colorful Active Tab) */}
        <div className="border-t border-slate-800 bg-[#1e293b] py-2 text-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
            {/* Left Department Links */}
            <div className="flex items-center gap-2 sm:gap-3 font-semibold overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="flex items-center gap-1.5 text-white hover:text-orange-400 font-bold shrink-0 cursor-pointer px-2.5 py-1 rounded-md hover:bg-slate-800/80 transition-colors mr-1"
              >
                <Menu className="w-4 h-4 text-orange-400" />
                <span>All Categories</span>
              </button>

              {/* Dynamic Categories & Filters with Vibrant Orange Focus Highlight */}
              {[
                {
                  label: 'Flash Sale',
                  href: '/products?sort=popularity&filter=flash-sale',
                  icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
                  isActive: pathname === '/products' && (currentSearch.includes('flash') || currentSearch.includes('sort=popularity')),
                },
                {
                  label: 'Best Sellers',
                  href: '/products?sort=popular&filter=best-sellers',
                  icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
                  isActive: pathname === '/products' && (currentSearch.includes('best-sellers') || currentSearch.includes('sort=popular')),
                },
                {
                  label: "Men's Fashion",
                  href: '/category/men-fashion',
                  isActive: pathname === '/category/men-fashion',
                },
                {
                  label: "Women's Apparel",
                  href: '/category/women-fashion',
                  isActive: pathname === '/category/women-fashion',
                },
                {
                  label: 'Streetwear & Pret',
                  href: '/category/fashion',
                  isActive: pathname === '/category/fashion' || pathname === '/category/kids-clothing',
                },
                {
                  label: 'Mobile Accessories',
                  href: '/category/mobile-accessories',
                  isActive:
                    pathname === '/category/mobile-accessories' ||
                    pathname === '/category/earbuds-audio' ||
                    pathname === '/category/chargers-powerbanks',
                },
                {
                  label: 'Home & Kitchen',
                  href: '/category/home-kitchen',
                  isActive: pathname === '/category/home-kitchen',
                },
                {
                  label: 'Beauty & Care',
                  href: '/category/beauty-personal-care',
                  isActive: pathname === '/category/beauty-personal-care',
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    item.isActive
                      ? 'bg-orange-500 hover:bg-orange-600 text-white font-black px-3 py-1 rounded-md shrink-0 shadow-sm shadow-orange-500/30 ring-1 ring-orange-400/40 transition-all scale-[1.02] flex items-center gap-1.5'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/80 px-2.5 py-1 rounded-md shrink-0 transition-colors flex items-center gap-1.5 font-medium'
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Sub-links (Vouchers & Track Orders) */}
            <div className="hidden lg:flex items-center gap-3 text-gray-300 text-[11px] shrink-0 font-medium">
              <Link
                href="/products?filter=vouchers"
                className={
                  pathname === '/products' && currentSearch.includes('vouchers')
                    ? 'bg-amber-400 text-black font-black px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 transition-all'
                    : 'flex items-center gap-1 hover:text-amber-300 transition-colors text-amber-300 font-bold px-2 py-1 rounded-md hover:bg-slate-800/60'
                }
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Vouchers</span>
              </Link>
              <span className="text-slate-700">|</span>
              <Link
                href="/track-order"
                className={
                  pathname === '/track-order'
                    ? 'bg-orange-500 text-white font-black px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 transition-all'
                    : 'flex items-center gap-1 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-slate-800/60'
                }
              >
                <Truck className="w-3.5 h-3.5 text-orange-400" />
                <span>Track Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Category Drawer */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
    </>
  );
}
