'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight, MessageCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Payment & Verification',
    q: 'How do I pay using Bank Transfer, Easypaisa, or JazzCash?',
    a: 'When you place an order, you will select your preferred method and be given our official account details (e.g. Meezan Bank IBAN, or Easypaisa/JazzCash mobile numbers). Transfer the exact total from your mobile banking app, copy the Transaction ID (TID), and upload your receipt screenshot on your order confirmation page.',
  },
  {
    category: 'Payment & Verification',
    q: 'How long does payment verification take?',
    a: 'Our verification team checks bank and wallet statements continuously between 9:00 AM and 9:00 PM PKT. Most orders are verified within 30 to 60 minutes. You will receive an SMS and email notification the moment it is confirmed.',
  },
  {
    category: 'Payment & Verification',
    q: 'What happens if I forget to upload the payment proof within 48 hours?',
    a: 'Items are held in reservation for 48 hours. If payment proof is not received within this window, our system flags the order for cancellation so other shoppers can purchase the stock. If you paid after 48 hours, simply message us on WhatsApp (+92 300 1234567) with your TID to restore the order.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'How much are the delivery charges across Pakistan?',
    a: 'We offer a flat nationwide rate of Rs. 250 for orders below Rs. 5,000. All orders of Rs. 5,000 or above qualify for 100% FREE nationwide shipping.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'How many days will it take for my order to arrive?',
    a: 'Major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Sialkot, Gujranwala, Peshawar) take 2 to 4 working days after payment verification. Other regions and remote districts take 4 to 7 working days.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'Which courier service delivers my package?',
    a: 'We partner with Pakistan’s most reliable networks: TCS Express, Leopards Courier, and PostEx. You will receive an SMS with your tracking number as soon as your parcel is dispatched.',
  },
  {
    category: 'Returns & Refunds',
    q: 'What is your return policy if the size does not fit or I change my mind?',
    a: 'You have 7 days from the delivery date to return any unused, unwashed item with tags intact. Simply contact our support on WhatsApp with your order number. Once inspected, refunds are transferred via Bank, Easypaisa, or JazzCash within 5-7 working days.',
  },
  {
    category: 'Returns & Refunds',
    q: 'What if my item arrives damaged or defective?',
    a: 'We offer a 100% Free Replacement Guarantee! If an item is damaged or defective upon arrival, take photos and notify us within 48 hours of delivery. We will courier a replacement at no extra charge.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center space-y-2 mb-12">
        <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-900 text-xs font-bold px-3 py-1 rounded-full">
          <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
          <span>Frequently Asked Questions</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Everything You Need to Know
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Clear answers about manual payments, tracking courier parcels, and hassle-free returns.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
                    {faq.category}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    {faq.q}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Banner */}
      <div className="mt-12 p-8 bg-orange-50 border border-orange-200 rounded-3xl text-center space-y-3">
        <h3 className="text-lg font-bold text-orange-950">Still Have Questions?</h3>
        <p className="text-xs text-orange-900 max-w-sm mx-auto">
          Our friendly Pakistani customer service team is always happy to assist you on WhatsApp.
        </p>
        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp (+92 300 1234567)</span>
        </a>
      </div>
    </div>
  );
}

