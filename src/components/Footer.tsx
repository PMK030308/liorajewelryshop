import React from 'react';
import { useStore } from '../store/useStore';

export default function Footer() {
  const { navigate, showToast } = useStore();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('🎉 Cảm ơn bạn đã đăng ký!');
    setEmail('');
  };

  return (
    <footer className="bg-brand-700 text-white/80 pt-16 pb-6 mt-16">
      <div className="container-x grid md:grid-cols-12 gap-10">
        {/* Col 1 — Brand + contact */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5 mb-4 text-white">
            <svg width="42" height="42" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="30" cy="30" r="22"/>
              <path d="M18 32 C 22 22, 38 22, 42 32"/>
              <path d="M21 34 C 24 27, 36 27, 39 34"/>
              <path d="M24 36 C 27 31, 33 31, 36 36"/>
              <circle cx="30" cy="33.5" r="1.6" fill="currentColor" stroke="none"/>
            </svg>
            <span className="font-bold text-2xl tracking-[0.22em]">LIORA</span>
          </div>
          <p className="text-sm leading-relaxed mb-5 text-white/75">Trang sức bạc cao cấp dành cho giới trẻ — luôn cập nhật những xu hướng thời trang mới nhất.</p>
          <ul className="space-y-2.5 text-sm text-white/85">
            <li className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>159 Lý Thường Kiệt, Quang Trung, Hà Đông, Hà Nội</span>
            </li>
            <li className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92Z"/></svg>
              <a href="tel:0982463691" className="hover:text-white">0982 463 691</a>
            </li>
            <li className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><path d="m22 6-10 7L2 6"/></svg>
              <a href="mailto:hello@liorajewelry.shop" className="hover:text-white">hello@liorajewelry.shop</a>
            </li>
          </ul>
        </div>

        {/* Col 2 — Policies */}
        <div className="md:col-span-3">
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Chính sách</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href:'#/about', label:'Giới thiệu', nav:'/about' },
              { href:'#', label:'Bảo hành, Đổi trả' },
              { href:'#', label:'Chính sách kiểm hàng' },
              { href:'#', label:'Chính sách giao hàng' },
              { href:'#', label:'Bảo mật thông tin' },
            ].map(({ href, label, nav }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={nav ? (e) => { e.preventDefault(); navigate(nav); } : undefined}
                  className="hover:text-white transition-colors"
                >{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Help */}
        <div className="md:col-span-2">
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hỗ trợ</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href:'#/huong-dan', label:'Hướng dẫn chọn size', nav:'/huong-dan' },
              { href:'#/huong-dan', label:'Hướng dẫn bảo quản', nav:'/huong-dan' },
              { href:'#/kiem-dinh', label:'Kiểm định GRA', nav:'/kiem-dinh' },
              { href:'#/feedback', label:'Feedback', nav:'/feedback' },
              { href:'#/lien-he', label:'Liên hệ', nav:'/lien-he' },
            ].map(({ href, label, nav }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={nav ? (e) => { e.preventDefault(); navigate(nav); } : undefined}
                  className="hover:text-white transition-colors"
                >{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Newsletter + Social */}
        <div className="md:col-span-3">
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Đăng ký nhận tin</h4>
          <p className="text-sm text-white/70 mb-3">Nhận ưu đãi sớm và sản phẩm mới</p>
          <form onSubmit={handleSubscribe} className="flex border border-white/20 rounded-md overflow-hidden bg-white/10 focus-within:border-white/50 transition mb-5">
            <input
              type="email"
              required
              placeholder="Email của bạn"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/50 outline-none"
            />
            <button type="submit" className="bg-white text-brand-700 px-4 text-sm font-semibold hover:bg-brand-50 transition-colors">Gửi</button>
          </form>
          <div className="flex gap-3">
            {[
              { title:'Facebook', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.46 1.47-3.83 3.72-3.83 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89H13.5v6.98A10 10 0 0 0 22 12Z"/></svg> },
              { title:'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg> },
              { title:'TikTok', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8.5a6 6 0 0 1-3.5-1.1v7.4a5.5 5.5 0 1 1-5.5-5.5v3a2.5 2.5 0 1 0 2.5 2.5V2h3a3 3 0 0 0 3 3v3.5Z"/></svg> },
            ].map(s => (
              <a key={s.title} href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-brand-700 flex items-center justify-center transition-all" title={s.title}>{s.icon}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-6 container-x flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/60">
        <div>Copyright © 2026 Liorajewelry.shop — All rights reserved</div>
        <div className="flex items-center gap-2">
          <span className="mr-1">Thanh toán:</span>
          {['VISA','Mastercard','MoMo','COD'].map(m => (
            <span key={m} className="bg-white/10 px-2.5 py-1 rounded text-[11px] font-medium">{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
