import React, { useState } from 'react';
import { Package, Check, Clock, Truck, Phone, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fmt } from '../data';
import { Order, OrderStatus } from '../types';
import InvoiceModal from '../components/InvoiceModal';

const STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'pending',   label: 'Chờ xác nhận',  icon: <Clock size={18} strokeWidth={1.8} /> },
  { key: 'confirmed', label: 'Đã xác nhận',   icon: <Check size={18} strokeWidth={1.8} /> },
  { key: 'shipping',  label: 'Đang giao',     icon: <Truck size={18} strokeWidth={1.8} /> },
  { key: 'done',      label: 'Đã giao',       icon: <Package size={18} strokeWidth={1.8} /> },
];

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function TrackOrderPage() {
  const { state, navigate } = useStore();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    // Match by either: full id, last-8 chars (case-insensitive), or partial id
    const cleanCode = code.trim().toLowerCase().replace(/^#/, '');
    const cleanPhone = phone.trim().replace(/\s/g, '');

    const order = state.orders.find(o => {
      const last8 = o.id.slice(-8).toLowerCase();
      const phoneMatch = o.shipping.phone.replace(/\s/g, '') === cleanPhone;
      const codeMatch = last8 === cleanCode || o.id.toLowerCase().includes(cleanCode);
      return codeMatch && phoneMatch;
    });

    setFoundOrder(order ?? null);
  };

  const reset = () => {
    setSearched(false);
    setFoundOrder(null);
    setCode('');
    setPhone('');
  };

  // Cancelled status renders separately
  const isCancelled = foundOrder?.status === 'cancelled';
  const currentStepIdx = foundOrder
    ? STEPS.findIndex(s => s.key === foundOrder.status)
    : -1;

  return (
    <main className="page container-x py-10 md:py-14 max-w-3xl min-h-[60vh]">
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-700 mb-2 flex items-center justify-center gap-2">
          <Package size={28} strokeWidth={1.8} />
          Tra cứu đơn hàng
        </h1>
        <p className="text-sm text-mute">
          Nhập mã đơn hàng và số điện thoại để kiểm tra trạng thái — không cần đăng nhập
        </p>
      </header>

      {/* Search form */}
      {!searched && (
        <form
          onSubmit={submit}
          className="bg-white border border-rule rounded-lg shadow-card p-6 md:p-8 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Mã đơn hàng *</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: A1B2C3D4 hoặc #A1B2C3D4"
              className="w-full border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500 font-mono uppercase"
            />
            <p className="text-[11px] text-mute mt-1">8 ký tự cuối của mã đơn, có trong email xác nhận hoặc hóa đơn</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Số điện thoại đặt hàng *</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0987 654 321"
              className="w-full border border-rule rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-md transition-colors"
          >
            Tra cứu đơn hàng
          </button>
          <p className="text-xs text-mute text-center pt-2">
            Không tìm thấy đơn? Liên hệ hotline <a href="tel:0982463691" className="text-brand-500 font-semibold">0982 463 691</a>
          </p>
        </form>
      )}

      {/* Result: not found */}
      {searched && !foundOrder && (
        <div className="bg-white border border-rule rounded-lg shadow-card p-8 text-center">
          <div className="text-5xl mb-3">😕</div>
          <h2 className="font-bold text-lg mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-sm text-ink2 mb-5">
            Kiểm tra lại mã đơn và số điện thoại. Nếu vẫn không thấy, liên hệ hotline để được hỗ trợ.
          </p>
          <div className="flex gap-2 justify-center">
            <button onClick={reset} className="border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 text-sm font-semibold px-5 py-2.5 rounded-md">
              Tra cứu lại
            </button>
            <a
              href="tel:0982463691"
              className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md inline-flex items-center gap-2"
            >
              <Phone size={14} strokeWidth={2} />
              Gọi hotline
            </a>
          </div>
        </div>
      )}

      {/* Result: found */}
      {searched && foundOrder && (
        <div className="space-y-5">
          {/* Header card */}
          <div className="bg-white border border-rule rounded-lg shadow-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <span className="text-xs text-mute uppercase tracking-wider">Mã đơn hàng</span>
              <button onClick={reset} className="text-xs text-brand-500 hover:underline">Tra cứu đơn khác</button>
            </div>
            <div className="font-bold text-xl font-mono text-brand-700 mb-1">#{foundOrder.id.slice(-8).toUpperCase()}</div>
            <div className="text-sm text-ink2">Đặt ngày {formatDate(foundOrder.createdAt)}</div>
          </div>

          {/* Stepper */}
          {!isCancelled ? (
            <div className="bg-white border border-rule rounded-lg shadow-card p-6">
              <h3 className="font-bold mb-5 text-brand-700">Trạng thái</h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-4 right-4 top-5 h-0.5 bg-rule" />
                <div
                  className="absolute left-4 top-5 h-0.5 bg-brand-700 transition-all duration-500"
                  style={{ width: `calc(${currentStepIdx >= 0 ? (currentStepIdx / (STEPS.length - 1)) * 100 : 0}% - 0px)` }}
                />
                <div className="relative grid grid-cols-4 gap-2">
                  {STEPS.map((step, i) => {
                    const reached = i <= currentStepIdx;
                    const isCurrent = i === currentStepIdx;
                    return (
                      <div key={step.key} className="text-center">
                        <div className={`w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center transition-colors ${
                          reached
                            ? 'bg-brand-700 border-brand-700 text-white'
                            : 'bg-white border-rule text-mute'
                        } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                          {step.icon}
                        </div>
                        <div className={`text-[11px] md:text-xs mt-2 font-medium ${reached ? 'text-brand-700' : 'text-mute'}`}>
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-rule text-xs text-ink2">
                {foundOrder.status === 'pending' && '⏳ Đơn hàng của bạn đang chờ xác nhận. Chúng tôi sẽ gọi xác nhận trong vòng 15 phút.'}
                {foundOrder.status === 'confirmed' && '✅ Đơn đã được xác nhận và đang chuẩn bị giao.'}
                {foundOrder.status === 'shipping' && '🚚 Đơn đang trên đường giao tới bạn. Vui lòng giữ điện thoại để shipper liên hệ.'}
                {foundOrder.status === 'done' && '🎉 Đơn đã giao thành công. Cảm ơn bạn đã mua sắm tại LIORA!'}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🚫</div>
              <h3 className="font-bold text-red-700 mb-1">Đơn hàng đã hủy</h3>
              <p className="text-sm text-ink2">Vui lòng liên hệ hotline nếu cần hỗ trợ.</p>
            </div>
          )}

          {/* Shipping info */}
          <div className="bg-white border border-rule rounded-lg shadow-card p-6">
            <h3 className="font-bold mb-3 text-brand-700">Giao hàng tới</h3>
            <div className="text-sm space-y-1">
              <div><b>{foundOrder.shipping.name}</b> · {foundOrder.shipping.phone}</div>
              <div className="text-ink2">{foundOrder.shipping.address}, {foundOrder.shipping.city}{foundOrder.shipping.district ? `, ${foundOrder.shipping.district}` : ''}</div>
              {foundOrder.shipping.note && <div className="text-mute italic text-xs mt-1">"{foundOrder.shipping.note}"</div>}
            </div>
          </div>

          {/* Order items + total */}
          <div className="bg-white border border-rule rounded-lg shadow-card p-6">
            <h3 className="font-bold mb-3 text-brand-700">Sản phẩm ({foundOrder.items.length})</h3>
            <div className="divide-y divide-rule mb-4">
              {foundOrder.items.map(it => (
                <div key={it.cartId} className="flex justify-between items-baseline gap-3 py-2 text-sm">
                  <span className="line-clamp-1 flex-1">{it.name}</span>
                  <span className="text-xs text-mute whitespace-nowrap">× {it.qty}</span>
                  <span className="font-semibold whitespace-nowrap">{fmt(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-rule pt-3 flex justify-between text-lg font-bold text-brand-700">
              <span>Tổng cộng</span>
              <span>{fmt(foundOrder.total)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-rule">
              <button
                onClick={() => setInvoiceOpen(true)}
                className="text-xs font-semibold border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-4 py-2 rounded inline-flex items-center gap-1.5 transition-colors"
              >
                <FileText size={12} strokeWidth={2} />
                Xem & in hóa đơn
              </button>
              <a
                href="tel:0982463691"
                className="text-xs font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2 rounded inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone size={12} strokeWidth={2} />
                Liên hệ shop
              </a>
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => navigate('/shop')} className="text-sm text-brand-500 hover:text-brand-700 font-semibold">
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}

      <InvoiceModal order={invoiceOpen ? foundOrder : null} onClose={() => setInvoiceOpen(false)} />
    </main>
  );
}
