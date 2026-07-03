export interface Product {
  slug: string;
  code: string;
  name: string;
  cat: 'moissanite' | 'best-seller';
  subcat: string;
  price: number;
  /** Original (pre-sale) price. If set and > price, UI shows a strikethrough + discount %. */
  originalPrice?: number;
  tint: string;
  tint2: string;
  accent: string;
  hot?: boolean;
  sold?: boolean;
  shape: ShapeKey;
  /** Optional product image (webp preferred). If absent, SVG placeholder is used. */
  image?: string;
  /** Optional second image shown on hover (lifestyle / model). */
  imageHover?: string;
  /** Additional gallery images for product detail page. */
  gallery?: string[];
  /** Short marketing description. */
  description?: string;
  /** Detailed material (e.g. "Bạc S925 xi bạch kim, đính kim cương Moissanite GRA"). */
  material?: string;
  /** Average rating 0-5 (with decimals). */
  rating?: number;
  /** Number of customer reviews. */
  reviewCount?: number;
  /** Available stock count. */
  inStock?: number;
}

export interface CartItem {
  cartId: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  tint: string;
  tint2: string;
  accent: string;
  shape: ShapeKey;
}

export interface Category {
  slug: string;
  label: string;
  icon: string;
  sub?: { slug: string; label: string }[];
}

export interface HeroCat {
  slug: string;
  label: string;
  tint: string;
  accent: string;
}

export interface HeroSlide {
  plaque: string;
  script: string;
  tint: string;
  /** Model / lifestyle image rendered on the right side of the slide. */
  image?: string;
  /** Alt text for accessibility. */
  imageAlt?: string;
}

export interface NewsArticle {
  date: string;
  title: string;
  excerpt: string;
  tint: string;
  accent: string;
  content?: string;
  image?: string;
}

export type ShapeKey =
  | 'bow' | 'flower' | 'snow' | 'gem' | 'star'
  | 'bracelet' | 'ring' | 'butterfly' | 'clover'
  | 'heart' | 'sparkle';

export type SortOption = 'default' | 'name' | 'price-low' | 'price-high' | 'bestseller' | 'newest';

export type Route =
  | '/'
  | '/shop'
  | '/checkout'
  | '/about'
  | '/news'
  | '/lien-he'
  | '/kiem-dinh'
  | '/feedback'
  | '/huong-dan'
  | '/cart-view'
  | '/login'
  | '/register'
  | '/account'
  | '/admin'
  | '/admin/products'
  | '/admin/orders'
  | '/admin/dashboard';

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  /** Demo only — hashed/encrypted in real backend */
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  note?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'done' | 'cancelled';

export interface Order {
  id: string;
  userId: string | null;
  items: CartItem[];
  shipping: ShippingInfo;
  payment: 'cod' | 'bank' | 'momo';
  subtotal: number;
  ship: number;
  discount: number;
  total: number;
  coupon?: string;
  status: OrderStatus;
  createdAt: number;
}
