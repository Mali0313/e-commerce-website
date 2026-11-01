import React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | BazaarHub Pakistan',
  description: 'Nationwide shipping rates, delivery timelines, and courier partners for BazaarHub shoppers in Pakistan.',
};

export default function ShippingPolicyPage() {
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
            <Truck className="w-3.5 h-3.5 text-orange-500" />
            <span>Nationwide Logistics</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: October 2026 • Effective across Pakistan
          </p>
        </div>

        <div className="prose prose-orange max-w-none text-gray-700 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Order Processing Time</h2>
            <p>
              All orders at BazaarHub undergo manual payment verification (via Bank Transfer, Easypaisa, or JazzCash). Once your payment proof is verified by our accounts team, your order is prepared, packed, and dispatched within <strong>1 to 2 working days</strong> (excluding Sundays and national gazetted holidays).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Delivery Timelines Across Pakistan</h2>
            <p>
              We partner with Pakistan&apos;s leading courier services, including <strong>TCS, Leopards Courier, and PostEx</strong>, to deliver safely to your doorstep:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
              <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
                <span className="font-bold text-orange-950 block text-sm">Major Metropolitan Cities</span>
                <p className="text-xs text-orange-900 mt-1">
                  <strong>2 to 4 working days</strong> for Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, and Peshawar.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="font-bold text-gray-900 block text-sm">Other Cities & Towns</span>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>4 to 7 working days</strong> for regional areas, Balochistan, Interior Sindh, South Punjab, Azad Kashmir, and Gilgit-Baltistan.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Shipping Charges & Free Delivery Threshold</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>
                <strong>Standard Nationwide Flat Rate:</strong> Rs. 250 for any order value below Rs. 5,000.
              </li>
              <li>
                <strong>FREE Shipping:</strong> Applicable on all orders totaling <strong>Rs. 5,000 or more</strong> anywhere across Pakistan.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Tracking Your Parcel</h2>
            <p>
              Immediately upon courier pickup, you will receive an automated email and SMS notification containing your courier partner name and unique <strong>Tracking Number</strong>. You can monitor progress on our <Link href="/track-order" className="text-orange-600 font-bold underline">Track Order</Link> page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Courier Delivery Attempts</h2>
            <p>
              Courier dispatch riders make up to <strong>2 delivery attempts</strong> before returning a parcel to our central warehouse. Please keep your provided phone number reachable and active.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">6. Incorrect Address Responsibility</h2>
            <p>
              Customers are responsible for providing complete and accurate shipping details (including house number, street name, and prominent landmark). BazaarHub is not liable for re-shipping charges caused by incorrect or incomplete addresses provided at checkout.
            </p>
          </section>

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950">
            For urgent shipping inquiries or delivery updates, contact our Pakistan support desk on WhatsApp at <strong>+92 300 1234567</strong> or email <strong>support@bazaarhub.pk</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

