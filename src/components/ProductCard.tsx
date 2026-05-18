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
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_WISH', payload: p.slug });
    showToast(wished ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích');
  };

  const discount = p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

  const open = () => navigate(`/product/${p.slug}`);

  return (
    <div className="pcard group">
      <button
        className={`wish-btn ${wished ? 'wished' : ''}`}
        onClick={handleWish}
        aria-label="Yêu thích"
        title={wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <a
        href={`#/product/${p.slug}`}
        onClick={(e) => { e.preventDefault(); open(); }}
        className="block relative"
      >
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
        {discount > 0 && !p.sold && (
          <span className="absolute top-3 left-3 bg-brand-700 text-white text-[10px] font-bold tracking-wide px-2 py-1 rounded-sm z-[2]">
            −{discount}%
          </span>
        )}
      </a>

      <div className="px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5">
        <a
          href={`#/product/${p.slug}`}
          onClick={(e) => { e.preventDefault(); open(); }}
          className="block"
        >
          <h3 className="text-[13px] md:text-[13.5px] font-medium leading-snug line-clamp-2 text-ink hover:text-brand-500 transition-colors min-h-[2.6em] mb-2 text-center">
            {p.name}
          </h3>
        </a>
        <div className="flex items-baseline justify-center gap-2">
          <div className="font-bold text-brand-700 text-base md:text-lg tracking-tight">{fmt(p.price)}</div>
          {p.originalPrice && p.originalPrice > p.price && (
            <div className="text-xs text-mute line-through">{fmt(p.originalPrice)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
