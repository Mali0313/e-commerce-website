import {
  getOrderPlacedEmail,
  getPaymentVerifiedEmail,
  getOrderShippedEmail,
  getOrderDeliveredEmail,
  getWelcomeEmail,
} from './templates';
import { Order } from '@/types';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@bazaarhub.pk';

  if (!apiKey) {
    console.log(`[Email Simulation (No RESEND_API_KEY)] To: ${to} | Subject: ${subject}`);
    return { success: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `BazaarHub <${fromEmail}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Failed to send email via Resend:', err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderPlacedNotification(
  order: Order,
  paymentMethodTitle: string,
  instructions: string
) {
  const html = getOrderPlacedEmail(order, paymentMethodTitle, instructions);
  return sendEmail({
    to: order.shipping_address.email,
    subject: `Order #${order.order_number} Confirmed - BazaarHub`,
    html,
  });
}

export async function sendPaymentVerifiedNotification(order: Order) {
  const html = getPaymentVerifiedEmail(order);
  return sendEmail({
    to: order.shipping_address.email,
    subject: `Payment Verified: Order #${order.order_number} - BazaarHub`,
    html,
  });
}

export async function sendOrderShippedNotification(order: Order) {
  const html = getOrderShippedEmail(order);
  return sendEmail({
    to: order.shipping_address.email,
    subject: `Your BazaarHub Order #${order.order_number} Has Been Shipped!`,
    html,
  });
}

export async function sendOrderDeliveredNotification(order: Order) {
  const html = getOrderDeliveredEmail(order);
  return sendEmail({
    to: order.shipping_address.email,
    subject: `Delivered: Order #${order.order_number} - BazaarHub`,
    html,
  });
}

export async function sendWelcomeNotification(email: string, fullName: string) {
  const html = getWelcomeEmail(fullName);
  return sendEmail({
    to: email,
    subject: `Welcome to BazaarHub Pakistan!`,
    html,
  });
}
