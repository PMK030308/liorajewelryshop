import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data';
import { SortOption } from '../types';
import ProductGrid from '../components/ProductGrid';

export default function ShopPage() {
  const { state, dispatch, navigate } = useStore();
  const products = state.products;
  const [filtersOpen, setFiltersOpen] = useState(false);

  let list = state.filter === 'all'
    ? [...products]
    : state.filter === 'moissanite' || state.filter === 'best-seller'
      ? products.filter(p => p.cat === state.filter)
      : products.filter(p => p.subcat === state.filter);

  if (state.sort === 'price-low')  list.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-high') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  const activeCat = CATEGORIES.find(c => c.slug === state.filter);
  const title = activeCat ? activeCat.label : 'Tất Cả Sản Phẩm';

  const setFilterNav = (slug: string) => {
    dispatch({ type: 'SET_FILTER', payload: slug });
  };

  const quickFilters = ['all','moissanite','best-seller','day-chuyen','lac-tay','nhan-don','bong-tai'];

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
        <h3 className="font-bold mb-3 text-sm uppercase tracking-wider">Khoảng giá</h3>
        <div className="space-y-2 text-sm">
          {[
            { label:'Dưới 500.000₫' },
            { label:'500.000₫ — 1.000.000₫' },
            { label:'Trên 1.000.000₫' },
          ].map(r => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer hover:text-brand-500">
              <input type="checkbox" className="accent-brand-500" />
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
        <p className="text-xs md:text-sm text-ink2 mb-4 md:mb-6">Hiển thị {list.length} sản phẩm</p>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">{FilterSidebar}</aside>

          {/* Mobile filter + sort toolbar */}
          <div className="lg:hidden sticky top-[60px] z-20 -mx-4 px-4 bg-white/95 backdrop-blur-sm border-b border-rule py-2 mb-2 flex gap-2">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-rule rounded-md py-2 text-sm font-medium text-ink hover:border-brand-500"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
              Bộ lọc
            </button>
            <select
              value={state.sort}
              onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value as SortOption })}
              className="flex-1 border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="name">Tên A–Z</option>
              <option value="price-low">Giá tăng dần</option>
              <option value="price-high">Giá giảm dần</option>
            </select>
          </div>

          {/* Products */}
          <div className="lg:col-span-9">
            {/* Desktop toolbar */}
            <div className="hidden lg:flex bg-soft rounded-xl p-3 md:p-4 mb-5 sm:items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap overflow-x-auto">
                {quickFilters.map(s => {
                  const c = CATEGORIES.find(x => x.slug === s);
                  const label = c ? c.label : s === 'moissanite' ? 'Moissanite' : s === 'best-seller' ? 'Bán chạy' : s;
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
                  <option value="default">Mặc định</option>
                  <option value="name">Tên A–Z</option>
                  <option value="price-low">Giá tăng dần</option>
                  <option value="price-high">Giá giảm dần</option>
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

            <ProductGrid products={list} />
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
            <h2 className="font-bold text-lg">Bộ lọc</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-soft flex items-center justify-center text-mute"
              aria-label="Đóng"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">{FilterSidebar}</div>
          <div className="border-t border-rule p-3 flex gap-2">
            <button
              onClick={() => { dispatch({ type: 'SET_FILTER', payload: 'all' }); setFiltersOpen(false); }}
              className="flex-1 border border-rule text-ink2 text-sm font-semibold py-2.5 rounded-md hover:bg-soft"
            >Xóa lọc</button>
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
