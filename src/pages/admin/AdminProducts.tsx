import React, { useMemo, useRef, useState } from 'react';
import { Plus, RefreshCw, X, Upload, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fmt } from '../../data';
import AdminLayout from './AdminLayout';
import { Product, ShapeKey } from '../../types';
import Shapes from '../../data/shapes';
import { getWordPressConfig, fetchWooCommerceProducts } from '../../utils/wordpressService';

const SUBCAT_LABELS: Record<string, string> = {
  'bong-tai':   'Bông tai / Khuyên tai',
  'day-chuyen': 'Dây chuyền',
  'lac-tay':    'Lắc tay / Vòng tay',
  'nhan-don':   'Nhẫn đơn',
  'cap-doi':    'Cặp đôi',
};

/** Convert Vietnamese text to URL-friendly slug. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function splitLines(value: string): string[] | undefined {
  const lines = value.split('\n').map(line => line.trim()).filter(Boolean);
  return lines.length ? lines : undefined;
}

function specsToText(specs: Product['specifications']): string {
  return (specs || []).map(item => `${item.label}: ${item.value}`).join('\n');
}

function parseSpecs(value: string): Product['specifications'] {
  const rows = value.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [label, ...rest] = line.split(':');
      return {
        label: label.trim(),
        value: rest.join(':').trim(),
      };
    })
    .filter(row => row.label && row.value);
  return rows.length ? rows : undefined;
}

const SHAPES: ShapeKey[] = ['bow','flower','snow','gem','star','bracelet','ring','butterfly','clover','heart','sparkle'];
const CATS: Product['cat'][] = ['bst', 'best-seller'];
const SUBCATS = ['bong-tai','day-chuyen','lac-tay','nhan-don','cap-doi'];

const emptyDraft: Product = {
  slug: '',
  code: '',
  name: '',
  cat: 'best-seller',
  subcat: 'day-chuyen',
  price: 0,
  tint: '#fff8fa',
  tint2: '#f8d8e3',
  accent: '#c96b8d',
  shape: 'gem',
};

export default function AdminProducts() {
  const { state, dispatch, showToast } = useStore();
  const { products } = state;
  const [q, setQ] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const wpConfig = useMemo(() => getWordPressConfig(), []);

  const handleWooCommerceSync = async () => {
    if (!wpConfig.useWordPress || !wpConfig.apiUrl) return;
    setIsSyncing(true);
    showToast('Đang kết nối đồng bộ sản phẩm từ WooCommerce...');
    try {
      const synced = await fetchWooCommerceProducts(wpConfig);
      if (synced && synced.length > 0) {
        dispatch({ type: 'SET_PRODUCTS', payload: synced });
        showToast(`Đồng bộ thành công ${synced.length} sản phẩm từ WooCommerce!`);
      } else {
        showToast('Không tìm thấy sản phẩm nào trên WooCommerce.');
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Đồng bộ thất bại: ${err.message || 'Lỗi kết nối API'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return products.filter(p => {
      if (filterCat !== 'all' && p.cat !== filterCat) return false;
      if (!ql) return true;
      return p.name.toLowerCase().includes(ql) || p.code.toLowerCase().includes(ql) || p.slug.includes(ql);
    });
  }, [products, q, filterCat]);

  const startNew = () => { setIsAutoSlug(true); setEditing({ ...emptyDraft }); };
  const startEdit = (p: Product) => { setIsAutoSlug(false); setEditing({ ...p }); };

  const save = () => {
    if (!editing) return;
    const slug = editing.slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug || !editing.name || !editing.code) {
      showToast('Vui lòng điền slug, mã và tên sản phẩm');
      return;
    }
    const exists = products.find(p => p.slug === slug);
    if (exists && exists !== products.find(p => p.slug === editing.slug)) {
      showToast('Slug đã tồn tại');
      return;
    }
    const isNew = !products.find(p => p.slug === editing.slug);
    const payload: Product = {
      ...editing,
      slug,
      seoTitle: editing.seoTitle?.trim() || undefined,
      seoDescription: editing.seoDescription?.trim() || undefined,
      seoKeywords: editing.seoKeywords?.trim() || undefined,
      canonicalSlug: editing.canonicalSlug?.trim() || undefined,
      description: editing.description?.trim() || undefined,
      longDescription: editing.longDescription?.trim() || undefined,
      material: editing.material?.trim() || undefined,
      careInstructions: editing.careInstructions?.trim() || undefined,
      highlights: editing.highlights?.map(item => item.trim()).filter(Boolean),
      specifications: editing.specifications?.filter(item => item.label.trim() && item.value.trim()),
    };
    if (!payload.highlights?.length) payload.highlights = undefined;
    if (!payload.specifications?.length) payload.specifications = undefined;
    if (isNew) {
      dispatch({ type: 'ADD_PRODUCT', payload });
      showToast('Đã thêm sản phẩm');
    } else {
      dispatch({ type: 'UPDATE_PRODUCT', payload });
      showToast('Đã cập nhật sản phẩm');
    }
    setEditing(null);
  };

  const confirmRemove = () => {
    if (!confirmDelete) return;
    dispatch({ type: 'DELETE_PRODUCT', payload: confirmDelete.slug });
    showToast('Đã xóa sản phẩm');
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
          {wpConfig.useWordPress && (
            <button
              onClick={handleWooCommerceSync}
              disabled={isSyncing}
              className="text-xs font-semibold border border-brand-200 bg-brand-50 text-brand-700 hover:border-brand-500 hover:bg-brand-100 px-4 py-2.5 rounded-md inline-flex items-center gap-1.5 disabled:opacity-50"
              title="Đồng bộ sản phẩm tải tức thì từ WooCommerce"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} strokeWidth={2} />
              {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ WooCommerce'}
            </button>
          )}
          <button
            onClick={() => {
              if (!confirm('Khôi phục danh sách về dữ liệu seed (kèm ảnh demo)? Mọi sản phẩm tự thêm sẽ bị mất.')) return;
              dispatch({ type: 'RESET_PRODUCTS' });
              showToast('Đã khôi phục về dữ liệu mẫu');
            }}
            className="text-xs font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2.5 rounded-md inline-flex items-center gap-1.5"
            title="Khôi phục về dữ liệu mẫu (có ảnh demo)"
          >
            <RefreshCw size={14} strokeWidth={2} />
            Khôi phục seed
          </button>
          <button onClick={startNew} className="bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-brand-800 inline-flex items-center gap-2">
            <Plus size={16} strokeWidth={2.4} />
            Thêm sản phẩm
          </button>
        </div>
      </header>

      {wpConfig.useWordPress && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed shadow-sm">
          ⚠️ <strong>Chế độ WooCommerce hoạt động:</strong> Trang web đang sử dụng nguồn cấp dữ liệu sản phẩm từ WordPress WooCommerce (API: {wpConfig.apiUrl}). 
          Các thao tác thêm/sửa/xoá trên bảng này chỉ được lưu trữ tạm thời tại trình duyệt của bạn và có thể bị ghi đè khi ứng dụng tải lại hoặc khi nhấn nút <strong>Đồng bộ WooCommerce</strong>.
        </div>
      )}

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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-2 md:p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <header className="flex items-center justify-between p-5 border-b border-rule sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-lg text-brand-700">
                  {products.find(p => p.slug === editing.slug) ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                <p className="text-xs text-mute mt-0.5">Điền đầy đủ thông tin để khách hàng dễ chọn mua</p>
              </div>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-full hover:bg-soft flex items-center justify-center text-mute">
                <X size={16} strokeWidth={2} />
              </button>
            </header>

            <div className="p-5 md:p-6 space-y-7">

              {/* SECTION 1 — Thông tin cơ bản */}
              <FormSection
                step={1}
                title="Thông tin cơ bản"
                desc="Tên, mã và slug sản phẩm. Slug sẽ tự sinh từ tên nếu bỏ trống."
              >
                <Field label="Tên sản phẩm" required className="md:col-span-2"
                  hint="VD: Vòng Tay Charm “Nơ Hồng Tiểu Thư” Liôra">
                  <input value={editing.name}
                    onChange={e => {
                      const name = e.target.value;
                      setEditing({
                        ...editing,
                        name,
                        // auto-fill slug if not yet customized
                        slug: editing.slug && !isAutoSlug ? editing.slug : slugify(name),
                      });
                    }}
                    placeholder="Ví dụ: Nhẫn Bạc Đính Đá Cao Cấp"
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                </Field>
                <Field label="Mã sản phẩm (SKU)" required hint="In trên thẻ kiểm định và hoá đơn">
                  <input value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                    placeholder="VD: NLJ002"
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-brand-500" />
                </Field>
                <Field label="Slug (định danh URL)" required
                  hint="Không trùng. Auto sinh từ tên — sửa nếu muốn">
                  <input value={editing.slug}
                    onChange={e => { setIsAutoSlug(false); setEditing({ ...editing, slug: e.target.value }); }}
                    placeholder="vd: nhan-bac-aurora"
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm font-mono lowercase focus:outline-none focus:border-brand-500" />
                </Field>
              </FormSection>

              {/* SECTION 2 — Phân loại */}
              <FormSection
                step={2}
                title="Phân loại sản phẩm"
                desc="Giúp khách lọc sản phẩm dễ dàng"
              >
                <Field label="Bộ sưu tập">
                  <select value={editing.cat} onChange={e => setEditing({ ...editing, cat: e.target.value as Product['cat'] })}
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500">
                    <option value="bst">Bộ Sưu Tập (BST)</option>
                    <option value="best-seller">Bán chạy</option>
                  </select>
                </Field>
                <Field label="Loại trang sức">
                  <select value={editing.subcat} onChange={e => setEditing({ ...editing, subcat: e.target.value })}
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500">
                    {SUBCATS.map(c => <option key={c} value={c}>{SUBCAT_LABELS[c] || c}</option>)}
                  </select>
                </Field>
                <Field label="Hình dạng (silhouette)" hint="Dùng khi không có ảnh thật">
                  <select value={editing.shape} onChange={e => setEditing({ ...editing, shape: e.target.value as ShapeKey })}
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500">
                    {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </FormSection>

              {/* SECTION 3 — Giá */}
              <FormSection
                step={3}
                title="Giá bán"
                desc="Nếu có giá gốc cao hơn giá hiện tại, badge giảm % sẽ tự hiện trên thẻ sản phẩm"
              >
                <Field label="Giá bán (₫)" required
                  hint={editing.price > 0 ? `Hiển thị: ${editing.price.toLocaleString('vi-VN')}₫` : ''}>
                  <input type="number" min={0} step={1000} value={editing.price}
                    onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    placeholder="658000"
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                </Field>
                <Field label="Giá gốc (₫)" hint="Để trống nếu không sale">
                  <input type="number" min={0} step={1000} value={editing.originalPrice ?? ''}
                    onChange={e => setEditing({ ...editing, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="828000"
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                </Field>
                <Field label="Số lượng tồn kho">
                  <input type="number" min={0} value={editing.inStock ?? ''}
                    onChange={e => setEditing({ ...editing, inStock: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="50"
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                </Field>
              </FormSection>

              {/* SECTION 4 — Hình ảnh */}
              <FormSection
                step={4}
                title="Hình ảnh"
                desc="Tải ảnh trực tiếp từ máy hoặc nhập URL. Ảnh hover là ảnh model đeo sản phẩm — sẽ hiện khi khách di chuột vào thẻ."
                fullWidth
              >
                <div className="md:col-span-3 grid sm:grid-cols-2 gap-5">
                  <ImageInput
                    label="Ảnh sản phẩm chính"
                    value={editing.image}
                    onChange={(v) => setEditing({ ...editing, image: v })}
                    hint="Ảnh flat, nền trắng/xám"
                  />
                  <ImageInput
                    label="Ảnh hover (model đeo)"
                    value={editing.imageHover}
                    onChange={(v) => setEditing({ ...editing, imageHover: v })}
                    hint="Tuỳ chọn — ảnh lifestyle/người mẫu"
                  />
                </div>

                {/* Color picker — kept for placeholder fallback */}
                <details className="md:col-span-3 mt-2 group">
                  <summary className="cursor-pointer text-xs text-mute hover:text-brand-500 select-none flex items-center gap-1.5">
                    <ChevronDown size={12} className="transition-transform group-open:rotate-180" />
                    Tùy chỉnh màu nền placeholder (khi chưa có ảnh)
                  </summary>
                  <div className="grid grid-cols-3 gap-3 mt-3 pl-4">
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
                  </div>
                </details>
              </FormSection>

              {/* SECTION 5 — Nội dung & SEO */}
              <FormSection
                step={5}
                title="Nội dung & SEO"
                desc="Viết nội dung chi tiết cho trang sản phẩm, tối ưu từ khoá và meta SEO"
                fullWidth
              >
                <Field label="Mô tả sản phẩm" className="md:col-span-3"
                  hint="Mô tả ngắn 2-3 câu nhấn vào điểm nổi bật (~150 ký tự)">
                  <textarea value={editing.description ?? ''} rows={3}
                    onChange={e => setEditing({ ...editing, description: e.target.value || undefined })}
                    placeholder="Ví dụ: Vòng tay hợp kim mạ bạc tinh xảo, charm nơ hồng dễ thương, phù hợp mọi outfit."
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none" />
                </Field>
                <Field label="Nội dung chi tiết / bài SEO" className="md:col-span-3"
                  hint="Viết nhiều đoạn về cảm hứng thiết kế, chất liệu, dịp phối đồ và lý do nên mua">
                  <textarea value={editing.longDescription ?? ''} rows={8}
                    onChange={e => setEditing({ ...editing, longDescription: e.target.value || undefined })}
                    placeholder={'Gợi ý:\n- Giới thiệu sản phẩm và phong cách thiết kế\n- Ai phù hợp đeo mẫu này\n- Chất liệu, độ bóng, cảm giác khi đeo\n- Gợi ý phối đồ hoặc làm quà tặng'}
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-brand-500 resize-y" />
                </Field>
                <Field label="Điểm nổi bật" className="md:col-span-3"
                  hint="Mỗi dòng là một ý, sẽ hiển thị dạng bullet trên trang sản phẩm">
                  <textarea value={(editing.highlights || []).join('\n')} rows={5}
                    onChange={e => setEditing({ ...editing, highlights: splitLines(e.target.value) })}
                    placeholder={'Thiết kế thanh mảnh, dễ phối đồ\nMàu bạc sáng, hợp nhiều tone da\nPhù hợp làm quà tặng sinh nhật, kỷ niệm'}
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-y" />
                </Field>
                <Field label="Chất liệu" className="md:col-span-3"
                  hint="VD: Hợp kim xi mạ bạc cao cấp · Charm resin pha lê cao cấp">
                  <input value={editing.material ?? ''}
                    onChange={e => setEditing({ ...editing, material: e.target.value || undefined })}
                    placeholder="Hợp kim mạ bạc · Charm silicone / resin / đá tổng hợp..."
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                </Field>
                <Field label="Thông số sản phẩm" className="md:col-span-3"
                  hint="Mỗi dòng theo dạng: Tên thông số: Giá trị. Ví dụ: Size: Freesize">
                  <textarea value={specsToText(editing.specifications)} rows={5}
                    onChange={e => setEditing({ ...editing, specifications: parseSpecs(e.target.value) })}
                    placeholder={'Chất liệu: Hợp kim mạ bạc cao cấp\nMàu sắc: Bạc sáng\nPhong cách: Thanh lịch, nữ tính\nPhù hợp: Đi hằng ngày, dự tiệc, làm quà tặng'}
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-y" />
                </Field>
                <Field label="Hướng dẫn bảo quản riêng" className="md:col-span-3"
                  hint="Nếu bỏ trống, trang sẽ dùng nội dung bảo quản mặc định">
                  <textarea value={editing.careInstructions ?? ''} rows={4}
                    onChange={e => setEditing({ ...editing, careInstructions: e.target.value || undefined })}
                    placeholder="Tránh tiếp xúc với nước hoa, hồ bơi, chất tẩy rửa. Lau nhẹ bằng khăn mềm sau khi sử dụng..."
                    className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-y" />
                </Field>
                <div className="md:col-span-3 grid md:grid-cols-2 gap-4 border-t border-rule pt-5">
                  <Field label="SEO title"
                    hint={`Nên 50-60 ký tự. Hiện tại: ${(editing.seoTitle || '').length}`}>
                    <input value={editing.seoTitle ?? ''}
                      onChange={e => setEditing({ ...editing, seoTitle: e.target.value || undefined })}
                      placeholder={`${editing.name || 'Tên sản phẩm'} | LIORA Jewelry`}
                      className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                  </Field>
                  <Field label="Canonical slug"
                    hint="Tuỳ chọn, dùng khi muốn khai báo URL chuẩn riêng">
                    <input value={editing.canonicalSlug ?? ''}
                      onChange={e => setEditing({ ...editing, canonicalSlug: e.target.value || undefined })}
                      placeholder={`/san-pham/${editing.slug || 'slug-san-pham'}`}
                      className="w-full border border-rule rounded-md px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-brand-500" />
                  </Field>
                  <Field label="Meta description" className="md:col-span-2"
                    hint={`Nên 140-160 ký tự. Hiện tại: ${(editing.seoDescription || '').length}`}>
                    <textarea value={editing.seoDescription ?? ''} rows={3}
                      onChange={e => setEditing({ ...editing, seoDescription: e.target.value || undefined })}
                      placeholder="Viết 1-2 câu thuyết phục chứa từ khoá chính, chất liệu và lợi ích nổi bật..."
                      className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none" />
                  </Field>
                  <Field label="Từ khoá SEO" className="md:col-span-2"
                    hint="Phân tách bằng dấu phẩy, ví dụ: vòng tay bạc nữ, lắc tay charm">
                    <input value={editing.seoKeywords ?? ''}
                      onChange={e => setEditing({ ...editing, seoKeywords: e.target.value || undefined })}
                      placeholder="vòng tay bạc nữ, lắc tay charm, trang sức LIORA"
                      className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
                  </Field>
                </div>
              </FormSection>

              {/* SECTION 6 — Trạng thái */}
              <FormSection
                step={6}
                title="Trạng thái hiển thị"
                desc="Tag nổi bật trên thẻ sản phẩm"
                fullWidth
              >
                <div className="md:col-span-3 flex flex-wrap gap-3">
                  <ToggleChip
                    checked={!!editing.hot}
                    onChange={(c) => setEditing({ ...editing, hot: c })}
                    label="HOT — Sản phẩm nổi bật"
                  />
                  <ToggleChip
                    checked={!!editing.sold}
                    onChange={(c) => setEditing({ ...editing, sold: c })}
                    label="Hết hàng (tạm ẩn nút mua)"
                    color="red"
                  />
                </div>
              </FormSection>

            </div>

            <footer className="flex items-center justify-between gap-2 p-5 border-t border-rule sticky bottom-0 bg-white">
              <span className="text-xs text-mute hidden sm:inline">* Bắt buộc</span>
              <div className="flex gap-2 ml-auto">
                <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-rule text-ink2 hover:bg-soft">Hủy</button>
                <button onClick={save} className="px-6 py-2.5 rounded-md text-sm font-semibold bg-brand-700 text-white hover:bg-brand-800">
                  {products.find(p => p.slug === editing.slug) ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
              </div>
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

function Field({
  label, required, className, hint, children,
}: { label: string; required?: boolean; className?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-ink2 mb-1.5">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <div className="text-[11px] text-mute mt-1">{hint}</div>}
    </div>
  );
}

function FormSection({
  step, title, desc, children, fullWidth,
}: { step: number; title: string; desc?: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <section className="border border-rule rounded-lg p-4 md:p-5">
      <header className="flex items-start gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
        <div>
          <h4 className="font-semibold text-brand-700 text-sm md:text-base">{title}</h4>
          {desc && <p className="text-xs text-mute mt-0.5">{desc}</p>}
        </div>
      </header>
      <div className={fullWidth ? 'space-y-4' : 'grid md:grid-cols-3 gap-4'}>
        {children}
      </div>
    </section>
  );
}

function ToggleChip({
  checked, onChange, label, color = 'brand',
}: { checked: boolean; onChange: (c: boolean) => void; label: string; color?: 'brand' | 'red' }) {
  const onCls = color === 'red' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-brand-50 border-brand-500 text-brand-700';
  return (
    <label className={`flex items-center gap-2.5 border rounded-md px-4 py-2.5 cursor-pointer transition-colors text-sm font-medium ${
      checked ? onCls : 'border-rule text-ink2 hover:border-brand-400'
    }`}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className={color === 'red' ? 'accent-red-500 w-4 h-4' : 'accent-brand-700 w-4 h-4'} />
      {label}
    </label>
  );
}

function ImageInput({
  label, value, onChange, hint,
}: { label: string; value: string | undefined; onChange: (v: string | undefined) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [error, setError] = useState('');

  const handleFile = (file: File | undefined) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('File phải là hình ảnh.'); return; }
    const maxBytes = 800 * 1024; // 800 KB
    if (file.size > maxBytes) {
      setError(`Ảnh quá lớn (${(file.size / 1024).toFixed(0)} KB). Tối đa 800 KB — hãy nén/resize trước khi tải lên.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === 'string' ? reader.result : undefined);
    reader.onerror = () => setError('Đọc file thất bại.');
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-ink2">{label}</label>
        <div className="flex text-[10px] border border-rule rounded overflow-hidden">
          <button type="button" onClick={() => setMode('upload')}
            className={`px-2 py-0.5 ${mode === 'upload' ? 'bg-brand-700 text-white' : 'bg-white text-mute hover:text-brand-700'}`}>Tải lên</button>
          <button type="button" onClick={() => setMode('url')}
            className={`px-2 py-0.5 ${mode === 'url' ? 'bg-brand-700 text-white' : 'bg-white text-mute hover:text-brand-700'}`}>URL</button>
        </div>
      </div>

      {value ? (
        <div className="relative group border border-rule rounded-md overflow-hidden bg-soft">
          <img src={value} alt={label} className="w-full aspect-square object-cover" />
          <button type="button" onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 shadow text-red-500 hover:bg-red-50 flex items-center justify-center"
            aria-label="Xóa ảnh">
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ) : mode === 'upload' ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed border-rule hover:border-brand-500 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer text-center px-3 transition-colors bg-soft hover:bg-brand-50/40"
        >
          <Upload size={28} strokeWidth={1.4} className="text-mute mb-2" />
          <div className="text-xs font-medium text-ink">Bấm để chọn ảnh</div>
          <div className="text-[10px] text-mute mt-0.5">hoặc kéo thả vào đây · &lt;800KB</div>
        </div>
      ) : (
        <input value={value || ''}
          onChange={e => onChange(e.target.value || undefined)}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-rule rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])} />

      {hint && !error && <div className="text-[11px] text-mute mt-1">{hint}</div>}
      {error && <div className="text-[11px] text-red-500 mt-1">{error}</div>}
    </div>
  );
}
