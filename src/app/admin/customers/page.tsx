'use client';

import React, { useState } from 'react';
import { Users, Search, ShieldCheck, ShieldAlert, Ban, CheckCircle, Mail, Phone } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  isBlocked: boolean;
  joinedAt: string;
}

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'c-1',
    name: 'Hamza Malik',
    email: 'hamza.malik@example.pk',
    phone: '0321-4455667',
    city: 'Lahore',
    ordersCount: 4,
    totalSpent: 18450,
    isBlocked: false,
    joinedAt: '2026-09-12',
  },
  {
    id: 'c-2',
    name: 'Zainab Fatima',
    email: 'zainab.f@example.pk',
    phone: '0300-8899112',
    city: 'Karachi',
    ordersCount: 3,
    totalSpent: 12990,
    isBlocked: false,
    joinedAt: '2026-09-28',
  },
  {
    id: 'c-3',
    name: 'Bilal Khan',
    email: 'bilal.k@example.pk',
    phone: '0333-5566778',
    city: 'Islamabad',
    ordersCount: 2,
    totalSpent: 7490,
    isBlocked: false,
    joinedAt: '2026-10-04',
  },
  {
    id: 'c-4',
    name: 'Ayesha Tariq',
    email: 'ayesha.t@example.pk',
    phone: '0301-2233445',
    city: 'Faisalabad',
    ordersCount: 1,
    totalSpent: 3250,
    isBlocked: false,
    joinedAt: '2026-10-18',
  },
];

export default function AdminCustomersPage() {
  const { success } = useToast();
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleBlock = (id: string) => {
    setCustomers(
      customers.map((c) => {
        if (c.id === id) {
          const nextState = !c.isBlocked;
          success(
            nextState
              ? `Customer ${c.name} has been blocked.`
              : `Customer ${c.name} has been unblocked.`
          );
          return { ...c, isBlocked: nextState };
        }
        return c;
      })
    );
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Registered shopper profiles, order history, and account moderation.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, city, email..."
            className="w-full text-xs p-2.5 pl-9 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">City</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Total Spent (PKR)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-[10px] text-gray-400">Joined: {c.joinedAt}</p>
                  </td>

                  <td className="p-4">
                    <p className="text-gray-700 font-medium">{c.email}</p>
                    <p className="text-[11px] text-gray-500">{c.phone}</p>
                  </td>

                  <td className="p-4 font-semibold text-gray-800">{c.city}</td>

                  <td className="p-4 font-bold text-gray-900">{c.ordersCount} orders</td>

                  <td className="p-4 font-black text-orange-950">{formatPrice(c.totalSpent)}</td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isBlocked
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-900'
                      }`}
                    >
                      {c.isBlocked ? 'Blocked' : 'Active Account'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleBlock(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        c.isBlocked
                          ? 'bg-orange-50 text-orange-900 hover:bg-orange-100'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      {c.isBlocked ? 'Unblock' : 'Block User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

