import { useStore } from '../store/useStore';
import { NewsArticle } from '../types';

/**
 * Trang Tin tức — hiển thị danh sách bài viết lấy từ WordPress headless
 * (fetch qua /wp-json/wp/v2/posts khi bật tích hợp WP).
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

  const openArticle = (a: NewsArticle) => {
    const key = a.slug || a.id;
    if (key) navigate(`/news/${key}`);
  };

  return (
    <main className="page">
      {/* Hero tiêu đề trang */}
      <section className="container-x pt-10 pb-6 md:pt-14 md:pb-8 text-center">
        <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">TIN TỨC LIORA</div>
        <h1 className="sec-title">Tin tức &amp; Kiến thức trang sức</h1>
        <p className="text-sm md:text-base text-ink2 max-w-2xl mx-auto mt-3">
          Cập nhật xu hướng trang sức bạc, đá quý, cách bảo quản và phối đồ — bài viết được soạn chuẩn SEO trên WordPress và hiển thị ngay tại website.
        </p>
      </section>

      {articles.length > 0 ? (
        <section className="container-x section-y">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {articles.map(article => {
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