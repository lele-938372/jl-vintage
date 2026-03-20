export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  stock: number;
  tags: string[];
  featured?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  verified: boolean;
  verificationCode?: string;
  verificationExpiry?: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountCode?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paypalOrderId?: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface DiscountCode {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  active: boolean;
  usageCount: number;
  maxUsage?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
