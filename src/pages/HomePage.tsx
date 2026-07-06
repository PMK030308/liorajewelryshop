import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { HERO_CATS, HERO_SLIDES, NEWS_ARTICLES, BRAND_IMAGES, fmt } from '../data';
import Shapes from '../data/shapes';
import ProductGrid from '../components/ProductGrid';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import Testimonials from '../components/Testimonials';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip';
import { getWordPressConfig, fetchWordPressPosts } from '../utils/wordpressService';
import { NewsArticle } from '../types';

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

const CATEGORY_TILES = [
  { id: 'day-chuyen', title: 'Dây Chuyền', img: 'https://images.unsplash.com/photo-1599643478514-4a4204162810?auto=format&fit=crop&q=80&w=800' },
  { id: 'nhan-don',   title: 'Nhẫn Bạc',   img: 'https://images.unsplash.com/photo-1605100804763-247f52bbfb77?auto=format&fit=crop&q=80&w=800' },
  { id: 'bong-tai',   title: 'Bông Tai',   img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' },
  { id: 'lac-tay',    title: 'Lắc Tay',    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
];

function CategorySlider({ setFilterNav }: { setFilterNav: (slug: string) => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.6;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-16 md:py-24 relative">
      <div className="container-x relative">
        <div
          ref={scrollerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 no-scrollbar pb-8"
        >
          {CATEGORY_TILES.map((c) => (
            <div key={c.id} className="snap-start flex-none w-[85%] md:w-[45%] lg:w-[32%] relative" data-card>
              <a
                href={`#/shop?cat=${c.id}`}
                onClick={(e) => { e.preventDefault(); setFilterNav(c.id); }}
                className="block cat-card-new group h-[400px] md:h-[480px]"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).style.background = '#fff8fa'; }}
                  className="photo absolute inset-0 w-full h-full object-cover"
                />
                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/30 pointer-events-none" />
                {/* Watermark Top */}
                <div className="absolute top-8 left-0 right-0 flex flex-col items-center pointer-events-none">
                  <div className="font-bold text-xl md:text-2xl tracking-[0.25em] text-white drop-shadow-md">LIORAJEWELRY</div>
                  <div className="text-white/95 text-sm font-light tracking-[0.06em] drop-shadow-md flex items-center gap-1.5 mt-2">
                    <span className="uppercase">Lấp Lánh</span>
                    <span className="script text-2xl lowercase leading-none">em xinh</span>
                  </div>
                </div>
                {/* Hover Panel Bottom */}
                <div className="hover-panel">
                  <div className="hover-name">{c.title}</div>
                  <div className="hover-btn">
                    <button className="bg-brand-700 text-white hover:bg-brand-800 transition-colors text-[11px] font-semibold px-5 py-1.5 rounded uppercase tracking-[0.18em]">
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
          className="hidden md:flex absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-card items-center justify-center text-ink hover:bg-brand-50 transition z-10 border border-rule"
          aria-label="Lùi"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="hidden md:flex absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-card items-center justify-center text-ink hover:bg-brand-50 transition z-10 border border-rule"
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
      <div className="absolute inset-0 flex items-center" style={{ background: `linear-gradient(110deg, ${s.tint} 0%, #fffdfd 55%, ${s.tint} 100%)` }}>
        {/* Wavy line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,200 C300,100 900,300 1200,200" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
        </svg>
        {/* Monogram wings — left & right */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[18%] monogram-bg pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 right-0 w-[18%] monogram-bg pointer-events-none" />
        <div className="container-x grid md:grid-cols-2 gap-2 items-center w-full relative z-10">
          <div className="text-center px-4 md:px-8 py-6 relative">
            <a
              href="#/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="flex flex-col items-center mb-4 md:mb-6 hover:opacity-90 transition-opacity"
            >
              <img src="/logoliora2.jpg" alt="LIORA" className="object-contain h-16 md:h-20 w-auto mix-blend-multiply" />
            </a>
            
            {/* Title Frame */}
            <div className="inline-block relative mb-6">
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-brand-300/70"></div>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-brand-300/70"></div>
              <div className="bg-brand-700 text-white px-8 md:px-14 py-5 md:py-7 relative z-10 shadow-[0_16px_36px_rgba(143,63,97,0.22)]">
                <div className="text-lg md:text-2xl lg:text-3xl font-light tracking-[0.12em] uppercase leading-tight whitespace-pre-line">{s.plaque}</div>
              </div>
            </div>

            {/* Slogan */}
            <div className="text-2xl md:text-3xl mt-2 mb-6 flex items-center justify-center gap-3">
              <span className="font-sans font-light uppercase tracking-[0.2em] text-brand-700">Lấp Lánh</span>
              <span className="script text-brand-500 lowercase text-4xl md:text-5xl">em xinh</span>
            </div>

            {/* Store Info — Address, Hours, QR */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              {/* Address & Hours */}
              <div className="flex flex-col gap-2.5 text-left">
                <div className="flex items-start gap-2 text-brand-700">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0 opacity-70">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-xs md:text-sm leading-snug font-medium">{settings.address}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-700">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 opacity-70">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="text-xs md:text-sm font-medium">{settings.openHours}</span>
                </div>
              </div>
              {/* Facebook QR Code */}
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-[0_6px_20px_rgba(201,107,141,0.12)] border border-brand-200 hover:shadow-[0_10px_28px_rgba(201,107,141,0.20)] transition-all hover:scale-105"
              >
                <img
                  src={settings.qrUrl}
                  alt="QR Facebook Liora"
                  width="80"
                  height="80"
                  className="rounded-lg"
                />
                <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-brand-700 tracking-wide">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.46 1.47-3.83 3.72-3.83 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89H13.5v6.98A10 10 0 0 0 22 12Z"/></svg>
                  Follow us
                </div>
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center relative order-first md:order-last mb-4 md:mb-0">
            <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-80 md:h-[32rem] lg:w-96 lg:h-[36rem] rounded-full overflow-hidden border-[4px] md:border-[6px] border-white/70 shadow-[0_12px_30px_-10px_rgba(201,107,141,0.25)] md:shadow-[0_20px_50px_-12px_rgba(201,107,141,0.22)] hero-float bg-gradient-to-b from-brand-100 to-brand-200">
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

export default function HomePage() {
  const { state, dispatch, navigate } = useStore();
  const slideCount = state.siteContent.heroSlides.length || HERO_SLIDES.length;
  const slideRef = useRef(state.slide);
  slideRef.current = state.slide;
  const [heroPaused, setHeroPaused] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>(
    state.siteContent.newsArticles.length ? state.siteContent.newsArticles : NEWS_ARTICLES,
  );

  useEffect(() => {
    const config = getWordPressConfig();
    if (!config.useWordPress) {
      setArticles(state.siteContent.newsArticles.length ? state.siteContent.newsArticles : NEWS_ARTICLES);
    }
  }, [state.siteContent.newsArticles]);

  useEffect(() => {
    if (heroPaused) return;
    const interval = setInterval(() => {
      dispatch({ type: 'SET_SLIDE', payload: slideRef.current + 1 });
    }, 7000);
    return () => clearInterval(interval);
  }, [dispatch, heroPaused]);

  useEffect(() => {
    const config = getWordPressConfig();
    if (config.useWordPress && config.apiUrl) {
      fetchWordPressPosts(config)
        .then(data => {
          if (data && data.length > 0) {
            setArticles(data);
          }
        })
        .catch(err => {
          console.error('Failed to sync posts for homepage:', err);
        });
    }
  }, []);

  const setFilterNav = (slug: string) => { dispatch({ type: 'SET_FILTER', payload: slug }); navigate('/shop'); };

  const shapeLookup: Record<string, 'bracelet' | 'gem' | 'heart' | 'ring' | 'bow'> = {
    'lac-tay': 'bracelet', 'day-chuyen': 'gem', 'cap-doi': 'heart', 'nhan-don': 'ring', 'bong-tai': 'bow',
  };

  const bstProducts = state.products.filter(p => p.cat === 'bst').slice(0, 12);
  const bestSellerProducts = state.products.filter(p => p.cat === 'best-seller').slice(0, 12);

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
      t: 'Đặt hàng trực tuyến', s: 'Hotline 0982 463 691',
    },
  ];

  return (
    <main className="page">
      {/* Hero Slider */}
      <section className="relative">
        <div
          className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[24/9] overflow-hidden squiggle-bg"
          style={{ backgroundColor: '#fff8fa' }}
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <AnimatePresence mode="sync" initial={false}>
            <HeroSlideItem key={state.slide} idx={state.slide} />
          </AnimatePresence>
          <button className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-12 md:px-6 z-10 text-brand-700/40 hover:text-brand-700 transition-colors" onClick={() => dispatch({ type: 'SET_SLIDE', payload: state.slide - 1 })} aria-label="Trước">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-12 md:px-6 z-10 text-brand-700/40 hover:text-brand-700 transition-colors" onClick={() => dispatch({ type: 'SET_SLIDE', payload: state.slide + 1 })} aria-label="Sau">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button key={i} onClick={() => dispatch({ type: 'SET_SLIDE', payload: i })} className={`w-2 h-2 rounded-full transition ${state.slide === i ? 'bg-white' : 'bg-white/60'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>


      {/* New Category Section */}
      <CategorySlider setFilterNav={setFilterNav} />

      {/* Bộ Sưu Tập Nổi Bật (BST) */}
      <section className="container-x section-y">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">BỘ SƯU TẬP NỔI BẬT</div>
            <h2 className="sec-title">Bộ Sưu Tập Mới Nhất</h2>
            <p className="text-sm text-ink2 mt-2 max-w-xl mx-auto">Thiết kế tinh xảo, phản chiếu nét riêng độc đáo trong từng khoảnh khắc đặc biệt</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ProductGrid products={bstProducts} />
          <div className="text-center mt-10">
            <a href="#/shop" onClick={(e) => { e.preventDefault(); setFilterNav('bst'); }} className="btn-outline">KHÁM PHÁ NGAY →</a>
          </div>
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
                className="inline-flex items-center gap-2 border-2 border-brand-700 text-brand-700 px-6 py-3 rounded-md font-semibold text-sm hover:bg-brand-700 hover:text-white transition-colors"
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
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-3">{b.icon}</div>
                <div className="font-semibold mb-1 text-brand-700 text-sm">{b.t}</div>
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
            <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">HOT TREND 2026</div>
            <h2 className="sec-title">Sản phẩm bán chạy</h2>
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

      {/* News */}
      <section className="container-x section-y">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">BLOG</div>
            <h2 className="sec-title">Tin tức</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map(n => (
            <a key={n.title} href="#/news" onClick={(e) => { e.preventDefault(); navigate('/news'); }} className="news-card group block bg-white rounded-lg overflow-hidden shadow-card hover:shadow-cardHover border border-rule">
              <div className="overflow-hidden bg-soft">
                <div 
                  className="photo aspect-[16/10] bg-cover bg-center" 
                  style={n.image 
                    ? { backgroundImage: `url(${n.image})` } 
                    : { backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${n.tint} 75%, ${n.tint})` } as React.CSSProperties
                  }
                >
                  {!n.image && <div className="sil" style={{ color: n.accent }}>{Shapes.sparkle}</div>}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-mute mb-2 uppercase tracking-wider">{n.date}</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-500 line-clamp-2 transition">{n.title}</h3>
                <p className="text-sm text-ink2 line-clamp-2 mb-3">{n.excerpt}</p>
                <span className="text-brand-500 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">Xem thêm <span className="transition-transform group-hover:translate-x-1">→</span></span>
              </div>
            </a>
          ))}
        </div>
        </Reveal>
      </section>

      {/* Recently viewed (localStorage) */}
      <RecentlyViewedStrip />
    </main>
  );
}
