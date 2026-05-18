import React, { useEffect, useState } from 'react';

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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92Z"/>
        </svg>
      </a>

      <a
        href="#"
        className="fab w-12 h-12 rounded-full bg-white shadow-float flex items-center justify-center hover:bg-brand-50 border border-rule"
        aria-label="Bản đồ" title="Xem địa chỉ shop"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43062" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </a>

      <a
        href="#"
        className="fab w-12 h-12 rounded-full bg-blue-500 text-white shadow-float flex items-center justify-center hover:bg-blue-600"
        aria-label="Messenger" title="Chat messenger"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.9 1.43 5.49 3.66 7.18V22l3.34-1.83c.89.25 1.83.38 2.8.38 5.5 0 10-4.14 10-9.25S17.5 2 12 2Zm.98 12.36-2.55-2.72-4.98 2.72 5.47-5.8 2.6 2.7 4.94-2.7-5.48 5.8Z"/>
        </svg>
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fab w-12 h-12 rounded-full bg-brand-700 text-white shadow-float flex items-center justify-center hover:bg-brand-900 transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        aria-label="Lên đầu trang" title="Lên đầu trang"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
}
