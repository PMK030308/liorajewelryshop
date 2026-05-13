import React from 'react';
import { Product } from '../types';
import { fmt } from '../data';
import { useStore } from '../store/useStore';
import PhotoPlaceholder from './PhotoPlaceholder';

interface Props { product: Product; }

export default function ProductCard({ product: p }: Props) {
  const { state, dispatch, navigate, showToast } = useStore();
  const wished = state.wishlist.includes(p.slug);

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_WISH', payload: p.slug });
    showToast(wished ? '💔 Đã bỏ yêu thích' : '💖 Đã thêm vào yêu thích');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = state.products.find(x => x.slug === p.slug);
    if (!product) return;
    if (product.sold) { showToast('⚠ Sản phẩm tạm hết hàng'); return; }
    const cartId = `${p.slug}__default`;
    dispatch({ type: 'ADD_TO_CART', payload: { cartId, slug: p.slug, name: p.name, price: p.price, qty: 1, tint: p.tint, tint2: p.tint2, accent: p.accent, shape: p.shape } });
    showToast(`✓ Đã thêm "${p.name.slice(0, 30)}..." vào giỏ`);
  };

  return (
    <div className="pcard shadow-card group">
      <button
        className={`wish-btn ${wished ? 'wished' : ''}`}
        onClick={handleWish}
        aria-label="Yêu thích"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <a href={`#/product/${p.slug}`} onClick={(e) => { e.preventDefault(); navigate(`/product/${p.slug}`); }} className="block relative">
        <PhotoPlaceholder
          tint={p.tint}
          tint2={p.tint2}
          accent={p.accent}
          shape={p.shape}
          ratio="1/1"
          hot={p.hot}
          sold={p.sold}
          image={p.image}
          imageHover={p.imageHover}
          imageAlt={p.name}
        />
        <button className="buy-cta" onClick={handleQuickAdd}>🛒 Mua ngay</button>
      </a>

      <div className="p-3 md:p-4">
        <a href={`#/product/${p.slug}`} onClick={(e) => { e.preventDefault(); navigate(`/product/${p.slug}`); }} className="block">
          <h3 className="text-[13px] md:text-sm font-medium leading-snug line-clamp-2 hover:text-brand-500 transition min-h-[2.6em] mb-2">{p.name}</h3>
        </a>
        <div className="flex items-center justify-between">
          <div className="font-bold text-brand-700 text-base md:text-lg tracking-tight">{fmt(p.price)}</div>
          <div className="flex text-yellow-400 text-xs">★★★★★</div>
        </div>
      </div>
    </div>
  );
}
