/**
 * URL blog WordPress (blog.liorajewelry.com).
 * Blog do WordPress tự render (SEO). Web React chỉ link sang — không fetch data runtime.
 *
 * Đổi qua biến môi trường VITE_BLOG_URL (xem .env.example). Mặc định trỏ subdomain Liora.
 */
export const BLOG_URL: string =
  (import.meta.env.VITE_BLOG_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://cms.liorajewelry.online';
