import React from 'react';
import Link from 'next/link';
import { Scale, ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | BazaarHub Pakistan',
  description: 'Terms of service, payment verification rules, and governing laws of Pakistan for BazaarHub.',
};

export default function TermsConditionsPage() {
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
            <Scale className="w-3.5 h-3.5 text-orange-500" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: October 2026 • Governing law of the Islamic Republic of Pakistan
          </p>
        </div>

        <div className="prose prose-orange max-w-none text-gray-700 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Acceptance & Use of the Site</h2>
            <p>
              By accessing and placing orders through <strong>BazaarHub (bazaarhub.pk)</strong>, you agree to be legally bound by these Terms and Conditions. You agree to use this website only for lawful purposes in accordance with all applicable provincial and federal regulations in Pakistan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Accuracy of Customer Information</h2>
            <p>
              When placing an order or registering an account, you must provide accurate, current, and complete details, including full legal name, active Pakistani phone number, and precise delivery address. Providing fraudulent or falsified details may lead to immediate cancellation of orders and permanent blacklisting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Pricing, Availability & Currency</h2>
            <p>
              All prices displayed on BazaarHub are quoted in <strong>Pakistani Rupees (Rs. / PKR)</strong> inclusive of applicable standard taxes. While we strive for absolute accuracy, product descriptions, stock quantities, and prices may change without prior notice. In the event of a typographical pricing error, BazaarHub reserves the right to cancel or adjust the order before dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Payment Verification Policy (48-Hour Deadline)</h2>
            <p>
              BazaarHub operates on manual payment verification via Bank Account Transfer (IBAN), Easypaisa, and JazzCash. After placing an order, customers must submit a valid Transaction ID (TID) and payment receipt screenshot within <strong>48 hours</strong>. Unpaid or unverified orders after this period will be automatically cancelled and inventory restocked for other shoppers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Order Acceptance & Cancellation Rights</h2>
            <p>
              Receipt of an order confirmation number does not constitute final contract acceptance. BazaarHub reserves the right at any time after receipt of your order to accept, decline, or limit order quantities for any reason, including suspected fraudulent activity or courier non-serviceability in remote areas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">6. Intellectual Property</h2>
            <p>
              All content on BazaarHub, including logos, trademarks, website layout, graphics, text, and product photography, is the intellectual property of BazaarHub or its content licensors and is protected by copyright and intellectual property laws of Pakistan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Pakistani law, BazaarHub will not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use items purchased on this platform. Our maximum aggregate liability shall never exceed the total amount paid by the customer for the specific order in dispute.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">8. Governing Law of Pakistan</h2>
            <p>
              These Terms and Conditions shall be interpreted, construed, and enforced exclusively in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>. Any disputes arising from transactions on this site shall fall under the jurisdiction of the competent courts of Lahore, Pakistan.
            </p>
          </section>

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950">
            For legal inquiries or business partnerships, reach out to <strong>legal@bazaarhub.pk</strong> or our physical office in Gulberg III, Lahore, Pakistan.
          </div>
        </div>
      </div>
    </div>
  );
}

