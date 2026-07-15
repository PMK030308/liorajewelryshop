import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { NewsArticle } from '../types';

const PAGE_SIZE = 9;

/**
 * Trang Tin tức — hiển thị danh sách bài viết lấy từ WordPress headless
 * (fetch qua /wp-json/wp/v2/posts khi bật tích hợp WP).
 *
 * Tất cả bài đã published được tải về (fetchWordPressPosts phân trang tự động),
 * tại đây render có phân trang UI (PAGE_SIZE bài/trang) để duyệt thoải mái.
 *
 * Mỗi bài là card link nội bộ tới /news/<slug> — nội dung đầy đủ được render
 * ngay trong web app (ArticlePage). Bài gốc tối ưu SEO vẫn do WordPress render
 * trên blog.liorajewelry.com (canonical), và được cập nhật tự động mỗi khi viết
 * bài mới bên WP.
 *
 * Khi WP chưa bật / fetch thất bại → fallback hiển thị bài mẫu seed (nếu có),
 * hoặc CTA hướng dẫn bật tích hợp WordPress trong Admin.
 */
export default function NewsPage() {
  const { state, navigate } = useStore();

  const articles: NewsArticle[] = state.siteContent.newsArticles;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => articles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [articles, safePage],
  );

  const openArticle = (a: NewsArticle) => {
    const key = a.slug || a.id;
    if (key) navigate(`/news/${key}`);
  };

  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page">
      {/* Hero tiêu đề trang */}
      <section className="container-x pt-10 pb-6 md:pt-14 md:pb-8 text-center">
        <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">TIN TỨC LIORA</div>
        <h1 className="sec-title">Tin tức & Kiến thức trang sức</h1>
        <p className="text-sm md:text-base text-ink2 max-w-2xl mx-auto mt-3">
          Cập nhật xu hướng trang sức bạc, đá quý, cách bảo quản và phối đồ — bài viết được soạn chuẩn SEO trên WordPress và hiển thị ngay tại website.
        </p>
        {articles.length > 0 && (
          <p className="text-xs text-mute mt-2">Tổng {articles.length} bài viết</p>
        )}
      </section>

      {articles.length > 0 ? (
        <section className="container-x section-y">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {paged.map(article => {
              const key = article.slug || article.id || article.title;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => openArticle(article)}
                  className="group rounded-2xl overflow-hidden border border-rule bg-white shadow-card hover:shadow-[0_14px_36px_rgba(178,58,104,0.14)] transition-all hover:-translate-y-1 flex flex-col text-left"
                >
                  <div className="aspect-[16/10] bg-brand-50 overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-300">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4h16v16H4z"/><path d="M8 4v16M16 4v16M4 8h16M4 16h16"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="text-[11px] text-mute mb-1.5">{article.date}</div>
                    <h2 className="font-semibold text-ink leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">{article.title}</h2>
                    <p className="text-sm text-ink2 line-clamp-3 flex-1">{article.excerpt}</p>
                    <span className="mt-3 text-xs font-semibold text-brand-700 inline-flex items-center gap-1">
                      Đọc tiếp <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => go(safePage - 1)}
                disabled={safePage <= 1}
                className="px-3 py-2 rounded-md border border-rule text-sm text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-50 transition-colors"
                aria-label="Trang trước"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // Hiển thị trang đầu, trang cuối, các trang quanh trang hiện tại
                const near = Math.abs(p - safePage) <= 1;
                const edge = p === 1 || p === totalPages;
                if (!near && !edge) {
                  // Chỉ hiển thị "..." tại các vị trí chuyển đổi (tránh lặp)
                  if (p === 2 || p === totalPages - 1) {
                    return <span key={p} className="px-2 text-mute">…</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => go(p)}
                    className={`min-w-[36px] px-3 py-2 rounded-md border text-sm transition-colors ${
                      p === safePage
                        ? 'bg-brand-700 text-white border-brand-700'
                        : 'border-rule text-ink hover:bg-brand-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => go(safePage + 1)}
                disabled={safePage >= totalPages}
                className="px-3 py-2 rounded-md border border-rule text-sm text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-50 transition-colors"
                aria-label="Trang sau"
              >
                ›
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Fallback: WP chưa bật / fetch fail → CTA hướng dẫn bật tích hợp. */
        <section className="container-x section-y">
          <div className="rounded-3xl overflow-hidden border border-rule bg-gradient-to-br from-brand-50 via-white to-brand-100 px-6 py-12 md:py-16 text-center shadow-card">
            <p className="text-sm md:text-base text-ink2 max-w-2xl mx-auto mb-7">
              Chưa có bài viết nào. Bật tích hợp WordPress trong Admin → Cấu hình WordPress để các bài viết soạn chuẩn SEO bên WP tự hiển thị tại đây.
            </p>
            <button
              onClick={() => navigate('/admin/wordpress')}
              className="btn-pink inline-flex items-center gap-2"
            >
              Cấu hình WordPress
              <span className="transition-transform">→</span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}