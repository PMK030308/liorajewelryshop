import React, { useEffect } from 'react';
import { X, Ruler } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Which guide to highlight: ring sizes vs bracelet length. */
  type?: 'ring' | 'bracelet' | 'necklace';
}

const RING_SIZES = [
  { vn: '#5', mm: 49.3, inner: 15.7 },
  { vn: '#6', mm: 51.9, inner: 16.5 },
  { vn: '#7', mm: 54.4, inner: 17.3 },
  { vn: '#8', mm: 57.0, inner: 18.1 },
  { vn: '#9', mm: 59.5, inner: 18.9 },
  { vn: '#10', mm: 62.1, inner: 19.8 },
  { vn: '#11', mm: 64.6, inner: 20.6 },
];

const BRACELET_SIZES = [
  { code: 'XS', length: 15, fit: 'Cổ tay nhỏ (13-14cm)' },
  { code: 'S',  length: 16, fit: 'Cổ tay 14-15cm' },
  { code: 'M',  length: 17, fit: 'Cổ tay 15-16cm (phổ biến)' },
  { code: 'L',  length: 18, fit: 'Cổ tay 16-17cm' },
  { code: 'XL', length: 19, fit: 'Cổ tay 17-18cm' },
];

const NECKLACE_SIZES = [
  { code: '38cm', name: 'Choker', position: 'Sát cổ' },
  { code: '40cm', name: 'Collar', position: 'Trên xương đòn' },
  { code: '42-45cm', name: 'Princess', position: 'Cổ áo (phổ biến nhất)' },
  { code: '50cm', name: 'Matinee', position: 'Trên ngực' },
  { code: '60cm', name: 'Opera', position: 'Dưới ngực' },
];

export default function SizeGuideModal({ open, onClose, type = 'ring' }: Props) {
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden my-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white border-b border-rule px-5 py-4">
          <div className="flex items-center gap-2 text-brand-700">
            <Ruler size={18} strokeWidth={1.8} />
            <h2 className="font-bold text-lg">Hướng dẫn chọn size</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-soft flex items-center justify-center text-mute" aria-label="Đóng">
            <X size={16} strokeWidth={2} />
          </button>
        </header>

        <div className="p-5 md:p-6 space-y-6">
          {/* How to measure */}
          <section>
            <h3 className="font-bold text-brand-700 text-sm uppercase tracking-wider mb-3">Cách đo tại nhà</h3>
            {type === 'ring' && (
              <ol className="space-y-2 text-sm text-ink2 list-decimal pl-5">
                <li>Dùng một sợi chỉ hoặc dây mảnh quấn quanh đốt giữa ngón tay (đốt to nhất).</li>
                <li>Đánh dấu điểm giao nhau bằng bút.</li>
                <li>Dùng thước đo độ dài đoạn đã đánh dấu (đơn vị mm).</li>
                <li>So sánh với bảng <b>Chu vi (mm)</b> bên dưới để chọn size phù hợp.</li>
                <li>Đo vào buổi tối, khi ngón tay không sưng phồng.</li>
              </ol>
            )}
            {type === 'bracelet' && (
              <ol className="space-y-2 text-sm text-ink2 list-decimal pl-5">
                <li>Đo chu vi cổ tay tại điểm xương cổ tay (đơn vị cm).</li>
                <li>Cộng thêm 1-1.5cm cho lắc tay vừa vặn, hoặc 2-3cm nếu thích đeo lỏng.</li>
                <li>Đối chiếu với bảng dưới để chọn size phù hợp.</li>
              </ol>
            )}
            {type === 'necklace' && (
              <ol className="space-y-2 text-sm text-ink2 list-decimal pl-5">
                <li>Quấn một sợi dây quanh cổ ở vị trí mong muốn đeo.</li>
                <li>Đánh dấu và đo độ dài đoạn dây (đơn vị cm).</li>
                <li>Đối chiếu với bảng dưới để chọn chiều dài phù hợp với phong cách.</li>
              </ol>
            )}
          </section>

          {/* Size table */}
          <section>
            <h3 className="font-bold text-brand-700 text-sm uppercase tracking-wider mb-3">Bảng size</h3>
            {type === 'ring' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-brand-50">
                      <th className="border border-rule px-3 py-2 text-left font-semibold">Size VN</th>
                      <th className="border border-rule px-3 py-2 text-right font-semibold">Chu vi (mm)</th>
                      <th className="border border-rule px-3 py-2 text-right font-semibold">Đường kính (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RING_SIZES.map(r => (
                      <tr key={r.vn} className="hover:bg-soft">
                        <td className="border border-rule px-3 py-2 font-bold text-brand-700">{r.vn}</td>
                        <td className="border border-rule px-3 py-2 text-right">{r.mm.toFixed(1)}</td>
                        <td className="border border-rule px-3 py-2 text-right text-mute">{r.inner.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {type === 'bracelet' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-brand-50">
                      <th className="border border-rule px-3 py-2 text-left font-semibold">Size</th>
                      <th className="border border-rule px-3 py-2 text-right font-semibold">Chiều dài (cm)</th>
                      <th className="border border-rule px-3 py-2 text-left font-semibold">Phù hợp với</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRACELET_SIZES.map(b => (
                      <tr key={b.code} className="hover:bg-soft">
                        <td className="border border-rule px-3 py-2 font-bold text-brand-700">{b.code}</td>
                        <td className="border border-rule px-3 py-2 text-right">{b.length}</td>
                        <td className="border border-rule px-3 py-2 text-ink2">{b.fit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {type === 'necklace' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-brand-50">
                      <th className="border border-rule px-3 py-2 text-left font-semibold">Chiều dài</th>
                      <th className="border border-rule px-3 py-2 text-left font-semibold">Tên gọi</th>
                      <th className="border border-rule px-3 py-2 text-left font-semibold">Vị trí trên ngực</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NECKLACE_SIZES.map(n => (
                      <tr key={n.code} className="hover:bg-soft">
                        <td className="border border-rule px-3 py-2 font-bold text-brand-700">{n.code}</td>
                        <td className="border border-rule px-3 py-2">{n.name}</td>
                        <td className="border border-rule px-3 py-2 text-ink2">{n.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-soft border border-rule rounded-md p-4 text-xs text-ink2">
            <b className="text-ink">Lưu ý:</b> Nếu giữa 2 size, bạn nên chọn size lớn hơn để thoải mái hơn khi đeo. Có thể đem ra cửa hàng LIORA (159 Lý Thường Kiệt, Hà Đông) để được đo miễn phí.
          </section>
        </div>
      </div>
    </div>
  );
}
