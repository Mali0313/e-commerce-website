import {
  Product,
  Category,
  Order,
  StoreSettings,
  PaymentSettings,
  Review,
  Coupon,
  OrderStatus,
  ContactMessage,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  SAMPLE_REVIEWS,
  INITIAL_ORDERS,
} from './mock-store';

// In-memory runtime cache for server/mock persistence across requests
let inMemoryProducts = [...INITIAL_PRODUCTS];
let inMemoryCategories = [...INITIAL_CATEGORIES];
let inMemoryOrders = [...INITIAL_ORDERS];
let inMemorySettings = { ...INITIAL_SETTINGS };
let inMemoryPaymentSettings = [...INITIAL_PAYMENT_SETTINGS];
let inMemoryCoupons = [...INITIAL_COUPONS];
let inMemoryReviews = [...SAMPLE_REVIEWS];
let inMemoryContactMessages: ContactMessage[] = [];

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
}

export function getCategories(): Category[] {
  return inMemoryCategories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  for (const cat of inMemoryCategories) {
    if (cat.slug === slug) return cat;
    if (cat.subcategories) {
      const sub = cat.subcategories.find((s) => s.slug === slug);
      if (sub) return sub;
    }
  }
  return undefined;
}

export function getProducts(filters: ProductFilters = {}): Product[] {
  let list = [...inMemoryProducts].filter((p) => p.is_active);

  // Category filter
  if (filters.category) {
    const cat = getCategoryBySlug(filters.category);
    if (cat) {
      const subIds = cat.subcategories?.map((s) => s.id) || [];
      const matchIds = [cat.id, ...subIds];
      list = list.filter((p) => p.category_id && matchIds.includes(p.category_id));
    }
  }

  // Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
  }

  // Price range
  if (filters.minPrice !== undefined) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }

  // In Stock
  if (filters.inStock) {
    list = list.filter((p) => p.stock_quantity > 0);
  }

  // Featured
  if (filters.featured !== undefined) {
    list = list.filter((p) => p.is_featured === filters.featured);
  }

  // Sorting
  if (filters.sort) {
    switch (filters.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        list.sort((a, b) => b.rating - a.rating || b.reviews_count - a.reviews_count);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }

  return list;
}

export function getProductBySlug(slug: string): Product | undefined {
  return inMemoryProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return inMemoryProducts.find((p) => p.id === id);
}

export function getAllProductsAdmin(): Product[] {
  return inMemoryProducts;
}

export function saveProduct(product: Partial<Product> & { id?: string }): Product {
  if (product.id) {
    const index = inMemoryProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      inMemoryProducts[index] = {
        ...inMemoryProducts[index],
        ...product,
        updated_at: new Date().toISOString(),
      } as Product;
      return inMemoryProducts[index];
    }
  }

  const newProduct: Product = {
    id: product.id || `p-${Date.now()}`,
    title: product.title || 'Untitled Product',
    slug: product.slug || `prod-${Date.now()}`,
    description: product.description || '',
    price: product.price || 0,
    compare_at_price: product.compare_at_price || null,
    cost_price: product.cost_price || null,
    sku: product.sku || `SKU-${Date.now().toString().slice(-4)}`,
    category_id: product.category_id || null,
    stock_quantity: product.stock_quantity ?? 10,
    is_active: product.is_active ?? true,
    is_featured: product.is_featured ?? false,
    rating: 5.0,
    reviews_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: product.images || [
      {
        id: `img-${Date.now()}`,
        product_id: product.id || '',
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        alt_text: product.title || '',
        display_order: 1,
        is_primary: true,
      },
    ],
    variants: product.variants || [],
  };

  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

export function deleteProduct(id: string): boolean {
  const initialLen = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
  return inMemoryProducts.length < initialLen;
}

// Orders
export function getOrders(status?: OrderStatus): Order[] {
  if (status) {
    return inMemoryOrders.filter((o) => o.status === status);
  }
  return inMemoryOrders;
}

export function getOrderById(id: string): Order | undefined {
  return inMemoryOrders.find((o) => o.id === id || o.order_number === id);
}

export function createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order {
  const orderNumber = `BH-${Math.floor(10000 + Math.random() * 90000)}`;
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    order_number: orderNumber,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemoryOrders.unshift(newOrder);

  // Auto-reduce variant & product stock if items exist
  if (newOrder.items) {
    for (const item of newOrder.items) {
      if (item.product_id) {
        const prod = inMemoryProducts.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        }
      }
    }
  }

  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  courier_name?: string | null,
  tracking_number?: string | null
): Order | null {
  const order = inMemoryOrders.find((o) => o.id === orderId || o.order_number === orderId);
  if (!order) return null;

  // Handle inventory restocking on cancellation or return
  if (
    (status === 'cancelled' || status === 'returned') &&
    order.status !== 'cancelled' &&
    order.status !== 'returned'
  ) {
    if (order.items) {
      for (const item of order.items) {
        if (item.product_id) {
          const prod = inMemoryProducts.find((p) => p.id === item.product_id);
          if (prod) {
            prod.stock_quantity += item.quantity;
          }
        }
      }
    }
  }

  order.status = status;
  if (courier_name !== undefined) order.courier_name = courier_name;
  if (tracking_number !== undefined) order.tracking_number = tracking_number;
  order.updated_at = new Date().toISOString();

  // If status is payment_verified, update payment record
  if (status === 'payment_verified' && order.payments && order.payments.length > 0) {
    order.payments[0].status = 'verified';
    order.payments[0].verified_at = new Date().toISOString();
  }

  return order;
}

export function submitPaymentProof(
  orderId: string,
  transactionId: string,
  proofUrl: string
): Order | null {
  const order = inMemoryOrders.find((o) => o.id === orderId || o.order_number === orderId);
  if (!order) return null;

  if (!order.payments || order.payments.length === 0) {
    order.payments = [
      {
        id: `pay-${Date.now()}`,
        order_id: order.id,
        payment_method: 'bank_transfer',
        transaction_id: transactionId,
        proof_url: proofUrl,
        amount: order.total_amount,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  } else {
    order.payments[0].transaction_id = transactionId;
    order.payments[0].proof_url = proofUrl;
    order.payments[0].updated_at = new Date().toISOString();
  }

  order.updated_at = new Date().toISOString();
  return order;
}

// Settings
export function getStoreSettings(): StoreSettings {
  return inMemorySettings;
}

export function updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  inMemorySettings = {
    ...inMemorySettings,
    ...settings,
  };
  return inMemorySettings;
}

export function getPaymentSettings(): PaymentSettings[] {
  return inMemoryPaymentSettings;
}

export function updatePaymentSettings(methodKey: string, updates: Partial<PaymentSettings>): PaymentSettings[] {
  inMemoryPaymentSettings = inMemoryPaymentSettings.map((item) =>
    item.method_key === methodKey ? { ...item, ...updates } : item
  );
  return inMemoryPaymentSettings;
}

// Coupons
export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
  const coupon = inMemoryCoupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active
  );

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
  }

  if (subtotal < coupon.min_order_amount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of Rs. ${coupon.min_order_amount.toLocaleString()} required for this coupon.`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((subtotal * coupon.discount_value) / 100);
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.discount_value;
  }

  return { valid: true, discount, message: `Coupon ${coupon.code} applied successfully!` };
}

export function getAllCoupons(): Coupon[] {
  return inMemoryCoupons;
}

export function saveCoupon(couponData: Partial<Coupon>): Coupon {
  if (couponData.id) {
    const idx = inMemoryCoupons.findIndex((c) => c.id === couponData.id);
    if (idx !== -1) {
      inMemoryCoupons[idx] = { ...inMemoryCoupons[idx], ...couponData } as Coupon;
      return inMemoryCoupons[idx];
    }
  }
  const newCoupon: Coupon = {
    id: `cp-${Date.now()}`,
    code: couponData.code?.toUpperCase() || `CP-${Date.now().toString().slice(-4)}`,
    discount_type: couponData.discount_type || 'percentage',
    discount_value: couponData.discount_value || 10,
    min_order_amount: couponData.min_order_amount || 0,
    max_discount: couponData.max_discount || null,
    starts_at: new Date().toISOString(),
    expires_at: couponData.expires_at || null,
    is_active: couponData.is_active ?? true,
    usage_limit: couponData.usage_limit || null,
    times_used: 0,
  };
  inMemoryCoupons.push(newCoupon);
  return newCoupon;
}

export function deleteCoupon(id: string): boolean {
  inMemoryCoupons = inMemoryCoupons.filter((c) => c.id !== id);
  return true;
}

// Reviews
export function getReviewsForProduct(productId: string): Review[] {
  return inMemoryReviews.filter((r) => r.product_id === productId && r.is_approved);
}

export function getAllReviewsAdmin(): Review[] {
  return inMemoryReviews;
}

export function addReview(reviewData: Omit<Review, 'id' | 'created_at'>): Review {
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  inMemoryReviews.unshift(newReview);

  // Recalculate product rating
  const prodReviews = inMemoryReviews.filter(
    (r) => r.product_id === reviewData.product_id && r.is_approved
  );
  const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
  const prod = inMemoryProducts.find((p) => p.id === reviewData.product_id);
  if (prod) {
    prod.rating = parseFloat(avg.toFixed(1));
    prod.reviews_count = prodReviews.length;
  }

  return newReview;
}

export function toggleReviewApproval(id: string): Review | null {
  const r = inMemoryReviews.find((x) => x.id === id);
  if (!r) return null;
  r.is_approved = !r.is_approved;
  return r;
}

export function deleteReview(id: string): boolean {
  inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id);
  return true;
}

// Contact Messages
export function submitContact(data: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>): ContactMessage {
  const msg: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  inMemoryContactMessages.unshift(msg);
  return msg;
}

export function getContactMessages(): ContactMessage[] {
  return inMemoryContactMessages;
}
