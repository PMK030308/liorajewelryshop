import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { NEWS_ARTICLES as STATIC_NEWS } from '../data';
import Shapes from '../data/shapes';
import { getWordPressConfig, fetchWordPressPosts } from '../utils/wordpressService';
import { NewsArticle } from '../types';

export default function NewsPage() {
  const { state, navigate } = useStore();
  const [articles, setArticles] = useState<NewsArticle[]>(
    state.siteContent.newsArticles.length ? state.siteContent.newsArticles : STATIC_NEWS,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    const config = getWordPressConfig();
    if (!config.useWordPress) {
      setArticles(state.siteContent.newsArticles.length ? state.siteContent.newsArticles : STATIC_NEWS);
      return;
    }
    if (config.useWordPress && config.apiUrl) {
      setLoading(true);
      fetchWordPressPosts(config)
        .then(data => {
          if (data && data.length > 0) {
            setArticles(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Không thể kết nối đến máy chủ WordPress. Đang hiển thị tin tức lưu trữ.');
          setLoading(false);
        });
    }
  }, [state.siteContent.newsArticles]);

  if (selectedArticle) {
    return (
      <main className="page container-x py-10 max-w-4xl mx-auto">
        <div className="text-xs text-mute mb-4">
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> 
          <span className="mx-1.5">/</span>
          <a 
            href="#/news" 
            onClick={(e) => { 
              e.preventDefault(); 
              setSelectedArticle(null); 
            }} 
            className="hover:text-brand-500"
          >
            Tin Tức
          </a> 
          <span className="mx-1.5">/</span> 
          <span className="text-ink line-clamp-1 inline">{selectedArticle.title}</span>
        </div>

        <button
          onClick={() => setSelectedArticle(null)}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-850 transition"
        >
          ← Quay lại danh sách
        </button>

        <header className="mb-8">
          <div className="text-xs text-mute mb-2 flex items-center gap-2">
            <span>📅 {selectedArticle.date}</span>
            <span>•</span>
            <span>Bởi Liorajewelry</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight text-ink mb-4">{selectedArticle.title}</h1>
        </header>

        {selectedArticle.image ? (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] shadow-sm bg-soft">
            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div 
            className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${selectedArticle.tint} 75%, ${selectedArticle.tint})` }}
          >
            <div className="w-20 h-20" style={{ color: selectedArticle.accent }}>{Shapes.sparkle}</div>
          </div>
        )}

        {/* Article content */}
        <div 
          className="prose max-w-none text-ink2 leading-relaxed text-sm md:text-base space-y-6 entry-content" 
          dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.excerpt }} 
        />
        
        {/* Style block dedicated to rendering WordPress HTML inside .entry-content properly */}
        <style>{`
          .entry-content p {
            margin-bottom: 1.5rem;
            line-height: 1.75;
          }
          .entry-content h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #9f1239;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .entry-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #9f1239;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .entry-content ul, .entry-content ol {
            margin-left: 1.5rem;
            margin-bottom: 1.5rem;
            list-style-position: outside;
          }
          .entry-content ul {
            list-style-type: disc;
          }
          .entry-content ol {
            list-style-type: decimal;
          }
          .entry-content li {
            margin-bottom: 0.5rem;
          }
          .entry-content blockquote {
            border-left: 4px solid #c96b8d;
            padding-left: 1.5rem;
            font-style: italic;
            color: #4a5568;
            margin: 1.5rem 0;
          }
          .entry-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem auto;
            display: block;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / Tin Tức
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Tin tức & Blog</h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="font-semibold hover:opacity-85">Đóng</button>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-card p-5 space-y-4">
              <div className="bg-brand-100 aspect-[16/10] rounded-xl" />
              <div className="h-4 bg-brand-100 w-1/3 rounded" />
              <div className="h-6 bg-brand-100 w-3/4 rounded" />
              <div className="h-4 bg-brand-100 w-full rounded" />
              <div className="h-4 bg-brand-100 w-5/6 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map(n => (
            <a 
              key={n.title} 
              href="#/news" 
              onClick={(e) => { 
                e.preventDefault(); 
                setSelectedArticle(n); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition"
            >
              <div 
                className="photo aspect-[16/10] bg-cover bg-center" 
                style={n.image 
                  ? { backgroundImage: `url(${n.image})` } 
                  : { backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${n.tint} 75%, ${n.tint})` } as React.CSSProperties
                }
              >
                {!n.image && <div className="sil" style={{ color: n.accent }}>{Shapes.sparkle}</div>}
              </div>
              <div className="p-5">
                <div className="text-xs text-mute mb-2">📅 {n.date}</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-500 line-clamp-2">{n.title}</h3>
                <p className="text-sm text-ink2 line-clamp-3 mb-3">{n.excerpt}</p>
                <span className="text-brand-500 text-sm font-medium">Đọc tiếp →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
