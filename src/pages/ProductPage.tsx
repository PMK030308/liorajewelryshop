import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ShoppingBag, Zap, MessageCircle, ChevronDown, Plus, Minus, Truck, RotateCcw, ShieldCheck, Gift, Ruler, ZoomIn, Pencil, Star, Mail, Sparkles, AlertTriangle, Check, Share2, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fmt } from '../data';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import ProductGrid from '../components/ProductGrid';
import SizeGuideModal from '../components/SizeGuideModal';
import ImageLightbox from '../components/ImageLightbox';
import ReviewsSection from '../components/ReviewsSection';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip';
import { Product, ShapeKey } from '../types';
import { pushRecentlyViewed } from '../utils/recentlyViewed';

const SIZES = ['#5', '#6', '#7', '#8', '#9'];

// Possible packaging variants (mocked — server would return these dynamically).
interface VariantOption {
  key: string;
  label: string;
  available?: boolean;
}
const PACKAGING_OPTIONS: VariantOption[] = [
  { key: 'hop-co-ban', label: 'Hộp cơ bản' },
  { key: 'hop-tang-cao-cap', label: 'Hộp tặng cao cấp' },
  { key: 'tui-velvet', label: 'Túi velvet (+50K)' },
  { key: 'da-het', label: 'Giấy gói VIP', available: false },
];

interface GiftItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}
const FREE_GIFTS: GiftItem[] = [
  { id: 'card', title: 'Thiệp lời chúc khắc tên', desc: 'Tặng kèm thiệp giấy mỹ thuật dày 250gsm, khắc tên người nhận miễn phí.', icon: <Mail size={18} strokeWidth={1.8} /> },
  { id: 'cloth', title: 'Khăn lau bạc cao cấp', desc: 'Khăn microfiber mềm chuyên dụng — giúp giữ bạc luôn sáng đẹp như mới.', icon: <Sparkles size={18} strokeWidth={1.8} /> },
  { id: 'voucher', title: 'Voucher 50K cho đơn tiếp theo', desc: 'Gửi qua email sau khi đơn hàng giao thành công.', icon: <Star size={18} strokeWidth={1.8} /> },
];

export default function ProductPage({ slug }: { slug: string }) {
  const { state, dispatch, navigate, showToast } = useStore();
  const p = state.products.find(x => x.slug === slug);

  if (!p) {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <a className="btn-primary" href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>← Quay lại Shop</a>
      </main>
    );
  }

  // --- Local state ---
  const [packaging, setPackaging] = useState('hop-co-ban');
  const [selectedGift, setSelectedGift] = useState('card');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [engraveOn, setEngraveOn] = useState(false);
  const [engraveText, setEngraveText] = useState('');
  const [engraveFont, setEngraveFont] = useState<'sans' | 'script'>('script');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stockAlertEmail, setStockAlertEmail] = useState('');
  const [stockAlertSent, setStockAlertSent] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const shareProduct = async () => {
    const url = `${window.location.origin}/#/product/${p.slug}`;
    const shareData = {
      title: p.name,
      text: p.description || `${p.name} - LIORA Jewelry`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        showToast('✓ Đã sao chép link sản phẩm');
      }
    } catch { /* user cancelled */ }
  };

  // Default size if not set
  useEffect(() => {
    if (!state.pdpSize) dispatch({ type: 'SET_PDP_SIZE', payload: SIZES[2] });
  }, [state.pdpSize, dispatch]);

  // Push to recently viewed
  useEffect(() => {
    if (p?.slug) pushRecentlyViewed(p.slug);
  }, [p?.slug]);

  // Mobile sticky CTA bar: show when main CTA is scrolled out of view
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [p?.slug]);

  // Decide size-guide type based on subcat
  const sizeGuideType: 'ring' | 'bracelet' | 'necklace' =
    p?.subcat === 'lac-tay' ? 'bracelet' :
    p?.subcat === 'day-chuyen' ? 'necklace' : 'ring';

  // --- Derived data ---
  const discount = useMemo(() => {
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  }, [p]);

  const inStock = p.inStock ?? 0;
  const isSold = !!p.sold || inStock === 0;
  const showSize = p.subcat === 'nhan-don' || p.subcat === 'cap-doi';
  const productHighlights = p.highlights?.filter(Boolean) || [];
  const productSpecs = p.specifications?.filter(item => item.label && item.value) || [];
  const productCare = p.careInstructions || 'Tránh tiếp xúc nước hoa, hoá chất, nước biển. Cất trong hộp khi không sử dụng. Lau bằng vải mềm sau khi đeo. Đem đến Liorajewelry để được vệ sinh miễn phí trọn đời.';

  useEffect(() => {
    const title = p.seoTitle || `${p.name} | LIORA Jewelry`;
    const description = p.seoDescription || p.description || `${p.name} tại LIORA Jewelry`;
    document.title = title;

    const upsertMeta = (name: string, content?: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!content) {
        el?.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    upsertMeta('description', description);
    upsertMeta('keywords', p.seoKeywords);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (p.canonicalSlug) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = p.canonicalSlug.startsWith('http')
        ? p.canonicalSlug
        : `${window.location.origin}${p.canonicalSlug.startsWith('/') ? p.canonicalSlug : `/${p.canonicalSlug}`}`;
    } else {
      canonical?.remove();
    }
  }, [p]);

  // Gallery: combine main + gallery (deduped)
  const galleryImages = useMemo(() => {
    const arr: string[] = [];
    if (p.image) arr.push(p.image);
    if (p.imageHover) arr.push(p.imageHover);
    (p.gallery || []).forEach(g => { if (!arr.includes(g)) arr.push(g); });
    return arr;
  }, [p]);

  const hasImages = galleryImages.length > 0;
  const activeIdx = state.pdpImageIdx < (hasImages ? galleryImages.length : 4) ? state.pdpImageIdx : 0;
  const mainImage = hasImages ? galleryImages[activeIdx] : undefined;

  const related = state.products.filter(x => x.subcat === p.subcat && x.slug !== p.slug).slice(0, 4);

  // --- Actions ---
  const engravingValid = engraveOn && engraveText.trim().length > 0;
  const engravingFee = engravingValid ? 50000 : 0;
  const finalPrice = p.price + engravingFee;

  const addToCart = () => {
    if (isSold) { showToast('Sản phẩm tạm hết hàng'); return; }
    if (engraveOn && !engraveText.trim()) {
      showToast('Vui lòng nhập nội dung khắc tên');
      return;
    }
    const cartId = `${p.slug}__${state.pdpSize}__${packaging}${engravingValid ? '__' + engraveText.trim() : ''}`;
    const displayName = engravingValid
      ? `${p.name} (khắc: "${engraveText.trim()}")`
      : p.name;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        cartId, slug: p.slug, name: displayName, price: finalPrice,
        qty: state.pdpQty, size: state.pdpSize || undefined,
        tint: p.tint, tint2: p.tint2, accent: p.accent, shape: p.shape,
      },
    });
    showToast('Đã thêm vào giỏ hàng');
    dispatch({ type: 'SET_PDP_QTY', payload: 1 });
    setTimeout(() => dispatch({ type: 'OPEN_CART' }), 250);
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => navigate('/checkout'), 200);
  };

  // Qty handlers with disabled state for boundaries
  const minusDisabled = state.pdpQty <= 1;
  const plusDisabled  = inStock > 0 && state.pdpQty >= inStock;

  const decQty = () => { if (!minusDisabled) dispatch({ type: 'SET_PDP_QTY', payload: state.pdpQty - 1 }); };
  const incQty = () => { if (!plusDisabled)  dispatch({ type: 'SET_PDP_QTY', payload: state.pdpQty + 1 }); };

  return (
    <main className="page">
      {/* Breadcrumb */}
      <div className="container-x py-3 md:py-4 text-xs text-mute">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="hover:text-brand-500">Sản phẩm</a>
        <span className="mx-2">/</span>
        <span className="text-ink line-clamp-1">{p.name}</span>
      </div>

      {/* ============================ MAIN GRID 55 / 45 ============================ */}
      <section className="container-x grid md:grid-cols-[55fr_45fr] gap-6 md:gap-8 pb-12">

        {/* ================ LEFT: MEDIA GALLERY ================ */}
        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">

          {/* Thumbnails — vertical desktop, horizontal mobile, scroll if many */}
          <div
            className="flex md:flex-col gap-2 md:gap-2.5 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:max-h-[560px] no-scrollbar md:w-[68px] flex-shrink-0 -mx-1 md:mx-0 px-1 md:px-0"
            role="tablist"
            aria-label="Thư viện ảnh sản phẩm"
          >
            {hasImages
              ? galleryImages.map((src, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeIdx === i}
                  onClick={() => dispatch({ type: 'SET_PDP_IMAGE', payload: i })}
                  className={`flex-shrink-0 w-14 h-14 md:w-[68px] md:h-[68px] overflow-hidden border-2 transition-colors ${
                    activeIdx === i ? 'border-brand-700' : 'border-rule hover:border-brand-400'
                  }`}
                >
                  <img src={src} alt={`${p.name} thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))
              // Fallback: 4 tint variants when no images
              : [
                { ...p },
                { ...p, tint: p.tint2 },
                { ...p, tint: p.accent, tint2: p.tint2 },
                { ...p, tint: '#1f1f1f', tint2: p.accent },
              ].map((g, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeIdx === i}
                  onClick={() => dispatch({ type: 'SET_PDP_IMAGE', payload: i })}
                  className={`flex-shrink-0 w-14 h-14 md:w-[68px] md:h-[68px] overflow-hidden border-2 transition-colors ${
                    activeIdx === i ? 'border-brand-700' : 'border-rule hover:border-brand-400'
                  }`}
                >
                  <PhotoPlaceholder tint={g.tint} tint2={g.tint2} accent={g.accent} shape={g.shape as ShapeKey} ratio="1/1" />
                </button>
              ))
            }
          </div>

          {/* Main preview — fixed aspect ratio, click to zoom */}
          <div className="flex-1 relative bg-soft overflow-hidden group">
            <button
              type="button"
              onClick={() => hasImages && setLightboxOpen(true)}
              className="aspect-square block w-full text-left cursor-zoom-in"
              aria-label="Phóng to ảnh"
            >
              {hasImages ? (
                <img
                  src={mainImage}
                  alt={p.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="eager"
                />
              ) : (
                <PhotoPlaceholder
                  tint={p.tint}
                  tint2={p.tint2}
                  accent={p.accent}
                  shape={p.shape as ShapeKey}
                  ratio="1/1"
                  hot={p.hot}
                  sold={p.sold}
                  discount={discount}
                />
              )}
            </button>
            {/* Zoom hint on hover */}
            {hasImages && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none inline-flex items-center gap-1">
                <ZoomIn size={12} strokeWidth={2} />
                <span>Bấm để phóng to</span>
              </div>
            )}
            {/* Badge overlay (only when using real image) */}
            {hasImages && (
              <>
                {isSold ? (
                  <div className="absolute top-3 left-3 bg-[#1f1f1f] text-white text-[11px] font-bold tracking-widest px-3 py-1 uppercase">Hết hàng</div>
                ) : discount > 0 ? (
                  <div className="absolute top-3 left-3 bg-red-700 text-white text-[11px] font-bold tracking-wider px-3 py-1">−{discount}%</div>
                ) : p.hot ? (
                  <div className="absolute top-3 left-3 bg-brand-700 text-white text-[11px] font-bold tracking-widest px-3 py-1 uppercase">HOT</div>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* ================ RIGHT: PRODUCT INFO ================ */}
        <div className="flex flex-col gap-5">

          {/* --- Title & Meta --- */}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold leading-snug text-ink mb-3">{p.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              {p.code && (
                <span className="text-mute">Mã SP: <span className="font-semibold text-ink">{p.code}</span></span>
              )}
              {p.reviewCount != null && (
                <span className="text-mute">Đã bán: <span className="font-semibold text-ink">{p.reviewCount * 3}+</span></span>
              )}
              {inStock > 0 && (
                <span className="text-mute">Tồn kho: <span className="font-semibold text-ink">{inStock}</span></span>
              )}
              {p.rating != null && (
                <button
                  onClick={scrollToReviews}
                  className="inline-flex items-center gap-1 text-mute hover:text-brand-700 transition-colors"
                >
                  <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                  <span className="font-semibold text-ink">{p.rating.toFixed(1)}</span>
                  <span className="underline-offset-2 hover:underline">({p.reviewCount ?? 0} đánh giá)</span>
                </button>
              )}
            </div>
          </div>

          {/* --- Price --- */}
          <div className="bg-brand-50/50 border-l-4 border-brand-700 px-5 py-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <div className="text-2xl md:text-3xl font-bold text-brand-700">{fmt(finalPrice)}</div>
              {p.originalPrice && p.originalPrice > p.price && (
                <>
                  <div className="text-mute line-through text-sm">{fmt(p.originalPrice + engravingFee)}</div>
                  <span className="bg-red-700 text-white text-[10px] tracking-wider px-2 py-1 font-bold">−{discount}%</span>
                </>
              )}
            </div>
            {p.originalPrice && p.originalPrice > p.price && (
              <div className="text-xs text-ink2 mt-1.5">Tiết kiệm {fmt(p.originalPrice - p.price)} hôm nay</div>
            )}
            {engravingFee > 0 && (
              <div className="text-xs text-brand-700 mt-1.5">Đã bao gồm phí khắc tên: {fmt(engravingFee)}</div>
            )}
          </div>

          {/* --- Variants: Size --- */}
          {showSize && (
            <VariantGroup
              label="Kích thước"
              helper={
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-brand-500 hover:text-brand-700 inline-flex items-center gap-1"
                >
                  <Ruler size={12} strokeWidth={2} />
                  Hướng dẫn chọn size
                </button>
              }
            >
              {SIZES.map(s => (
                <VariantButton
                  key={s}
                  active={state.pdpSize === s}
                  onClick={() => dispatch({ type: 'SET_PDP_SIZE', payload: s })}
                >{s}</VariantButton>
              ))}
            </VariantGroup>
          )}

          {/* --- Variants: Packaging (hộp/túi) --- */}
          <VariantGroup label="Hộp / Túi">
            {PACKAGING_OPTIONS.map(v => {
              const disabled = v.available === false;
              return (
                <VariantButton
                  key={v.key}
                  active={packaging === v.key}
                  disabled={disabled}
                  onClick={() => setPackaging(v.key)}
                >{v.label}</VariantButton>
              );
            })}
          </VariantGroup>

          {/* --- Quantity + Stock --- */}
          <div>
            <div className="text-sm font-semibold mb-2">Số lượng</div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-stretch border border-rule">
                <button
                  type="button"
                  onClick={decQty}
                  disabled={minusDisabled}
                  className={`w-10 h-11 flex items-center justify-center transition-colors ${
                    minusDisabled
                      ? 'text-mute cursor-not-allowed opacity-50'
                      : 'text-ink hover:bg-brand-50'
                  }`}
                  aria-label="Giảm số lượng"
                >
                  <Minus size={14} strokeWidth={2} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={inStock || undefined}
                  value={state.pdpQty}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isNaN(v)) return;
                    const clamped = Math.max(1, Math.min(inStock || 99, v));
                    dispatch({ type: 'SET_PDP_QTY', payload: clamped });
                  }}
                  className="w-14 text-center text-sm font-semibold outline-none border-x border-rule appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Số lượng"
                />
                <button
                  type="button"
                  onClick={incQty}
                  disabled={plusDisabled}
                  className={`w-10 h-11 flex items-center justify-center transition-colors ${
                    plusDisabled
                      ? 'text-mute cursor-not-allowed opacity-50'
                      : 'text-ink hover:bg-brand-50'
                  }`}
                  aria-label="Tăng số lượng"
                >
                  <Plus size={14} strokeWidth={2} />
                </button>
              </div>
              {inStock > 0 && (
                <span className="text-xs text-mute">Còn lại <span className="font-semibold text-ink">{inStock}</span> sản phẩm</span>
              )}
              {isSold && (
                <span className="text-xs text-red-600 font-semibold inline-flex items-center gap-1"><AlertTriangle size={13} strokeWidth={2} /> Sản phẩm tạm hết hàng</span>
              )}
            </div>
          </div>

          {/* --- Engraving (khắc tên) — optional --- */}
          <div className="border border-rule rounded-md">
            <button
              type="button"
              onClick={() => setEngraveOn(v => !v)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
              aria-expanded={engraveOn}
            >
              <span className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  engraveOn ? 'bg-brand-700 border-brand-700' : 'border-rule'
                }`}>
                  {engraveOn && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                <Pencil size={16} strokeWidth={1.8} className="text-brand-700" />
                <span className="font-semibold text-sm">Khắc tên cá nhân hoá</span>
                <span className="text-xs text-mute">(+50.000₫)</span>
              </span>
              <ChevronDown size={14} strokeWidth={2} className={`text-mute transition-transform ${engraveOn ? 'rotate-180' : ''}`} />
            </button>
            {engraveOn && (
              <div className="border-t border-rule p-4 space-y-3 bg-soft/50">
                <div>
                  <label className="block text-xs font-semibold text-ink2 mb-1.5">Nội dung khắc <span className="text-mute">(tối đa 12 ký tự)</span></label>
                  <input
                    value={engraveText}
                    onChange={(e) => setEngraveText(e.target.value.slice(0, 12))}
                    placeholder="VD: Mai Anh"
                    maxLength={12}
                    className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
                  />
                  <div className="text-[11px] text-mute mt-1 text-right">{engraveText.length}/12 ký tự</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink2 mb-1.5">Kiểu chữ</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEngraveFont('script')}
                      className={`flex-1 border-2 px-3 py-2 text-base ${engraveFont === 'script' ? 'border-brand-700 bg-brand-50' : 'border-rule hover:border-brand-400'}`}
                    >
                      <span className="script text-xl">Viết tay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEngraveFont('sans')}
                      className={`flex-1 border-2 px-3 py-2 text-base ${engraveFont === 'sans' ? 'border-brand-700 bg-brand-50' : 'border-rule hover:border-brand-400'}`}
                    >
                      <span className="uppercase font-bold tracking-wider">SANS-SERIF</span>
                    </button>
                  </div>
                </div>
                {/* Live preview */}
                {engraveText.trim() && (
                  <div className="bg-white border border-dashed border-brand-300 rounded p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-mute mb-1">Xem trước khắc</div>
                    <div className={`text-2xl md:text-3xl text-brand-700 ${engraveFont === 'script' ? 'script' : 'font-bold uppercase tracking-widest'}`}>
                      {engraveText}
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-mute italic inline-flex items-center gap-1"><AlertTriangle size={12} strokeWidth={1.8} /> Sản phẩm khắc tên sẽ không áp dụng đổi trả</p>
              </div>
            )}
          </div>

          {/* --- CTAs full-width vertical stack --- */}
          <div ref={ctaRef} className="flex flex-col gap-3">
            <button
              onClick={addToCart}
              disabled={isSold}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold border-2 transition-colors ${
                isSold
                  ? 'border-rule bg-soft text-mute cursor-not-allowed'
                  : 'border-brand-700 text-brand-700 hover:bg-brand-50'
              }`}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {isSold ? 'Hết hàng' : 'Thêm vào giỏ'}
            </button>
            <button
              onClick={buyNow}
              disabled={isSold}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors ${
                isSold
                  ? 'bg-soft text-mute cursor-not-allowed'
                  : 'bg-brand-700 hover:bg-brand-800 text-white'
              }`}
            >
              <Zap size={18} strokeWidth={1.8} fill="currentColor" />
              Mua ngay
            </button>
            <a
              href="https://m.me/liorajewelry.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold border border-rule text-ink2 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              <MessageCircle size={18} strokeWidth={1.8} />
              Chat Messenger để được tư vấn
            </a>
            <button
              onClick={shareProduct}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-mute hover:text-brand-700 transition-colors"
            >
              <Share2 size={16} strokeWidth={1.8} />
              Chia sẻ sản phẩm
            </button>
          </div>

          {/* --- Back-in-stock alert (chỉ hiển thị khi hết hàng) --- */}
          {isSold && (
            <div className="border-2 border-dashed border-brand-300 rounded-md p-4 bg-brand-50/30">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={16} strokeWidth={1.8} className="text-brand-700" />
                <span className="font-semibold text-sm text-brand-700">Thông báo khi có hàng</span>
              </div>
              {stockAlertSent ? (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 inline-flex items-center gap-1.5">
                  <Check size={14} strokeWidth={2} /> Đã đăng ký! Chúng tôi sẽ email cho bạn khi sản phẩm về hàng.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStockAlertSent(true);
                    showToast('✓ Đã đăng ký nhận thông báo');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    value={stockAlertEmail}
                    onChange={(e) => setStockAlertEmail(e.target.value)}
                    placeholder="Email của bạn"
                    className="flex-1 border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
                  >
                    Đăng ký
                  </button>
                </form>
              )}
            </div>
          )}

          {/* --- Promo widget: free gifts (dynamic list) --- */}
          {FREE_GIFTS.length > 0 && (
            <fieldset className="border-2 border-dashed border-brand-300 rounded p-4 bg-brand-50/30">
              <legend className="px-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
                <Gift size={14} strokeWidth={2} />
                Quà tặng kèm
              </legend>
              <ul className="space-y-2.5 mt-1">
                {FREE_GIFTS.map(g => {
                  const isSelected = selectedGift === g.id;
                  return (
                    <li key={g.id}>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="gift"
                          checked={isSelected}
                          onChange={() => setSelectedGift(g.id)}
                          className="mt-1 accent-brand-700 w-4 h-4 flex-shrink-0"
                        />
                        <div className="w-10 h-10 flex-shrink-0 bg-white border border-rule flex items-center justify-center text-base text-brand-500 group-hover:border-brand-400 transition-colors">
                          {g.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-semibold ${isSelected ? 'text-brand-700' : 'text-ink'} break-words`}>{g.title}</div>
                          <div className="text-xs text-mute break-words">{g.desc}</div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          )}

          {/* --- Trust badges --- */}
          <div className="border border-rule grid grid-cols-2 gap-x-3 gap-y-2.5 p-4 text-xs text-ink2">
            <span className="inline-flex items-center gap-2"><Truck size={14} strokeWidth={1.6} className="text-brand-500 flex-shrink-0" />Miễn phí giao từ 500K</span>
            <span className="inline-flex items-center gap-2"><RotateCcw size={14} strokeWidth={1.6} className="text-brand-500 flex-shrink-0" />Đổi trả trong 7 ngày</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={14} strokeWidth={1.6} className="text-brand-500 flex-shrink-0" />Chất liệu kiểm định cao cấp</span>
            <span className="inline-flex items-center gap-2"><Gift size={14} strokeWidth={1.6} className="text-brand-500 flex-shrink-0" />Hộp quà sang trọng</span>
          </div>

          {/* --- Accordions: description / care / shipping --- */}
          <div className="border-t border-rule">
            {[
              {
                title: 'Mô tả sản phẩm', open: true, content: (
                  <div>
                    {p.description && <p className="mb-3">{p.description}</p>}
                    {p.longDescription && (
                      <div className="space-y-3 mb-4">
                        {p.longDescription.split('\n').filter(Boolean).map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                    {p.material && (
                      <div className="mb-3">
                        <span className="font-semibold text-ink">Chất liệu: </span>
                        <span>{p.material}</span>
                      </div>
                    )}
                    {productHighlights.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {productHighlights.map((item, idx) => <li key={idx}>· {item}</li>)}
                      </ul>
                    )}
                    {productHighlights.length === 0 && (
                      <ul className="space-y-1.5 mb-4">
                        <li>· Chất liệu: Hợp kim mạ bạc cao cấp, chống xỉn màu bền lâu</li>
                        <li>· Kiểm định chất lượng nguyên liệu chính hãng (nếu áp dụng)</li>
                        <li>· Tặng kèm hộp quà sang trọng + thẻ bảo hành điện tử</li>
                        <li>· Bảo hành làm mới sản phẩm trọn đời tại cửa hàng</li>
                      </ul>
                    )}
                    {productSpecs.length > 0 && (
                      <dl className="grid sm:grid-cols-2 gap-x-5 gap-y-2 border-t border-rule pt-4">
                        {productSpecs.map((item, idx) => (
                          <div key={`${item.label}-${idx}`}>
                            <dt className="text-xs uppercase tracking-wide text-mute">{item.label}</dt>
                            <dd className="font-medium text-ink">{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                ),
              },
              {
                title: 'Bảo quản & Bảo hành', content: (
                  <p>{productCare}</p>
                ),
              },
              {
                title: 'Vận chuyển & Đổi trả', content: (
                  <p>Giao hàng toàn quốc 2–4 ngày. Miễn phí cho đơn từ 500.000₫. Hỗ trợ kiểm hàng trước khi thanh toán. Đổi trả miễn phí trong 7 ngày với sản phẩm còn nguyên vẹn.</p>
                ),
              },
            ].map(({ title, open, content }) => (
              <details key={title} className="border-b border-rule group" {...(open ? { open: true } : {})}>
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-semibold text-sm">
                  <span>{title}</span>
                  <ChevronDown size={16} strokeWidth={2} className="text-mute transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-4 text-sm text-ink2 leading-relaxed">{content}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-x">
        <ReviewsSection product={p} />
      </section>

      {related.length > 0 && (
        <section className="container-x py-10 border-t border-rule">
          <h2 className="sec-title text-center mb-8">Sản phẩm liên quan</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Recently viewed (excludes current product) */}
      <RecentlyViewedStrip exclude={[p.slug]} className="border-t border-rule" />

      {/* === Modals === */}
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} type={sizeGuideType} />
      <ImageLightbox
        open={lightboxOpen}
        images={hasImages ? galleryImages : []}
        startIdx={activeIdx}
        onClose={() => setLightboxOpen(false)}
        alt={p.name}
      />

      {/* === Mobile sticky CTA bar === */}
      <div className={`md:hidden fixed left-0 right-0 bottom-16 z-30 transition-transform duration-300 ${
        showStickyBar ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="bg-white border-t border-rule shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3 py-2.5 flex items-center gap-2">
          <div className="flex-shrink-0 w-12 h-12 bg-soft overflow-hidden">
            {hasImages ? (
              <img src={mainImage} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <PhotoPlaceholder tint={p.tint} tint2={p.tint2} accent={p.accent} shape={p.shape as ShapeKey} ratio="1/1" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs line-clamp-1 text-ink">{p.name}</div>
            <div className="text-sm font-bold text-brand-700">{fmt(finalPrice)}</div>
          </div>
          <button
            onClick={addToCart}
            disabled={isSold}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap ${
              isSold ? 'bg-soft text-mute' : 'bg-brand-700 text-white hover:bg-brand-800'
            }`}
          >
            {isSold ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </main>
  );
}

/* ============================ Reusable variant components ============================ */

function VariantGroup({
  label, helper, children,
}: { label: string; helper?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-semibold">{label}</span>
        {helper}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function VariantButton({
  active, disabled, onClick, children,
}: { active: boolean; disabled?: boolean; onClick?: () => void; children: React.ReactNode }) {
  if (disabled) {
    return (
      <button
        disabled
        className="px-4 py-2 text-sm border-2 border-rule text-mute opacity-40 cursor-not-allowed select-none"
        aria-disabled="true"
      >{children}</button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm border-2 transition-colors ${
        active
          ? 'bg-ink text-white border-ink'
          : 'bg-white text-ink border-rule hover:border-ink'
      }`}
    >{children}</button>
  );
}
