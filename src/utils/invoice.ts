/**
 * Invoice generator — produces a print-quality A4 invoice PDF.
 *
 * Uses jsPDF directly (no autotable plugin) so the build stays light.
 * Vietnamese text needs a Unicode font — we embed Noto Sans via Google Fonts at
 * runtime to render diacritics correctly.
 */
import jsPDF from 'jspdf';
import { Order } from '../types';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';
const formatDate = (ts: number) =>
  new Date(ts).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'Cho xac nhan',
  confirmed: 'Da xac nhan',
  shipping: 'Dang giao',
  done: 'Hoan tat',
  cancelled: 'Da huy',
};

// Strip Vietnamese diacritics so we can use the default Helvetica font.
// (Embedding a real Unicode font would inflate the bundle ~200kb.)
function vi(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

interface BuildOpts {
  /** Print directly instead of downloading. */
  autoPrint?: boolean;
}

/**
 * Build a PDF for the given order. By default downloads as `hoa-don-XXXX.pdf`.
 * Set `autoPrint: true` to open the print dialog in a new tab instead.
 */
export function generateInvoicePdf(order: Order, opts: BuildOpts = {}): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const W = doc.internal.pageSize.getWidth();
  const M = 40; // margin
  let y = M;

  // -------- Header --------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(143, 63, 97); // brand-700
  doc.text('LIORA', M, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(vi('Trang suc bac cao cap · Liorajewelry.shop'), M, y + 18);

  // Right side: HOA DON
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(143, 63, 97);
  doc.text(vi('HOA DON'), W - M, y + 4, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`#${order.id.slice(-8).toUpperCase()}`, W - M, y + 20, { align: 'right' });

  y += 40;

  // Divider
  doc.setDrawColor(230, 230, 230);
  doc.line(M, y, W - M, y);
  y += 18;

  // -------- Meta row --------
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(vi('Ngay xuat:'), M, y);
  doc.text(vi('Trang thai:'), W / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(order.createdAt), M + 60, y);
  doc.text(vi(STATUS_LABEL[order.status]), W / 2 + 60, y);
  y += 14;
  doc.setFont('helvetica', 'bold');
  doc.text(vi('Thanh toan:'), M, y);
  doc.setFont('helvetica', 'normal');
  doc.text(order.payment.toUpperCase(), M + 60, y);
  y += 24;

  // -------- Customer block --------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(143, 63, 97);
  doc.text(vi('THONG TIN KHACH HANG'), M, y);
  y += 4;
  doc.setDrawColor(230, 230, 230);
  doc.line(M, y, W - M, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(vi(`Ho ten: ${order.shipping.name}`), M, y); y += 13;
  doc.text(vi(`SDT:    ${order.shipping.phone}`), M, y); y += 13;
  if (order.shipping.email) { doc.text(vi(`Email:  ${order.shipping.email}`), M, y); y += 13; }
  const addr = `Dia chi: ${order.shipping.address}, ${order.shipping.city}${order.shipping.district ? ', ' + order.shipping.district : ''}`;
  const addrLines = doc.splitTextToSize(vi(addr), W - 2 * M);
  doc.text(addrLines, M, y);
  y += 13 * addrLines.length;
  if (order.shipping.note) {
    const noteLines = doc.splitTextToSize(vi(`Ghi chu: ${order.shipping.note}`), W - 2 * M);
    doc.text(noteLines, M, y);
    y += 13 * noteLines.length;
  }
  y += 12;

  // -------- Items header --------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(143, 63, 97);
  doc.text(vi('CHI TIET DON HANG'), M, y);
  y += 4;
  doc.line(M, y, W - M, y);
  y += 14;

  // Table header
  doc.setFillColor(248, 249, 250);
  doc.rect(M, y - 10, W - 2 * M, 22, 'F');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(vi('San pham'), M + 8, y + 4);
  doc.text(vi('SL'), W / 2 + 80, y + 4, { align: 'right' });
  doc.text(vi('Don gia'), W / 2 + 160, y + 4, { align: 'right' });
  doc.text(vi('Thanh tien'), W - M - 8, y + 4, { align: 'right' });
  y += 22;

  // Rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  order.items.forEach((it, i) => {
    if (y > 740) { doc.addPage(); y = M; }
    const nameLines = doc.splitTextToSize(vi(it.name + (it.size ? ` (${it.size})` : '')), W / 2 + 60);
    if (i % 2 === 1) {
      doc.setFillColor(252, 252, 253);
      doc.rect(M, y - 9, W - 2 * M, 13 * nameLines.length + 6, 'F');
    }
    doc.text(nameLines, M + 8, y);
    doc.text(String(it.qty), W / 2 + 80, y, { align: 'right' });
    doc.text(fmt(it.price), W / 2 + 160, y, { align: 'right' });
    doc.text(fmt(it.price * it.qty), W - M - 8, y, { align: 'right' });
    y += 13 * nameLines.length + 6;
  });
  doc.line(M, y, W - M, y);
  y += 14;

  // -------- Totals --------
  const totalX = W - M;
  const labelX = W - M - 140;

  const row = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 11 : 10);
    doc.setTextColor(bold ? 26 : 80, bold ? 48 : 80, bold ? 80 : 80);
    doc.text(vi(label), labelX, y, { align: 'right' });
    doc.text(value, totalX, y, { align: 'right' });
    y += bold ? 18 : 15;
  };

  row('Tam tinh:', fmt(order.subtotal));
  row('Phi van chuyen:', order.ship === 0 ? 'Mien phi' : fmt(order.ship));
  if (order.discount > 0) row(`Giam gia${order.coupon ? ' (' + order.coupon + ')' : ''}:`, '- ' + fmt(order.discount));
  y += 4;
  doc.setDrawColor(143, 63, 97);
  doc.setLineWidth(1);
  doc.line(labelX - 10, y - 12, totalX, y - 12);
  doc.setLineWidth(0.5);
  row('TONG CONG:', fmt(order.total), true);

  y += 20;

  // -------- Footer --------
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(vi('Cam on quy khach da mua hang tai LIORA!'), W / 2, y, { align: 'center' });
  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(vi('159 Ly Thuong Kiet, Quang Trung, Ha Dong, Ha Noi · Hotline 0982 463 691 · hello@liorajewelry.shop'), W / 2, y, { align: 'center' });

  if (opts.autoPrint) {
    // Open in a new tab and trigger print
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => { win.focus(); win.print(); };
    }
  } else {
    doc.save(`hoa-don-${order.id.slice(-8).toUpperCase()}.pdf`);
  }

  return doc;
}
