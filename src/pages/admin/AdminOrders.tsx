import React, { useMemo, useState } from 'react';
import { FileText, Download, Trash2, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fmt } from '../../data';
import AdminLayout from './AdminLayout';
import { OrderStatus, Order } from '../../types';
import { STATUS_META, formatDate } from '../AccountPage';
import InvoiceModal from '../../components/InvoiceModal';
import { SearchInput, EmptyState, Modal, ConfirmDialog, StatusBadge, Pagination, BulkBar } from '../../components/admin/ui';
import { hasSupabase } from '../../lib/supabase';
import { updateOrder as repoUpdateOrder, deleteOrder as repoDeleteOrder } from '../../lib/repo';

const STATUS_KEYS: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'done', 'cancelled'];

type SortKey = 'newest' | 'oldest' | 'total-high';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'oldest', label: 'Cũ nhất' },
  { key: 'total-high', label: 'Tổng tiền cao → thấp' },
];

const PAGE_SIZE = 10;

function statusLabel(s: OrderStatus) { return STATUS_META[s].label; }

export default function AdminOrders() {
  const { state, dispatch, showToast } = useStore();
  const { orders } = state;
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [selected, setSelected] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; bulk?: boolean } | null>(null);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | ''>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    const list = orders.filter(o => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!ql) return true;
      return o.id.toLowerCase().includes(ql) || o.shipping.name.toLowerCase().includes(ql) || o.shipping.phone.includes(ql);
    });
    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => b.createdAt - a.createdAt);
    else if (sort === 'oldest') sorted.sort((a, b) => a.createdAt - b.createdAt);
    else if (sort === 'total-high') sorted.sort((a, b) => b.total - a.total);
    return sorted;
  }, [orders, filter, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changeStatus = (id: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
    showToast(`Đã đổi trạng thái → ${STATUS_META[status].label}`);
    // Sync lên Supabase
    if (hasSupabase) {
      const order = state.orders.find(o => o.id === id);
      if (order) repoUpdateOrder({ ...order, status }).catch(err => console.error('[Liora] updateOrder Supabase:', err));
    }
  };

  const removeOne = (id: string) => {
    dispatch({ type: 'DELETE_ORDER', payload: id });
    showToast('Đã xóa đơn hàng');
    if (selected?.id === id) setSelected(null);
    // Sync lên Supabase
    if (hasSupabase) {
      repoDeleteOrder(id).catch(err => console.error('[Liora] deleteOrder Supabase:', err));
    }
  };

  const bulkDelete = () => {
    selectedIds.forEach(id => dispatch({ type: 'DELETE_ORDER', payload: id }));
    showToast(`Đã xóa ${selectedIds.size} đơn hàng`);
    if (selected && selectedIds.has(selected.id)) setSelected(null);
    // Sync lên Supabase
    if (hasSupabase) {
      selectedIds.forEach(id => repoDeleteOrder(id).catch(err => console.error('[Liora] bulkDelete Supabase:', err)));
    }
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const allOnPageSelected = pageItems.length > 0 && pageItems.every(o => selectedIds.has(o.id));
  const toggleSelectAll = () => {
    if (allOnPageSelected) setSelectedIds(prev => { const n = new Set(prev); pageItems.forEach(o => n.delete(o.id)); return n; });
    else setSelectedIds(prev => { const n = new Set(prev); pageItems.forEach(o => n.add(o.id)); return n; });
  };

  const applyBulkStatus = (status: OrderStatus) => {
    selectedIds.forEach(id => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } }));
    showToast(`Đã đổi ${selectedIds.size} đơn → ${STATUS_META[status].label}`);
    // Sync lên Supabase
    if (hasSupabase) {
      selectedIds.forEach(id => {
        const order = state.orders.find(o => o.id === id);
        if (order) repoUpdateOrder({ ...order, status }).catch(err => console.error('[Liora] bulkUpdate Supabase:', err));
      });
    }
    setBulkStatus('');
  };

  const exportCSV = () => {
    const rows = filtered.length ? filtered : orders;
    const header = ['Mã đơn', 'Khách hàng', 'SĐT', 'Email', 'Địa chỉ', 'Thành phố', 'Ngày', 'Trạng thái', 'Tạm tính', 'Phí ship', 'Giảm giá', 'Tổng', 'Thanh toán'];
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [header.map(esc).join(',')];
    rows.forEach(o => {
      lines.push([
        o.id.slice(-8).toUpperCase(),
        o.shipping.name,
        o.shipping.phone,
        o.shipping.email || '',
        o.shipping.address,
        o.shipping.city + (o.shipping.district ? `, ${o.shipping.district}` : ''),
        formatDate(o.createdAt),
        statusLabel(o.status),
        o.subtotal,
        o.ship,
        o.discount,
        o.total,
        o.payment.toUpperCase(),
      ].map(esc).join(','));
    });
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `don-hang-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Đã xuất ${rows.length} đơn ra CSV`);
  };

  return (
    <AdminLayout active="orders">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Đơn hàng</h1>
          <p className="text-sm text-mute">{orders.length} đơn · {orders.filter(o => o.status === 'pending').length} chờ xử lý</p>
        </div>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold border border-rule bg-white hover:bg-soft">
          <Download size={14} strokeWidth={2} /> Xuất CSV
        </button>
      </header>

      <div className="bg-white border border-rule rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-rule">
          <SearchInput value={q} onChange={setQ} placeholder="Tìm theo mã / tên / SĐT..." />
          <select value={sort} onChange={e => { setSort(e.target.value as SortKey); setPage(1); }}
            className="border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
            {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => { setFilter('all'); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === 'all' ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-ink2 border-rule hover:border-brand-500'}`}>
              Tất cả ({orders.length})
            </button>
            {STATUS_KEYS.map(k => {
              const count = orders.filter(o => o.status === k).length;
              return (
                <button key={k} onClick={() => { setFilter(k); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === k ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-ink2 border-rule hover:border-brand-500'}`}>
                  {STATUS_META[k].label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <BulkBar selectedCount={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
          <span className="text-xs text-mute">{selectedIds.size} đơn</span>
          <div className="relative">
            <select
              value={bulkStatus}
              onChange={e => { const v = e.target.value as OrderStatus; if (v) applyBulkStatus(v); }}
              className="appearance-none border border-rule rounded-md pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-white">
              <option value="">Đổi trạng thái…</option>
              {STATUS_KEYS.map(k => <option key={k} value={k}>{statusLabel(k)}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          </div>
          <button onClick={() => setConfirmDelete({ id: '', bulk: true })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 bg-white px-3 py-1.5 rounded-md">
            <Trash2 size={13} /> Xóa đã chọn
          </button>
        </BulkBar>

        {filtered.length === 0 ? (
          <EmptyState icon={<FileText size={32} strokeWidth={1.2} />} title="Chưa có đơn hàng phù hợp" message="Thử đổi bộ lọc hoặc từ khoá tìm kiếm." />
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-soft text-xs uppercase tracking-wider text-mute">
                <tr>
                  <th className="py-2.5 px-4 w-10">
                    <input type="checkbox" checked={allOnPageSelected} onChange={toggleSelectAll}
                      className="accent-brand-700 w-4 h-4 align-middle" />
                  </th>
                  <th className="text-left py-2.5 px-2">Mã đơn</th>
                  <th className="text-left py-2.5 px-2">Khách hàng</th>
                  <th className="text-left py-2.5 px-2">Thời gian</th>
                  <th className="text-right py-2.5 px-2">Tổng tiền</th>
                  <th className="text-center py-2.5 px-2">Trạng thái</th>
                  <th className="text-right py-2.5 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {pageItems.map(o => (
                  <tr key={o.id} className="hover:bg-brand-50/40 cursor-pointer">
                    <td className="py-2.5 px-4" onClick={e => { e.stopPropagation(); toggleSelect(o.id); }}>
                      <input type="checkbox" checked={selectedIds.has(o.id)} onChange={() => toggleSelect(o.id)}
                        className="accent-brand-700 w-4 h-4 align-middle" />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-brand-700" onClick={() => setSelected(o)}>#{o.id.slice(-8).toUpperCase()}</td>
                    <td className="py-2.5 px-2" onClick={() => setSelected(o)}>
                      <div className="font-medium">{o.shipping.name}</div>
                      <div className="text-xs text-mute">{o.shipping.phone}</div>
                    </td>
                    <td className="py-2.5 px-2 text-xs text-mute" onClick={() => setSelected(o)}>{formatDate(o.createdAt)}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-brand-700 whitespace-nowrap" onClick={() => setSelected(o)}>{fmt(o.total)}</td>
                    <td className="py-2.5 px-2 text-center" onClick={() => setSelected(o)}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(o); }} className="text-brand-500 hover:text-brand-700 px-2 py-1 text-xs font-semibold">Chi tiết</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ id: o.id }); }} className="text-red-500 hover:text-red-600 px-2 py-1 text-xs font-semibold">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Đơn hàng #${selected.id.slice(-8).toUpperCase()}` : ''}
        subtitle={selected ? formatDate(selected.createdAt) : ''}
      >
        {selected && (
          <div className="space-y-5">
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
                onClick={() => setInvoiceOrder(selected)}
                className="text-xs font-semibold bg-brand-700 text-white hover:bg-brand-800 px-4 py-2 rounded-md inline-flex items-center gap-2"
              >
                <FileText size={14} strokeWidth={2} />
                Xem & in hóa đơn
              </button>
              <button
                onClick={() => { setConfirmDelete({ id: selected.id }); }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 px-4 py-2 rounded-md inline-flex items-center gap-2"
              >
                <Trash2 size={14} strokeWidth={2} />
                Xóa đơn hàng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm delete (single + bulk) */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={confirmDelete?.bulk ? `Xóa ${selectedIds.size} đơn hàng?` : 'Xóa đơn hàng?'}
        tone="red"
        message={confirmDelete?.bulk
          ? `Xóa ${selectedIds.size} đơn hàng đang chọn? Hành động này không thể hoàn tác.`
          : 'Xóa đơn hàng này? Hành động này không thể hoàn tác.'}
        confirmLabel="Xóa"
        onConfirm={() => {
          if (confirmDelete?.bulk) bulkDelete();
          else if (confirmDelete) removeOne(confirmDelete.id);
        }}
        onClose={() => setConfirmDelete(null)}
      />

      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
    </AdminLayout>
  );
}