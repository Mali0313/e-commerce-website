'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Boxes,
  Users,
  Star,
  BarChart3,
  Settings,
  Ticket,
  ArrowLeft,
  Shield,
  Menu,
  X,
  LogOut,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders & Payments', href: '/admin/orders', icon: PackageCheck },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Sales Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not admin, provide access gate / demo bypass
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Admin Portal Restricted</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            You must be logged in as an authorized store administrator to access BazaarHub management.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login?role=admin"
              className="w-full py-3 bg-orange-600 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Log In as Administrator
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800"
            aria-label="Toggle admin sidebar"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm tracking-tight flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-orange-400" />
            BazaarHub Admin
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-orange-200 hover:text-white flex items-center gap-1"
        >
          <span>Store</span>
          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 bottom-0 z-40 w-64 bg-slate-950 text-white flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-base shadow-xs">
                B
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight">
                  BazaarHub
                </span>
                <span className="text-[10px] text-orange-400 font-bold block -mt-1 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs font-bold'
                      : 'text-orange-100/80 hover:bg-slate-900/60 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-amber-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to Customer Store</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-orange-400">
            <div className="truncate max-w-[140px]">
              <span className="block text-[10px] text-orange-500">Logged in as</span>
              <span className="font-semibold text-white truncate">{user.email}</span>
            </div>
            <button
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="p-1.5 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Page Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

