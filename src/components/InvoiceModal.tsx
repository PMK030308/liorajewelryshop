import React, { useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { Order } from '../types';
import { fmt } from '../data';
import { numberToVietnameseWords, capitalize } from '../utils/numberToWords';

interface Props {
  order: Order | null;
  onClose: () => void;
}

const STATUS_LABEL = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  done: 'Hoàn tất',
  cancelled: 'Đã hủy',
} as const;

const PAYMENT_LABEL = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank: 'Chuyển khoản ngân hàng',
  momo: 'Ví điện tử MoMo',
} as const;

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function InvoiceModal({ order, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (!order) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, [order]);

  // ESC to close
  useEffect(() => {
    if (!order) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [order, onClose]);

  if (!order) return null;

  const print = () => window.print();

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-start md:items-center justify-center overflow-y-auto p-2 md:p-6 invoice-no-print">
      <div className="bg-white w-full max-w-[820px] shadow-2xl rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Toolbar — hidden when printing */}
        <header className="invoice-no-print sticky top-0 z-10 flex items-center justify-between gap-3 bg-white border-b border-rule px-4 md:px-6 py-3">
          <h2 className="font-bold text-brand-700">Hóa đơn bán hàng</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={print}
              className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
            >
              <Printer size={16} strokeWidth={2} />
              <span className="hidden sm:inline">In hóa đơn</span>
              <span className="sm:hidden">In</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-soft flex items-center justify-center text-mute"
              aria-label="Đóng"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* Printable area */}
        <article className="invoice-print-area px-6 md:px-10 py-8 md:py-10 text-[13px] leading-snug text-ink">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-rule">
            <div className="flex items-start gap-3">
              <img src="/logoliora.png" alt="LIORA" className="h-12 w-auto object-contain" />
              <div className="text-[11px] leading-snug">
                <div className="text-mute uppercase tracking-wider">Liorajewelry.shop</div>
                <div className="text-ink">159 Lý Thường Kiệt, Quang Trung, Hà Đông, Hà Nội</div>
                <div className="text-ink">Hotline: 0982 463 691</div>
                <div className="text-ink">Email: hello@liorajewelry.shop</div>
                <div className="text-mute mt-1">MST: 8662980683-001</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-700 tracking-wide">HÓA ĐƠN</div>
              <div className="text-xs text-mute uppercase tracking-wider">Bán lẻ</div>
              <div className="text-sm mt-2 font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</div>
              <div className="text-xs text-mute">Ngày xuất: {formatDate(order.createdAt)}</div>
              <div className="text-xs text-mute">Trạng thái: <span className="text-ink font-medium">{STATUS_LABEL[order.status]}</span></div>
            </div>
          </div>

          {/* Customer info */}
          <section className="mt-5 mb-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-brand-700 mb-2">Thông tin khách hàng</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              <Row label="Họ và tên" value={order.shipping.name} />
              <Row label="Số điện thoại" value={order.shipping.phone} />
              {order.shipping.email && <Row label="Email" value={order.shipping.email} />}
              <Row label="Hình thức thanh toán" value={PAYMENT_LABEL[order.payment]} />
              <Row
                label="Địa chỉ giao hàng"
                value={`${order.shipping.address}, ${order.shipping.city}${order.shipping.district ? `, ${order.shipping.district}` : ''}`}
                full
              />
              {order.shipping.note && <Row label="Ghi chú" value={order.shipping.note} full />}
            </div>
          </section>

          {/* Items table */}
          <section className="mb-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-brand-700 mb-2">Chi tiết đơn hàng</div>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-brand-50">
                  <th className="border border-rule px-2 py-2 text-left w-10">STT</th>
                  <th className="border border-rule px-2 py-2 text-left">Tên sản phẩm</th>
                  <th className="border border-rule px-2 py-2 text-center w-12">ĐVT</th>
                  <th className="border border-rule px-2 py-2 text-center w-14">SL</th>
                  <th className="border border-rule px-2 py-2 text-right w-24">Đơn giá</th>
                  <th className="border border-rule px-2 py-2 text-right w-28">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={it.cartId}>
                    <td className="border border-rule px-2 py-2 text-center">{i + 1}</td>
                    <td className="border border-rule px-2 py-2">
                      <div>{it.name}</div>
                      {it.size && <div className="text-[10px] text-mute mt-0.5">Size: {it.size}</div>}
                    </td>
                    <td className="border border-rule px-2 py-2 text-center text-mute">Cái</td>
                    <td className="border border-rule px-2 py-2 text-center">{it.qty}</td>
                    <td className="border border-rule px-2 py-2 text-right whitespace-nowrap">{fmt(it.price)}</td>
                    <td className="border border-rule px-2 py-2 text-right whitespace-nowrap font-medium">{fmt(it.price * it.qty)}</td>
                  </tr>
                ))}
                {/* Spacer rows if few items (for visual balance) */}
                {order.items.length < 3 && Array.from({ length: 3 - order.items.length }).map((_, i) => (
                  <tr key={`spacer-${i}`}>
                    <td className="border border-rule px-2 py-3"></td>
                    <td className="border border-rule px-2"></td>
                    <td className="border border-rule px-2"></td>
                    <td className="border border-rule px-2"></td>
                    <td className="border border-rule px-2"></td>
                    <td className="border border-rule px-2"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-medium">
                <tr>
                  <td colSpan={5} className="border border-rule px-2 py-1.5 text-right text-ink2">Tạm tính</td>
                  <td className="border border-rule px-2 py-1.5 text-right">{fmt(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="border border-rule px-2 py-1.5 text-right text-ink2">Phí vận chuyển</td>
                  <td className="border border-rule px-2 py-1.5 text-right">
                    {order.ship === 0 ? <span className="text-green-700">Miễn phí</span> : fmt(order.ship)}
                  </td>
                </tr>
                {order.discount > 0 && (
                  <tr>
                    <td colSpan={5} className="border border-rule px-2 py-1.5 text-right text-ink2">
                      Giảm giá {order.coupon ? <span className="font-mono text-[10px] uppercase">({order.coupon})</span> : ''}
                    </td>
                    <td className="border border-rule px-2 py-1.5 text-right text-green-700">− {fmt(order.discount)}</td>
                  </tr>
                )}
                <tr className="bg-brand-50">
                  <td colSpan={5} className="border border-rule px-2 py-2.5 text-right font-bold text-brand-700 uppercase tracking-wide">Tổng cộng</td>
                  <td className="border border-rule px-2 py-2.5 text-right font-bold text-brand-700 text-base">{fmt(order.total)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Amount in words */}
            <div className="text-[12px] mt-3 italic">
              <span className="text-ink2">Bằng chữ: </span>
              <span className="text-ink font-medium">{capitalize(numberToVietnameseWords(order.total))} chẵn./.</span>
            </div>
          </section>

          {/* Signatures */}
          <section className="mt-8 mb-4 grid grid-cols-3 gap-4 text-center text-[11px]">
            <div>
              <div className="font-bold uppercase tracking-wider mb-1">Người mua hàng</div>
              <div className="italic text-mute mb-12">(Ký, ghi rõ họ tên)</div>
            </div>
            <div>
              <div className="font-bold uppercase tracking-wider mb-1">Người giao hàng</div>
              <div className="italic text-mute mb-12">(Ký, ghi rõ họ tên)</div>
            </div>
            <div>
              <div className="font-bold uppercase tracking-wider mb-1">Người bán hàng</div>
              <div className="italic text-mute mb-12">(Ký, ghi rõ họ tên)</div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-[11px] text-mute italic pt-3 border-t border-rule">
            Cảm ơn quý khách đã mua hàng tại LIORA · Giữ hóa đơn này để được hỗ trợ đổi trả & bảo hành
          </div>
        </article>
      </div>
    </div>
  );
}

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`text-[12px] ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-mute mr-2">{label}:</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}
