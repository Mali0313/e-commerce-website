'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role');

  const { signIn, signUp, setDemoUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(defaultRole === 'admin' ? 'admin@bazaarhub.pk' : '');
  const [password, setPassword] = useState(defaultRole === 'admin' ? 'admin123' : '');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const res = await signUp(email, password, fullName);
      if (res.success) {
        success('Account created successfully! Welcome to BazaarHub.');
        router.push('/account');
      } else {
        toastError(res.error || 'Sign up failed');
      }
    } else {
      const res = await signIn(email, password);
      if (res.success) {
        success('Signed in successfully!');
        if (email.includes('admin') || defaultRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        toastError(res.error || 'Invalid credentials');
      }
    }
    setIsLoading(false);
  };

  const handleDemoLogin = (role: 'admin' | 'customer') => {
    setDemoUser(role);
    success(`Logged in as Demo ${role === 'admin' ? 'Administrator' : 'Customer'}!`);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 font-sans">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            {defaultRole === 'admin' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {defaultRole === 'admin'
              ? 'Admin / Seller Hub Login'
              : isSignUp
              ? 'Create a BazaarHub Account'
              : 'Sign In to BazaarHub MALL'}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {defaultRole === 'admin'
              ? 'Authorized store administrators only'
              : 'Track orders, save Pakistani addresses, and earn member discounts'}
          </p>
        </div>

        {/* Demo Fast Logins */}
        <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-900 block text-center">
            ⚡ 1-Click Fast Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="py-2.5 px-3 bg-white hover:bg-orange-100/50 border border-orange-300 text-orange-950 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
            >
              Demo Admin Portal
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        {defaultRole !== 'admin' && (
          <div className="flex border rounded-xl p-1 bg-gray-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                !isSignUp ? 'bg-white text-orange-950 shadow-sm font-black' : 'text-gray-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                isSignUp ? 'bg-white text-orange-950 shadow-sm font-black' : 'text-gray-500'
              }`}
            >
              Register
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Asad Ullah"
                  className="w-full text-xs p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.pk"
                className="w-full text-xs p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              {!isSignUp && (
                <Link href="/contact" className="text-[11px] text-orange-600 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>{isLoading ? 'Processing...' : isSignUp ? 'Create Free Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t">
          <span>Just browsing as a guest? </span>
          <Link href="/products" className="text-orange-600 font-bold hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading auth portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
