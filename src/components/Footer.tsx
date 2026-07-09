import React, { useState } from 'react';
import { MapPin, Phone, Mail, ChevronDown, Banknote, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import LogoMark from './LogoMark';
import MoMoIcon from './icons/MoMoIcon';

interface FooterLinkSectionProps {
  title: string;
  links: { label: string; href: string; nav?: string }[];
  navigate: (path: string) => void;
  span: string;
}

function FooterLinkSection({ title, links, navigate, span }: FooterLinkSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={span}>
      <button
        onClick={() => setOpen(v => !v)}
        className="md:cursor-default md:pointer-events-none w-full text-left text-white font-semibold mb-3 md:mb-4 text-sm uppercase tracking-wider flex items-center justify-between py-2 md:py-0 border-b md:border-0 border-white/10"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          size={14} strokeWidth={2}
          className={`md:hidden transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <ul className={`space-y-2.5 text-sm pt-3 md:pt-0 md:!block ${open ? 'block' : 'hidden'}`}>
        {links.map(({ href, label, nav }) => (
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
  );
}

export default function Footer() {
  const { navigate, showToast } = useStore();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Cảm ơn bạn đã đăng ký!');
    setEmail('');
  };

  return (
    <footer className="bg-brand-700 text-white/80 pt-16 pb-6 mt-16">
      <div className="container-x grid md:grid-cols-12 gap-10">
        {/* Col 1 — Brand + contact */}
        <div className="md:col-span-4">
          <LogoMark
            href="#/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            size={56}
            className="mb-4 text-white hover:opacity-90 transition-opacity"
          />
          <p className="text-sm leading-relaxed mb-5 text-white/75">Trang sức bạc cao cấp dành cho giới trẻ — luôn cập nhật những xu hướng thời trang mới nhất.</p>
          <ul className="space-y-2.5 text-sm text-white/85">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
              <span>159 Lý Thường Kiệt, Quang Trung, Hà Đông, Hà Nội</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
              <a href="tel:0982463691" className="hover:text-white">0982 463 691</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
              <a href="mailto:hello@liorajewelry.shop" className="hover:text-white">hello@liorajewelry.shop</a>
            </li>
          </ul>
        </div>

        <FooterLinkSection
          title="Chính sách"
          span="md:col-span-3"
          navigate={navigate}
          links={[
            { href:'#/about', label:'Giới thiệu', nav:'/about' },
            { href:'#', label:'Bảo hành, Đổi trả' },
            { href:'#', label:'Chính sách kiểm hàng' },
            { href:'#', label:'Chính sách giao hàng' },
            { href:'#', label:'Bảo mật thông tin' },
          ]}
        />
        <FooterLinkSection
          title="Hỗ trợ"
          span="md:col-span-2"
          navigate={navigate}
          links={[
            { href:'#/track-order', label:'Tra cứu đơn hàng', nav:'/track-order' },
            { href:'#/huong-dan', label:'Hướng dẫn chọn size', nav:'/huong-dan' },
            { href:'#/huong-dan', label:'Hướng dẫn bảo quản', nav:'/huong-dan' },
            { href:'#/kiem-dinh', label:'Kiểm định GRA', nav:'/kiem-dinh' },
            { href:'#/feedback', label:'Feedback', nav:'/feedback' },
            { href:'#/lien-he', label:'Liên hệ', nav:'/lien-he' },
          ]}
        />

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
              {
                title: 'Facebook',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.46 1.47-3.83 3.72-3.83 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89H13.5v6.98A10 10 0 0 0 22 12Z"/></svg>,
              },
              {
                title: 'TikTok',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8.5a6 6 0 0 1-3.5-1.1v7.4a5.5 5.5 0 1 1-5.5-5.5v3a2.5 2.5 0 1 0 2.5 2.5V2h3a3 3 0 0 0 3 3v3.5Z"/></svg>,
              },
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
          <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1" title="Thẻ ngân hàng (Visa/Mastercard/JCB)">
            <CreditCard size={14} strokeWidth={1.8} /> Visa/Master
          </span>
          <span className="bg-white/10 p-1 rounded" title="Ví MoMo"><MoMoIcon size={18} /></span>
          <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1" title="Thanh toán khi nhận hàng (COD)">
            <Banknote size={14} strokeWidth={1.8} /> COD
          </span>
        </div>
      </div>
    </footer>
  );
}
