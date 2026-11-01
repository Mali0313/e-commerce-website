import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

export function getBaseEmailLayout(title: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #ea580c; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #dcfce7; margin: 6px 0 0; font-size: 13px; }
    .content { padding: 32px 24px; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 12px; background: #fff7ed; color: #c2410c; }
    .button { display: inline-block; padding: 12px 28px; background-color: #ea580c; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 16px; text-align: center; }
    .box { background: #fff7ed; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { text-align: left; padding: 10px; border-bottom: 2px solid #e2e8f0; font-size: 13px; color: #64748b; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BazaarHub</h1>
      <p>Your Everyday Bazaar, Online 🇵🇰</p>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>Need help? Contact our customer support on WhatsApp at <strong>+92 300 1234567</strong> or email <strong>support@bazaarhub.pk</strong>.</p>
      <p>&copy; ${new Date().getFullYear()} BazaarHub Pakistan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getOrderPlacedEmail(order: Order, paymentMethodTitle: string, paymentDetails: string): string {
  const itemsHtml = order.items
    ?.map(
      (item) => `
    <tr>
      <td>${item.product_title} ${item.variant_title ? `<br><small style="color:#64748b">Variant: ${item.variant_title}</small>` : ''}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right; font-weight: 600;">${formatPrice(item.total)}</td>
    </tr>
  `
    )
    .join('');

  return getBaseEmailLayout(
    `Order Confirmed #${order.order_number} - BazaarHub`,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">Order Received - Action Required</span>
      <h2 style="margin: 12px 0 6px; color: #c2410c;">Thank You For Your Order!</h2>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Order #${order.order_number}</p>
    </div>

    <p>Dear <strong>${order.shipping_address.full_name}</strong>,</p>
    <p>We have successfully received your order! To finalize processing and dispatch via courier, please complete payment using your selected method:</p>

    <div class="box">
      <h3 style="margin: 0 0 10px; color: #c2410c;">Payment Instructions: ${paymentMethodTitle}</h3>
      <p style="margin: 0; line-height: 1.6; font-size: 14px;">${paymentDetails}</p>
      <p style="margin: 12px 0 0; font-weight: 600; color: #15803d;">Total Amount Due: ${formatPrice(order.total_amount)}</p>
    </div>

    <p style="font-size: 14px; color: #475569;">
      After transferring, please upload your Transaction ID (TID) and payment receipt screenshot on your order tracking page within <strong>48 hours</strong>:
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-confirmation/${order.order_number}" class="button">
        Submit Payment Proof & Track Order
      </a>
    </div>

    <h3 style="margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Summary</h3>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="2" style="text-align: right; font-weight: 600; color: #64748b;">Subtotal:</td>
          <td style="text-align: right; font-weight: 600;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: right; font-weight: 600; color: #64748b;">Shipping Fee:</td>
          <td style="text-align: right; font-weight: 600;">${order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</td>
        </tr>
        ${
          order.discount_amount > 0
            ? `
        <tr>
          <td colspan="2" style="text-align: right; font-weight: 600; color: #ea580c;">Discount:</td>
          <td style="text-align: right; font-weight: 600; color: #ea580c;">-${formatPrice(order.discount_amount)}</td>
        </tr>`
            : ''
        }
        <tr>
          <td colspan="2" style="text-align: right; font-size: 16px; font-weight: 700; color: #c2410c;">Grand Total:</td>
          <td style="text-align: right; font-size: 16px; font-weight: 700; color: #c2410c;">${formatPrice(order.total_amount)}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 24px; padding: 14px; background: #f8fafc; border-radius: 8px; font-size: 13px;">
      <strong>Delivery Address:</strong><br>
      ${order.shipping_address.street_address}, ${order.shipping_address.city}, ${order.shipping_address.province}<br>
      Phone: ${order.shipping_address.phone}
    </div>
    `
  );
}

export function getPaymentVerifiedEmail(order: Order): string {
  return getBaseEmailLayout(
    `Payment Verified - Order #${order.order_number}`,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background: #dcfce7; color: #15803d;">Payment Verified ✓</span>
      <h2 style="margin: 12px 0 6px; color: #c2410c;">Payment Confirmed!</h2>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Order #${order.order_number}</p>
    </div>

    <p>Dear <strong>${order.shipping_address.full_name}</strong>,</p>
    <p>Good news! Our accounts team has verified your payment of <strong>${formatPrice(order.total_amount)}</strong> for order #${order.order_number}.</p>
    
    <div class="box">
      <p style="margin: 0; font-weight: 600; color: #c2410c;">What happens next?</p>
      <p style="margin: 6px 0 0; font-size: 14px; line-height: 1.5;">Your parcel is now in packing and will be handed over to our courier partner within 1-2 working days. You will receive an SMS and email notification with your tracking number once dispatched.</p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-confirmation/${order.order_number}" class="button">
        View Order Status
      </a>
    </div>
    `
  );
}

export function getOrderShippedEmail(order: Order): string {
  return getBaseEmailLayout(
    `Your Order #${order.order_number} Has Been Shipped!`,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background: #e0f2fe; color: #0369a1;">Order Dispatched 🚚</span>
      <h2 style="margin: 12px 0 6px; color: #0c4a6e;">On Its Way!</h2>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Order #${order.order_number}</p>
    </div>

    <p>Dear <strong>${order.shipping_address.full_name}</strong>,</p>
    <p>Your package has been dispatched from our fulfillment center via <strong>${order.courier_name || 'Courier Partner'}</strong>.</p>
    
    <div class="box" style="background: #f0f9ff; border-color: #bae6fd;">
      <p style="margin: 0; font-weight: 600; color: #0369a1;">Tracking Information:</p>
      <p style="margin: 6px 0; font-size: 15px;">Courier: <strong>${order.courier_name || 'Standard Courier'}</strong></p>
      <p style="margin: 0; font-size: 15px;">Tracking Number: <strong style="font-family: monospace; font-size: 16px;">${order.tracking_number || 'N/A'}</strong></p>
      <p style="margin: 8px 0 0; font-size: 13px; color: #475569;">Expected delivery: 2-4 working days (major cities) or 4-7 working days (other regions).</p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-confirmation/${order.order_number}" class="button">
        Track Your Package
      </a>
    </div>
    `
  );
}

export function getOrderDeliveredEmail(order: Order): string {
  return getBaseEmailLayout(
    `Delivered: Order #${order.order_number} - BazaarHub`,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background: #dcfce7; color: #15803d;">Package Delivered 🎉</span>
      <h2 style="margin: 12px 0 6px; color: #c2410c;">Your Order Has Arrived!</h2>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Order #${order.order_number}</p>
    </div>

    <p>Dear <strong>${order.shipping_address.full_name}</strong>,</p>
    <p>According to our courier partner, your package for order #${order.order_number} has been delivered to your address.</p>
    
    <p>We hope you love your purchase! If you have a minute, we'd love for you to leave a rating and review to help other shoppers in Pakistan.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/orders" class="button">
        Rate & Review Your Items
      </a>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      Remember: You are covered by our 7-Day Hassle-Free Return Policy. For any issues, reach out to us within 48 hours.
    </p>
    `
  );
}

export function getWelcomeEmail(fullName: string): string {
  return getBaseEmailLayout(
    `Welcome to BazaarHub Pakistan!`,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">Welcome to the Family</span>
      <h2 style="margin: 12px 0 6px; color: #c2410c;">Khush Amdeed, ${fullName || 'Shopper'}!</h2>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Your Everyday Bazaar, Online</p>
    </div>

    <p>Thank you for creating an account with BazaarHub! We are on a mission to bring high quality, affordable lifestyle products right to your doorstep anywhere in Pakistan.</p>
    
    <div class="box">
      <h4 style="margin: 0 0 6px; color: #c2410c;">🎁 Your Exclusive Welcome Coupon</h4>
      <p style="margin: 0; font-size: 14px;">Use coupon code <strong style="color: #ea580c; font-size: 16px;">WELCOME10</strong> at checkout to get 10% off your first order over Rs. 1,500.</p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="button">
        Start Shopping Now
      </a>
    </div>
    `
  );
}
