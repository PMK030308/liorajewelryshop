import { Product, NewsArticle, ShapeKey, SiteContent } from '../types';

/**
 * Interface mapping configuration for dynamic settings.
 * Users can customize this via the Admin dashboard settings.
 */
export interface WordPressConfig {
  useWordPress: boolean;
  apiUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

const DEFAULT_CONFIG: WordPressConfig = {
  useWordPress: false,
  apiUrl: import.meta.env.VITE_WP_API_URL || '',
  consumerKey: import.meta.env.VITE_WC_CONSUMER_KEY || '',
  consumerSecret: import.meta.env.VITE_WC_CONSUMER_SECRET || '',
};

// Key for saving config in LocalStorage
const STORAGE_KEY = 'liora_wp_config';

/** Get active WordPress config from localStorage or environment variables */
export function getWordPressConfig(): WordPressConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to parse wordpress configuration', e);
  }
  
  // Fallback to environment flag VITE_USE_WORDPRESS
  const envUseWP = import.meta.env.VITE_USE_WORDPRESS === 'true';
  return {
    ...DEFAULT_CONFIG,
    useWordPress: envUseWP,
  };
}

/** Save active WordPress config to localStorage */
export function saveWordPressConfig(config: WordPressConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/** Utility to strip HTML tags from standard WordPress responses */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
}

/** Utility to clean up and extract first image from WP content markup if no featured media */
function extractImageFromContent(content: string): string | undefined {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : undefined;
}

/**
 * Fetch and map news articles from a standard WordPress site.
 * Endpoint: /wp-json/wp/v2/posts
 */
export async function fetchWordPressPosts(config = getWordPressConfig()): Promise<NewsArticle[]> {
  if (!config.useWordPress || !config.apiUrl) {
    throw new Error('WordPress integration is not enabled or API URL is missing.');
  }

  const url = `${config.apiUrl}/wp-json/wp/v2/posts?_embed&per_page=10&_t=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
  }

  const posts = await response.json();
  
  return posts.map((post: any) => {
    // Attempt to extract featured media image url, fall back to first image in content, then default shapes tint
    let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    if (!imageUrl && post.content?.rendered) {
      imageUrl = extractImageFromContent(post.content.rendered);
    }

    // Format date nicely (DD/MM/YYYY)
    const rawDate = new Date(post.date);
    const dateStr = isNaN(rawDate.getTime()) 
      ? 'Gần đây' 
      : `${String(rawDate.getDate()).padStart(2, '0')}/${String(rawDate.getMonth() + 1).padStart(2, '0')}/${rawDate.getFullYear()}`;

    return {
      date: dateStr,
      title: stripHtml(post.title?.rendered || ''),
      excerpt: stripHtml(post.excerpt?.rendered || post.content?.rendered || '').substring(0, 150) + '...',
      // For aesthetics, we reuse theme tints dynamically or pass fallback properties
      tint: '#fdf4f6',
      accent: '#f472a0',
      // Store raw content/featured image in optional extensions if pages need detailed view
      content: post.content?.rendered,
      image: imageUrl,
      // Slug bài (WP) — dùng cho route nội bộ /news/<slug> của web React.
      slug: post.slug,
      // Permalink bài gốc trên blog — dùng làm canonical / SEO (bài đầy đủ do WP render).
      link: post.link,
    };
  });
}

/**
 * Fetch một bài WordPress theo slug — dùng khi mở trực tiếp /news/<slug> mà bài
 * chưa có trong store (vd: tải lại trang, WP headless chưa fetch xong list).
 * Endpoint: /wp-json/wp/v2/posts?slug=<slug>&_embed
 */
export async function fetchWordPressPostBySlug(slug: string, config = getWordPressConfig()): Promise<NewsArticle | null> {
  if (!config.useWordPress || !config.apiUrl || !slug) {
    return null;
  }

  const url = `${config.apiUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed&per_page=1&_t=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
  }

  const posts = await response.json();
  const post = Array.isArray(posts) ? posts[0] : null;
  if (!post) return null;

  let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (!imageUrl && post.content?.rendered) {
    imageUrl = extractImageFromContent(post.content.rendered);
  }

  const rawDate = new Date(post.date);
  const dateStr = isNaN(rawDate.getTime())
    ? 'Gần đây'
    : `${String(rawDate.getDate()).padStart(2, '0')}/${String(rawDate.getMonth() + 1).padStart(2, '0')}/${rawDate.getFullYear()}`;

  return {
    date: dateStr,
    title: stripHtml(post.title?.rendered || ''),
    excerpt: stripHtml(post.excerpt?.rendered || post.content?.rendered || '').substring(0, 150) + '...',
    tint: '#fdf4f6',
    accent: '#f472a0',
    content: post.content?.rendered,
    image: imageUrl,
    slug: post.slug,
    link: post.link,
  };
}

/**
 * Fetch site content partial từ theme WP (route custom liora/v1/site-content).
 * Trả về partial override — caller merge over DEFAULT_SITE_CONTENT.
 * Endpoint: /wp-json/liora/v1/site-content
 */
export async function fetchWordPressSiteContent(config = getWordPressConfig()): Promise<Partial<SiteContent>> {
  if (!config.useWordPress || !config.apiUrl) {
    throw new Error('WordPress integration is not enabled or API URL is missing.');
  }

  const url = `${config.apiUrl}/wp-json/liora/v1/site-content?_t=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    // 404 = theme route chưa kích hoạt (theme chưa activate / permalink chưa flush).
    // Không throw — trả partial rỗng để frontend giữ mặc định, tránh lỗi console.
    console.warn(`[Liora] site-content endpoint trả ${response.status} — theme liora-blog có thể chưa kích hoạt route này. Giữ mặc định.`);
    return {};
  }

  const data = await response.json();
  // Route trả { seeded: false } khi chưa có override → xem như partial rỗng.
  if (!data || data.seeded === false) return {};
  const { seeded, ...partial } = data;
  return partial as Partial<SiteContent>;
}

/**
 * Fetch and map products from a WooCommerce-enabled WordPress site.
 * Endpoint: /wp-json/wc/v3/products
 */
export async function fetchWooCommerceProducts(config = getWordPressConfig()): Promise<Product[]> {
  if (!config.useWordPress || !config.apiUrl) {
    throw new Error('WooCommerce integration is not enabled or API URL is missing.');
  }

  const base = config.apiUrl;
  // Construct WooCommerce REST API URL with Auth query parameters
  const url = `${base}/wp-json/wc/v3/products?consumer_key=${config.consumerKey}&consumer_secret=${config.consumerSecret}&per_page=100`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
  }

  const wcProducts = await response.json();

  return wcProducts.map((wc: any): Product => {
    // Map WooCommerce categories/tags to LIORA structure
    const categories = wc.categories?.map((c: any) => c.slug) || [];
    const cat = categories.includes('bst') || categories.includes('collection') ? 'bst'
      : categories.includes('diy') || categories.includes('charm') ? 'diy'
      : 'vong-tay';
    const subcat = categories.length > 0 ? categories[0] : 'vong-tay-da';

    // Pricing
    const price = parseFloat(wc.price) || 0;
    const originalPrice = parseFloat(wc.regular_price) > price 
      ? parseFloat(wc.regular_price) 
      : undefined;

    // Standard properties
    const images = wc.images?.map((img: any) => img.src) || [];
    const image = images[0] || undefined;
    const imageHover = images[1] || undefined;
    const gallery = images.slice(2);

    // Extract average rating
    const rating = parseFloat(wc.average_rating) || 4.5;
    const reviewCount = parseInt(wc.rating_count) || 8;

    // Stock
    const inStock = wc.manage_stock && wc.stock_quantity !== null
      ? wc.stock_quantity
      : wc.stock_status === 'instock' ? 10 : 0;

    // Pick shape based on categories, tags, or fallback
    let shape: ShapeKey = 'sparkle';
    if (categories.includes('love') || wc.name?.toLowerCase().includes('đôi')) shape = 'heart';
    else if (categories.includes('ring') || wc.name?.toLowerCase().includes('nhẫn')) shape = 'ring';
    else if (categories.includes('necklace') || wc.name?.toLowerCase().includes('dây chuyền')) shape = 'gem';
    else if (categories.includes('bracelet') || wc.name?.toLowerCase().includes('lắc')) shape = 'bracelet';

    return {
      slug: wc.slug || `wc-${wc.id}`,
      code: wc.sku || `LR-${wc.id}`,
      name: wc.name || 'Sản phẩm WooCommerce',
      cat,
      subcat,
      price,
      originalPrice,
      tint: '#fdf4f6',
      tint2: '#ffcfdd',
      accent: '#f472a0',
      hot: wc.featured,
      sold: inStock === 0,
      shape: shape as ShapeKey,
      image,
      imageHover,
      gallery,
      description: stripHtml(wc.short_description || wc.description || ''),
      longDescription: stripHtml(wc.description || ''),
      seoTitle: wc.name ? `${wc.name} | LIORA Jewelry` : undefined,
      seoDescription: stripHtml(wc.short_description || wc.description || '').slice(0, 160) || undefined,
      seoKeywords: wc.tags?.map((tag: any) => tag.name).filter(Boolean).join(', ') || undefined,
      material: wc.attributes?.find((a: any) => a.name?.toLowerCase().includes('chất liệu'))?.options?.[0] || 'Bạc Cao Cấp',
      rating,
      reviewCount,
      inStock,
    };
  });
}
