import React from 'react';
import { useStore } from '../../store/useStore';
import { fmt } from '../../data';
import AdminLayout from './AdminLayout';
import { STATUS_META, formatDate } from '../AccountPage';

export default function AdminDashboard() {
  const { state, navigate } = useStore();
  const { orders, products, users } = state;

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const customers = users.filter(u => u.role === 'customer').length;
  const soldProducts = products.filter(p => p.sold).length;

  const recentOrders = orders.slice(0, 5);

  const cards = [
    { label: 'Doanh thu', value: fmt(totalRevenue), tone: 'bg-brand-700 text-white', sub: `${orders.length} đơn hàng` },
    { label: 'Đơn chờ xử lý', value: pending.toString(), tone: 'bg-yellow-50 text-yellow-700 border border-yellow-200', sub: 'Cần xác nhận' },
    { label: 'Sản phẩm', value: products.length.toString(), tone: 'bg-white border border-rule', sub: `${soldProducts} hết hàng` },
    { label: 'Khách hàng', value: customers.toString(), tone: 'bg-white border border-rule', sub: 'Đã đăng ký' },
  ];

  return (
    <AdminLayout active="dashboard">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Bảng điều khiển</h1>
          <p className="text-sm text-mute">Tổng quan hoạt động của shop</p>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className={`rounded-lg p-5 ${c.tone}`}>
            <div className="text-xs uppercase tracking-wider opacity-80 mb-1.5">{c.label}</div>
            <div className="text-2xl md:text-3xl font-bold leading-none mb-1">{c.value}</div>
            <div className="text-xs opacity-70">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-rule rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
          <h2 className="font-bold text-brand-700">Đơn hàng gần đây</h2>
          <a href="#/admin/orders" onClick={(e) => { e.preventDefault(); navigate('/admin/orders'); }}
            className="text-sm text-brand-500 hover:text-brand-700 font-semibold">Xem tất cả →</a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-mute text-sm">Chưa có đơn hàng nào.</div>
        ) : (
          <div className="divide-y divide-rule">
            {recentOrders.map(o => {
              const meta = STATUS_META[o.status];
              return (
                <div key={o.id} className="flex items-center gap-4 px-5 py-3 hover:bg-brand-50/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="font-bold text-sm text-brand-700">#{o.id.slice(-8).toUpperCase()}</span>
                      <span className="text-xs text-mute">{formatDate(o.createdAt)}</span>
                    </div>
                    <div className="text-xs text-ink2 truncate">{o.shipping.name} · {o.items.length} sp</div>
                  </div>
                  <div className="font-bold text-sm whitespace-nowrap">{fmt(o.total)}</div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${meta.cls}`}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
