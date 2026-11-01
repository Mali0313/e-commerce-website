'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createOrUpdateUserDoc, getUserProfile } from '@/lib/firebase/service';
import { Role } from '@/types';

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string, phone: string) => Promise<{ success: boolean }>;
  setDemoUser: (role: 'admin' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'bazaarhub_auth_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check local session & Firebase Auth State Listener
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse local auth user', e);
    }

    // Firebase Auth Listener
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const profile = await getUserProfile(fbUser.uid);
          const role: Role =
            profile?.role ||
            (fbUser.email?.includes('admin') ? 'admin' : 'customer');

          const authUser: AuthUser = {
            id: fbUser.uid,
            email: fbUser.email || '',
            full_name: profile?.full_name || fbUser.displayName || 'Customer',
            phone: profile?.phone || '',
            role,
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        }
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    // Fast-path demo accounts
    if (cleanEmail === 'admin@bazaarhub.pk' || cleanEmail.includes('admin')) {
      const adminUser: AuthUser = {
        id: 'usr-admin-01',
        email: cleanEmail,
        full_name: 'Store Administrator',
        phone: '+92 300 1234567',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      setIsLoading(false);
      return { success: true };
    }

    // Try Firebase Auth
    if (password) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        if (cred.user) {
          const profile = await getUserProfile(cred.user.uid);
          const role: Role = profile?.role || 'customer';
          const authUser: AuthUser = {
            id: cred.user.uid,
            email: cred.user.email || cleanEmail,
            full_name: profile?.full_name || cred.user.displayName || 'Customer',
            role,
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        // If Firebase API key is still placeholder, fallback smoothly to demo login
        if (err.code === 'auth/invalid-api-key' || err.code === 'auth/network-request-failed') {
          console.warn('Firebase key not configured, using local fallback.');
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setIsLoading(false);
          return { success: false, error: 'Invalid email or password.' };
        }
      }
    }

    // Fallback Customer session
    const customerUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0].replace('.', ' '),
      phone: '+92 321 0000000',
      role: 'customer',
    };
    setUser(customerUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customerUser));
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (
    email: string,
    password?: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    if (password) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (cred.user) {
          await updateFirebaseProfile(cred.user, { displayName: fullName || 'Customer' });
          await createOrUpdateUserDoc(cred.user.uid, {
            email: cleanEmail,
            full_name: fullName || 'Customer',
            role: cleanEmail.includes('admin') ? 'admin' : 'customer',
          });

          const authUser: AuthUser = {
            id: cred.user.uid,
            email: cleanEmail,
            full_name: fullName || 'Customer',
            role: cleanEmail.includes('admin') ? 'admin' : 'customer',
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setIsLoading(false);
          return { success: false, error: 'An account with this email already exists.' };
        }
      }
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: fullName || 'Valued Customer',
      role: 'customer',
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = async (fullName: string, phone: string) => {
    if (!user) return { success: false };
    const updated = { ...user, full_name: fullName, phone };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        await updateFirebaseProfile(auth.currentUser, { displayName: fullName });
        await createOrUpdateUserDoc(auth.currentUser.uid, {
          email: user.email,
          full_name: fullName,
          phone,
          role: user.role,
        });
      } catch (e) {
        console.error('Firebase profile update error', e);
      }
    }
    return { success: true };
  };

  const setDemoUser = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      const admin: AuthUser = {
        id: 'usr-admin-01',
        email: 'admin@bazaarhub.pk',
        full_name: 'Store Administrator',
        phone: '+92 300 1234567',
        role: 'admin',
      };
      setUser(admin);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin));
    } else {
      const customer: AuthUser = {
        id: 'usr-customer-01',
        email: 'customer@bazaarhub.pk',
        full_name: 'Hamza Malik (Lahore)',
        phone: '+92 321 4455667',
        role: 'customer',
      };
      setUser(customer);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customer));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
