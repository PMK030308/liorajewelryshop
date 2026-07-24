import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { HERO_CATS, HERO_SLIDES, BRAND_IMAGES, fmt } from '../data';
import ProductGrid from '../components/ProductGrid';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import Testimonials from '../components/Testimonials';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip';

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, ease: [0.2, 0.6, 0.2, 1] }}
  >
    {children}
  </motion.div>
);
function CategorySlider({ setFilterNav }: { setFilterNav: (slug: string) => void }) {
  const { state } = useStore();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.6;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const tiles = state.siteContent.categoryTiles || [
    { id: 'bst',       title: 'Bộ Sưu Tập',          slug: 'bst',      img: '/product/BST _HÀNH TRÌNH NỞ HOA_ - CHẠM_Vòng tay hợp kim mạ bạc.jpg' },
    { id: 'vong-tay',  title: 'Vòng Tay Đơn',         slug: 'vong-tay', img: '/product/Vòng tay hợp kim mạ bạc - Charm Nơ Hồng.png' },
    { id: 'diy',       title: 'Phụ Kiện DIY',        slug: 'diy',      img: '/product/Vòng trơn hợp kim mạ bạc.png' },
    { id: 'bst-xuan-ha-thu-dong', title: 'BST Xuân Hạ Thu Đông', slug: 'bst-xuan-ha-thu-dong', img: '/product/BST _XUÂN HẠ THU ĐÔNG_ - RỰC_Vòng tay hợp kim mạ bạc.jpg' },
  ];

  return (
    <section className="bg-white section-y relative">
      <div className="container-x relative">
        <div
          ref={scrollerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 no-scrollbar pb-8"
        >
          {tiles.map((c) => (
            <div key={c.id} className="snap-start flex-none w-[85%] md:w-[45%] lg:w-[32%] relative" data-card>
              <a
                href={`#/shop?cat=${c.slug ?? c.id}`}
                onClick={(e) => { e.preventDefault(); setFilterNav(c.slug ?? c.id); }}
                className="block cat-card-new group h-[400px] md:h-[480px]"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).style.background = '#fff7f9'; }}
                  className="photo absolute inset-0 w-full h-full object-cover"
                />
                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/30 pointer-events-none" />
                {/* Watermark Top */}
                <div className="absolute top-8 left-0 right-0 flex flex-col items-center pointer-events-none">
                  <div className="font-bold text-xl md:text-2xl tracking-[0.25em] text-white drop-shadow-md">LIORAJEWELRY</div>
                  <div className="mt-2.5 flex items-center justify-center gap-2.5 drop-shadow-md">
                    <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/70" />
                    <span className="text-white/95 text-[11px] md:text-xs font-light uppercase tracking-[0.42em] whitespace-nowrap">
                      Own Your Shine
                    </span>
                    <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/70" />
                  </div>
                </div>
                {/* Hover Panel Bottom */}
                <div className="hover-panel">
                  <div className="hover-name">{c.title}</div>
                  <div className="hover-btn">
                    <button className="bg-brand-400 text-white hover:bg-brand-600 transition-colors text-[11px] font-semibold px-5 py-1.5 rounded uppercase tracking-[0.18em]">
                      Xem Ngay
                    </button>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        {/* Slider Arrows — small, white, overlap card edges */}
        <button
          onClick={() => scrollBy(-1)}
          className="hidden md:flex absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-card items-center justify-center text-ink hover:bg-soft transition z-10 border border-rule"
          aria-label="Lùi"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="hidden md:flex absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-card items-center justify-center text-ink hover:bg-soft transition z-10 border border-rule"
          aria-label="Tiếp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </section>
  );
}

function HeroSlideItem({ idx }: { idx: number }) {
  const { state, navigate, dispatch } = useStore();
  const slides = state.siteContent.heroSlides.length ? state.siteContent.heroSlides : HERO_SLIDES;
  const settings = state.siteContent.settings;
  const s = slides[idx % slides.length];
  const setFilterNav = (slug: string) => { dispatch({ type: 'SET_FILTER', payload: slug }); navigate('/shop'); };

  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.8, ease: [0.2, 0.6, 0.2, 1] }}
      className="absolute inset-0"
    >
      {/* Nền trắng chủ đạo, ảnh sản phẩm là điểm nhấn chính */}
      <div className="absolute inset-0 flex items-center bg-white">
        {/* Đường nét trang trí cực nhạt */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,200 C300,100 900,300 1200,200" fill="none" stroke="#F2DCE5" strokeWidth="1.5" opacity="0.7" />
        </svg>
        <div className="container-x grid md:grid-cols-2 gap-6 items-center w-full relative z-10">
          <div className="text-center px-4 md:px-10 py-8 md:py-12 relative">
            <a
              href="#/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="flex flex-col items-center mb-6 md:mb-8 hover:opacity-90 transition-opacity"
            >
              <img src="/logoliora2.jpg" alt="LIORA" className="object-contain h-14 md:h-16 w-auto mix-blend-multiply" />
            </a>

            {/* Tiêu đề serif nâu/xám đậm, không dùng khối nền hồng */}
            <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-semibold text-ink leading-tight tracking-wide mb-5 whitespace-pre-line">
              {s.plaque}
            </h1>

            {/* Slogan */}
            <div className="mb-8 flex items-center justify-center gap-3 md:gap-4">
              <span className="h-px w-8 md:w-12 bg-brand-300" />
              <span className="font-sans text-sm md:text-base font-light uppercase tracking-[0.42em] text-brand-600 whitespace-nowrap">
                Own Your Shine
              </span>
              <span className="h-px w-8 md:w-12 bg-brand-300" />
            </div>

            {/* CTA button hồng pastel */}
            <a
              href="#/shop"
              onClick={(e) => { e.preventDefault(); setFilterNav('all'); }}
              className="btn-primary mb-8"
            >
              Khám phá bộ sưu tập
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </a>

            {/* Store Info — chỉ icon Facebook/Shopee, QR chuyển xuống Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <div className="flex flex-col gap-2.5 text-left">
                <div className="flex items-start gap-2 text-ink2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 flex-shrink-0 text-brand-500">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-xs md:text-sm leading-snug font-medium">{settings.address}</span>
                </div>
                <div className="flex items-center gap-2 text-ink2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-shrink-0 text-brand-500">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="text-xs md:text-sm font-medium">{settings.openHours}</span>
                </div>
              </div>
              {/* Chỉ icon Facebook/Shopee — QR đã chuyển xuống Footer */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-600 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all"
                  title="Facebook Liora"
                  aria-label="Facebook Liora"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.46 1.47-3.83 3.72-3.83 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89H13.5v6.98A10 10 0 0 0 22 12Z"/></svg>
                </a>
                <a
                  href={settings.shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-600 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all"
                  title="Shopee Liora"
                  aria-label="Shopee Liora"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 7h14l.9 11.2A2 2 0 0 1 17.9 20.5H6.1a2 2 0 0 1-2-1.8L5 7Zm5.2-2.5a1.8 1.8 0 0 1 3.6 0V6h2v-1.5a3.8 3.8 0 0 0-7.6 0V6h2v-1.5Z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center relative order-first md:order-last mb-4 md:mb-0">
            <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-80 md:h-[32rem] lg:w-96 lg:h-[36rem] rounded-full overflow-hidden border-[4px] md:border-[6px] border-brand-100 hero-float bg-brand-100">
              {s.image && (
                <img
                  src={s.image}
                  alt={s.imageAlt || 'Người mẫu LIORA'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}
              {/* Soft inner glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(255,255,255,0.4)' }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const BST_COLLECTIONS = [
  {
    id: 'bst-hanh-trinh',
    title: 'Hành Trình Nở Hoa',
    subtitle: 'Mỗi khoảnh khắc đều rạng ngời',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - NẮNG_Vòng tay hợp kim mạ bạc.jpg',
    accent: 'from-rose-500/70 to-rose-500/0',
  },
  {
    id: 'bst-xuan-ha-thu-dong',
    title: 'Xuân Hạ Thu Đông',
    subtitle: 'Bốn mùa, một câu chuyện',
    image: '/product/BST _XUÂN HẠ THU ĐÔNG_ - RỰC_Vòng tay hợp kim mạ bạc.jpg',
    accent: 'from-amber-500/70 to-amber-500/0',
  },
];

function BstShowcase({ setFilterNav }: { setFilterNav: (slug: string) => void }) {
  const { state } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeProducts = activeId
    ? state.products.filter(p => p.cat === 'bst' && p.subcat === activeId)
    : [];

  return (
    <div>
      {/* 2 BST Cards */}
      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {BST_COLLECTIONS.map((bst, idx) => {
          const isActive = activeId === bst.id;
          return (
            <button
              key={bst.id}
              onClick={() => setActiveId(isActive ? null : bst.id)}
              className={`group relative block w-full text-left overflow-hidden rounded-xl border transition-all duration-500 ${
                isActive
                  ? 'border-brand-400 shadow-cardHover'
                  : 'border-black/5 shadow-card hover:shadow-cardHover'
              }`}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-soft">
                <img
                  src={bst.image}
                  alt={bst.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                {/* Legibility gradient at bottom only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Editorial index */}
                <div className="absolute top-4 left-4 text-white/60 text-[10px] font-medium tracking-[0.3em]">
                  0{idx + 1}
                </div>

                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-px w-5 bg-white/60" />
                    <span className="text-white/80 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-medium">Bộ Sưu Tập</span>
                  </div>
                  <h3 className="text-white text-lg md:text-xl font-semibold leading-tight mb-0.5">{bst.title}</h3>
                  <p className="text-white/70 text-[11px] md:text-xs font-light italic mb-3">{bst.subtitle}</p>
                  <div className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    <span>{isActive ? 'Thu gọn' : 'Khám phá'}</span>
                    <svg
                      width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Products */}
      <AnimatePresence mode="wait">
        {activeId && activeProducts.length > 0 && (
          <motion.div
            key={activeId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-8">
              <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-ink">
                BST {BST_COLLECTIONS.find(b => b.id === activeId)?.title}
                <span className="text-sm font-normal text-mute ml-2">({activeProducts.length} sản phẩm)</span>
              </h3>
              <button
                onClick={() => setFilterNav(activeId)}
                className="text-sm text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                  Xem tất cả
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
                </button>
              </div>
              <ProductGrid products={activeProducts} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const { state, dispatch, navigate } = useStore();
  const slideCount = state.siteContent.heroSlides.length || HERO_SLIDES.length;
  const slideRef = useRef(state.slide);
  slideRef.current = state.slide;
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (heroPaused) return;
    const interval = setInterval(() => {
      dispatch({ type: 'SET_SLIDE', payload: slideRef.current + 1 });
    }, 7000);
    return () => clearInterval(interval);
  }, [dispatch, heroPaused]);

  const setFilterNav = (slug: string) => { dispatch({ type: 'SET_FILTER', payload: slug }); navigate('/shop'); };

  const shapeLookup: Record<string, 'bracelet' | 'gem' | 'heart' | 'star' | 'bow'> = {
    'bst': 'bracelet', 'vong-tay': 'bracelet', 'diy': 'star',
  };


  const bestSellerProducts = state.products.filter(p => p.cat === 'vong-tay').slice(0, 12);

  // Bài tin tức lấy từ WordPress headless (hoặc seed) — hiển thị tại web, link nội bộ tới /news/<slug>.
  const wpNews = state.siteContent.newsArticles.slice(0, 6);

  const trustBadges: { icon: React.ReactNode; t: string; s: string }[] = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h-2v13H1V6a3 3 0 0 1 3-3h12v13"/><path d="M16 8h4l3 4v4h-7"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      t: 'Giao hàng miễn phí', s: 'Với đơn hàng từ 500k trở lên',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      ),
      t: 'Hỗ trợ 24/7', s: 'Tư vấn online / offline mọi lúc',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>
        </svg>
      ),
      t: 'Miễn phí đổi trả', s: 'Trong vòng 7 ngày kể từ ngày nhận',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92Z"/>
        </svg>
      ),
      t: 'Đặt hàng trực tuyến', s: `Hotline ${state.siteContent.settings.hotline}`,
    },
  ];

  return (
    <main className="page">
      {/* Hero Slider */}
      <section className="relative">
        <div
          className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[24/9] overflow-hidden bg-white"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <AnimatePresence mode="sync" initial={false}>
            <HeroSlideItem key={state.slide} idx={state.slide} />
          </AnimatePresence>
          <button className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-12 md:px-6 z-10 text-brand-400 hover:text-brand-600 transition-colors" onClick={() => dispatch({ type: 'SET_SLIDE', payload: state.slide - 1 })} aria-label="Trước">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-12 md:px-6 z-10 text-brand-400 hover:text-brand-600 transition-colors" onClick={() => dispatch({ type: 'SET_SLIDE', payload: state.slide + 1 })} aria-label="Sau">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button key={i} onClick={() => dispatch({ type: 'SET_SLIDE', payload: i })} className={`w-2 h-2 rounded-full transition ${state.slide === i ? 'bg-brand-500' : 'bg-brand-300'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>


      {/* New Category Section */}
      <CategorySlider setFilterNav={setFilterNav} />

      {/* Bộ Sưu Tập Nổi Bật (BST) */}
      <section className="container-x section-y">
        <Reveal>
          <div className="text-center mb-12">
            <div className="text-[11px] tracking-[0.25em] text-brand-500 font-semibold mb-3 uppercase">Bộ Sưu Tập Nổi Bật</div>
            <h2 className="sec-title">Bộ Sưu Tập Mới Nhất</h2>
            <p className="text-sm text-ink2 mt-3 max-w-xl mx-auto">Thiết kế tinh xảo, phản chiếu nét riêng độc đáo trong từng khoảnh khắc đặc biệt</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <BstShowcase setFilterNav={setFilterNav} />
        </Reveal>
      </section>

      {/* About teaser — zig-zag */}
      <section className="bg-soft section-y">
        <div className="container-x grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden hero-float bg-gradient-to-br from-brand-100 to-brand-200">
                <img
                  src={BRAND_IMAGES.aboutLifestyle}
                  alt="LIORA — Lifestyle"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Decorative second image overlay (bottom right) */}
              <div className="hidden md:block absolute -bottom-6 -right-6 w-1/2 aspect-square rounded-lg overflow-hidden border-[6px] border-white shadow-xl bg-gradient-to-br from-brand-100 to-brand-200">
                <img
                  src={BRAND_IMAGES.aboutLifestyle2}
                  alt="LIORA — Chân dung"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-3">VỀ LIORA</div>
              <h2 className="sec-title mb-5">
                Mỗi món trang sức là <span className="script text-brand-500">lấp lánh</span> riêng của bạn
              </h2>
              <p className="text-ink2 leading-relaxed mb-4">
                LIORA tin rằng mỗi người phụ nữ đều xứng đáng tỏa sáng theo cách của riêng mình. Chúng tôi mang đến những món trang sức tinh tế — chất liệu cao cấp, kiểm định minh bạch, thiết kế tôn dáng — để bạn thêm <span className="script text-brand-500">tự tin</span> trong mọi khoảnh khắc.
              </p>
              <p className="text-ink2 leading-relaxed mb-7">
                Toàn bộ sản phẩm của LIORA đều được chế tác từ hợp kim mạ bạc cao cấp, bảo hành 12 tháng và đổi trả miễn phí trong 7 ngày.
              </p>
              <a
                href="#/about"
                onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                className="btn-outline"
              >
                Xem thêm về chúng tôi
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust badges */}
      <section className="container-x section-y">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {trustBadges.map(b => (
              <div key={b.t} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">{b.icon}</div>
                <div className="font-semibold mb-1 text-ink text-sm">{b.t}</div>
                <div className="text-xs text-mute">{b.s}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Best Sellers */}
      <section className="container-x section-y">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">VÒNG TAY NỔI BẬT</div>
            <h2 className="sec-title">Vòng Tay Nổi Bật</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ProductGrid products={bestSellerProducts} />
          <div className="text-center mt-10">
            <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="btn-primary">Xem tất cả sản phẩm →</a>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* News → Blog WordPress (SEO). Fetch list bài qua REST khi WP headless bật;
          fallback CTA-only khi chưa có bài (WP off / fetch fail). */}
      <section className="container-x section-y">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">BLOG LIORA</div>
            <h2 className="sec-title">Tin tức & Kiến thức trang sức</h2>
          </div>
        </Reveal>

        {wpNews.length > 0 ? (
          <>
            <Reveal delay={0.1}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {wpNews.map(article => {
                  const key = article.slug || article.id || article.title;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => navigate(`/news/${article.slug || article.id}`)}
                      className="group rounded-2xl overflow-hidden border border-rule bg-white shadow-card hover:shadow-cardHover transition-all hover:-translate-y-1 flex flex-col text-left"
                    >
                      <div className="aspect-[16/10] bg-brand-100 overflow-hidden">
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
                        <h3 className="font-semibold text-ink leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">{article.title}</h3>
                        <p className="text-sm text-ink2 line-clamp-3 flex-1">{article.excerpt}</p>
                        <span className="mt-3 text-xs font-semibold text-brand-700 inline-flex items-center gap-1">
                          Đọc tiếp <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Reveal>
            <div className="text-center mt-10">
              <button
                onClick={() => navigate('/news')}
                className="btn-primary inline-flex items-center gap-2"
              >
                Xem tất cả bài viết
                <span className="transition-transform">→</span>
              </button>
            </div>
          </>
        ) : (
          <Reveal delay={0.1}>
            <div className="rounded-3xl overflow-hidden border border-rule bg-brand-100 px-6 py-12 md:py-16 text-center shadow-card">
              <p className="text-sm md:text-base text-ink2 max-w-2xl mx-auto mb-7">
                Cập nhật xu hướng trang sức bạc, đá quý, cách bảo quản và phối đồ — bài viết soạn chuẩn SEO trên WordPress sẽ hiển thị tại đây.
              </p>
              <button
                onClick={() => navigate('/admin/wordpress')}
                className="btn-primary inline-flex items-center gap-2"
              >
                Cấu hình WordPress
                <span className="transition-transform">→</span>
              </button>
            </div>
          </Reveal>
        )}
      </section>

      {/* Recently viewed (localStorage) */}
      <RecentlyViewedStrip />
    </main>
  );
}