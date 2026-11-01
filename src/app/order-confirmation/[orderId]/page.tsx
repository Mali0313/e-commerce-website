import React from 'react';
import { notFound } from 'next/navigation';
import { getOrderById, getPaymentSettings } from '@/lib/data/store';
import { OrderConfirmationView } from '@/components/orders/OrderConfirmationView';

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) {
    notFound();
  }

  const paymentSettings = getPaymentSettings();
  const paymentMethodKey = order.payments?.[0]?.payment_method || 'bank_transfer';
  const paymentSetting = paymentSettings.find((p) => p.method_key === paymentMethodKey);

  return <OrderConfirmationView order={order} paymentSetting={paymentSetting} />;
}
