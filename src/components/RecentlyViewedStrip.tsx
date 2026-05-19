import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { fmt } from '../data';

interface Props {
  /** Hide products with these slugs (e.g. the one currently being viewed). */
  exclude?: string[];
  className?: string;
}

export default function RecentlyViewedStrip({ exclude = [], className = '' }: Props) {
  const { state, navigate } = useStore();
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecentlyViewed());
  }, [state.route]);

  const items = slugs
    .filter(s => !exclude.includes(s))
    .map(s => state.products.find(p => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className={`container-x py-8 md:py-10 ${className}`}>
      <header className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-base md:text-lg font-bold text-brand-700">
          <Clock size={18} strokeWidth={1.8} />
          Vừa xem gần đây
        </h2>
        <span className="text-xs text-mute">{items.length} sản phẩm</span>
      </header>

      <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
        {items.map(p => (
          <a
            key={p.slug}
            href={`#/product/${p.slug}`}
            onClick={(e) => { e.preventDefault(); navigate(`/product/${p.slug}`); }}
            className="flex-shrink-0 w-32 md:w-40 group"
          >
            <div className="aspect-square overflow-hidden bg-soft mb-2">
              {p.image ? (
                <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
              ) : (
                <div className="photo h-full w-full" style={{ aspectRatio: 'auto', backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${p.tint} 75%, ${p.tint2})` } as React.CSSProperties} />
              )}
            </div>
            <div className="text-xs line-clamp-1 text-ink mb-0.5">{p.name}</div>
            <div className="text-sm font-bold text-brand-700">{fmt(p.price)}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
