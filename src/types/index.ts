export interface Product {
  slug: string;
  code: string;
  name: string;
  cat: 'bst' | 'diy' | 'vong-tay';
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
  /** Long-form product content for SEO and product detail pages. */
  longDescription?: string;
  /** Search engine title. Falls back to product name. */
  seoTitle?: string;
  /** Search engine summary. Falls back to short description. */
  seoDescription?: string;
  /** Comma-separated target keywords. */
  seoKeywords?: string;
  /** Optional canonical slug/path for SEO tools. */
  canonicalSlug?: string;
  /** Bullet points shown in product detail content. */
  highlights?: string[];
  /** Product care instructions for the detail accordion. */
  careInstructions?: string;
  /** Structured specification rows for SEO-friendly detail content. */
  specifications?: ProductSpecification[];
  /** Detailed material (e.g. "Hợp kim xi mạ bạc cao cấp, charm resin pha lê"). */
  material?: string;
  /** Average rating 0-5 (with decimals). */
  rating?: number;
  /** Number of customer reviews. */
  reviewCount?: number;
  /** Available stock count. */
  inStock?: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
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
  id?: string;
  date: string;
  title: string;
  excerpt: string;
  tint: string;
  accent: string;
  content?: string;
  image?: string;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  visible: boolean;
}

/** Một khối "câu chuyện thương hiệu" trên trang Giới thiệu (ảnh + tiêu đề + mô tả). */
export interface AboutStoryBlock {
  id: string;
  image?: string;
  title?: string;
  text: string;
}

/** Một "giá trị cốt lõi" hiển thị dạng thẻ trên trang Giới thiệu. */
export interface AboutValue {
  id: string;
  /** Khóa shape dùng làm icon (xem data/shapes): gem, sparkle, flower, heart... */
  icon: ShapeKey;
  title: string;
  text: string;
}

/** Một con số thống kê (vd: "5+", "Năm kinh nghiệm"). */
export interface AboutStat {
  value: string;
  label: string;
}

/** Nội dung trang Giới thiệu — chỉnh sửa được qua Admin → Quản trị nội dung. */
export interface AboutContent {
  title: string;
  tagline: string;
  /** Ảnh chính đầu trang (nên dùng tỉ lệ 4:3 hoặc 4:5, nền sáng). */
  heroImage?: string;
  /** Đoạn mở đầu, hỗ trợ HTML. */
  intro: string;
  /** Các khối câu chuyện thương hiệu (ảnh + chữ, so le trái/phải). */
  story: AboutStoryBlock[];
  /** Tuyên ngôn / sứ mệnh, hỗ trợ HTML. */
  mission: string;
  /** Dải con số thống kê. */
  stats: AboutStat[];
  /** Các giá trị cốt lõi. */
  values: AboutValue[];
  /** Tiêu đề + lời kêu gọi hành động cuối trang. */
  ctaTitle: string;
  ctaText: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  address: string;
  openHours: string;
  hotline: string;
  email: string;
  facebookUrl: string;
  qrUrl: string;
}

export interface CategoryTile {
  id: string;
  title: string;
  img: string;
  slug: string;
}

export interface NavSubItem {
  label: string;
  slug: string;
}

export interface NavCategory {
  id: string;
  label: string;
  slug: string;
  sub?: NavSubItem[];
}

/** Một liên kết trong footer (Chính sách / Hỗ trợ). */
export interface FooterLink {
  label: string;
  /** Đường dẫn tĩnh (href) — dùng khi không có nav. */
  href?: string;
  /** Route nội bộ (vd: /about) — ưu tiên hơn href. */
  nav?: string;
}

/** Nội dung footer — chỉnh sửa được qua Admin → Tùy chỉnh giao diện → Footer. */
export interface FooterContent {
  /** Logo footer (URL ảnh hoặc data URL). Mặc định dùng /logotrang.jpg. */
  logo: string;
  /** Mô tả ngắn bên dưới logo thương hiệu. */
  brandDescription: string;
  /** Cột "Chính sách". */
  policyLinks: FooterLink[];
  /** Cột "Hỗ trợ". */
  supportLinks: FooterLink[];
  /** Tiêu đề khối đăng ký nhận tin. */
  newsletterTitle: string;
  /** Lời mô tả dưới tiêu đề đăng ký nhận tin. */
  newsletterText: string;
  /** Link Facebook (để trống để ẩn). */
  facebookUrl: string;
  /** Link TikTok (để trống để ẩn). */
  tiktokUrl: string;
  /** Dòng bản quyền. */
  copyright: string;
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  newsArticles: NewsArticle[];
  pages: SitePage[];
  settings: SiteSettings;
  /** Editable nav dropdown categories */
  navCategories?: NavCategory[];
  /** Editable category tiles on homepage */
  categoryTiles?: CategoryTile[];
  /** Quick filter chips on shop page */
  shopQuickFilters?: string[];
  /** Nội dung trang Giới thiệu (chỉnh sửa qua Admin). */
  about?: AboutContent;
  /** Nội dung footer (chỉnh sửa qua Admin). */
  footer?: FooterContent;
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
  /** Demo only — hashed/encrypted in real backend. Optional khi dùng Supabase Auth. */
  password?: string;
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
  payment: 'cod' | 'bank' | 'momo' | 'card';
  subtotal: number;
  ship: number;
  discount: number;
  total: number;
  coupon?: string;
  status: OrderStatus;
  createdAt: number;
}
