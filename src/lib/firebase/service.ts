import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_COUPONS,
} from '@/lib/data/mock-store';
import { Product, Order, Role } from '@/types';

// Users / Profiles
export async function createOrUpdateUserDoc(uid: string, data: { email: string; full_name?: string; phone?: string; role?: Role }) {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        ...data,
        role: data.role || (data.email.includes('admin') ? 'admin' : 'customer'),
        created_at: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error('Firestore user save error:', e);
  }
}

export async function getUserProfile(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (e) {
    console.error('Firestore get user error:', e);
  }
  return null;
}

// Orders
export async function saveOrderToFirestore(order: Order) {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, order);
    return true;
  } catch (e) {
    console.error('Firestore save order error:', e);
    return false;
  }
}

// Seed all 20 sample products & categories to Firestore
export async function seedFirestore() {
  try {
    // 1. Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // 2. Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), prod);
    }

    // 3. Settings
    await setDoc(doc(db, 'settings', 'store_settings'), INITIAL_SETTINGS);

    // 4. Coupons
    for (const coupon of INITIAL_COUPONS) {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
    }

    return { success: true, count: INITIAL_PRODUCTS.length };
  } catch (error: any) {
    console.error('Firestore seed error:', error);
    return { success: false, error: error.message };
  }
}

