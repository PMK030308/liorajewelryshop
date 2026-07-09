import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import Shapes from '../data/shapes';
import { DEFAULT_ABOUT } from '../data';
import type { AboutContent, AboutStoryBlock } from '../types';

const photoBg = (src?: string, fallback = 'radial-gradient(120% 80% at 50% 30%, #ffffff, #f9e5ea 75%, #f2c8d2)') =>
  src
    ? { backgroundImage: `url("${src.replace(/"/g, '\\"')}")` }
    : { backgroundImage: fallback };

export default function AboutPage() {
  const { navigate } = useStore();
  const a: AboutContent = useStore().state.siteContent.about ?? DEFAULT_ABOUT;

  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / Giới Thiệu
      </div>

      {/* Tiêu đề + tagline */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{a.title}</h1>
        <div className="text-brand-500 font-medium flex items-center gap-2">
          <Sparkles size={16} strokeWidth={1.8} /> {a.tagline}
        </div>
      </div>

      {/* Hero: ảnh + đoạn mở đầu */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-12 items-center">
        <div
          className="rounded-2xl overflow-hidden photo aspect-[4/3] shadow-card bg-cover bg-center"
          style={photoBg(a.heroImage) as React.CSSProperties}
        >
          {!a.heroImage && (
            <div className="w-full h-full flex items-center justify-center" style={{ color: '#c2537a' }}>
              <div className="w-20 h-20">{Shapes.gem}</div>
            </div>
          )}
        </div>
        <div
          className="text-ink2 leading-relaxed space-y-4 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-ink [&_em]:text-brand-600"
          dangerouslySetInnerHTML={{ __html: a.intro }}
        />
      </div>

      {/* Dải con số thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-soft rounded-2xl p-6 md:p-8 mb-14">
        {a.stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-brand-500 mb-1">{s.value}</div>
            <div className="text-sm text-ink2">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Các khối câu chuyện (so le trái/phải) */}
      {a.story.length > 0 && (
        <section className="space-y-12 md:space-y-16 mb-14">
          {a.story.map((block, i) => (
            <StoryBlock key={block.id} block={block} reverse={i % 2 === 1} />
          ))}
        </section>
      )}

      {/* Sứ mệnh */}
      {a.mission && (
        <section className="mb-14">
          <div
            className="rounded-2xl p-6 md:p-10 bg-cover bg-center"
            style={{ backgroundImage: 'radial-gradient(120% 100% at 50% 0%, #ffffff, #fdf4f6 70%, #f9e5ea)' }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 text-brand-500 text-sm font-semibold mb-4">
                <Sparkles size={15} strokeWidth={1.8} /> Sứ mệnh của chúng mình
              </div>
              <div
                className="text-ink2 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-ink"
                dangerouslySetInnerHTML={{ __html: a.mission }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Giá trị cốt lõi */}
      {a.values.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-center mb-2">Giá trị cốt lõi</h2>
          <p className="text-center text-ink2 mb-8 text-sm">Những điều LIORA luôn kiên định theo đuổi</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {a.values.map(v => (
              <div key={v.id} className="bg-white border border-rule rounded-2xl p-6 text-center hover:shadow-card transition">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <div className="w-7 h-7">{Shapes[v.icon] ?? Shapes.gem}</div>
                </div>
                <h3 className="font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink2 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lời kêu gọi hành động */}
      <section className="mb-4">
        <div
          className="rounded-2xl p-8 md:p-12 text-center bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(135deg, #fdf4f6, #f9e5ea)' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">{a.ctaTitle}</h2>
          <p className="text-ink2 max-w-2xl mx-auto mb-6 leading-relaxed">{a.ctaText}</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-700 text-white font-semibold hover:bg-brand-800 transition"
          >
            Khám phá bộ sưu tập <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

function StoryBlock({ block, reverse }: { block: AboutStoryBlock; reverse: boolean }) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div
        className="rounded-2xl overflow-hidden photo aspect-[4/3] shadow-card bg-cover bg-center"
        style={photoBg(block.image) as React.CSSProperties}
      >
        {!block.image && (
          <div className="w-full h-full flex items-center justify-center" style={{ color: '#c2537a' }}>
            <div className="w-20 h-20">{Shapes.flower}</div>
          </div>
        )}
      </div>
      <div className={reverse ? 'md:order-1' : ''}>
        {block.title && <h3 className="text-xl md:text-2xl font-bold text-ink mb-3">{block.title}</h3>}
        <p className="text-ink2 leading-relaxed">{block.text}</p>
      </div>
    </div>
  );
}