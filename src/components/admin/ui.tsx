import React, { useEffect } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../../types';
import { STATUS_META } from '../../pages/AccountPage';

/** Shared input/label class strings — reused across admin pages. */
export const inputCls = 'w-full text-sm px-3 py-2 border border-rule rounded-lg focus:outline-none focus:border-brand-500 bg-white';
export const labelCls = 'block text-xs font-bold uppercase text-mute mb-1.5 tracking-wide';

/* ───────────────────────── PageHeader ───────────────────────── */
export function PageHeader({
  title, subtitle, actions, dirty,
}: { title: string; subtitle?: string; actions?: React.ReactNode; dirty?: boolean }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-brand-700 flex items-center gap-2 flex-wrap">
          {title}
          {dirty && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full align-middle">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Có thay đổi chưa lưu
            </span>
          )}
        </h1>
        {subtitle && <p className="text-sm text-mute mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}

/* ───────────────────────── StatCard ───────────────────────── */
export function StatCard({
  label, value, sub, icon, tone = 'bg-white border border-rule',
}: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; tone?: string }) {
  return (
    <div className={`rounded-lg p-5 ${tone}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs uppercase tracking-wider opacity-80">{label}</div>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <div className="text-2xl md:text-3xl font-bold leading-none mt-1.5 mb-1">{value}</div>
      {sub && <div className="text-xs opacity-70">{sub}</div>}
    </div>
  );
}

/* ───────────────────────── SearchInput ───────────────────────── */
export function SearchInput({
  value, onChange, placeholder = 'Tìm kiếm...',
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-rule rounded-md pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-brand-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-mute hover:text-ink2"
          aria-label="Xóa tìm kiếm"
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── EmptyState ───────────────────────── */
export function EmptyState({
  icon, title, message, action,
}: { icon?: React.ReactNode; title: string; message?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 text-mute">
      {icon && <div className="mb-3 opacity-50">{icon}</div>}
      <p className="text-sm font-medium text-ink2">{title}</p>
      {message && <p className="text-xs mt-1">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ───────────────────────── Modal ───────────────────────── */
export function Modal({
  open, onClose, title, subtitle, children, footer, size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizeCls = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }[size];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className={`bg-white rounded-lg w-full ${sizeCls} max-h-[95vh] md:max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-5 border-b border-rule sticky top-0 bg-white z-10">
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-brand-700 truncate">{title}</h3>
            {subtitle && <p className="text-xs text-mute mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-soft flex items-center justify-center text-mute shrink-0" aria-label="Đóng">
            <X size={16} strokeWidth={2} />
          </button>
        </header>
        <div className="p-5">{children}</div>
        {footer && <footer className="flex items-center justify-end gap-2 p-5 border-t border-rule sticky bottom-0 bg-white">{footer}</footer>}
      </div>
    </div>
  );
}

/* ───────────────────────── ConfirmDialog ───────────────────────── */
export function ConfirmDialog({
  open, title, message, confirmLabel = 'Xác nhận', tone = 'red', onConfirm, onClose,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  tone?: 'red' | 'brand' | 'amber';
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  const toneCls = {
    red: 'text-red-600',
    brand: 'text-brand-700',
    amber: 'text-amber-600',
  }[tone];
  const btnCls = {
    red: 'bg-red-500 text-white hover:bg-red-600',
    brand: 'bg-brand-700 text-white hover:bg-brand-800',
    amber: 'bg-amber-500 text-white hover:bg-amber-600',
  }[tone];

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full bg-soft flex items-center justify-center shrink-0 ${toneCls}`}>
            <AlertCircle size={20} strokeWidth={2} />
          </div>
          <h3 className={`font-bold text-lg ${toneCls} mt-1`}>{title}</h3>
        </div>
        <div className="text-sm text-ink2 mb-5 leading-relaxed">{message}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm border border-rule hover:bg-soft">Hủy</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${btnCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── StatusBadge ───────────────────────── */
export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status];
  return <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${m.cls}`}>{m.label}</span>;
}

/* ───────────────────────── Pagination ───────────────────────── */
export function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-rule text-xs text-mute">
      <span>Trang {page} / {totalPages}</span>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-md border border-rule hover:bg-soft disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹ Trước
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-md border border-rule hover:bg-soft disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sau ›
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── BulkBar ───────────────────────── */
export function BulkBar({
  selectedCount, onClear, children,
}: { selectedCount: number; onClear: () => void; children: React.ReactNode }) {
  if (selectedCount === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-brand-50 border-b border-brand-100 text-sm">
      <span className="font-semibold text-brand-700">{selectedCount} đã chọn</span>
      <button onClick={onClear} className="text-xs text-mute hover:text-ink2 underline">Bỏ chọn hết</button>
      <div className="flex flex-wrap items-center gap-2 ml-auto">{children}</div>
    </div>
  );
}