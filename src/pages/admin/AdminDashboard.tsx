import React, { useMemo } from 'react';
import { Wallet, Clock, Package, Users, Plus, ListChecks, AlertTriangle, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fmt } from '../../data';
import AdminLayout from './AdminLayout';
import { STATUS_META, formatDate } from '../AccountPage';
import { StatCard, StatusBadge } from '../../components/admin/ui';
import { OrderStatus } from '../../types';

const STATUS_KEYS: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'done', 'cancelled'];

export default function AdminDashboard() {
  const { state, navigate } = useStore();
  const { orders, products, users } = state;

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const customers = users.filter(u => u.role === 'customer').length;
  const soldProducts = products.filter(p => p.sold).length;

  // Revenue by status (exclude cancelled).
  const revenueByStatus = useMemo(() => {
    const map: Record<OrderStatus, number> = { pending: 0, confirmed: 0, shipping: 0, done: 0, cancelled: 0 };
    orders.forEach(o => { map[o.status] += o.total; });
    return map;
  }, [orders]);
  const maxRev = Math.max(1, ...STATUS_KEYS.filter(k => k !== 'cancelled').map(k => revenueByStatus[k]));

  // Top 5 bestsellers — aggregate order items by slug.
  const topProducts = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; qty: number }>();
    orders.forEach(o => {
      if (o.status === 'cancelled') return;
      o.items.forEach(it => {
        const cur = map.get(it.slug);
        if (cur) cur.qty += it.qty;
        else map.set(it.slug, { slug: it.slug, name: it.name, qty: it.qty });
      });
    });
    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map(row => {
        const p = products.find(x => x.slug === row.slug);
        return { ...row, image: p?.image, inStock: p?.inStock, sold: p?.sold };
      });
  }, [orders, products]);

  // Low / out of stock alerts.
  const lowStock = useMemo(() => {
    return products
      .filter(p => p.sold || (p.inStock ?? 0) <= 5)
      .sort((a, b) => (a.inStock ?? 0) - (b.inStock ?? 0))
      .slice(0, 6);
  }, [products]);

  const recentOrders = orders.slice(0, 5);

  const cards = [
    { label: 'Doanh thu', value: fmt(totalRevenue), sub: `${orders.length} đơn hàng`, icon: <Wallet size={20} strokeWidth={1.8} />, tone: 'bg-brand-700 text-white' },
    { label: 'Đơn chờ xử lý', value: pending.toString(), sub: 'Cần xác nhận', icon: <Clock size={20} strokeWidth={1.8} />, tone: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
    { label: 'Sản phẩm', value: products.length.toString(), sub: `${soldProducts} hết hàng`, icon: <Package size={20} strokeWidth={1.8} />, tone: 'bg-white border border-rule' },
    { label: 'Khách hàng', value: customers.toString(), sub: 'Đã đăng ký', icon: <Users size={20} strokeWidth={1.8} />, tone: 'bg-white border border-rule' },
  ];

  const go = (path: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(path); };

  return (
    <AdminLayout active="dashboard">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Bảng điều khiển</h1>
          <p className="text-sm text-mute">Tổng quan hoạt động của shop</p>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(c => (
          <StatCard key={c.label} label={c.label} value={c.value} sub={c.sub} icon={c.icon} tone={c.tone} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a href="#/admin/products" onClick={go('/admin/products')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800">
          <Plus size={15} strokeWidth={2.2} /> Thêm sản phẩm
        </a>
        <a href="#/admin/orders" onClick={go('/admin/orders')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rule bg-white text-sm font-semibold hover:bg-soft">
          <ListChecks size={15} strokeWidth={2} /> Xem đơn chờ{pending > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{pending}</span>}
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue by status */}
        <div className="bg-white border border-rule rounded-lg p-5">
          <h2 className="font-bold text-brand-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} strokeWidth={2} /> Doanh thu theo trạng thái
          </h2>
          <div className="space-y-3">
            {STATUS_KEYS.filter(k => k !== 'cancelled').map(k => {
              const val = revenueByStatus[k];
              const pct = Math.round((val / maxRev) * 100);
              return (
                <div key={k}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink2">{STATUS_META[k].label}</span>
                    <span className="font-semibold text-ink">{fmt(val)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-soft overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top bestsellers */}
        <div className="bg-white border border-rule rounded-lg p-5">
          <h2 className="font-bold text-brand-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} strokeWidth={2} /> Top 5 bán chạy
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-xs text-mute py-6 text-center">Chưa có dữ liệu bán hàng.</p>
          ) : (
            <ol className="space-y-2.5">
              {topProducts.map((row, i) => (
                <li key={row.slug} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="w-8 h-8 rounded bg-soft overflow-hidden shrink-0">
                    {row.image
                      ? <img src={row.image} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#fff7f9,#ffcfdd)' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-ink truncate">{row.name}</div>
                  </div>
                  <span className="text-xs font-semibold text-brand-700 shrink-0">{row.qty} đã bán</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Low stock alert */}
        <div className="bg-white border border-rule rounded-lg p-5">
          <h2 className="font-bold text-brand-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} strokeWidth={2} /> Cảnh báo tồn kho
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-xs text-mute py-6 text-center">Tất cả sản phẩm còn đủ hàng.</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.slug} className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded bg-soft overflow-hidden shrink-0">
                    {p.image
                      ? <img src={p.image} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#fff7f9,#ffcfdd)' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-ink truncate">{p.name}</div>
                  </div>
                  <span className={`shrink-0 font-semibold ${p.sold ? 'text-red-600' : (p.inStock ?? 0) <= 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {p.sold ? 'Hết hàng' : `${p.inStock ?? 0} còn`}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a href="#/admin/products" onClick={go('/admin/products')}
            className="block text-center text-xs text-brand-500 hover:text-brand-700 font-semibold mt-3 pt-3 border-t border-rule">
            Quản lý sản phẩm →
          </a>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-rule rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
          <h2 className="font-bold text-brand-700">Đơn hàng gần đây</h2>
          <a href="#/admin/orders" onClick={go('/admin/orders')}
            className="text-sm text-brand-500 hover:text-brand-700 font-semibold">Xem tất cả →</a>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-10 text-center text-mute text-sm">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="divide-y divide-rule">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-3 hover:bg-brand-50/40">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-bold text-sm text-brand-700">#{o.id.slice(-8).toUpperCase()}</span>
                    <span className="text-xs text-mute">{formatDate(o.createdAt)}</span>
                  </div>
                  <div className="text-xs text-ink2 truncate">{o.shipping.name} · {o.items.length} sp</div>
                </div>
                <div className="font-bold text-sm whitespace-nowrap">{fmt(o.total)}</div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}