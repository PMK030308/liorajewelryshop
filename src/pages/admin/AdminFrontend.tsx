import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown, ChevronRight, ChevronUp, GripVertical,
  Image, LayoutList, Menu, Minus, Plus, RefreshCw, Save, Trash2, Wand2, X,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useStore } from '../../store/useStore';
import { DEFAULT_FOOTER, DEFAULT_SITE_CONTENT } from '../../data';
import { removeImageBackground } from '../../utils/removeBackground';
import { CategoryTile, FooterContent, FooterLink, NavCategory, NavSubItem, SiteContent } from '../../types';
import ImageInput from '../../components/admin/ImageInput';
import { PageHeader, inputCls, labelCls } from '../../components/admin/ui';

type Tab = 'hero' | 'tiles' | 'nav' | 'shop' | 'footer';

const DEFAULT_NAV: NavCategory[] = [
  { id: 'n1', label: 'Tất Cả Sản Phẩm', slug: 'all' },
  { id: 'n2', label: 'Bộ Sưu Tập (BST)', slug: 'bst', sub: [
    { label: 'Hành Trình Nở Hoa', slug: 'bst-hanh-trinh' },
    { label: 'Xuân Hạ Thu Đông', slug: 'bst-xuan-ha-thu-dong' },
  ]},
  { id: 'n3', label: 'Phụ Kiện DIY', slug: 'diy', sub: [
    { label: 'Charm Titan', slug: 'charm-titan' },
    { label: 'Charm Đá Năng Lượng', slug: 'charm-da' },
    { label: 'Dây Vòng', slug: 'day-vong' },
    { label: 'Phụ Kiện Khác', slug: 'phu-kien-khac' },
  ]},
  { id: 'n4', label: 'Vòng Tay Đơn', slug: 'vong-tay', sub: [
    { label: 'Vòng Tay Đá Năng Lượng', slug: 'vong-tay-da' },
    { label: 'Vòng Tay Charm', slug: 'vong-tay-charm' },
  ]},
];

const DEFAULT_TILES: CategoryTile[] = [
  { id: 't1', title: 'Bộ Sưu Tập', slug: 'bst',      img: '/product/BST _HÀNH TRÌNH NỞ HOA_ - CHẠM_Vòng tay hợp kim mạ bạc.jpg' },
  { id: 't2', title: 'Vòng Tay Đơn', slug: 'vong-tay', img: '/product/Vòng tay hợp kim mạ bạc - Charm Nơ Hồng.png' },
  { id: 't3', title: 'Phụ Kiện DIY', slug: 'diy',      img: '/product/Vòng trơn hợp kim mạ bạc.png' },
  { id: 't4', title: 'BST Xuân Hạ Thu Đông', slug: 'bst-xuan-ha-thu-dong', img: '/product/BST _XUÂN HẠ THU ĐÔNG_ - RỰC_Vòng tay hợp kim mạ bạc.jpg' },
];

const DEFAULT_QUICK: string[] = ['all', 'bst', 'diy', 'vong-tay'];

function uid() { return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

/* ─── Section: Hero Slides ─── */
function HeroTab({ draft, setDraft }: { draft: SiteContent; setDraft: React.Dispatch<React.SetStateAction<SiteContent>> }) {
  const update = (i: number, patch: object) =>
    setDraft(d => ({ ...d, heroSlides: d.heroSlides.map((s, idx) => idx === i ? { ...s, ...patch } : s) }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-brand-700 text-lg">Hero / Banner trang chủ</h2>
        <button
          onClick={() => setDraft(d => ({ ...d, heroSlides: [...d.heroSlides, { plaque: 'Tiêu đề mới', script: 'Slogan mới', tint: '#fff7f9' }] }))}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800"
        >
          <Plus size={15} /> Thêm slide
        </button>
      </div>
      {draft.heroSlides.map((slide, i) => (
        <div key={i} className="border border-rule rounded-xl p-4 grid lg:grid-cols-[180px_1fr] gap-4">
          <ImageInput
            label="Ảnh slide"
            value={slide.image}
            onChange={v => update(i, { image: v })}
            aspect="4/5"
            hint="Tải lên từ máy hoặc dán link"
          />
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Tiêu đề banner (xuống dòng bằng \n)</label>
              <textarea value={slide.plaque} onChange={e => update(i, { plaque: e.target.value })} rows={3} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Slogan</label>
                <input value={slide.script ?? ''} onChange={e => update(i, { script: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Màu nền</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={slide.tint} onChange={e => update(i, { tint: e.target.value })}
                    className="h-10 w-14 rounded-lg border border-rule flex-shrink-0 cursor-pointer" />
                  <input value={slide.tint} onChange={e => update(i, { tint: e.target.value })} className={`${inputCls} font-mono`} />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setDraft(d => ({ ...d, heroSlides: d.heroSlides.filter((_, idx) => idx !== i) }))}
                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold"
              >
                <Trash2 size={13} /> Xóa slide này
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Section: Category Tiles ─── */
function TilesTab({ draft, setDraft }: { draft: SiteContent; setDraft: React.Dispatch<React.SetStateAction<SiteContent>> }) {
  const tiles = draft.categoryTiles ?? DEFAULT_TILES;
  const set = (newTiles: CategoryTile[]) => setDraft(d => ({ ...d, categoryTiles: newTiles }));
  const update = (id: string, patch: Partial<CategoryTile>) =>
    set(tiles.map(t => t.id === id ? { ...t, ...patch } : t));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-brand-700 text-lg">Ô danh mục trang chủ</h2>
          <p className="text-xs text-mute">Các ô ảnh hiển thị phía dưới hero slider (tối đa 4)</p>
        </div>
        {tiles.length < 6 && (
          <button
            onClick={() => set([...tiles, { id: uid(), title: 'Danh mục mới', slug: 'all', img: '' }])}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800"
          >
            <Plus size={15} /> Thêm ô
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {tiles.map(t => (
          <div key={t.id} className="border border-rule rounded-xl overflow-hidden">
            <div className="h-36 bg-soft relative">
              {t.img
                ? <img src={t.img} alt={t.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity='0'; }} />
                : <div className="w-full h-full flex items-center justify-center text-mute"><Image size={28} strokeWidth={1.2} /></div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-white font-bold text-base drop-shadow">{t.title}</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Tên hiển thị</label>
                  <input value={t.title} onChange={e => update(t.id, { title: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug danh mục</label>
                  <input value={t.slug} onChange={e => update(t.id, { slug: e.target.value })} className={inputCls} placeholder="bst / diy / vong-tay" />
                </div>
              </div>
              <div>
                <ImageInput
                  label="Ảnh danh mục"
                  value={t.img}
                  onChange={v => update(t.id, { img: v })}
                  aspect="video"
                  hint="Ảnh ngang, hiển thị làm nền ô danh mục"
                />
              </div>
              <div className="flex justify-end">
                <button onClick={() => set(tiles.filter(x => x.id !== t.id))}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold">
                  <Trash2 size={13} /> Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section: Nav Categories ─── */
function NavTab({ draft, setDraft }: { draft: SiteContent; setDraft: React.Dispatch<React.SetStateAction<SiteContent>> }) {
  const cats = draft.navCategories ?? DEFAULT_NAV;
  const set = (v: NavCategory[]) => setDraft(d => ({ ...d, navCategories: v }));
  const [expanded, setExpanded] = useState<string | null>(cats[0]?.id ?? null);

  const addCat = () => {
    const c: NavCategory = { id: uid(), label: 'Mục mới', slug: 'muc-moi' };
    set([...cats, c]);
    setExpanded(c.id);
  };

  const delCat = (id: string) => set(cats.filter(c => c.id !== id));

  const updateCat = (id: string, patch: Partial<NavCategory>) =>
    set(cats.map(c => c.id === id ? { ...c, ...patch } : c));

  const addSub = (catId: string) => {
    set(cats.map(c => c.id === catId
      ? { ...c, sub: [...(c.sub ?? []), { label: 'Sub mới', slug: 'sub-moi' }] }
      : c));
  };

  const delSub = (catId: string, idx: number) =>
    set(cats.map(c => c.id === catId ? { ...c, sub: (c.sub ?? []).filter((_, i) => i !== idx) } : c));

  const updateSub = (catId: string, idx: number, patch: Partial<NavSubItem>) =>
    set(cats.map(c => c.id === catId
      ? { ...c, sub: (c.sub ?? []).map((s, i) => i === idx ? { ...s, ...patch } : s) }
      : c));

  const moveUp = (i: number) => { if (i === 0) return; const a = [...cats]; [a[i-1], a[i]] = [a[i], a[i-1]]; set(a); };
  const moveDown = (i: number) => { if (i === cats.length-1) return; const a = [...cats]; [a[i], a[i+1]] = [a[i+1], a[i]]; set(a); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-brand-700 text-lg">Combo box menu "Sản phẩm"</h2>
          <p className="text-xs text-mute">Cấu hình danh sách và sub-menu xuất hiện khi hover vào "Sản phẩm" trên nav</p>
        </div>
        <button onClick={addCat}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800">
          <Plus size={15} /> Thêm mục
        </button>
      </div>

      <div className="space-y-2">
        {cats.map((cat, i) => (
          <div key={cat.id} className="border border-rule rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-brand-50/60">
              <div className="flex flex-col gap-0.5 mr-1">
                <button onClick={() => moveUp(i)} disabled={i===0} className="text-mute hover:text-brand-700 disabled:opacity-30"><ChevronUp size={14}/></button>
                <button onClick={() => moveDown(i)} disabled={i===cats.length-1} className="text-mute hover:text-brand-700 disabled:opacity-30"><ChevronDown size={14}/></button>
              </div>
              <GripVertical size={14} className="text-mute flex-shrink-0" />
              <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                className="flex-1 flex items-center gap-2 text-left font-semibold text-sm text-brand-700">
                {cat.label}
                {cat.sub && cat.sub.length > 0 && (
                  <span className="text-[10px] bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded font-normal">{cat.sub.length} sub</span>
                )}
                {expanded === cat.id ? <ChevronDown size={14} className="ml-auto text-mute"/> : <ChevronRight size={14} className="ml-auto text-mute"/>}
              </button>
              <button onClick={() => delCat(cat.id)} className="text-red-400 hover:text-red-600 ml-1"><X size={15}/></button>
            </div>

            {/* Body */}
            {expanded === cat.id && (
              <div className="p-4 space-y-4 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Tên hiển thị</label>
                    <input value={cat.label} onChange={e => updateCat(cat.id, { label: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Slug (bấm để lọc)</label>
                    <input value={cat.slug} onChange={e => updateCat(cat.id, { slug: e.target.value })} className={inputCls} placeholder="bst / diy / all" />
                  </div>
                </div>

                {/* Sub-items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelCls + ' mb-0'}>Sub-menu</label>
                    <button onClick={() => addSub(cat.id)}
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-semibold border border-brand-200 rounded px-2 py-1">
                      <Plus size={12}/> Thêm sub
                    </button>
                  </div>
                  {(cat.sub ?? []).length === 0 && (
                    <p className="text-xs text-mute italic">Không có sub-menu. Mục này sẽ click thẳng vào slug.</p>
                  )}
                  <div className="space-y-2">
                    {(cat.sub ?? []).map((s, j) => (
                      <div key={j} className="flex items-center gap-2 bg-brand-50/40 rounded-lg px-3 py-2">
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <input value={s.label} onChange={e => updateSub(cat.id, j, { label: e.target.value })}
                            className={inputCls} placeholder="Tên sub" />
                          <input value={s.slug} onChange={e => updateSub(cat.id, j, { slug: e.target.value })}
                            className={inputCls} placeholder="slug-sub" />
                        </div>
                        <button onClick={() => delSub(cat.id, j)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <Minus size={15}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section: Shop Quick Filters ─── */
function ShopTab({ draft, setDraft }: { draft: SiteContent; setDraft: React.Dispatch<React.SetStateAction<SiteContent>> }) {
  const filters = draft.shopQuickFilters ?? DEFAULT_QUICK;
  const set = (v: string[]) => setDraft(d => ({ ...d, shopQuickFilters: v }));
  const [newSlug, setNewSlug] = useState('');
  const cats = draft.navCategories ?? DEFAULT_NAV;

  const labelOf = (slug: string): string => {
    for (const c of cats) {
      if (c.slug === slug) return c.label;
      for (const s of c.sub ?? []) if (s.slug === slug) return s.label;
    }
    return slug === 'all' ? 'Tất Cả Sản Phẩm' : slug;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-brand-700 text-lg">Quick Filter chips trang Sản phẩm</h2>
        <p className="text-xs text-mute">Các nút lọc nhanh hiển thị trên thanh công cụ trang shop</p>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-brand-50 rounded-xl border border-brand-100 min-h-[64px]">
        {filters.map((slug, i) => (
          <div key={slug} className="inline-flex items-center gap-1.5 bg-white border border-rule rounded-full px-3 py-1.5 text-sm shadow-sm">
            <span className="font-medium text-ink">{labelOf(slug)}</span>
            <span className="text-[10px] text-mute font-mono">({slug})</span>
            <button onClick={() => set(filters.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-600 ml-1"><X size={13}/></button>
          </div>
        ))}
        {filters.length === 0 && <p className="text-sm text-mute italic">Chưa có filter nào. Thêm slug bên dưới.</p>}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelCls}>Thêm slug filter (vd: bst / diy / vong-tay / charm-titan)</label>
          <div className="flex gap-2">
            <input value={newSlug} onChange={e => setNewSlug(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newSlug.trim()) { set([...filters, newSlug.trim()]); setNewSlug(''); } }}
              className={inputCls} placeholder="Nhập slug rồi Enter hoặc bấm Thêm" />
            <button
              onClick={() => { if (!newSlug.trim()) return; set([...filters, newSlug.trim()]); setNewSlug(''); }}
              className="px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-semibold hover:bg-brand-800 flex-shrink-0"
            ><Plus size={16}/></button>
          </div>
        </div>
      </div>

      {/* Preset buttons from nav */}
      <div>
        <div className={labelCls}>Chọn nhanh từ danh mục đã cấu hình</div>
        <div className="flex flex-wrap gap-2">
          {cats.flatMap(c => [{ label: c.label, slug: c.slug }, ...(c.sub ?? [])]).map(item => (
            <button key={item.slug}
              onClick={() => { if (!filters.includes(item.slug)) set([...filters, item.slug]); }}
              disabled={filters.includes(item.slug)}
              className="text-xs px-3 py-1.5 rounded-full border border-rule hover:border-brand-400 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >{item.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section: Footer ─── */
function FooterLinksEditor({
  title, links, onChange,
}: {
  title: string;
  links: FooterLink[];
  onChange: (v: FooterLink[]) => void;
}) {
  const update = (i: number, patch: Partial<FooterLink>) =>
    onChange(links.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  const add = () => onChange([...links, { label: 'Liên kết mới' }]);
  const del = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const a = [...links];
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };

  return (
    <div className="border border-rule rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-brand-700 text-sm">{title}</h3>
        <button onClick={add}
          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-semibold border border-brand-200 rounded px-2 py-1">
          <Plus size={12}/> Thêm liên kết
        </button>
      </div>
      <div className="space-y-2">
        {links.map((l, i) => (
          <div key={i} className="flex items-center gap-2 bg-brand-50/40 rounded-lg px-3 py-2">
            <div className="flex flex-col gap-0.5 mr-0.5">
              <button onClick={() => move(i, -1)} disabled={i===0} className="text-mute hover:text-brand-700 disabled:opacity-30"><ChevronUp size={12}/></button>
              <button onClick={() => move(i, 1)} disabled={i===links.length-1} className="text-mute hover:text-brand-700 disabled:opacity-30"><ChevronDown size={12}/></button>
            </div>
            <input value={l.label} onChange={e => update(i, { label: e.target.value })}
              className={inputCls} placeholder="Tên hiển thị" />
            <input value={l.nav ?? ''} onChange={e => update(i, { nav: e.target.value })}
              className={inputCls} placeholder="Route nội bộ (/about) — bỏ trống nếu dùng href" />
            <input value={l.href ?? ''} onChange={e => update(i, { href: e.target.value })}
              className={inputCls} placeholder="href (url)" />
            <button onClick={() => del(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
              <Minus size={15}/>
            </button>
          </div>
        ))}
        {links.length === 0 && <p className="text-xs text-mute italic">Chưa có liên kết nào.</p>}
      </div>
    </div>
  );
}

function FooterTab({ draft, setDraft }: { draft: SiteContent; setDraft: React.Dispatch<React.SetStateAction<SiteContent>> }) {
  const { showToast } = useStore();
  const footer: FooterContent = { ...DEFAULT_FOOTER, ...(draft.footer ?? {}) };
  const set = (patch: Partial<FooterContent>) =>
    setDraft(d => ({ ...d, footer: { ...DEFAULT_FOOTER, ...(d.footer ?? {}), ...patch } }));
  const setSetting = (patch: Partial<SiteContent['settings']>) =>
    setDraft(d => ({ ...d, settings: { ...d.settings, ...patch } }));

  const [bgBusy, setBgBusy] = useState(false);
  const [bgErr, setBgErr] = useState('');
  const [tolerance, setTolerance] = useState(32);

  const onRemoveBg = async () => {
    setBgErr('');
    if (!footer.logo) { setBgErr('Chưa có ảnh logo để tách nền.'); return; }
    setBgBusy(true);
    try {
      const out = await removeImageBackground(footer.logo, tolerance);
      set({ logo: out });
      showToast('✅ Đã tách nền logo!');
    } catch (e: any) {
      setBgErr(e?.message || 'Tách nền thất bại.');
    } finally {
      setBgBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-brand-700 text-lg">Footer (Chân trang)</h2>
        <p className="text-xs text-mute">Chỉnh sửa toàn bộ chân trang: logo, liên hệ, các cột liên kết, đăng ký nhận tin và mạng xã hội.</p>
      </div>

      {/* Brand + contact */}
      <div className="border border-rule rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-brand-700 text-sm">Cột thương hiệu & Liên hệ</h3>
        <div className="grid md:grid-cols-[220px_1fr] gap-4">
          <div className="space-y-3">
            <ImageInput
              label="Logo footer"
              value={footer.logo}
              onChange={v => set({ logo: v ?? '' })}
              aspect="4/5"
              hint="Logo trắng trên nền hồng. Tải lên hoặc dán URL."
            />
            {/* Tách nền logo */}
            <div className="border border-rule rounded-lg p-3 bg-soft/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
                <Wand2 size={13} /> Tách nền logo
              </div>
              <p className="text-[11px] text-mute leading-relaxed">
                Xoá nền đồng nhất (trắng/hồng…) quanh logo, xuất PNG trong suốt. Tăng sai số nếu nền lệch màu nhiều.
              </p>
              <div>
                <div className="flex items-center justify-between text-[11px] text-mute mb-1">
                  <span>Sai số (độ nhạy)</span>
                  <span className="font-mono">{tolerance}</span>
                </div>
                <input type="range" min={8} max={80} value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="w-full accent-brand-500" />
              </div>
              <button onClick={onRemoveBg} disabled={bgBusy || !footer.logo}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 disabled:opacity-50">
                <Wand2 size={13}/> {bgBusy ? 'Đang xử lý…' : 'Tách nền'}
              </button>
              {bgErr && <p className="text-[11px] text-red-500">{bgErr}</p>}
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Mô tả ngắn dưới logo</label>
              <textarea value={footer.brandDescription} onChange={e => set({ brandDescription: e.target.value })}
                rows={3} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Địa chỉ</label>
                <input value={draft.settings.address} onChange={e => setSetting({ address: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Điện thoại</label>
                <input value={draft.settings.hotline} onChange={e => setSetting({ hotline: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input value={draft.settings.email} onChange={e => setSetting({ email: e.target.value })} className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="grid md:grid-cols-2 gap-4">
        <FooterLinksEditor title="Cột Chính sách" links={footer.policyLinks} onChange={v => set({ policyLinks: v })} />
        <FooterLinksEditor title="Cột Hỗ trợ" links={footer.supportLinks} onChange={v => set({ supportLinks: v })} />
      </div>

      {/* Newsletter + social + copyright */}
      <div className="border border-rule rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-brand-700 text-sm">Đăng ký nhận tin & Mạng xã hội</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Tiêu đề khối đăng ký</label>
            <input value={footer.newsletterTitle} onChange={e => set({ newsletterTitle: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mô tả đăng ký</label>
            <input value={footer.newsletterText} onChange={e => set({ newsletterText: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Link Facebook (để trống để ẩn)</label>
            <input value={footer.facebookUrl} onChange={e => set({ facebookUrl: e.target.value })} className={inputCls} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className={labelCls}>Link TikTok (để trống để ẩn)</label>
            <input value={footer.tiktokUrl} onChange={e => set({ tiktokUrl: e.target.value })} className={inputCls} placeholder="https://tiktok.com/..." />
          </div>
        </div>
        <div>
          <label className={labelCls}>Dòng bản quyền</label>
          <input value={footer.copyright} onChange={e => set({ copyright: e.target.value })} className={inputCls} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main AdminFrontend ─── */
export default function AdminFrontend() {
  const { state, dispatch, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [draft, setDraft] = useState<SiteContent>(() => ({
    ...state.siteContent,
    navCategories: state.siteContent.navCategories ?? DEFAULT_NAV,
    categoryTiles: state.siteContent.categoryTiles ?? DEFAULT_TILES,
    shopQuickFilters: state.siteContent.shopQuickFilters ?? DEFAULT_QUICK,
  }));

  useEffect(() => {
    setDraft(sc => ({
      ...state.siteContent,
      navCategories: sc.navCategories,
      categoryTiles: sc.categoryTiles,
      shopQuickFilters: sc.shopQuickFilters,
    }));
  }, [state.siteContent]);

  const savedSnapshot = useMemo(() => ({
    ...state.siteContent,
    navCategories: state.siteContent.navCategories ?? DEFAULT_NAV,
    categoryTiles: state.siteContent.categoryTiles ?? DEFAULT_TILES,
    shopQuickFilters: state.siteContent.shopQuickFilters ?? DEFAULT_QUICK,
  }), [state.siteContent]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(savedSnapshot);

  const save = () => {
    dispatch({ type: 'SET_SITE_CONTENT', payload: draft });
    showToast('✅ Đã lưu cấu hình giao diện!');
  };

  const reset = () => {
    if (dirty && !confirm('Khôi phục mặc định sẽ mất các thay đổi hiện tại. Tiếp tục?')) return;
    const clean: SiteContent = {
      ...DEFAULT_SITE_CONTENT,
      navCategories: DEFAULT_NAV,
      categoryTiles: DEFAULT_TILES,
      shopQuickFilters: DEFAULT_QUICK,
    };
    setDraft(clean);
    dispatch({ type: 'SET_SITE_CONTENT', payload: clean });
    showToast('Đã khôi phục mặc định');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'hero',  label: 'Hero / Banner',        icon: <Image size={16}/> },
    { key: 'tiles', label: 'Ô danh mục (Trang chủ)', icon: <LayoutList size={16}/> },
    { key: 'nav',   label: 'Combo box Menu',        icon: <Menu size={16}/> },
    { key: 'shop',  label: 'Filter chip (Shop)',    icon: <ChevronDown size={16}/> },
    { key: 'footer', label: 'Footer (Chân trang)',  icon: <LayoutList size={16}/> },
  ];

  return (
    <AdminLayout active="frontend" dirty={dirty}>
      <PageHeader
        title="Tùy chỉnh giao diện"
        subtitle="Chỉnh sửa trang chủ, menu điều hướng và bộ lọc sản phẩm."
        dirty={dirty}
        actions={
          <>
            <button onClick={reset}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rule text-sm font-semibold hover:bg-soft">
              <RefreshCw size={15}/> Khôi phục mặc định
            </button>
            <button onClick={save}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800">
              <Save size={15}/> Lưu thay đổi
            </button>
          </>
        }
      />

      <div className="grid lg:grid-cols-[220px_1fr] gap-5">
        {/* Sidebar tabs */}
        <aside className="bg-white border border-rule rounded-xl p-2 h-max">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors mb-0.5 ${
                activeTab === t.key ? 'bg-brand-700 text-white' : 'text-ink2 hover:bg-brand-50 hover:text-brand-700'
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <section className="bg-white border border-rule rounded-xl p-5 min-w-0">
          {activeTab === 'hero'  && <HeroTab  draft={draft} setDraft={setDraft} />}
          {activeTab === 'tiles' && <TilesTab draft={draft} setDraft={setDraft} />}
          {activeTab === 'nav'   && <NavTab   draft={draft} setDraft={setDraft} />}
          {activeTab === 'shop'  && <ShopTab  draft={draft} setDraft={setDraft} />}
          {activeTab === 'footer' && <FooterTab draft={draft} setDraft={setDraft} />}
        </section>
      </div>
    </AdminLayout>
  );
}
