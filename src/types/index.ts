export type Role = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  street_address: string;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  subcategories?: Category[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  size: string | null;
  color: string | null;
  image_url: string | null;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  sku: string | null;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  cart_id?: string;
  product_id: string;
  variant_id?: string | null;
  title: string;
  variant_title?: string | null;
  price: number;
  compare_at_price?: number | null;
  quantity: number;
  image_url: string;
  slug: string;
  stock_quantity: number;
}

export interface Cart {
  id?: string;
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  coupon_code?: string | null;
  total: number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verified'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethodKey = 'bank_transfer' | 'easypaisa' | 'jazzcash';

export interface ShippingAddress {
  full_name: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  street_address: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_title: string;
  variant_title: string | null;
  price: number;
  quantity: number;
  total: number;
  image_url: string | null;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  payment_method: PaymentMethodKey;
  transaction_id: string | null;
  proof_url: string | null;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  verified_at?: string | null;
  verified_by?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  courier_name: string | null;
  tracking_number: string | null;
  notes: string | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payments?: PaymentRecord[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  comment: string;
  photo_url: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  user_name?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  usage_limit: number | null;
  times_used: number;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string;
  support_email: string;
  support_phone: string;
  whatsapp_number: string;
  standard_shipping_rate: number;
  free_shipping_threshold: number;
  announcement_bar: string;
}

export interface PaymentSettings {
  id: string;
  method_key: PaymentMethodKey;
  method_title: string;
  account_title: string;
  account_number: string;
  bank_name: string | null;
  instructions: string;
  is_active: boolean;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
