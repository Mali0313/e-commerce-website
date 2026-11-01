'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  AlertCircle,
  Download,
  Eye,
  Printer,
  X,
  CreditCard,
  Building,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/lib/data/store';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { sendPaymentVerifiedNotification, sendOrderShippedNotification } from '@/lib/email';

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as OrderStatus | null;
  const initialSearch = searchParams.get('search') || '';

  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Selected Order for detail & action modal
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [courierName, setCourierName] = useState('TCS Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shipping_address.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shipping_address.phone.includes(searchQuery) ||
        o.payments?.[0]?.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchMethod =
        methodFilter === 'all' || o.payments?.[0]?.payment_method === methodFilter;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [orders, searchQuery, statusFilter, methodFilter]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!activeOrder) return;

    try {
      const updated = updateOrderStatus(
        activeOrder.id,
        newStatus,
        newStatus === 'shipped' ? courierName : activeOrder.courier_name,
        newStatus === 'shipped' ? trackingNumber : activeOrder.tracking_number
      );

      if (updated) {
        setOrders(getOrders());
        setActiveOrder({ ...updated });
        success(`Order #${updated.order_number} status updated to ${newStatus.replace('_', ' ')}!`);

        // Send customer email notifications
        if (newStatus === 'payment_verified') {
          await sendPaymentVerifiedNotification(updated);
        } else if (newStatus === 'shipped') {
          await sendOrderShippedNotification(updated);
        }
      }
    } catch {
      toastError('Could not update status');
    }
  };

  const exportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Province', 'Subtotal', 'Shipping', 'Discount', 'Total (PKR)', 'Status', 'Payment Method', 'TID', 'Courier', 'Tracking'];
    const rows = filteredOrders.map((o) => [
      o.order_number,
      o.created_at,
      `"${o.shipping_address.full_name}"`,
      o.shipping_address.phone,
      o.shipping_address.city,
      o.shipping_address.province,
      o.subtotal,
      o.shipping_fee,
      o.discount_amount,
      o.total_amount,
      o.status,
      o.payments?.[0]?.payment_method || 'bank_transfer',
      o.payments?.[0]?.transaction_id || 'N/A',
      o.courier_name || 'N/A',
      o.tracking_number || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bazaarhub-orders-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Orders exported to CSV file.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Customer Orders & Payments
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Verify manual transaction receipts (TIDs), update fulfillment, and dispatch parcels.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="self-start sm:self-auto px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, phone, customer name, TID..."
            className="w-full text-xs p-2.5 pl-9 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending_payment">Pending Payment (Review)</option>
            <option value="payment_verified">Payment Verified</option>
            <option value="processing">Processing / Packing</option>
            <option value="shipped">Shipped (Dispatched)</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment method filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Payment Methods</option>
            <option value="bank_transfer">Bank Transfer (IBAN)</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="jazzcash">JazzCash</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Payment Info</th>
                <th className="p-4">Total (PKR)</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Courier / Tracking</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const payment = order.payments?.[0];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900 block">
                          #{order.order_number}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatDateTime(order.created_at)}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-900">{order.shipping_address.full_name}</p>
                        <p className="text-[11px] text-gray-500">{order.shipping_address.phone}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                          {order.shipping_address.city}, {order.shipping_address.province}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-bold uppercase text-gray-800 block text-[11px]">
                          {payment?.payment_method.replace('_', ' ') || 'Bank'}
                        </span>
                        {payment?.transaction_id ? (
                          <span className="text-[10px] font-mono text-orange-900 bg-orange-50 px-1.5 py-0.5 rounded font-bold">
                            TID: {payment.transaction_id}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                            No TID yet
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-black text-orange-950">
                        {formatPrice(order.total_amount)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize inline-flex items-center gap-1 ${
                            order.status === 'delivered'
                              ? 'bg-orange-100 text-orange-900'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'payment_verified'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.status === 'payment_verified' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'pending_payment' && <Clock className="w-3 h-3" />}
                          <span>{order.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="p-4 text-[11px]">
                        {order.tracking_number ? (
                          <div>
                            <span className="font-semibold text-gray-900 block">{order.courier_name}</span>
                            <span className="font-mono text-gray-500">{order.tracking_number}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not Dispatched</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setActiveOrder(order);
                            setCourierName(order.courier_name || 'TCS Express');
                            setTrackingNumber(order.tracking_number || '');
                            setIsDetailModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-900 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review & Verify</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Payment Verification Modal */}
      {isDetailModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded">
                  #{activeOrder.order_number}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">Order Details & Verification</h2>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Proof Verification Box */}
            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-orange-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span>Manual Payment Verification</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Method:</span>
                  <span className="font-bold uppercase text-gray-900">
                    {activeOrder.payments?.[0]?.payment_method.replace('_', ' ') || 'Bank Transfer'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Due:</span>
                  <span className="font-bold text-orange-950">{formatPrice(activeOrder.total_amount)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Customer Transaction ID (TID):</span>
                  <p className="font-mono font-bold text-orange-950 text-sm bg-white p-2 rounded-lg border border-orange-200">
                    {activeOrder.payments?.[0]?.transaction_id || '⚠️ No TID submitted yet by customer'}
                  </p>
                </div>
              </div>

              {/* Screenshot Proof */}
              {activeOrder.payments?.[0]?.proof_url && (
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 block">Uploaded Receipt Screenshot:</span>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border bg-black/5">
                    <Image
                      src={activeOrder.payments[0].proof_url}
                      alt="Payment proof screenshot"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="pt-2 flex flex-wrap gap-2 border-t border-orange-200">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('payment_verified')}
                  className="px-4 py-2 bg-orange-600 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verify Payment (Confirm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('processing')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Mark Processing
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('cancelled')}
                  className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold"
                >
                  Cancel Order
                </button>
              </div>
            </div>

            {/* Courier Dispatch Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border space-y-3">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Courier Dispatch & Tracking Number</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Courier Partner</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="TCS Express">TCS Express</option>
                    <option value="Leopards Courier">Leopards Courier</option>
                    <option value="PostEx Pakistan">PostEx Pakistan</option>
                    <option value="Trax Logistics">Trax Logistics</option>
                    <option value="M&P Express">M&P Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TCS-987654321"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('shipped')}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch & Notify Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('delivered')}
                  className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold"
                >
                  Mark Delivered 🎉
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs border-t pt-4">
              <div>
                <span className="font-bold text-gray-900 block mb-1">Customer Details:</span>
                <p className="text-gray-700 font-semibold">{activeOrder.shipping_address.full_name}</p>
                <p className="text-gray-500">{activeOrder.shipping_address.phone}</p>
                <p className="text-gray-500">{activeOrder.shipping_address.email}</p>
              </div>
              <div>
                <span className="font-bold text-gray-900 block mb-1">Destination:</span>
                <p className="text-gray-700">{activeOrder.shipping_address.street_address}</p>
                <p className="text-gray-600">
                  {activeOrder.shipping_address.city}, {activeOrder.shipping_address.province}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4 space-y-2">
              <span className="font-bold text-gray-900 block text-xs">Purchased Items:</span>
              <div className="divide-y text-xs">
                {activeOrder.items?.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <span>
                      {item.product_title} {item.variant_title ? `(${item.variant_title})` : ''} x{item.quantity}
                    </span>
                    <span className="font-bold text-gray-900">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gray-400">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

