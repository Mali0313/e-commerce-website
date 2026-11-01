'use client';

import React, { useState } from 'react';
import { Settings, Building, Smartphone, Truck, ShieldCheck, Check, Save } from 'lucide-react';
import {
  getStoreSettings,
  updateStoreSettings,
  getPaymentSettings,
  updatePaymentSettings,
} from '@/lib/data/store';
import { StoreSettings, PaymentSettings } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { success } = useToast();
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(getStoreSettings());
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings[]>(getPaymentSettings());

  // Store General State
  const [storeName, setStoreName] = useState(storeSettings.store_name);
  const [tagline, setTagline] = useState(storeSettings.tagline);
  const [supportEmail, setSupportEmail] = useState(storeSettings.support_email);
  const [supportPhone, setSupportPhone] = useState(storeSettings.support_phone);
  const [whatsappNumber, setWhatsappNumber] = useState(storeSettings.whatsapp_number);
  const [shippingRate, setShippingRate] = useState(storeSettings.standard_shipping_rate);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    storeSettings.free_shipping_threshold
  );
  const [announcementBar, setAnnouncementBar] = useState(storeSettings.announcement_bar);

  // Bank Transfer Setting
  const bankSetting = paymentSettings.find((p) => p.method_key === 'bank_transfer');
  const [bankTitle, setBankTitle] = useState(bankSetting?.account_title || '');
  const [bankNumber, setBankNumber] = useState(bankSetting?.account_number || '');
  const [bankName, setBankName] = useState(bankSetting?.bank_name || '');
  const [bankInstructions, setBankInstructions] = useState(bankSetting?.instructions || '');

  // Easypaisa Setting
  const epSetting = paymentSettings.find((p) => p.method_key === 'easypaisa');
  const [epTitle, setEpTitle] = useState(epSetting?.account_title || '');
  const [epNumber, setEpNumber] = useState(epSetting?.account_number || '');
  const [epInstructions, setEpInstructions] = useState(epSetting?.instructions || '');

  // JazzCash Setting
  const jcSetting = paymentSettings.find((p) => p.method_key === 'jazzcash');
  const [jcTitle, setJcTitle] = useState(jcSetting?.account_title || '');
  const [jcNumber, setJcNumber] = useState(jcSetting?.account_number || '');
  const [jcInstructions, setJcInstructions] = useState(jcSetting?.instructions || '');

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateStoreSettings({
      store_name: storeName,
      tagline,
      support_email: supportEmail,
      support_phone: supportPhone,
      whatsapp_number: whatsappNumber,
      standard_shipping_rate: Number(shippingRate),
      free_shipping_threshold: Number(freeShippingThreshold),
      announcement_bar: announcementBar,
    });
    setStoreSettings(updated);
    success('Store configuration and shipping parameters updated!');
  };

  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();

    updatePaymentSettings('bank_transfer', {
      account_title: bankTitle,
      account_number: bankNumber,
      bank_name: bankName,
      instructions: bankInstructions,
    });

    updatePaymentSettings('easypaisa', {
      account_title: epTitle,
      account_number: epNumber,
      instructions: epInstructions,
    });

    updatePaymentSettings('jazzcash', {
      account_title: jcTitle,
      account_number: jcNumber,
      instructions: jcInstructions,
    });

    setPaymentSettings(getPaymentSettings());
    success('Payment account credentials updated! Customers will immediately see the new details.');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Store & Payment Configuration
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage Pakistani manual bank credentials, mobile wallet receiver accounts, and shipping parameters.
        </p>
      </div>

      {/* General Store & Shipping Settings Form */}
      <form onSubmit={handleSaveStore} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-900">General Information & Shipping Rates</h2>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Store Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">WhatsApp Number (e.g. 923001234567)</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full p-2.5 border rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Standard Nationwide Flat Shipping (PKR)</label>
            <input
              type="number"
              value={shippingRate}
              onChange={(e) => setShippingRate(Number(e.target.value))}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Free Shipping Threshold (PKR)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-bold mb-1">Top Announcement Bar Text</label>
            <input
              type="text"
              value={announcementBar}
              onChange={(e) => setAnnouncementBar(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>
        </div>
      </form>

      {/* Manual Payment Verification Accounts Form */}
      <form onSubmit={handleSavePayments} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-900">Manual Payment Accounts (Bank, Easypaisa, JazzCash)</h2>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Payment Details</span>
          </button>
        </div>

        {/* 1. Bank Account */}
        <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3">
          <span className="font-bold text-xs uppercase tracking-wider text-orange-950 block">
            1. Bank Account Transfer (Meezan / HBL / IBAN)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Account Title</label>
              <input
                type="text"
                value={bankTitle}
                onChange={(e) => setBankTitle(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">IBAN / Account Number</label>
              <input
                type="text"
                value={bankNumber}
                onChange={(e) => setBankNumber(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white font-mono"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-gray-700 font-bold mb-1">Instructions for Customer</label>
              <input
                type="text"
                value={bankInstructions}
                onChange={(e) => setBankInstructions(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
          </div>
        </div>

        {/* 2. Easypaisa */}
        <div className="p-4 bg-[#00A651]/5 rounded-2xl border border-[#00A651]/20 space-y-3">
          <span className="font-bold text-xs uppercase tracking-wider text-[#00A651] block">
            2. Easypaisa Mobile Wallet
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Account Title</label>
              <input
                type="text"
                value={epTitle}
                onChange={(e) => setEpTitle(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Easypaisa Mobile Number</label>
              <input
                type="text"
                value={epNumber}
                onChange={(e) => setEpNumber(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-bold mb-1">Instructions for Customer</label>
              <input
                type="text"
                value={epInstructions}
                onChange={(e) => setEpInstructions(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
          </div>
        </div>

        {/* 3. JazzCash */}
        <div className="p-4 bg-[#FF0000]/5 rounded-2xl border border-[#FF0000]/20 space-y-3">
          <span className="font-bold text-xs uppercase tracking-wider text-[#FF0000] block">
            3. JazzCash Mobile Wallet
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Account Title</label>
              <input
                type="text"
                value={jcTitle}
                onChange={(e) => setJcTitle(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">JazzCash Mobile Number</label>
              <input
                type="text"
                value={jcNumber}
                onChange={(e) => setJcNumber(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-bold mb-1">Instructions for Customer</label>
              <input
                type="text"
                value={jcInstructions}
                onChange={(e) => setJcInstructions(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

