import React from 'react';
import { useStore } from '../store/useStore';
import { NEWS_ARTICLES } from '../data';
import Shapes from '../data/shapes';

export default function NewsPage() {
  const { navigate } = useStore();
  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / Tin Tức
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Tin tức & Blog</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {NEWS_ARTICLES.map(n => (
          <a key={n.title} href="#/news" onClick={(e) => e.preventDefault()} className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition">
            <div className="photo aspect-[16/10]" style={{ backgroundImage:`radial-gradient(120% 80% at 50% 30%, #ffffff, ${n.tint} 75%, ${n.tint})` } as React.CSSProperties}>
              <div className="sil" style={{ color: n.accent }}>{Shapes.sparkle}</div>
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
    </main>
  );
}
