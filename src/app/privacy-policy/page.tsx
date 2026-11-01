import React from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | BazaarHub Pakistan',
  description: 'How BazaarHub protects your personal information and transaction details in Pakistan.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: October 2026 • Compliant with Pakistani laws & consumer privacy
          </p>
        </div>

        <div className="prose prose-orange max-w-none text-gray-700 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              When you browse or make a purchase on BazaarHub, we collect the necessary details required to fulfill your order:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Contact Information:</strong> Full name, email address, and mobile phone number for order updates.</li>
              <li><strong>Delivery Details:</strong> Street address, city, and province for courier dispatch (TCS, Leopards, PostEx).</li>
              <li><strong>Payment Records:</strong> Transaction IDs (TID) and payment receipt screenshots for manual verification. We never store credit or debit card details.</li>
              <li><strong>Order History:</strong> Past purchases, items, wishlist items, and reviews.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Why We Collect Your Information</h2>
            <p>Your information is used strictly to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Process and ship your orders across Pakistan.</li>
              <li>Verify your manual payments via Bank Transfer, Easypaisa, or JazzCash.</li>
              <li>Provide SMS and email notifications regarding delivery tracking.</li>
              <li>Respond promptly to customer support requests on WhatsApp and email.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Secure Storage & No Selling of Data</h2>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
              <p className="font-bold text-orange-950 text-xs sm:text-sm">
                🛡️ Zero Tolerance For Data Selling:
              </p>
              <p className="text-xs text-orange-900 mt-1">
                BazaarHub will never sell, rent, trade, or distribute your personal contact information to third-party marketing companies or data brokers.
              </p>
            </div>
            <p>
              All customer data is encrypted in transit and securely hosted on PostgreSQL databases with industry-grade Row Level Security (RLS) policies. Payment proof screenshots are stored in private storage buckets accessible exclusively to the account owner and authorized store administrators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Cookies & Local Storage</h2>
            <p>
              We use lightweight browser cookies and localStorage exclusively to preserve your shopping cart, maintain guest sessions, and remember your wishlist preferences without requiring complex tracking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Your Rights to Access or Delete Data</h2>
            <p>
              Under Pakistani data protection best practices, you hold full authority over your personal information. You can request a copy of your stored records, edit your profile, or request complete account and data deletion at any time by emailing <strong>support@bazaarhub.pk</strong>.
            </p>
          </section>

          <div className="p-4 bg-gray-50 rounded-2xl border text-xs text-gray-600">
            Have questions about your privacy? Contact our Data Officer at <strong>support@bazaarhub.pk</strong> or write to BazaarHub Pakistan, Gulberg III, Lahore, Punjab.
          </div>
        </div>
      </div>
    </div>
  );
}

