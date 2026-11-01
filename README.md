# BazaarHub - Your Everyday Bazaar, Online 🇵🇰

A complete, production-ready full-stack e-commerce platform built specifically for the **Pakistan market**, powered by **Next.js 16 (App Router)**, **Tailwind CSS**, and **Firebase (Authentication, Cloud Firestore, and Storage)**.

---

## 🌟 Key Features

### 1. Pakistani Market-Tailored Architecture
- **Currency:** Pakistani Rupee (`Rs.` formatted e.g. `Rs. 2,499`) everywhere.
- **Manual Payment Verification:**
  - Bank Account Transfer (Meezan Bank, HBL, UBL, Alfalah, IBAN / Raast).
  - Easypaisa Mobile Wallet.
  - JazzCash Mobile Wallet.
  - After placing orders, customers see explicit account title, account number/IBAN, and bank name.
  - Customers upload their Transaction ID (TID) and payment receipt screenshot directly on their order confirmation page.
  - 48-hour reservation deadline with auto-flagging for admin review.
- **Nationwide Shipping Plan:**
  - Standard flat rate: **Rs. 250** nationwide.
  - **FREE Delivery** on all orders over **Rs. 5,000**.
  - Dynamic free shipping progress bar in cart and drawer.
  - Courier dispatch support (TCS Express, Leopards Courier, PostEx, Trax).
- **Categories (with 20 Sample Seed Products):**
  1. Fashion (Men Kurtas, Women Lawn Suits, Kids Shalwar Kameez)
  2. Home & Kitchen (Granite Cookware, Electric Kettles, Memory Foam Pillows)
  3. Mobile Accessories (AirWave ANC Earbuds, 20,000mAh Power Banks, 65W GaN Chargers, Armor Cases)
  4. Beauty & Personal Care (Vitamin C Serums, 7-Herb Herbal Hair Growth Oil, Matte Lipsticks)

### 2. Mobile-First & Accessible Design
- Designed specifically for **360px width first** and scaled seamlessly to tablet and desktop.
- **Sticky top header** with brand logo, live instant search suggestions, wishlist badge, and cart counter.
- **Bottom navigation bar on mobile** (Home, Categories Drawer, Cart Drawer, Account) with 44px+ tap targets.
- **Slide-up filter drawer** on mobile and desktop sidebar with price range, in-stock, and sort filters.
- **Sticky "Add to Cart" Bar** on mobile product pages.
- **WhatsApp Floating Button** with configurable number (`+92 300 1234567`) and pre-filled inquiry text.
- Emerald Green & White visual identity: Primary green (`#16A34A`), dark green hover (`#166534`), light background (`#F0FDF4`).

---

## 🔥 Connecting to Your Firebase Project

BazaarHub is fully integrated with **Firebase** for:
1. **Firebase Authentication:** Secure customer login, registration, and admin authorization.
2. **Cloud Firestore:** Real-time database for products, categories, orders, user profiles, and coupons.
3. **Firebase Storage:** Uploading payment receipt screenshots and product photography.

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g. `bazaarhub-pk`).

### Step 2: Enable Firebase Services
1. **Authentication:**
   - In the left sidebar, click **Build ➔ Authentication**.
   - Click **Get Started** and enable the **Email/Password** sign-in method.
2. **Firestore Database:**
   - Click **Build ➔ Firestore Database ➔ Create database**.
   - Start in **Test mode** (or configure standard security rules).
3. **Storage:**
   - Click **Build ➔ Storage ➔ Get Started** to enable cloud storage for payment receipts.

### Step 3: Get Web Configuration Keys
1. In Firebase Project Overview, click the **Web icon (`</>`)** to register a web app.
2. Copy the `firebaseConfig` keys into your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...
```

### Step 4: Seed All 20 Pakistani Products into Firestore
We built an automatic seeding endpoint. Once you add your `.env.local` keys, simply run:

```bash
curl -X POST http://localhost:3000/api/seed-firebase
```

This immediately uploads all 20 Pakistani products, categories, settings, and discount coupons directly into your Firestore database!

---

## ⚡ Instant Demo & Local Testing (Zero Setup Required)

Even before connecting your live Firebase project, BazaarHub has a built-in fallback simulation layer:
1. Start dev server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Go to [http://localhost:3000/login](http://localhost:3000/login) and click:
   - **"Demo Admin Portal"** to immediately test the `/admin` dashboard.
   - **"Demo Customer"** to test customer profile and order history.
4. Try coupons at checkout:
   - `WELCOME10` (10% off on orders > Rs. 1,500)
   - `BAZAAR500` (Rs. 500 off on orders > Rs. 4,000)

---

## 📄 License
MIT License. Built for Pakistani shoppers with 💚 by the BazaarHub Team.
