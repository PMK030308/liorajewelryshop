import React from 'react';
import { Heart } from 'lucide-react';
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
        <Heart size={16} strokeWidth={1.8} fill={wished ? 'currentColor' : 'none'} />
      </button>

      <a
        href={`#/product/${p.slug}`}
        onClick={(e) => { e.preventDefault(); open(); }}
        className="block relative"
      >
        {/* Ảnh sản phẩm chiếm ~70-75% card — tăng tỉ lệ ảnh, giảm padding */}
        <PhotoPlaceholder
          tint={p.tint}
          tint2={p.tint2}
          accent={p.accent}
          shape={p.shape}
          ratio="1/1"
          hot={p.hot}
          sold={p.sold}
          discount={discount}
          image={p.image}
          imageHover={p.imageHover}
          imageAlt={p.name}
        />
      </a>

      {/* Khoảng trắng nhiều hơn, text tối giản, giá màu nâu/xám đậm */}
      <div className="px-4 pt-4 pb-5 md:px-5 md:pt-5 md:pb-6">
        <a
          href={`#/product/${p.slug}`}
          onClick={(e) => { e.preventDefault(); open(); }}
          className="block"
        >
          <h3 className="text-[13px] md:text-[13.5px] font-medium leading-snug line-clamp-2 text-ink hover:text-brand-600 transition-colors min-h-[2.6em] mb-2 text-center">
            {p.name}
          </h3>
        </a>
        <div className="flex items-baseline justify-center gap-2">
          <div className="font-semibold text-ink text-base md:text-lg tracking-tight">{fmt(p.price)}</div>
          {p.originalPrice && p.originalPrice > p.price && (
            <div className="text-xs text-mute line-through">{fmt(p.originalPrice)}</div>
          )}
        </div>
      </div>
    </div>
  );
}