import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ContactPage() {
  const { navigate, showToast } = useStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('✓ Đã gửi tin nhắn! Liorajewelry sẽ phản hồi sớm.');
  };
  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / Liên Hệ
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Liên hệ với Liorajewelry</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Thông tin cửa hàng</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><MapPin size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Địa chỉ</div><div className="text-ink2">159 Lý Thường Kiệt, Quang Trung, Hà Đông, Hà Nội</div></div></li>
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><Phone size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Hotline</div><a href="tel:0982463691" className="text-brand-500 hover:underline">0982463691</a></div></li>
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><Mail size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Email</div><a href="mailto:hello@liorajewelry.shop" className="text-brand-500 hover:underline">hello@liorajewelry.shop</a></div></li>
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><Clock size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Giờ làm việc</div><div className="text-ink2">Thứ 2 – CN: 9:00 – 22:00</div></div></li>
          </ul>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-2">Gửi tin nhắn cho chúng mình</h3>
          <input required placeholder="Họ tên" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <input required type="tel" placeholder="Số điện thoại" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <input type="email" placeholder="Email" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <textarea required rows={5} placeholder="Nội dung tin nhắn…" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <button className="btn-primary w-full justify-center">Gửi tin nhắn →</button>
        </form>
      </div>
    </main>
  );
}
