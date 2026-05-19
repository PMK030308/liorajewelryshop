import React, { useMemo, useState } from 'react';
import { X, Download, Printer } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fmt } from '../../data';
import AdminLayout from './AdminLayout';
import { OrderStatus, Order } from '../../types';
import { STATUS_META, formatDate } from '../AccountPage';
import { generateInvoicePdf } from '../../utils/invoice';

const STATUS_KEYS: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'done', 'cancelled'];

export default function AdminOrders() {
  const { state, dispatch, showToast } = useStore();
  const { orders } = state;
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return orders.filter(o => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!ql) return true;
      return (
        o.id.toLowerCase().includes(ql) ||
        o.shipping.name.toLowerCase().includes(ql) ||
        o.shipping.phone.includes(ql)
      );
    });
  }, [orders, filter, q]);

  const changeStatus = (id: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
    showToast(`Đã đổi trạng thái → ${STATUS_META[status].label}`);
  };

  const remove = (id: string) => {
    if (!confirm('Xóa đơn hàng này?')) return;
    dispatch({ type: 'DELETE_ORDER', payload: id });
    showToast('Đã xóa đơn hàng');
    if (selected?.id === id) setSelected(null);
  };

  return (
    <AdminLayout active="orders">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-brand-700">Đơn hàng</h1>
        <p className="text-sm text-mute">{orders.length} đơn · {orders.filter(o => o.status === 'pending').length} chờ xử lý</p>
      </header>

      <div className="bg-white border border-rule rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-rule">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Tìm theo mã / tên / SĐT..."
            className="flex-1 min-w-[200px] border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
          />
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === 'all' ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-ink2 border-rule hover:border-brand-500'}`}>
              Tất cả ({orders.length})
            </button>
            {STATUS_KEYS.map(k => {
              const count = orders.filter(o => o.status === k).length;
              const m = STATUS_META[k];
              return (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === k ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-ink2 border-rule hover:border-brand-500'}`}>
                  {m.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-mute text-sm">Chưa có đơn hàng phù hợp.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-soft text-xs uppercase tracking-wider text-mute">
                <tr>
                  <th className="text-left py-2.5 px-4">Mã đơn</th>
                  <th className="text-left py-2.5 px-2">Khách hàng</th>
                  <th className="text-left py-2.5 px-2">Thời gian</th>
                  <th className="text-right py-2.5 px-2">Tổng tiền</th>
                  <th className="text-center py-2.5 px-2">Trạng thái</th>
                  <th className="text-right py-2.5 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {filtered.map(o => {
                  const meta = STATUS_META[o.status];
                  return (
                    <tr key={o.id} className="hover:bg-brand-50/40">
                      <td className="py-2.5 px-4 font-mono font-bold text-brand-700">#{o.id.slice(-8).toUpperCase()}</td>
                      <td className="py-2.5 px-2">
                        <div className="font-medium">{o.shipping.name}</div>
                        <div className="text-xs text-mute">{o.shipping.phone}</div>
                      </td>
                      <td className="py-2.5 px-2 text-xs text-mute">{formatDate(o.createdAt)}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-brand-700 whitespace-nowrap">{fmt(o.total)}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${meta.cls}`}>{meta.label}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <button onClick={() => setSelected(o)} className="text-brand-500 hover:text-brand-700 px-2 py-1 text-xs font-semibold">Chi tiết</button>
                        <button onClick={() => remove(o.id)} className="text-red-500 hover:text-red-600 px-2 py-1 text-xs font-semibold">Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <header className="flex items-center justify-between p-5 border-b border-rule sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-lg text-brand-700">Đơn hàng #{selected.id.slice(-8).toUpperCase()}</h3>
                <p className="text-xs text-mute">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-soft flex items-center justify-center text-mute">
                <X size={16} strokeWidth={2} />
              </button>
            </header>

            <div className="p-5 space-y-5">
              {/* Status changer */}
              <div>
                <div className="text-xs font-semibold text-ink2 uppercase tracking-wider mb-2">Cập nhật trạng thái</div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_KEYS.map(k => {
                    const m = STATUS_META[k];
                    const active = selected.status === k;
                    return (
                      <button key={k}
                        onClick={() => { changeStatus(selected.id, k); setSelected({ ...selected, status: k }); }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${active ? m.cls + ' ring-2 ring-offset-1 ring-brand-300' : 'bg-white text-ink2 border-rule hover:border-brand-500'}`}>
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-soft rounded-md p-4 text-sm">
                <div className="text-xs font-semibold text-ink2 uppercase tracking-wider mb-2">Thông tin giao hàng</div>
                <div className="space-y-0.5">
                  <div><b>{selected.shipping.name}</b> · {selected.shipping.phone}</div>
                  {selected.shipping.email && <div className="text-mute text-xs">{selected.shipping.email}</div>}
                  <div className="text-ink2">{selected.shipping.address}</div>
                  <div className="text-ink2 text-xs">{selected.shipping.city}{selected.shipping.district ? `, ${selected.shipping.district}` : ''}</div>
                  {selected.shipping.note && <div className="text-mute text-xs mt-1">Ghi chú: {selected.shipping.note}</div>}
                  <div className="text-xs text-mute pt-2 border-t border-rule mt-2">Thanh toán: <b>{selected.payment.toUpperCase()}</b></div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="text-xs font-semibold text-ink2 uppercase tracking-wider mb-2">Sản phẩm ({selected.items.length})</div>
                <div className="border border-rule rounded-md divide-y divide-rule">
                  {selected.items.map(it => (
                    <div key={it.cartId} className="flex justify-between items-center px-3 py-2 text-sm">
                      <span className="line-clamp-1 pr-3">{it.name}</span>
                      <span className="text-xs text-mute whitespace-nowrap">× {it.qty}</span>
                      <span className="font-bold ml-3 whitespace-nowrap">{fmt(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-soft rounded-md p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-ink2">Tạm tính</span><span>{fmt(selected.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink2">Phí ship</span><span>{selected.ship === 0 ? <span className="text-green-600">Miễn phí</span> : fmt(selected.ship)}</span></div>
                {selected.discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá {selected.coupon ? `(${selected.coupon})` : ''}</span><span>− {fmt(selected.discount)}</span></div>}
                <div className="flex justify-between text-base font-bold text-brand-700 border-t border-rule pt-2 mt-2">
                  <span>Tổng cộng</span><span>{fmt(selected.total)}</span>
                </div>
              </div>

              {/* Invoice actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-rule">
                <button
                  onClick={() => generateInvoicePdf(selected)}
                  className="text-xs font-semibold bg-brand-700 text-white hover:bg-brand-800 px-4 py-2 rounded-md inline-flex items-center gap-2"
                >
                  <Download size={14} strokeWidth={2} />
                  Tải hóa đơn PDF
                </button>
                <button
                  onClick={() => generateInvoicePdf(selected, { autoPrint: true })}
                  className="text-xs font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2 rounded-md inline-flex items-center gap-2"
                >
                  <Printer size={14} strokeWidth={2} />
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
