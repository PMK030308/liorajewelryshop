import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initials: string;
  tint: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Nguyễn Thu Hà',
    role: 'Khách hàng từ 2023',
    content: 'Sản phẩm đẹp hơn ảnh, hộp đựng sang trọng. Mình mua vòng tay Charm Hoà Hồng Ngọc và rất bất ngờ vì độ in ảnh đẹp, charm tỉ mỉ từng chi tiết!',
    initials: 'TH',
    tint: '#f2c8d2',
  },
  {
    name: 'Trần Minh Anh',
    role: 'Khách hàng từ 2024',
    content: 'Shop tư vấn rất nhiệt tình, gói quà cẩn thận. Mình tặng vợ nhân kỷ niệm và nàng thích lắm. Sẽ ủng hộ tiếp!',
    initials: 'MA',
    tint: '#ffe0e7',
  },
  {
    name: 'Phạm Quỳnh Anh',
    role: 'Khách hàng từ 2025',
    content: 'Vòng tay Charm chârm biết chọc, đeo rất nhẹ, không bị tuột charm. Charm khắc sắc nét đẹp sắc sảo. Giá hợp lý, đáng tiền!',
    initials: 'QA',
    tint: '#e6f0e8',
  },
  {
    name: 'Lê Hoàng Nam',
    role: 'Khách hàng từ 2024',
    content: 'Đặt online giao nhanh trong ngày, kiểm hàng kỹ trước khi nhận. Chất lượng đúng như mô tả. Recommend shop!',
    initials: 'HN',
    tint: '#fff1cf',
  },
];

const Stars = () => (
  <div className="flex gap-0.5 text-yellow-400" aria-label="5 sao">
    {[0,1,2,3,4].map(i => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 14.85 8.74 22 9.27l-5.43 4.74L18.18 22 12 18.27 5.82 22l1.61-7.99L2 9.27l7.15-.53L12 2z"/>
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(v => (v + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (delta: number) => setIdx(v => (v + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  const t = TESTIMONIALS[idx];

  return (
    <section className="bg-soft section-y">
      <div className="container-x">
        <div className="text-center mb-10">
          <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">CẢM NHẬN</div>
          <h2 className="sec-title">Khách hàng nói gì về LIORA</h2>
        </div>

        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            onClick={() => go(-1)}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card text-brand-700 hover:bg-brand-50 hidden md:flex items-center justify-center z-10"
            aria-label="Trước"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card text-brand-700 hover:bg-brand-50 hidden md:flex items-center justify-center z-10"
            aria-label="Sau"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <div className="relative overflow-hidden min-h-[260px] md:min-h-[220px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
                className="bg-white rounded-lg shadow-card p-7 md:p-9 text-center"
              >
                <svg className="mx-auto mb-4 text-brand-200" width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.17 5C4.32 5 2 7.32 2 10.17v8.83h7v-8H5c0-1.75 1.42-3.17 3.17-3.17V5Zm10 0c-2.85 0-5.17 2.32-5.17 5.17v8.83h7v-8h-4c0-1.75 1.42-3.17 3.17-3.17V5Z"/>
                </svg>
                <p className="text-ink2 text-base md:text-lg leading-relaxed mb-6">"{t.content}"</p>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-brand-700"
                    style={{ background: t.tint }}
                  >{t.initials}</div>
                  <Stars />
                  <div>
                    <div className="font-semibold text-brand-700">{t.name}</div>
                    <div className="text-xs text-mute">{t.role}</div>
                  </div>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-brand-700 w-6' : 'bg-brand-200'}`}
                aria-label={`Cảm nhận ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
