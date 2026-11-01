'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  // Phone number (Pakistani format without + or spaces for wa.me)
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const defaultMessage =
    'Assalam-o-Alaikum BazaarHub! I have an inquiry about an order / product on your store.';
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2 font-sans"
    >
      {/* Speech Bubble / Tooltip (Interactive & Dismissible) */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-gray-800 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-gray-100 animate-fade-in group">
          <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="font-bold">Need Help? Chat on WhatsApp</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-gray-400 hover:text-gray-600 ml-1 p-0.5 rounded-full hover:bg-gray-100"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Official Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly with BazaarHub on WhatsApp (+92 300 1234567)"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full sm:rounded-2xl shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 cursor-pointer"
      >
        {/* Official WhatsApp SVG Logo */}
        <div className="relative shrink-0">
          <svg
            className="w-7 h-7 sm:w-6 sm:h-6 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.59 20.16 9.17 19.77 7.92 19.03L7.63 18.86L4.5 19.68L5.34 16.63L5.15 16.33C4.34 15.04 3.91 13.53 3.91 11.92C3.91 7.43 7.56 3.78 12.05 3.78C14.22 3.78 16.27 4.63 17.8 6.16C19.33 7.69 20.18 9.74 20.18 11.92C20.18 16.41 16.53 20.16 12.05 20.16ZM16.51 14.38C16.27 14.26 15.06 13.66 14.83 13.58C14.61 13.5 14.44 13.46 14.28 13.7C14.11 13.94 13.63 14.5 13.48 14.67C13.34 14.83 13.19 14.85 12.95 14.73C12.71 14.61 11.93 14.36 11 13.54C10.28 12.9 9.79 12.11 9.65 11.87C9.51 11.63 9.63 11.5 9.75 11.38C9.86 11.27 10 11.11 10.12 10.97C10.24 10.83 10.28 10.73 10.36 10.57C10.44 10.41 10.4 10.27 10.34 10.15C10.28 10.03 9.79 8.83 9.59 8.34C9.39 7.86 9.19 7.93 9.04 7.92C8.9 7.91 8.74 7.91 8.58 7.91C8.42 7.91 8.16 7.97 7.93 8.22C7.71 8.46 7.07 9.06 7.07 10.28C7.07 11.5 7.96 12.68 8.08 12.84C8.2 13 9.83 15.51 12.32 16.59C12.91 16.85 13.37 17 13.73 17.11C14.32 17.3 14.86 17.27 15.28 17.21C15.75 17.14 16.73 16.62 16.93 16.05C17.13 15.48 17.13 14.99 17.07 14.89C17.01 14.79 16.85 14.73 16.51 14.38Z" />
          </svg>
          {/* Pulsing online indicator */}
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        </div>

        {/* Text for Desktop */}
        <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
          <span className="text-[10px] text-white/90 font-bold uppercase tracking-wider">
            Live Support
          </span>
          <span className="text-sm font-black tracking-tight text-white">
            WhatsApp
          </span>
        </div>
      </a>
    </aside>
  );
}
