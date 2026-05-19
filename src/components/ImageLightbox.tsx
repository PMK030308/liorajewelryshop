import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface Props {
  open: boolean;
  images: string[];
  startIdx?: number;
  onClose: () => void;
  alt?: string;
}

export default function ImageLightbox({ open, images, startIdx = 0, onClose, alt = '' }: Props) {
  const [idx, setIdx] = useState(startIdx);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => { setIdx(startIdx); setZoomed(false); }, [startIdx, open]);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(v => (v - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(v => (v + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, images.length]);

  if (!open || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/90 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white" onClick={e => e.stopPropagation()}>
        <span className="text-sm">{idx + 1} / {images.length}</span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          aria-label="Đóng"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center px-4 pb-4 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={() => setIdx(v => (v - 1 + images.length) % images.length)}
            className="absolute left-2 md:left-4 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
        )}

        <div
          className={`overflow-auto max-w-full max-h-full cursor-${zoomed ? 'zoom-out' : 'zoom-in'}`}
          onClick={() => setZoomed(z => !z)}
        >
          <img
            src={images[idx]}
            alt={alt}
            className={`select-none transition-transform duration-300 ${zoomed ? 'scale-[2]' : 'scale-100'}`}
            style={{ maxWidth: zoomed ? 'none' : '100%', maxHeight: zoomed ? 'none' : '85vh' }}
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={() => setIdx(v => (v + 1) % images.length)}
            className="absolute right-2 md:right-4 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            aria-label="Ảnh sau"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-1.5 pointer-events-none">
          <ZoomIn size={12} strokeWidth={2} />
          <span>Bấm vào ảnh để {zoomed ? 'thu nhỏ' : 'phóng to'}</span>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 p-3 overflow-x-auto no-scrollbar bg-black/40"
          onClick={e => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setZoomed(false); }}
              className={`flex-shrink-0 w-14 h-14 border-2 overflow-hidden transition ${i === idx ? 'border-white' : 'border-white/20 hover:border-white/50 opacity-70'}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
