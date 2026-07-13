import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { getWordPressConfig, fetchWordPressPostBySlug } from '../utils/wordpressService';
import { NewsArticle } from '../types';

/**
 * Trang chi tiết một bài Tin tức — render nội dung đầy đủ ngay trong web app
 * (lấy từ WordPress headless: state.siteContent.newsArticles, hoặc fetch lẻ theo slug
 * khi mở link trực tiếp và bài chưa có trong store).
 *
 * Bài gốc do WordPress render trên blog.liorajewelry.com để tối ưu SEO;
 * link gốc (canonical) được giữ ở article.link.
 */
interface Props {
  slug: string;
}

export default function ArticlePage({ slug }: Props) {
  const { state, navigate } = useStore();
  const [remote, setRemote] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Tìm bài trong store theo slug (WP) hoặc id (seed bài mẫu).
  const article = useMemo(
    () => state.siteContent.newsArticles.find(a => a.slug === slug || a.id === slug) || null,
    [state.siteContent.newsArticles, slug]
  );

  // Khi chưa có trong store + WP đang bật → fetch lẻ bài theo slug (hỗ trợ mở link trực tiếp).
  useEffect(() => {
    if (article) { setNotFound(false); return; }
    const config = getWordPressConfig();
    if (!config.useWordPress || !config.apiUrl) { setNotFound(true); return; }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetchWordPressPostBySlug(slug, config)
      .then(post => {
        if (cancelled) return;
        if (post) setRemote(post);
        else setNotFound(true);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[Liora] load bài tin tức theo slug thất bại:', err);
        setNotFound(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [article, slug]);

  const data = article || remote;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (loading && !data) {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <div className="inline-block w-10 h-10 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-mute mt-4 text-sm">Đang tải bài viết…</p>
      </main>
    );
  }

  if (notFound || !data) {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-3">Không tìm thấy bài viết</h1>
        <p className="text-ink2 mb-6">Bài viết không tồn tại hoặc đã bị gỡ.</p>
        <a className="btn-pink" href="#/news" onClick={(e) => { e.preventDefault(); navigate('/news'); }}>
          Về trang Tin tức
        </a>
      </main>
    );
  }

  return (
    <main className="page">
      {/* Breadcrumb */}
      <section className="container-x pt-8 pb-2">
        <div className="text-xs text-mute">
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
          {' / '}
          <a href="#/news" onClick={(e) => { e.preventDefault(); navigate('/news'); }} className="hover:text-brand-500">Tin tức</a>
          {' / '}
          <span className="text-ink2 line-clamp-1">{data.title}</span>
        </div>
      </section>

      {/* Header bài */}
      <section className="container-x pt-4 pb-6 md:pt-6 md:pb-8 text-center max-w-3xl mx-auto">
        <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">TIN TỨC LIORA</div>
        <h1 className="sec-title text-3xl md:text-4xl">{data.title}</h1>
        <div className="text-xs text-mute mt-3">{data.date}</div>
      </section>

      {/* Ảnh đại diện */}
      {data.image && (
        <section className="container-x mb-8 md:mb-10">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-rule shadow-card">
            <img
              src={data.image}
              alt={data.title}
              className="w-full aspect-[16/9] object-cover"
              decoding="async"
            />
          </div>
        </section>
      )}

      {/* Nội dung bài */}
      <section className="container-x pb-14 md:pb-20">
        <div className="max-w-3xl mx-auto">
          {data.content ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          ) : data.excerpt ? (
            <p className="text-ink2 leading-relaxed">{data.excerpt}</p>
          ) : (
            <p className="text-mute">Bài viết chưa có nội dung.</p>
          )}

          {/* Link bài gốc trên blog (canonical / SEO) */}
          {data.link && (
            <div className="mt-10 pt-6 border-t border-rule text-sm text-mute">
              Bài gốc tối ưu SEO trên Blog Liora:{' '}
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:text-brand-500 font-semibold"
              >
                Xem tại blog.liorajewelry.com →
              </a>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href="#/news"
              onClick={(e) => { e.preventDefault(); navigate('/news'); }}
              className="inline-flex items-center gap-2 border-2 border-brand-700 text-brand-700 px-6 py-3 rounded-md font-semibold text-sm hover:bg-brand-700 hover:text-white transition-colors"
            >
              <span>←</span> Xem thêm tin tức khác
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}