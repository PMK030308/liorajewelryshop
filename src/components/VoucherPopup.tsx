import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import Shapes from '../data/shapes';
import { fmt } from '../data';

export default function VoucherPopup() {
  const { state, dispatch, showToast } = useStore();
  const [email, setEmail] = React.useState('');

  useEffect(() => {
    if (!localStorage.getItem('liora_voucher_seen')) {
      const t = setTimeout(() => {
        dispatch({ type: 'OPEN_VOUCHER' });
        localStorage.setItem('liora_voucher_seen', '1');
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [dispatch]);

  const close = () => dispatch({ type: 'CLOSE_ALL' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    close();
    showToast('🎉 Đã gửi voucher tới email của bạn!');
    setEmail('');
  };

  return (
    <>
      <div className={`scrim ${state.voucherOpen ? 'open' : ''}`} onClick={close} />
      <div className={`voucher ${state.voucherOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center z-10"
          onClick={close} aria-label="Đóng"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-8 text-white text-center flex flex-col justify-center">
            <div className="text-5xl mb-3">🎁</div>
            <div className="text-2xl font-bold mb-1">VOUCHER 50K</div>
            <div className="text-sm opacity-90">Cho đơn từ 500.000₫</div>
          </div>
          <div className="p-7">
            <h3 className="font-bold text-xl mb-2">Đăng Ký Nhận Ngay Voucher 50k</h3>
            <p className="text-sm text-ink2 mb-4">Cùng nhiều ưu đãi cực hấp dẫn từ Liorajewelry!</p>
            <div className="bg-brand-50 border border-dashed border-brand-300 rounded-lg px-4 py-3 mb-4 text-center">
              <div className="text-[10px] tracking-widest text-brand-600 mb-1">MÃ GIẢM GIÁ</div>
              <div className="font-bold text-xl text-brand-600 tracking-wider">LIORANEW</div>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email của bạn"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-rule rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 mb-3"
              />
              <button className="btn-primary w-full justify-center">Nhận voucher ngay</button>
            </form>
            <p className="text-[11px] text-mute mt-3 text-center">Nhập mã LIORANEW để được giảm 50k. Thời gian sử dụng 7 ngày.</p>
          </div>
        </div>
      </div>
    </>
  );
}
