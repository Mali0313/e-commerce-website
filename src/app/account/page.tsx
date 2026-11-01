'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Clock,
  Truck,
  Eye,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Phone,
  Mail,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { getOrders, getProducts } from '@/lib/data/store';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Address, Order, Product } from '@/types';

type ActiveTab = 'overview' | 'orders' | 'addresses' | 'profile' | 'wishlist';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, signOut, updateProfile, setDemoUser } = useAuth();
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Profile edit state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '0300-1234567');
  const [city, setCity] = useState('Lahore');

  // Saved addresses state (Pakistani addresses)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-1',
      user_id: user?.id || 'usr-1',
      full_name: user?.full_name || 'Hamza Malik',
      phone: '0321-4455667',
      province: 'Punjab',
      city: 'Lahore',
      street_address: 'House 42-A, Sector Y, Phase 3, DHA',
      is_default: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'addr-2',
      user_id: user?.id || 'usr-1',
      full_name: user?.full_name || 'Hamza Malik',
      phone: '0300-9876543',
      province: 'Sindh',
      city: 'Karachi',
      street_address: 'Apartment 5B, Clifton Block 4',
      is_default: false,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrProvince, setNewAddrProvince] = useState('Punjab');
  const [newAddrCity, setNewAddrCity] = useState('Lahore');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  // Fetch orders and catalog products
  const allOrders = useMemo(() => getOrders(), []);
  const allProducts = useMemo(() => getProducts(), []);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter((p) => wishlistIds.includes(p.id));
  }, [allProducts, wishlistIds]);

  const userOrders = useMemo(() => {
    return allOrders.filter(
      (o) => !user || o.user_id === user.id || o.shipping_address?.email === user.email || !o.user_id
    );
  }, [allOrders, user]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return userOrders;
    return userOrders.filter((o) => o.status === orderFilter);
  }, [userOrders, orderFilter]);

  // Active / in-progress order
  const activeOrder = useMemo(() => {
    return (
      userOrders.find((o) => ['pending_payment', 'payment_verified', 'shipped'].includes(o.status)) ||
      userOrders[0]
    );
  }, [userOrders]);

  const pendingPaymentsCount = useMemo(() => {
    return userOrders.filter((o) => o.status === 'pending_payment').length;
  }, [userOrders]);

  const recommendedProducts = useMemo(() => {
    return getProducts({ featured: true }).slice(0, 4);
  }, []);

  const getPaymentMethodLabel = (ord: Order) => {
    const method = ord.payments?.[0]?.payment_method || 'bank_transfer';
    return method.replace('_', ' ');
  };

  const handleAddToCart = (p: Product) => {
    addItem({
      product_id: p.id,
      title: p.title,
      price: p.price,
      compare_at_price: p.compare_at_price,
      quantity: 1,
      image_url: p.images?.[0]?.image_url || '',
      slug: p.slug,
      stock_quantity: p.stock_quantity,
    });
    success('Added to your shopping cart!');
  };

  // Demo user fallback if not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-900 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Customer Dashboard
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Please sign in to track your real-time parcel delivery status, verify payment receipts, manage saved Pakistani shipping addresses, and view your wishlist.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition-all"
          >
            Sign In with Email / Firebase
          </Link>
          <button
            type="button"
            onClick={() => setDemoUser('customer')}
            className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>⚡ View Customer Dashboard</span>
          </button>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Continue as Guest
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(fullName, phone);
    success('Profile updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) {
      toastError('Please enter a street address');
      return;
    }
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      user_id: user.id,
      full_name: newAddrName || user.full_name,
      phone: newAddrPhone || user.phone || '0300-1234567',
      province: newAddrProvince,
      city: newAddrCity,
      street_address: newAddrStreet,
      is_default: addresses.length === 0,
      created_at: new Date().toISOString(),
    };
    setAddresses([...addresses, newAddr]);
    setShowAddAddress(false);
    setNewAddrStreet('');
    setNewAddrName('');
    setNewAddrPhone('');
    success('New Pakistani delivery address saved!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    success('Address removed.');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        is_default: a.id === id,
      }))
    );
    success('Default shipping address updated.');
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      {/* Top Profile Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white py-8 sm:py-12 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Info Avatar Row */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-500/20 backdrop-blur-md border-2 border-orange-400/40 text-orange-400 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shrink-0">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                    Assalam-o-Alaikum, {user.full_name?.split(' ')[0] || 'Valued Shopper'}!
                  </h1>
                  <span className="bg-orange-500/80 border border-orange-400/50 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span>🇵🇰</span> Verified Shopper
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 font-medium flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  {user.email}
                  <span className="text-gray-500">•</span>
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  {user.phone || '+92 300 1234567'}
                </p>
                <p className="text-[11px] text-gray-400">
                  Firebase Connected • Member since 2026
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Shield className="w-4 h-4 text-black" />
                  <span>Admin Portal</span>
                </Link>
              )}
              <Link
                href="/products"
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-orange-500/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Today</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  router.push('/');
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-rose-600 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* 4 Quick Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => setActiveTab('orders')}
              className="text-left bg-slate-900/80 hover:bg-slate-900 border border-slate-700 p-4 rounded-2xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">Total Orders</span>
                <Package className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                {userOrders.length}
              </p>
              <span className="text-[11px] text-orange-400 font-medium">View all parcel history &rarr;</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('pending_payment');
              }}
              className="text-left bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 p-4 rounded-2xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-200">Pending Verification</span>
                <Clock className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                {pendingPaymentsCount}
              </p>
              <span className="text-[11px] text-amber-200 font-medium">
                {pendingPaymentsCount > 0 ? 'Requires TID / Receipt' : 'All payments settled'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className="text-left bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 p-4 rounded-2xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-200">Wishlist Items</span>
                <Heart className="w-4 h-4 text-rose-300 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                {wishlistIds.length}
              </p>
              <span className="text-[11px] text-orange-200 font-medium">Saved favorites &rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className="text-left bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 p-4 rounded-2xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-200">Saved Addresses</span>
                <MapPin className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                {addresses.length}
              </p>
              <span className="text-[11px] text-orange-200 font-medium">Punjab, Sindh & KPK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar mb-6 sm:mb-8 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistIds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Active Order Live Tracker Stepper Banner (If user has an active order) */}
            {activeOrder && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                  <div>
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-1 rounded-md">
                      Latest Order Live Status
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-2">
                      Order #{activeOrder.order_number}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {formatDateTime(activeOrder.created_at)} • Total:{' '}
                      <strong className="text-orange-600 font-black">
                        {formatPrice(activeOrder.total_amount)}
                      </strong>{' '}
                      via{' '}
                      <span className="capitalize font-semibold text-gray-800">
                        {getPaymentMethodLabel(activeOrder)}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/order-confirmation/${activeOrder.order_number}`}
                    className="self-start sm:self-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Receipt & Payment Instructions</span>
                  </Link>
                </div>

                {/* 4-Step Visual Progress Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Step 1: Placed */}
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-orange-900">1. Order Placed</p>
                        <p className="text-[10px] text-gray-400">Order recorded</p>
                      </div>
                    </div>

                    {/* Step 2: Payment Verified */}
                    <div className="text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mx-auto shadow-sm ${
                          ['payment_verified', 'shipped', 'delivered'].includes(activeOrder.status)
                            ? 'bg-orange-500 text-white'
                            : 'bg-amber-100 text-amber-800 border-2 border-amber-400 animate-pulse'
                        }`}
                      >
                        {['payment_verified', 'shipped', 'delivered'].includes(activeOrder.status) ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">2. Payment Verification</p>
                        <p className="text-[10px] text-gray-400">
                          {['payment_verified', 'shipped', 'delivered'].includes(activeOrder.status)
                            ? 'TID Verified ✓'
                            : 'Pending TID proof'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Dispatched */}
                    <div className="text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mx-auto shadow-sm ${
                          ['shipped', 'delivered'].includes(activeOrder.status)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">3. Handed to Courier</p>
                        <p className="text-[10px] text-gray-400">
                          {activeOrder.tracking_number
                            ? `TCS: ${activeOrder.tracking_number}`
                            : 'TCS / Leopards'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mx-auto shadow-sm ${
                          activeOrder.status === 'delivered'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">4. Delivered</p>
                        <p className="text-[10px] text-gray-400">Doorstep delivery</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* If payment is pending, show high-impact alert */}
                {activeOrder.status === 'pending_payment' && (
                  <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">
                          Payment screenshot or Transaction ID (TID) needed
                        </p>
                        <p className="text-[11px] text-amber-700">
                          Please transfer {formatPrice(activeOrder.total_amount)} to Meezan Bank, Easypaisa, or JazzCash within 48 hours to confirm dispatch.
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/order-confirmation/${activeOrder.order_number}`}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
                    >
                      Upload Proof Now &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Two Column Layout: Recent Orders + Quick Default Address */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left 2 Cols: Recent Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-900 cursor-pointer"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                {userOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-gray-200 hover:border-orange-500/50 hover:bg-orange-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative border border-gray-200">
                            <Image
                              src={ord.items?.[0]?.image_url || 'https://placehold.co/100x100'}
                              alt="order item"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-mono font-bold text-orange-900">
                              #{ord.order_number}
                            </p>
                            <p className="text-xs font-bold text-gray-900 mt-0.5">
                              {ord.items?.length || 1} Item(s) •{' '}
                              <span className="text-orange-600">
                                {formatPrice(ord.total_amount)}
                              </span>
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {formatDateTime(ord.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-auto">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                              ord.status === 'delivered'
                                ? 'bg-orange-100 text-orange-900'
                                : ord.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'payment_verified'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {ord.status.replace('_', ' ')}
                          </span>
                          <Link
                            href={`/order-confirmation/${ord.order_number}`}
                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="View receipt"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col: Default Address & Quick Support Card */}
              <div className="space-y-6">
                {/* Default Address */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      Default Delivery Address
                    </h3>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>

                  {addresses.find((a) => a.is_default) ? (
                    <div className="text-xs space-y-1.5 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="font-bold text-gray-900">
                        {addresses.find((a) => a.is_default)?.full_name}
                      </p>
                      <p>{addresses.find((a) => a.is_default)?.street_address}</p>
                      <p>
                        {addresses.find((a) => a.is_default)?.city},{' '}
                        {addresses.find((a) => a.is_default)?.province}
                      </p>
                      <p className="text-gray-500 font-mono">
                        {addresses.find((a) => a.is_default)?.phone}
                      </p>
                      <span className="inline-block mt-2 text-[10px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded">
                        Primary Pakistani Address
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No default address saved yet.</p>
                  )}
                </div>

                {/* Direct Help WhatsApp Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Need Assistance?
                  </span>
                  <h4 className="font-extrabold text-base mt-1">BazaarHub Helpline</h4>
                  <p className="text-xs text-orange-200 mt-1 leading-relaxed">
                    Have questions about order verification, bank transfers or returns? Our Lahore & Karachi support team is live.
                  </p>
                  <a
                    href="https://wa.me/923001234567?text=Hello%20BazaarHub%20Support,%20I%20need%20help%20with%20my%20account."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-950 rounded-xl text-xs font-bold shadow-xs hover:bg-orange-50 transition-colors"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Recommended Products Showcase */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Recommended For You
                  </h3>
                  <p className="text-xs text-gray-500">
                    Trending lifestyle picks with flat rate Rs. 250 delivery
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-xs font-bold text-orange-600 hover:text-orange-900"
                >
                  View Catalog &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-lg transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                        <Image
                          src={p.images?.[0]?.image_url || 'https://placehold.co/300x300'}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="text-xs font-bold text-gray-900 group-hover:text-orange-600 line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs font-black text-orange-600 mt-1">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="mt-3 w-full py-1.5 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-900 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
              <span className="text-gray-400 font-medium">Filter:</span>
              {['all', 'pending_payment', 'payment_verified', 'shipped', 'delivered', 'cancelled'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-full capitalize whitespace-nowrap cursor-pointer transition-colors ${
                      orderFilter === st
                        ? 'bg-orange-600 text-white font-bold'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-900">No matching orders found</h4>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  {orderFilter !== 'all'
                    ? `You don't have any orders with status "${orderFilter.replace('_', ' ')}"`
                    : 'Your orders will appear here as soon as you shop.'}
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
                >
                  Explore BazaarHub Products
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs p-5 sm:p-7 space-y-4"
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-orange-900 bg-orange-50 px-2.5 py-1 rounded-md">
                          #{ord.order_number}
                        </span>
                        <span className="text-xs text-gray-400 ml-3">
                          Placed on {formatDateTime(ord.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                            ord.status === 'delivered'
                              ? 'bg-orange-100 text-orange-900'
                              : ord.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.status === 'payment_verified'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>

                        <Link
                          href={`/order-confirmation/${ord.order_number}`}
                          className="px-3.5 py-1.5 border border-gray-300 hover:border-orange-500 hover:text-orange-600 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Receipt & Tracking</span>
                        </Link>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="divide-y divide-gray-100 text-xs">
                      {ord.items?.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              <Image
                                src={item.image_url || 'https://placehold.co/100x100'}
                                alt={item.product_title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{item.product_title}</p>
                              <p className="text-gray-400 text-[11px]">
                                Qty: {item.quantity}{' '}
                                {item.variant_title ? `• Variant: ${item.variant_title}` : ''}
                              </p>
                            </div>
                          </div>
                          <span className="font-extrabold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer: Total and Courier Info */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70 p-4 rounded-2xl text-xs">
                      <div>
                        {ord.tracking_number ? (
                          <p className="text-blue-900 font-semibold flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-blue-600" />
                            Courier: <span className="font-bold">{ord.courier_name || 'TCS Express'}</span> • Tracking:{' '}
                            <span className="font-mono font-bold">{ord.tracking_number}</span>
                          </p>
                        ) : (
                          <p className="text-gray-500">
                            Payment Method:{' '}
                            <span className="font-bold text-gray-800 capitalize">
                              {getPaymentMethodLabel(ord)}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-gray-500 mr-2">Grand Total:</span>
                        <span className="text-sm sm:text-base font-black text-orange-600">
                          {formatPrice(ord.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Pakistani Delivery Addresses
                </h3>
                <p className="text-xs text-gray-500">
                  Manage your home and office shipping locations across Pakistan
                </p>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Add Address Form Accordion */}
            {showAddAddress && (
              <form
                onSubmit={handleAddAddress}
                className="bg-white rounded-3xl border-2 border-orange-500/30 p-6 sm:p-8 space-y-4 shadow-md"
              >
                <h4 className="text-sm font-bold text-gray-900">Add New Shipping Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Recipient Name
                    </label>
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      placeholder="e.g. Hamza Malik"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone Number (for Courier SMS)
                    </label>
                    <input
                      type="text"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Province / Region
                    </label>
                    <select
                      value={newAddrProvince}
                      onChange={(e) => setNewAddrProvince(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital Territory">
                        Islamabad Capital Territory
                      </option>
                      <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      placeholder="e.g. Lahore, Karachi, Rawalpindi"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Complete Street Address (House #, Street, Sector / Area)
                    </label>
                    <textarea
                      rows={2}
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      placeholder="e.g. House 42-A, Street 5, Sector F-8/2"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-3xl border p-6 space-y-3 relative shadow-xs transition-all ${
                    addr.is_default
                      ? 'border-orange-500 ring-2 ring-orange-500/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-gray-900">{addr.full_name}</span>
                    {addr.is_default ? (
                      <span className="bg-orange-100 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[11px] text-gray-500 hover:text-orange-600 font-bold cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{addr.street_address}</p>
                  <p className="text-xs text-gray-600 font-medium">
                    {addr.city}, {addr.province}
                  </p>
                  <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {addr.phone}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-gray-900">Profile & Account Settings</h3>
              <p className="text-xs text-gray-500">
                Update your personal info and manage your Firebase credentials
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-orange-600 font-semibold mt-1 inline-block">
                  ✓ Verified Firebase Auth Email
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Phone (Pakistani SIM)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-gray-900">My Saved Wishlist</h3>
              <p className="text-xs text-gray-500">
                Items you have bookmarked for later purchase
              </p>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto">
                <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-900">Your wishlist is empty</h4>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  Save items you love by tapping the heart icon on any product page.
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
                >
                  Explore BazaarHub Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlistProducts.map((item: Product) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all p-3 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                        <Image
                          src={item.images?.[0]?.image_url || 'https://placehold.co/300x300'}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-xs font-bold text-gray-900 group-hover:text-orange-600 line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs font-black text-orange-600 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          handleAddToCart(item);
                          toggleWishlist(item.id);
                        }}
                        className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
