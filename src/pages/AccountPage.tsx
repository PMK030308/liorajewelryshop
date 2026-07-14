import React, { useState, useEffect } from 'react';
import { FileText, Package, XCircle, RefreshCw, Search, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fmt } from '../data';
import { Order, OrderStatus } from '../types';
import InvoiceModal from '../components/InvoiceModal';
import { hasSupabase } from '../lib/supabase';
import { updateProfile, signOut } from '../lib/auth';

export const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  pending:    { label: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed:  { label: 'Đã xác nhận',  cls: 'bg-brand-100 text-brand-700 border-brand-200' },
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
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [showPwForm, setShowPwForm] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
  }, [user]);

  if (!user) return null;

  const myOrders = state.orders.filter(o => o.userId === user.id);
  const filteredOrders = myOrders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch) {
      const q = orderSearch.trim().toLowerCase();
      return o.id.toLowerCase().includes(q) || o.id.slice(-8).toLowerCase().includes(q);
    }
    return true;
  });

  const cancelOrder = (orderId: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status: 'cancelled' } });
    showToast('Đơn hàng đã được hủy');
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr('');
    if (newPw.length < 6) { setPwErr('Mật khẩu mới cần tối thiểu 6 ký tự.'); return; }
    if (newPw !== confirmPw) { setPwErr('Mật khẩu xác nhận không khớp.'); return; }
    if (!hasSupabase) {
      if (user.password && oldPw !== user.password) { setPwErr('Mật khẩu cũ không đúng.'); return; }
      dispatch({ type: 'UPDATE_USER', payload: { id: user.id, password: newPw } });
    }
    showToast('✓ Đã đổi mật khẩu thành công');
    setShowPwForm(false);
    setOldPw(''); setNewPw(''); setConfirmPw('');
  };

  const reorder = (order: Order) => {
    order.items.forEach(item => {
      dispatch({ type: 'ADD_TO_CART', payload: item });
    });
    showToast('Đã thêm sản phẩm vào giỏ hàng');
    setTimeout(() => navigate('/checkout'), 300);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const patch = { name: name.trim(), phone: phone.trim() || undefined };
    if (hasSupabase) {
      try { await updateProfile(user.id, patch); }
      catch (err) { showToast('⚠ Không lưu được: ' + (err as Error).message); return; }
    }
    dispatch({ type: 'UPDATE_USER', payload: { id: user.id, ...patch } });
    showToast('✓ Đã cập nhật hồ sơ');
  };

  const logout = async () => {
    if (hasSupabase) { try { await signOut(); } catch { /* ignore */ } }
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

            <div className="mt-4 border-t border-rule pt-4">
              <button
                onClick={() => setShowPwForm(v => !v)}
                className="w-full text-left text-sm font-semibold text-ink2 hover:text-brand-700 inline-flex items-center gap-2"
              >
                <KeyRound size={16} strokeWidth={1.8} />
                Đổi mật khẩu
              </button>
              {showPwForm && (
                <form onSubmit={changePassword} className="mt-3 space-y-2">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={oldPw}
                    onChange={e => setOldPw(e.target.value)}
                    required
                    placeholder="Mật khẩu cũ"
                    className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                  />
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      required
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                      className="w-full border border-rule rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-mute hover:text-brand-500"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    required
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                  />
                  {pwErr && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{pwErr}</div>}
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-brand-700 text-white text-sm font-semibold py-2 rounded-md hover:bg-brand-800 transition-colors">
                      Cập nhật
                    </button>
                    <button type="button" onClick={() => { setShowPwForm(false); setOldPw(''); setNewPw(''); setConfirmPw(''); setPwErr(''); }} className="px-4 border border-rule text-sm font-semibold py-2 rounded-md hover:bg-soft">
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </aside>

        {/* Orders */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-brand-700">Đơn hàng của bạn ({myOrders.length})</h2>

          {myOrders.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value as OrderStatus | 'all')}
                className="border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="done">Hoàn tất</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <div className="relative flex-1 min-w-[180px]">
                <Search size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Tìm theo mã đơn…"
                  className="w-full border border-rule rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {myOrders.length === 0 ? (
            <div className="bg-soft border border-rule rounded-lg p-10 text-center">
              <Package size={48} strokeWidth={1.2} className="mb-3 mx-auto text-mute" />
              <p className="text-ink2 mb-4">Bạn chưa có đơn hàng nào</p>
              <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="btn-pink">Mua sắm ngay →</a>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-soft border border-rule rounded-lg p-10 text-center">
              <p className="text-ink2 mb-4">Không có đơn hàng phù hợp với bộ lọc.</p>
              <button onClick={() => { setOrderFilter('all'); setOrderSearch(''); }} className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-5 py-2 rounded-md">
                Xoá bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(o => {
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
                           onClick={() => setInvoiceOrder(o)}
                           className="text-xs font-semibold border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-4 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors"
                         >
                           <FileText size={12} strokeWidth={2} />
                           Xem & in hóa đơn
                         </button>
                        {(o.status === 'pending' || o.status === 'confirmed') && (
                          <button
                            onClick={() => cancelOrder(o.id)}
                            className="text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 px-4 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle size={12} strokeWidth={2} />
                            Hủy đơn
                          </button>
                        )}
                        {o.status === 'done' && (
                          <button
                            onClick={() => reorder(o)}
                            className="text-xs font-semibold border border-green-200 text-green-700 hover:bg-green-50 px-4 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw size={12} strokeWidth={2} />
                            Mua lại
                          </button>
                        )}
                       </div>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </section>
      </div>
      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
    </main>
  );
}
