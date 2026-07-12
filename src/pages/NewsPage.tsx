import { useEffect } from 'react';
import { BLOG_URL } from '../lib/blogUrl';

/**
 * Trang /news đã chuyển sang blog WordPress (blog.liorajewelry.com) — do WordPress
 * tự render để SEO (web React dùng hash routing nên không index được bài viết).
 *
 * Trang này chỉ làm redirect mượt cho link/hash cũ (/#/news) sang blog, tránh đứt link.
 * Code headless WP cũ (lấy bài qua REST API) đã ngủ đông — không dùng trong luồng này.
 */
export default function NewsPage() {
  useEffect(() => {
    window.location.href = BLOG_URL;
  }, []);

  return (
    <main className="page container-x py-20 text-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-3 text-ink">Đang chuyển đến Blog Liora…</h1>
      <p className="text-sm text-ink2 mb-6">
        Tin tức &amp; blog đã chuyển sang WordPress để tối ưu SEO.
      </p>
      <a className="btn-pink" href={BLOG_URL}>Đi tới Blog Liora →</a>
    </main>
  );
}