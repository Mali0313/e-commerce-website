import React from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Return & Refund Policy | BazaarHub Pakistan',
  description: '7-day hassle-free returns and money-back guarantee for Pakistani shoppers at BazaarHub.',
};

export default function ReturnRefundPolicyPage() {
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
            <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
            <span>Customer Protection Guarantee</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Return & Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: October 2026 • Valid nationwide in Pakistan
          </p>
        </div>

        <div className="prose prose-orange max-w-none text-gray-700 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. 7-Day Hassle-Free Return Window</h2>
            <p>
              At BazaarHub, we prioritize your satisfaction. You can initiate a return within <strong>7 days from the delivery date</strong> if you are unsatisfied with your purchase. To be eligible for a return:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>The item must be completely unused, unwashed, and in the same brand-new condition as received.</li>
              <li>The original product packaging, tags, barcodes, and any included accessories must remain intact.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Damaged, Defective or Incorrect Items (48-Hour Notice)</h2>
            <p>
              If your parcel arrives damaged, defective, or contains the wrong product or size, <strong>BazaarHub will replace or refund the order at zero additional cost to you</strong>.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
              ⚠️ <strong>Important Requirement:</strong> You must report the issue to our support team within <strong>48 hours of delivery</strong> with clear unboxing photos/video and your order number.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Non-Returnable Items</h2>
            <p>
              For hygiene and health safety compliance, the following categories cannot be returned or refunded once delivered:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Opened or unsealed beauty, skincare, hair care, cosmetics, and personal grooming products.</li>
              <li>Innerwear, lingerie, and undergarments.</li>
              <li>Final clearance and flash sale liquidation items marked as non-returnable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Refund Methods & Timelines (5-7 Working Days)</h2>
            <p>
              Once your returned package is received at our Lahore fulfillment hub and passes quality inspection, your refund will be processed within <strong>5 to 7 working days</strong>.
            </p>
            <p>
              Refunds are transferred directly to your preferred Pakistani account:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose my-3">
              <div className="p-3 bg-gray-50 border rounded-xl text-center">
                <span className="font-bold text-xs text-gray-800 block">Bank Account / IBAN</span>
                <span className="text-[11px] text-gray-500">Meezan, HBL, UBL, etc.</span>
              </div>
              <div className="p-3 bg-[#00A651]/10 border border-[#00A651]/30 rounded-xl text-center">
                <span className="font-bold text-xs text-[#00A651] block">Easypaisa</span>
                <span className="text-[11px] text-gray-500">Mobile Wallet Transfer</span>
              </div>
              <div className="p-3 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-xl text-center">
                <span className="font-bold text-xs text-[#FF0000] block">JazzCash</span>
                <span className="text-[11px] text-gray-500">Mobile Wallet Transfer</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Return Shipping Costs</h2>
            <p>
              Return courier charges are the responsibility of the customer, unless the item was received defective, damaged, or incorrect due to our error, in which case BazaarHub reimburses the standard courier cost.
            </p>
          </section>

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950">
            To start a return, send your order number and photos to our returns desk via WhatsApp at <strong>+92 300 1234567</strong> or email <strong>support@bazaarhub.pk</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

