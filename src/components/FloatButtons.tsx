import React, { useEffect, useState } from 'react';
import { Phone, MapPin, MessageCircle, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function FloatButtons() {
  const { state } = useStore();
  const { settings } = state.siteContent;
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-20 lg:bottom-5 right-4 lg:right-5 z-20 flex flex-col gap-2.5 lg:gap-3">
      {/* Nền trắng, border hồng pastel, icon hồng — hover mới đổi nền hồng */}
      <a
        href={`tel:${settings.hotline}`}
        className="fab fab-call w-12 h-12 rounded-full shadow-float flex items-center justify-center"
        aria-label="Gọi ngay" title="Gọi ngay"
      >
        <Phone size={20} strokeWidth={1.8} />
      </a>

      <a
        href={settings.mapUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="fab w-12 h-12 rounded-full shadow-float flex items-center justify-center"
        aria-label="Bản đồ" title="Xem địa chỉ shop"
      >
        <MapPin size={20} strokeWidth={1.8} />
      </a>

      <a
        href={settings.messengerUrl || settings.facebookUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="fab w-12 h-12 rounded-full shadow-float flex items-center justify-center"
        aria-label="Messenger" title="Chat messenger"
      >
        <MessageCircle size={20} strokeWidth={1.8} />
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fab w-12 h-12 rounded-full shadow-float flex items-center justify-center transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        aria-label="Lên đầu trang" title="Lên đầu trang"
      >
        <ChevronUp size={20} strokeWidth={2} />
      </button>
    </div>
  );
}