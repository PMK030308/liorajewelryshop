import React, { useEffect, useState } from 'react';
import { Phone, MapPin, MessageCircle, ChevronUp } from 'lucide-react';

export default function FloatButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-20 lg:bottom-5 right-4 lg:right-5 z-20 flex flex-col gap-2.5 lg:gap-3">
      <a
        href="tel:0982463691"
        className="fab fab-call w-12 h-12 rounded-full bg-brand-500 text-white shadow-float flex items-center justify-center hover:bg-brand-600"
        aria-label="Gọi ngay" title="Gọi ngay"
      >
        <Phone size={20} strokeWidth={1.8} />
      </a>

      <a
        href="https://goo.gl/maps/example"
        target="_blank"
        rel="noopener noreferrer"
        className="fab w-12 h-12 rounded-full bg-white shadow-float flex items-center justify-center hover:bg-brand-50 border border-rule text-brand-700"
        aria-label="Bản đồ" title="Xem địa chỉ shop"
      >
        <MapPin size={20} strokeWidth={1.8} />
      </a>

      <a
        href="https://m.me/liorajewelry.vn"
        target="_blank"
        rel="noopener noreferrer"
        className="fab w-12 h-12 rounded-full bg-brand-500 text-white shadow-float flex items-center justify-center hover:bg-brand-600"
        aria-label="Messenger" title="Chat messenger"
      >
        <MessageCircle size={20} strokeWidth={1.8} />
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fab w-12 h-12 rounded-full bg-brand-700 text-white shadow-float flex items-center justify-center hover:bg-brand-900 transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        aria-label="Lên đầu trang" title="Lên đầu trang"
      >
        <ChevronUp size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
