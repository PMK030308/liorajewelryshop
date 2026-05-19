import React, { useState, useEffect } from 'react';
import { Download, Printer, ChevronDown, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fmt } from '../data';
import { OrderStatus } from '../types';
import { generateInvoicePdf } from '../utils/invoice';

export const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  pending:    { label: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed:  { label: 'Đã xác nhận',  cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipping:   { label: 'Đang giao',    cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  done:       { label: 'Hoàn tất',     cls: 'bg-green-100 text-green-700 border-green-200' },
  cancelled:  { label: 'Đã hủy',       cls: 'bg-red-100 text-red-600 border-red-200' },
};

export const formatDate = (ts: number) => new Date(ts).toLocaleString('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export default function AccountPage() {
  const { state, dispatch, navigate, showToast } = useStore();
  const user = state.user;

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
  }, [user]);

  if (!user) return null;

  const myOrders = state.orders.filter(o => o.userId === user.id);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_USER', payload: { id: user.id, name: name.trim(), phone: phone.trim() || undefined } });
    showToast('✓ Đã cập nhật hồ sơ');
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('👋 Đã đăng xuất');
    setTimeout(() => navigate('/'), 200);
  };

  return (
    <main className="page container-x py-10 md:py-14 min-h-[60vh]">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-rule rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
                {user.name.split(' ').slice(-2).map(s => s[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-brand-700 truncate">{user.name}</div>
                <div className="text-xs text-mute truncate">{user.email}</div>
                <div className="text-[10px] inline-block bg-brand-50 text-brand-700 px-2 py-0.5 rounded mt-1 uppercase tracking-wider font-semibold">{user.role === 'admin' ? 'Admin' : 'Khách hàng'}</div>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink2 mb-1">Họ tên</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink2 mb-1">Số điện thoại</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <button className="w-full bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-brand-800 transition-colors">
                Lưu thay đổi
              </button>
            </form>

            {user.role === 'admin' && (
              <a href="#/admin/dashboard" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }}
                className="block text-center mt-3 text-sm border border-brand-700 text-brand-700 font-semibold py-2.5 rounded-md hover:bg-brand-700 hover:text-white transition-colors">
                → Vào trang quản trị
              </a>
            )}

            <button onClick={logout}
              className="w-full mt-3 text-sm border border-red-200 text-red-600 font-semibold py-2.5 rounded-md hover:bg-red-50 transition-colors">
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Orders */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-brand-700">Đơn hàng của bạn ({myOrders.length})</h2>
          {myOrders.length === 0 ? (
            <div className="bg-soft border border-rule rounded-lg p-10 text-center">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-ink2 mb-4">Bạn chưa có đơn hàng nào</p>
              <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="btn-pink">Mua sắm ngay →</a>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map(o => {
                const meta = STATUS_META[o.status];
                return (
                  <details key={o.id} className="bg-white border border-rule rounded-lg shadow-card overflow-hidden group">
                    <summary className="cursor-pointer flex items-center gap-3 p-4 hover:bg-brand-50/40 list-none">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <span className="font-bold text-brand-700 text-sm">#{o.id.slice(-8).toUpperCase()}</span>
                          <span className="text-xs text-mute">{formatDate(o.createdAt)}</span>
                        </div>
                        <div className="text-xs text-ink2">{o.items.length} sản phẩm · <b className="text-brand-700">{fmt(o.total)}</b></div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}>{meta.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mute transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                    </summary>
                    <div className="border-t border-rule p-4 bg-soft text-sm">
                      <div className="mb-3">
                        <div className="text-xs text-mute uppercase tracking-wider mb-1">Giao đến</div>
                        <div className="text-ink">{o.shipping.name} · {o.shipping.phone}</div>
                        <div className="text-ink2 text-xs">{o.shipping.address}, {o.shipping.city}</div>
                      </div>
                      <div className="space-y-2 mb-3">
                        {o.items.map(it => (
                          <div key={it.cartId} className="flex justify-between text-xs">
                            <span className="line-clamp-1 pr-2 text-ink2">{it.name} × {it.qty}</span>
                            <span className="font-medium whitespace-nowrap">{fmt(it.price * it.qty)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-rule pt-2 flex justify-between text-sm font-bold text-brand-700">
                        <span>Tổng cộng</span><span>{fmt(o.total)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => generateInvoicePdf(o)}
                          className="text-xs font-semibold border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Download size={12} strokeWidth={2} />
                          Tải PDF
                        </button>
                        <button
                          onClick={() => generateInvoicePdf(o, { autoPrint: true })}
                          className="text-xs font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Printer size={12} strokeWidth={2} />
                          In hóa đơn
                        </button>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
