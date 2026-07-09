import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AboutContent, AboutStat, AboutStoryBlock, AboutValue, ShapeKey, SiteContent } from '../../types';
import { DEFAULT_ABOUT } from '../../data';
import ImageInput from '../../components/admin/ImageInput';
import { inputCls, labelCls } from '../../components/admin/ui';

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const SHAPE_OPTIONS: ShapeKey[] = ['gem', 'sparkle', 'flower', 'heart', 'star', 'bow', 'butterfly', 'clover', 'bracelet', 'snow'];

interface Props {
  draft: SiteContent;
  updateAbout: (patch: Partial<AboutContent>) => void;
}

export default function AboutEditor({ draft, updateAbout }: Props) {
  const a: AboutContent = draft.about ?? DEFAULT_ABOUT;

  // ---- Story blocks ----
  const addStory = () => {
    const block: AboutStoryBlock = { id: uid('story'), title: 'Tiêu đề khối', text: 'Mô tả cho khối câu chuyện.' };
    updateAbout({ story: [...a.story, block] });
  };
  const updateStory = (id: string, patch: Partial<AboutStoryBlock>) =>
    updateAbout({ story: a.story.map(s => (s.id === id ? { ...s, ...patch } : s)) });
  const removeStory = (id: string) => updateAbout({ story: a.story.filter(s => s.id !== id) });

  // ---- Stats ----
  const addStat = () => {
    const stat: AboutStat = { value: '0+', label: 'Nhãn' };
    updateAbout({ stats: [...a.stats, stat] });
  };
  const updateStat = (index: number, patch: Partial<AboutStat>) =>
    updateAbout({ stats: a.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)) });
  const removeStat = (index: number) => updateAbout({ stats: a.stats.filter((_, i) => i !== index) });

  // ---- Values ----
  const addValue = () => {
    const v: AboutValue = { id: uid('val'), icon: 'gem', title: 'Giá trị mới', text: 'Mô tả giá trị.' };
    updateAbout({ values: [...a.values, v] });
  };
  const updateValue = (id: string, patch: Partial<AboutValue>) =>
    updateAbout({ values: a.values.map(v => (v.id === id ? { ...v, ...patch } : v)) });
  const removeValue = (id: string) => updateAbout({ values: a.values.filter(v => v.id !== id) });

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-bold text-brand-700">Trang Giới thiệu</h2>
        <p className="text-xs text-mute mt-1">Nội dung hiển thị ở trang /about. Hỗ trợ ảnh tải lên và HTML cho các đoạn văn.</p>
      </div>

      {/* Tiêu đề + tagline + ảnh hero */}
      <div className="border border-rule rounded-lg p-4 grid md:grid-cols-[200px_1fr] gap-4">
        <ImageInput
          label="Ảnh chính"
          value={a.heroImage}
          onChange={v => updateAbout({ heroImage: v })}
          aspect="4/5"
          hint="Ảnh đầu trang, nền sáng"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tiêu đề trang</label>
            <input value={a.title} onChange={e => updateAbout({ title: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tagline</label>
            <input value={a.tagline} onChange={e => updateAbout({ tagline: e.target.value })} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Đoạn mở đầu (HTML)</label>
            <textarea value={a.intro} onChange={e => updateAbout({ intro: e.target.value })} rows={5} className={`${inputCls} font-mono`} />
            <p className="text-[11px] text-mute mt-1">Hỗ trợ thẻ p, strong, em.</p>
          </div>
        </div>
      </div>

      {/* Dải con số thống kê */}
      <div className="border border-rule rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-brand-700">Con số thống kê</h3>
          <button onClick={addStat} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Thêm con số">
            <Plus size={16} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {a.stats.map((s, i) => (
            <div key={i} className="border border-rule rounded-lg p-3 relative">
              <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-600" title="Xoá">
                <Trash2 size={14} />
              </button>
              <label className={labelCls}>Giá trị</label>
              <input value={s.value} onChange={e => updateStat(i, { value: e.target.value })} className={inputCls} />
              <label className={`${labelCls} mt-2`}>Nhãn</label>
              <input value={s.label} onChange={e => updateStat(i, { label: e.target.value })} className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* Khối câu chuyện */}
      <div className="border border-rule rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-brand-700">Khối câu chuyện thương hiệu</h3>
          <button onClick={addStory} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Thêm khối">
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {a.story.map(block => (
            <div key={block.id} className="border border-rule rounded-lg p-3 grid md:grid-cols-[160px_1fr] gap-3">
              <ImageInput
                label="Ảnh khối"
                value={block.image}
                onChange={v => updateStory(block.id, { image: v })}
                aspect="4/5"
              />
              <div className="space-y-3 relative">
                <button onClick={() => removeStory(block.id)} className="absolute top-0 right-0 text-red-500 hover:text-red-600" title="Xoá">
                  <Trash2 size={14} />
                </button>
                <div>
                  <label className={labelCls}>Tiêu đề khối</label>
                  <input value={block.title || ''} onChange={e => updateStory(block.id, { title: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mô tả</label>
                  <textarea value={block.text} onChange={e => updateStory(block.id, { text: e.target.value })} rows={3} className={inputCls} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sứ mệnh */}
      <div className="border border-rule rounded-lg p-4">
        <label className={labelCls}>Sứ mệnh (HTML)</label>
        <textarea value={a.mission} onChange={e => updateAbout({ mission: e.target.value })} rows={5} className={`${inputCls} font-mono`} />
      </div>

      {/* Giá trị cốt lõi */}
      <div className="border border-rule rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-brand-700">Giá trị cốt lõi</h3>
          <button onClick={addValue} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Thêm giá trị">
            <Plus size={16} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {a.values.map(v => (
            <div key={v.id} className="border border-rule rounded-lg p-3 relative space-y-2">
              <button onClick={() => removeValue(v.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-600" title="Xoá">
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Icon</label>
                  <select value={v.icon} onChange={e => updateValue(v.id, { icon: e.target.value as ShapeKey })} className={inputCls}>
                    {SHAPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tiêu đề</label>
                  <input value={v.title} onChange={e => updateValue(v.id, { title: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Mô tả</label>
                <textarea value={v.text} onChange={e => updateValue(v.id, { text: e.target.value })} rows={2} className={inputCls} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lời kêu gọi */}
      <div className="border border-rule rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-brand-700">Lời kêu gọi hành động</h3>
        <div>
          <label className={labelCls}>Tiêu đề</label>
          <input value={a.ctaTitle} onChange={e => updateAbout({ ctaTitle: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Mô tả</label>
          <textarea value={a.ctaText} onChange={e => updateAbout({ ctaText: e.target.value })} rows={2} className={inputCls} />
        </div>
      </div>
    </div>
  );
}