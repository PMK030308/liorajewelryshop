import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data';
import { SortOption } from '../types';
import ProductGrid from '../components/ProductGrid';

const PRICE_BUCKETS = [
  { id: 'lt500',   label: 'Dưới 500.000₫',          min: 0,       max: 500_000 },
  { id: '500-1m',  label: '500.000₫ — 1.000.000₫',  min: 500_000, max: 1_000_000 },
  { id: 'gt1m',    label: 'Trên 1.000.000₫',        min: 1_000_000, max: Infinity },
];

const SORT_LABELS: Record<SortOption, string> = {
  default:     'Mặc định',
  bestseller:  'Bán chạy nhất',
  newest:      'Mới nhất',
  'price-low': 'Giá tăng dần',
  'price-high':'Giá giảm dần',
  name:        'Tên A–Z',
};

export default function ShopPage() {
  const { state, dispatch, navigate } = useStore();
  const products = state.products;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceBuckets, setPriceBuckets] = useState<string[]>([]);

  const togglePrice = (id: string) => {
    setPriceBuckets(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const list = useMemo(() => {
    let l = state.filter === 'all'
      ? [...products]
      : state.filter === 'bst' || state.filter === 'best-seller'
        ? products.filter(p => p.cat === state.filter)
        : products.filter(p => p.subcat === state.filter);

    // Apply price filter (OR within selected buckets)
    if (priceBuckets.length > 0) {
      const ranges = PRICE_BUCKETS.filter(b => priceBuckets.includes(b.id));
      l = l.filter(p => ranges.some(r => p.price >= r.min && p.price < r.max));
    }

    if (state.sort === 'price-low')   l.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-high')  l.sort((a, b) => b.price - a.price);
    if (state.sort === 'name')        l.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (state.sort === 'bestseller')  l.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    if (state.sort === 'newest')      l = [...l].reverse(); // proxy: newer products added later in seed
    return l;
  }, [products, state.filter, state.sort, priceBuckets]);

  const activeCat = CATEGORIES.find(c => c.slug === state.filter);
  const title = activeCat ? activeCat.label : 'Tất Cả Sản Phẩm';

  const setFilterNav = (slug: string) => {
    dispatch({ type: 'SET_FILTER', payload: slug });
  };

  const clearAllFilters = () => {
    dispatch({ type: 'SET_FILTER', payload: 'all' });
    setPriceBuckets([]);
  };

  const activeFilterCount = (state.filter !== 'all' ? 1 : 0) + priceBuckets.length;

  const quickFilters = ['all','bst','best-seller','lac-tay','day-chuyen','nhan-don','bong-tai'];

  const FilterSidebar = (
    <>
      <div className="bg-soft rounded-2xl p-5">
        <h3 className="font-bold mb-3 text-sm uppercase tracking-wider">Danh mục</h3>
        <ul className="space-y-1.5">
          {CATEGORIES.map(c => (
            <li key={c.slug}>
              <button
                className={`text-left text-sm w-full py-1.5 hover:text-brand-500 ${state.filter === c.slug ? 'text-brand-500 font-semibold' : 'text-ink2'}`}
                onClick={() => { setFilterNav(c.slug); setFiltersOpen(false); }}
              >
                {state.filter === c.slug ? '▸ ' : ''}{c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-soft rounded-2xl p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-bold text-sm uppercase tracking-wider">Khoảng giá</h3>
          {priceBuckets.length > 0 && (
            <button onClick={() => setPriceBuckets([])} className="text-[11px] text-brand-500 hover:underline">Xoá</button>
          )}
        </div>
        <div className="space-y-2 text-sm">
          {PRICE_BUCKETS.map(r => (
            <label key={r.id} className="flex items-center gap-2 cursor-pointer hover:text-brand-500">
              <input
                type="checkbox"
                checked={priceBuckets.includes(r.id)}
                onChange={() => togglePrice(r.id)}
                className="accent-brand-700 w-4 h-4"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-5">
        <h3 className="font-bold mb-1">Voucher 50K</h3>
        <p className="text-xs text-ink2 mb-3">Cho đơn từ 500K. Mã: <strong className="text-brand-600">LIORANEW</strong></p>
        <button className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors" onClick={() => dispatch({ type: 'OPEN_VOUCHER' })}>Lấy ngay →</button>
      </div>
    </>
  );

  return (
    <main className="page">
      {/* Breadcrumb */}
      <div className="container-x py-3 md:py-4 text-xs text-mute">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </div>

      <section className="container-x">
        <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{title}</h1>
        <p className="text-xs md:text-sm text-ink2 mb-4 md:mb-6">
          Hiển thị <span className="font-semibold text-ink">{list.length}</span> sản phẩm
          {activeFilterCount > 0 && (
            <button onClick={clearAllFilters} className="ml-3 text-brand-500 hover:underline">
              · Xoá {activeFilterCount} bộ lọc
            </button>
          )}
        </p>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">{FilterSidebar}</aside>

          {/* Mobile filter + sort toolbar */}
          <div className="lg:hidden sticky top-[60px] z-20 -mx-4 px-4 bg-white/95 backdrop-blur-sm border-b border-rule py-2 mb-2 flex gap-2">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-rule rounded-md py-2 text-sm font-medium text-ink hover:border-brand-500"
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-brand-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <select
              value={state.sort}
              onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value as SortOption })}
              className="flex-1 border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map(s => (
                <option key={s} value={s}>Sắp xếp: {SORT_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Products */}
          <div className="lg:col-span-9">
            {/* Desktop toolbar */}
            <div className="hidden lg:flex bg-soft rounded-xl p-3 md:p-4 mb-5 sm:items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap overflow-x-auto">
                {quickFilters.map(s => {
                  const c = CATEGORIES.find(x => x.slug === s);
                const label = c ? c.label : s === 'bst' ? 'Bộ Sưu Tập' : s === 'best-seller' ? 'Bán chạy' : s;
                  return (
                    <button key={s} className={`chip ${state.filter === s ? 'active' : ''}`} onClick={() => setFilterNav(s)}>{label}</button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-sm flex-shrink-0">
                <label className="text-mute">Sắp xếp:</label>
                <select
                  value={state.sort}
                  onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value as SortOption })}
                  className="border border-rule rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-brand-500 bg-white"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map(s => (
                    <option key={s} value={s}>{SORT_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile quick chips */}
            <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 mb-3">
              {quickFilters.map(s => {
                const c = CATEGORIES.find(x => x.slug === s);
                const label = c ? c.label : s === 'moissanite' ? 'Moissanite' : s === 'best-seller' ? 'Bán chạy' : s;
                return (
                  <button key={s} className={`chip flex-shrink-0 ${state.filter === s ? 'active' : ''}`} onClick={() => setFilterNav(s)}>{label}</button>
                );
              })}
            </div>

            {list.length === 0 ? (
              <div className="bg-soft border border-rule rounded-lg p-10 text-center">
                <p className="text-ink2 mb-4">Không có sản phẩm phù hợp với bộ lọc.</p>
                <button onClick={clearAllFilters} className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-5 py-2 rounded-md">
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <ProductGrid products={list} />
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${filtersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!filtersOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
        <aside
          className={`absolute top-0 right-0 bottom-0 w-[88%] max-w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${filtersOpen ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Bộ lọc"
        >
          <header className="flex items-center justify-between px-5 py-4 border-b border-rule bg-white sticky top-0">
            <h2 className="font-bold text-lg">Bộ lọc {activeFilterCount > 0 && <span className="text-sm text-brand-500">({activeFilterCount})</span>}</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-soft flex items-center justify-center text-mute"
              aria-label="Đóng"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">{FilterSidebar}</div>
          <div className="border-t border-rule p-3 flex gap-2">
            <button
              onClick={clearAllFilters}
              className="flex-1 border border-rule text-ink2 text-sm font-semibold py-2.5 rounded-md hover:bg-soft"
            >Xoá lọc</button>
            <button
              onClick={() => setFiltersOpen(false)}
              className="flex-1 bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-brand-800"
            >Xem {list.length} sản phẩm</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
