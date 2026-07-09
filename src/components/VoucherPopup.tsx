import React, { useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function VoucherPopup() {
  const { state, dispatch, showToast } = useStore();

  useEffect(() => {
    // Chỉ hiển thị khi mới truy cập trang web hoặc load lại trang
    dispatch({ type: 'OPEN_VOUCHER' });
  }, [dispatch]);

  const close = () => dispatch({ type: 'CLOSE_ALL' });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`🎉 Đã copy mã ${code} thành công!`);
    // Tự động đóng modal sau 800ms để người dùng thao tác tiếp
    setTimeout(() => {
      close();
    }, 800);
  };

  return (
    <>
      {/* Lớp overlay mờ nền phía sau */}
      <div 
        className={`scrim fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          state.voucherOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={close} 
      />
      
      {/* Hộp thoại Popup Voucher */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-white rounded-3xl shadow-[0_20px_50px_rgba(244,114,160,0.22)] overflow-hidden transition-all duration-500 ease-out border border-brand-200 ${
          state.voucherOpen
            ? 'opacity-100 scale-100 translate-y-[-50%]'
            : 'opacity-0 scale-90 translate-y-[-40%] pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        style={{ width: '90%', maxWidth: '380px' }}
      >
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20 transition-all active:scale-90"
          onClick={close} 
          aria-label="Đóng"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Tiêu đề với dải màu Gradient Rose Gold lấp lánh */}
        <div className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 p-8 text-white text-center select-none overflow-hidden">
          {/* Hiệu ứng hạt sáng lấp lánh */}
          <div className="absolute top-3 left-4 text-white/25 animate-pulse"><Sparkles size={20} strokeWidth={1.5} /></div>
          <div className="absolute bottom-4 right-6 text-white/30 animate-bounce"><Sparkles size={26} strokeWidth={1.5} /></div>
          <div className="absolute top-10 right-10 text-white/15"><Sparkles size={16} strokeWidth={1.5} /></div>
          <div className="absolute bottom-10 left-8 text-white/20"><Sparkles size={20} strokeWidth={1.5} /></div>

          <div className="relative z-10">
            <span className="block mb-2 drop-shadow-md select-none flex justify-center"><Gift size={52} strokeWidth={1.5} /></span>
            <h3 className="font-sans font-bold text-2xl tracking-wider uppercase drop-shadow">Ưu Đãi Độc Quyền</h3>
            <p className="text-xs text-white/95 font-light mt-1.5 uppercase tracking-widest">Dành riêng cho khách hàng Liora</p>
          </div>
          
          {/* Đường cắt lượn sóng thẩm mỹ phía dưới tiêu đề */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-white" style={{ clipPath: 'path("M0 10 Q 15 2 30 10 T 60 10 T 90 10 T 120 10 T 150 10 T 180 10 T 210 10 T 240 10 T 270 10 T 300 10 T 330 10 T 360 10 T 390 10 T 420 10 V 15 H 0 Z")' }}></div>
        </div>

        {/* Phần danh sách thẻ Voucher */}
        <div className="p-6 bg-white space-y-4 pt-7">
          <p className="text-xs text-center text-ink2 font-medium">Bấm vào thẻ voucher dưới đây để sao chép nhanh:</p>
          
          <div className="space-y-3 max-h-[260px] overflow-y-auto no-scrollbar pr-0.5">
            {[
              { code: 'LIORA20', label: 'Giảm ngay 20.000₫', min: 'đơn từ 300k' },
              { code: 'LIORA50', label: 'Giảm ngay 50.000₫', min: 'đơn từ 500k' },
              { code: 'LIORA100', label: 'Giảm ngay 100.000₫', min: 'đơn từ 1.5tr' },
            ].map(v => (
              <button
                key={v.code}
                onClick={() => copyCode(v.code)}
                className="group relative w-full flex items-center justify-between border-2 border-dashed border-brand-200 hover:border-brand-500 bg-brand-50 hover:bg-white rounded-2xl p-3.5 text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                {/* Lỗ xẻ hai bên rìa tạo phong cách tấm vé cổ điển */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-r-2 border-dashed border-brand-200 group-hover:border-brand-500 transition-colors"></div>
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-l-2 border-dashed border-brand-200 group-hover:border-brand-500 transition-colors"></div>
                
                <div className="pl-2">
                  <span className="font-extrabold text-brand-700 text-sm block tracking-widest">{v.code}</span>
                  <span className="text-[11px] text-ink2 font-medium mt-0.5 block">{v.label} <span className="text-mute font-normal">• {v.min}</span></span>
                </div>
                <div className="pr-2">
                  <span className="text-[10px] bg-brand-700 group-hover:bg-brand-500 text-white font-bold px-3 py-1.5 rounded-lg tracking-wider transition-colors inline-block uppercase shadow-sm">SAO CHÉP</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-mute flex items-center justify-center gap-1 opacity-80 pt-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 6V12L16 14"/></svg>
            Hạn dùng: 30/12/2026 • Áp dụng khi thanh toán đơn hàng
          </div>
        </div>
      </div>
    </>
  );
}
