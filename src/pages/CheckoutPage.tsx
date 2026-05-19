import React, { useState, useEffect } from 'react';
import { Check, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fmt } from '../data';
import Shapes from '../data/shapes';
import { Order } from '../types';
import InvoiceModal from '../components/InvoiceModal';

export default function CheckoutPage() {
  const { state, dispatch, navigate, showToast } = useStore();
  const { cart, user } = state;

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [district, setDistrict] = useState('');
  const [note, setNote] = useState('');
  const [payment, setPayment] = useState<'cod' | 'bank' | 'momo'>('cod');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number } | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      setName(prev => prev || user.name);
      setPhone(prev => prev || user.phone || '');
      setEmail(prev => prev || user.email);
    }
  }, [user]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = subtotal >= 500000 ? 0 : 30000;
  const discount = appliedCoupon?.amount ?? 0;
  const total = Math.max(0, subtotal + ship - discount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === 'LIORANEW' && subtotal >= 500000) {
      setAppliedCoupon({ code, amount: 50000 });
      showToast('✓ Áp dụng mã LIORANEW: giảm 50.000₫');
    } else if (code === 'LIORANEW') {
      showToast('⚠ Mã LIORANEW áp dụng cho đơn từ 500k');
    } else {
      setAppliedCoupon(null);
      showToast('⚠ Mã giảm giá không hợp lệ');
    }
  };

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: 'o-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      userId: user?.id ?? null,
      items: cart,
      shipping: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        city,
        district: district || undefined,
        note: note.trim() || undefined,
      },
      payment,
      subtotal,
      ship,
      discount,
      total,
      coupon: appliedCoupon?.code,
      status: 'pending',
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });
    showToast('Đặt hàng thành công!');
    setPlacedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ====== ORDER SUCCESS SCREEN ======
  if (placedOrder) {
    return (
      <main className="page container-x py-10 md:py-16 max-w-2xl min-h-[70vh]">
        <div className="bg-white border border-rule rounded-lg shadow-card p-7 md:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-5">
            <Check size={32} strokeWidth={2.4} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-700 mb-2">Đặt hàng thành công!</h1>
          <p className="text-sm text-ink2 mb-1">
            Mã đơn hàng: <span className="font-bold text-brand-700">#{placedOrder.id.slice(-8).toUpperCase()}</span>
          </p>
          <p className="text-sm text-mute mb-7">
            Chúng tôi sẽ liên hệ xác nhận đơn trong vòng 15 phút.<br />
            Hóa đơn cũng có thể tải lại bất kỳ lúc nào ở trang Tài khoản.
          </p>

          <div className="bg-soft rounded-md p-4 mb-6 text-sm text-left max-w-md mx-auto">
            <div className="flex justify-between mb-1"><span className="text-ink2">Người nhận</span><span className="font-medium">{placedOrder.shipping.name}</span></div>
            <div className="flex justify-between mb-1"><span className="text-ink2">SĐT</span><span className="font-medium">{placedOrder.shipping.phone}</span></div>
            <div className="flex justify-between mb-1"><span className="text-ink2">Phương thức</span><span className="font-medium uppercase">{placedOrder.payment}</span></div>
            <div className="flex justify-between mt-2 pt-2 border-t border-rule text-base font-bold text-brand-700"><span>Tổng tiền</span><span>{fmt(placedOrder.total)}</span></div>
          </div>

          <div className="max-w-md mx-auto mb-3">
            <button
              onClick={() => setShowInvoice(true)}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-md text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <FileText size={16} strokeWidth={2} />
              Xem & in hóa đơn
            </button>
            <p className="text-[11px] text-mute mt-2 text-center">
              Mở hóa đơn để in trực tiếp hoặc lưu thành PDF từ hộp thoại in của trình duyệt
            </p>
          </div>

          <InvoiceModal order={showInvoice ? placedOrder : null} onClose={() => setShowInvoice(false)} />

          <div className="flex gap-2 max-w-md mx-auto">
            <button
              onClick={() => navigate(user ? '/account' : '/')}
              className="flex-1 text-sm text-brand-500 hover:text-brand-700 py-2 font-medium"
            >
              {user ? '→ Xem đơn của tôi' : '→ Về trang chủ'}
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 text-sm text-brand-500 hover:text-brand-700 py-2 font-medium"
            >
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-3">Giỏ hàng trống</h1>
        <p className="text-ink2 mb-6">Hãy thêm sản phẩm vào giỏ trước khi thanh toán</p>
        <a className="btn-pink" href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>Khám phá sản phẩm →</a>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container-x py-4 text-xs text-mute">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <span className="text-ink">Thanh toán</span>
      </div>

      <section className="container-x grid lg:grid-cols-5 gap-8 pb-12">
        <form className="lg:col-span-3 space-y-5" onSubmit={placeOrder}>
          {!user && (
            <div className="bg-brand-50 border border-brand-200 rounded-md px-4 py-3 text-sm text-brand-700 flex items-center justify-between">
              <span>💡 Bạn đã có tài khoản? <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="underline font-semibold">Đăng nhập</a> để theo dõi đơn hàng dễ hơn.</span>
            </div>
          )}

          <h2 className="text-xl font-bold mb-2">Thông tin giao hàng</h2>
          <div className="grid grid-cols-2 gap-3">
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Họ và tên *" className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500 col-span-2" />
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Số điện thoại *" className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
            <input required value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ chi tiết *" className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500 col-span-2" />
            <select value={city} onChange={e => setCity(e.target.value)} className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500">
              <option>Hà Nội</option><option>TP. Hồ Chí Minh</option><option>Đà Nẵng</option>
            </select>
            <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Quận / Huyện" className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" className="border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500 col-span-2" rows={3} />
          </div>

          <h2 className="text-xl font-bold mt-8 mb-2">Phương thức thanh toán</h2>
          <div className="space-y-2">
            {[
              { v:'cod',  label:'Thanh toán khi nhận hàng (COD)', icon:'💵' },
              { v:'bank', label:'Chuyển khoản ngân hàng',         icon:'🏦' },
              { v:'momo', label:'Ví điện tử MoMo',                icon:'📱' },
            ].map((pm) => (
              <label key={pm.v} className="flex items-center gap-3 border border-rule rounded-md p-3 cursor-pointer hover:border-brand-500 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input type="radio" name="pm" value={pm.v} checked={payment === pm.v} onChange={() => setPayment(pm.v as typeof payment)} className="accent-brand-700" />
                <span className="text-2xl">{pm.icon}</span>
                <span className="font-medium text-sm">{pm.label}</span>
              </label>
            ))}
          </div>

          <button className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-4 rounded-md mt-4 transition-colors">
            Đặt hàng — {fmt(total)}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="lg:col-span-2 lg:sticky lg:top-24 self-start">
          <div className="bg-soft rounded-lg p-5">
            <h3 className="font-bold mb-4">Đơn hàng ({cart.length} sản phẩm)</h3>
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1 no-scrollbar">
              {cart.map(it => {
                const ShapeSvg = Shapes[it.shape] || Shapes['gem'];
                return (
                  <div key={it.cartId} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <div
                        className="photo h-full w-full"
                        style={{ aspectRatio:'auto', backgroundImage:`radial-gradient(120% 80% at 50% 30%, #ffffff, ${it.tint} 75%, ${it.tint2})` } as React.CSSProperties}
                      >
                        <div className="sil" style={{ color: it.accent }}>{ShapeSvg}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium line-clamp-2">{it.name}</div>
                      <div className="text-xs text-mute mt-0.5">SL: {it.qty}{it.size ? ` · ${it.size}` : ''}</div>
                    </div>
                    <div className="text-xs font-bold whitespace-nowrap">{fmt(it.price * it.qty)}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mb-4">
              <input
                placeholder="Nhập mã giảm giá"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                className="flex-1 border border-rule rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
              <button type="button" onClick={applyCoupon} className="btn-outline px-5 py-2 text-sm">Áp dụng</button>
            </div>
            <div className="space-y-2 text-sm border-t border-rule pt-3">
              <div className="flex justify-between"><span className="text-ink2">Tạm tính</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between">
                <span className="text-ink2">Phí vận chuyển</span>
                <span>{ship === 0 ? <span className="text-green-600">Miễn phí</span> : fmt(ship)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Mã {appliedCoupon.code}</span><span>− {fmt(appliedCoupon.amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-rule pt-2 mt-2">
                <span>Tổng tiền</span><span className="text-brand-700">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
