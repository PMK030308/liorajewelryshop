import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { fmt } from '../../data';
import AdminLayout from './AdminLayout';
import { Product, ShapeKey } from '../../types';
import Shapes from '../../data/shapes';

const SHAPES: ShapeKey[] = ['bow','flower','snow','gem','star','bracelet','ring','butterfly','clover','heart','sparkle'];
const CATS: Product['cat'][] = ['moissanite', 'best-seller'];
const SUBCATS = ['bong-tai','day-chuyen','lac-tay','nhan-don','cap-doi'];

const emptyDraft: Product = {
  slug: '',
  code: '',
  name: '',
  cat: 'best-seller',
  subcat: 'day-chuyen',
  price: 0,
  tint: '#eef2f7',
  tint2: '#d8e0ec',
  accent: '#34507a',
  shape: 'gem',
};

export default function AdminProducts() {
  const { state, dispatch, showToast } = useStore();
  const { products } = state;
  const [q, setQ] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return products.filter(p => {
      if (filterCat !== 'all' && p.cat !== filterCat) return false;
      if (!ql) return true;
      return p.name.toLowerCase().includes(ql) || p.code.toLowerCase().includes(ql) || p.slug.includes(ql);
    });
  }, [products, q, filterCat]);

  const startNew = () => setEditing({ ...emptyDraft });
  const startEdit = (p: Product) => setEditing({ ...p });

  const save = () => {
    if (!editing) return;
    const slug = editing.slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug || !editing.name || !editing.code) {
      showToast('⚠ Vui lòng điền slug, mã và tên sản phẩm');
      return;
    }
    const exists = products.find(p => p.slug === slug);
    if (exists && exists !== products.find(p => p.slug === editing.slug)) {
      showToast('⚠ Slug đã tồn tại');
      return;
    }
    const isNew = !products.find(p => p.slug === editing.slug);
    const payload = { ...editing, slug };
    if (isNew) {
      dispatch({ type: 'ADD_PRODUCT', payload });
      showToast('✓ Đã thêm sản phẩm');
    } else {
      dispatch({ type: 'UPDATE_PRODUCT', payload });
      showToast('✓ Đã cập nhật sản phẩm');
    }
    setEditing(null);
  };

  const confirmRemove = () => {
    if (!confirmDelete) return;
    dispatch({ type: 'DELETE_PRODUCT', payload: confirmDelete.slug });
    showToast('🗑 Đã xóa sản phẩm');
    setConfirmDelete(null);
  };

  return (
    <AdminLayout active="products">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Sản phẩm</h1>
          <p className="text-sm text-mute">{products.length} sản phẩm đang quản lý</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!confirm('Khôi phục danh sách về dữ liệu seed (kèm ảnh demo)? Mọi sản phẩm tự thêm sẽ bị mất.')) return;
              dispatch({ type: 'RESET_PRODUCTS' });
              showToast('✓ Đã khôi phục về dữ liệu mẫu');
            }}
            className="text-xs font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2.5 rounded-md inline-flex items-center gap-1.5"
            title="Khôi phục về dữ liệu mẫu (có ảnh demo)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>
            Khôi phục seed
          </button>
          <button onClick={startNew} className="bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-brand-800 inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
            Thêm sản phẩm
          </button>
        </div>
      </header>

      <div className="bg-white border border-rule rounded-lg overflow-hidden">
        <div className="flex flex-wrap gap-3 p-4 border-b border-rule">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Tìm theo tên / mã / slug..."
            className="flex-1 min-w-[200px] border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
          />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
            <option value="all">Tất cả danh mục</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-mute text-sm">Không tìm thấy sản phẩm phù hợp.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-soft text-xs uppercase tracking-wider text-mute">
                <tr>
                  <th className="text-left py-2.5 px-4">Sản phẩm</th>
                  <th className="text-left py-2.5 px-2">Mã</th>
                  <th className="text-left py-2.5 px-2">Danh mục</th>
                  <th className="text-right py-2.5 px-2">Giá</th>
                  <th className="text-center py-2.5 px-2">Trạng thái</th>
                  <th className="text-right py-2.5 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {filtered.map(p => {
                  const ShapeSvg = Shapes[p.shape] || Shapes['gem'];
                  return (
                    <tr key={p.slug} className="hover:bg-brand-50/40">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-soft">
                            {p.image ? (
                              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="photo h-full w-full" style={{ aspectRatio: 'auto', backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${p.tint} 75%, ${p.tint2})` } as React.CSSProperties}>
                                <div className="sil" style={{ color: p.accent }}>{ShapeSvg}</div>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-mute flex items-center gap-2">
                              <span>{p.slug}</span>
                              {p.rating != null && <span className="text-yellow-500">★ {p.rating.toFixed(1)}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-xs font-mono text-mute">{p.code}</td>
                      <td className="py-2 px-2 text-xs">{p.cat} <span className="text-mute">/ {p.subcat}</span></td>
                      <td className="py-2 px-2 text-right font-bold text-brand-700">{fmt(p.price)}</td>
                      <td className="py-2 px-2 text-center">
                        {p.sold ? <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">Hết hàng</span>
                          : p.hot ? <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">HOT</span>
                          : <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200">Đang bán</span>}
                      </td>
                      <td className="py-2 px-4 text-right whitespace-nowrap">
                        <button onClick={() => startEdit(p)} className="text-brand-500 hover:text-brand-700 px-2 py-1 text-xs font-semibold">Sửa</button>
                        <button onClick={() => setConfirmDelete(p)} className="text-red-500 hover:text-red-600 px-2 py-1 text-xs font-semibold">Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <header className="flex items-center justify-between p-5 border-b border-rule sticky top-0 bg-white">
              <h3 className="font-bold text-lg text-brand-700">
                {products.find(p => p.slug === editing.slug) ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-full hover:bg-soft flex items-center justify-center text-mute">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </header>
            <div className="p-5 grid md:grid-cols-2 gap-4">
              <Field label="Slug (định danh, không trùng)" required>
                <input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </Field>
              <Field label="Mã sản phẩm" required>
                <input value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </Field>
              <Field label="Tên sản phẩm" required className="md:col-span-2">
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </Field>
              <Field label="Danh mục">
                <select value={editing.cat} onChange={e => setEditing({ ...editing, cat: e.target.value as Product['cat'] })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Danh mục con">
                <select value={editing.subcat} onChange={e => setEditing({ ...editing, subcat: e.target.value })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
                  {SUBCATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Giá (₫)">
                <input type="number" min={0} value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </Field>
              <Field label="Hình dạng (placeholder)">
                <select value={editing.shape} onChange={e => setEditing({ ...editing, shape: e.target.value as ShapeKey })}
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
                  {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Tint 1">
                <input type="color" value={editing.tint} onChange={e => setEditing({ ...editing, tint: e.target.value })}
                  className="h-10 w-full border border-rule rounded-md cursor-pointer" />
              </Field>
              <Field label="Tint 2">
                <input type="color" value={editing.tint2} onChange={e => setEditing({ ...editing, tint2: e.target.value })}
                  className="h-10 w-full border border-rule rounded-md cursor-pointer" />
              </Field>
              <Field label="Accent">
                <input type="color" value={editing.accent} onChange={e => setEditing({ ...editing, accent: e.target.value })}
                  className="h-10 w-full border border-rule rounded-md cursor-pointer" />
              </Field>
              <Field label="URL ảnh sản phẩm (tuỳ chọn)" className="md:col-span-2">
                <input value={editing.image || ''} onChange={e => setEditing({ ...editing, image: e.target.value || undefined })}
                  placeholder="https://..."
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </Field>
              <Field label="URL ảnh hover (tuỳ chọn)" className="md:col-span-2">
                <input value={editing.imageHover || ''} onChange={e => setEditing({ ...editing, imageHover: e.target.value || undefined })}
                  placeholder="https://..."
                  className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500" />
              </Field>
              <div className="md:col-span-2 flex flex-wrap gap-5 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.hot} onChange={e => setEditing({ ...editing, hot: e.target.checked })}
                    className="accent-brand-700 w-4 h-4" />
                  Đánh dấu HOT
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.sold} onChange={e => setEditing({ ...editing, sold: e.target.checked })}
                    className="accent-brand-700 w-4 h-4" />
                  Hết hàng
                </label>
              </div>
            </div>
            <footer className="flex items-center justify-end gap-2 p-5 border-t border-rule">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-rule text-ink2 hover:bg-soft">Hủy</button>
              <button onClick={save} className="px-5 py-2.5 rounded-md text-sm font-semibold bg-brand-700 text-white hover:bg-brand-800">Lưu</button>
            </footer>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-lg max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2 text-red-600">Xác nhận xóa</h3>
            <p className="text-sm text-ink2 mb-5">
              Xóa sản phẩm <b>{confirmDelete.name}</b>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-md text-sm border border-rule hover:bg-soft">Hủy</button>
              <button onClick={confirmRemove} className="px-4 py-2 rounded-md text-sm bg-red-500 text-white font-semibold hover:bg-red-600">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-ink2 mb-1.5">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
