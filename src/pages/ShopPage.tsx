import React from 'react';
import { useStore } from '../store/useStore';
import { CATEGORIES, fmt } from '../data';
import { SortOption } from '../types';
import ProductGrid from '../components/ProductGrid';

export default function ShopPage() {
  const { state, dispatch, navigate } = useStore();
  const products = state.products;

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

  return (
    <main className="page">
      {/* Breadcrumb */}
      <div className="container-x py-4 text-xs text-mute">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </div>

      <section className="container-x">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-ink2 mb-6">Hiển thị {list.length} sản phẩm</p>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-soft rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wider">Danh mục</h3>
              <ul className="space-y-1.5">
                {CATEGORIES.map(c => (
                  <li key={c.slug}>
                    <button
                      className={`text-left text-sm w-full py-1.5 hover:text-brand-500 ${state.filter === c.slug ? 'text-brand-500 font-semibold' : 'text-ink2'}`}
                      onClick={() => setFilterNav(c.slug)}
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
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-bold mb-1">Voucher 50K</h3>
              <p className="text-xs text-ink2 mb-3">Cho đơn từ 500K. Mã: <strong className="text-brand-600">LIORANEW</strong></p>
              <button className="btn-primary text-xs px-4 py-2" onClick={() => dispatch({ type: 'OPEN_VOUCHER' })}>Lấy ngay →</button>
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-9">
            <div className="bg-soft rounded-xl p-3 md:p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <ProductGrid products={list} />
          </div>
        </div>
      </section>
    </main>
  );
}
