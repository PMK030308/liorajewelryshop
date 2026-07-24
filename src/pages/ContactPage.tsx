import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ContactMessage } from '../types';

export default function ContactPage() {
  const { state, navigate, dispatch, showToast } = useStore();
  const { settings } = state.siteContent;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg: ContactMessage = {
      id: 'cm-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      message: message.trim(),
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_CONTACT_MESSAGE', payload: msg });
    showToast(`✓ Đã gửi tin nhắn! ${settings.brandName} sẽ phản hồi sớm.`);
    setName(''); setPhone(''); setEmail(''); setMessage('');
  };
  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / Liên Hệ
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Liên hệ với {settings.brandName}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Thông tin cửa hàng</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><MapPin size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Địa chỉ</div><div className="text-ink2">{settings.address}</div></div></li>
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><Phone size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Hotline</div><a href={`tel:${settings.hotline}`} className="text-brand-500 hover:underline">{settings.hotline}</a></div></li>
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><Mail size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Email</div><a href={`mailto:${settings.email}`} className="text-brand-500 hover:underline">{settings.email}</a></div></li>
            <li className="flex items-start gap-3"><span className="text-xl text-brand-700 mt-0.5"><Clock size={20} strokeWidth={1.8} /></span><div><div className="font-semibold">Giờ làm việc</div><div className="text-ink2">{settings.openHours}</div></div></li>
          </ul>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-2">Gửi tin nhắn cho chúng mình</h3>
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Họ tên" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Số điện thoại" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Nội dung tin nhắn…" className="w-full border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
          <button className="btn-primary w-full justify-center">Gửi tin nhắn →</button>
        </form>
      </div>
    </main>
  );
}