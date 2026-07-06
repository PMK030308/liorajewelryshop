import React, { useEffect, useRef, useState } from 'react';
import { ShapeKey } from '../types';
import Shapes from '../data/shapes';

interface Props {
  tint: string;
  tint2: string;
  accent: string;
  shape: ShapeKey;
  ratio?: string;
  hot?: boolean;
  sold?: boolean;
  /** Discount percent (e.g. 25 → "−25%" badge). Takes priority over `hot`. */
  discount?: number;
  image?: string;
  imageAlt?: string;
  imageHover?: string;
}

export default function PhotoPlaceholder({
  tint, tint2, accent, shape, ratio = '1/1', hot, sold, discount, image, imageAlt, imageHover,
}: Props) {
  const ShapeSvg = Shapes[shape] || Shapes['gem'];
  const [loaded, setLoaded] = useState(!image);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`photo ${!loaded ? 'skeleton' : ''}`}
      style={{
        aspectRatio: ratio,
        backgroundImage: loaded
          ? `radial-gradient(120% 80% at 50% 30%, #ffffff, ${tint} 75%, ${tint2})`
          : undefined,
      } as React.CSSProperties}
    >
      {image && inView && (
        <>
          <img
            src={image}
            alt={imageAlt || ''}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imageHover ? 'group-hover:opacity-0' : ''}`}
          />
          {imageHover && (
            <img
              src={imageHover}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </>
      )}
      {!image && loaded && (
        <div className="sil" style={{ color: accent }}>
          {ShapeSvg}
        </div>
      )}
      {/* Unified left badge — priority: sold > discount > hot */}
      {sold ? (
        <div className="ribbon-out" style={{ zIndex: 2 }}>Hết hàng</div>
      ) : discount && discount > 0 ? (
        <div className="ribbon" style={{ zIndex: 2, background: '#ad4f74' }}>−{discount}%</div>
      ) : hot ? (
        <div className="ribbon" style={{ zIndex: 2 }}>HOT</div>
      ) : null}
    </div>
  );
}
