import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

type Aspect = 'square' | '4/5' | 'video';

const ASPECT_CLS: Record<Aspect, string> = {
  square: 'aspect-square',
  '4/5': 'aspect-[4/5]',
  video: 'aspect-video',
};

/** Dung lượng tối đa cho 1 ảnh tải lên (byte). 500KB để giảm rủi ro tràn localStorage (~5MB). */
const MAX_BYTES = 500 * 1024;
/** Ngưỡng cảnh báo ảnh base64 lớn (byte). */
const WARN_BYTES = 400 * 1024;

interface Props {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  hint?: string;
  aspect?: Aspect;
  /** Cảnh báo khi ảnh base64 lớn (mặc định bật). */
  warnOnBase64?: boolean;
}

/**
 * Ô nhập ảnh 2 chế độ: Tải lên từ máy (drag/drop + chọn file) hoặc Dán URL.
 * Ảnh từ máy được đọc thành data URL (base64) và lưu cùng dữ liệu trong localStorage.
 */
export default function ImageInput({
  label, value, onChange, hint, aspect = 'square', warnOnBase64 = true,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [error, setError] = useState('');

  const handleFile = (file: File | undefined) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('File phải là hình ảnh.'); return; }
    if (file.size > MAX_BYTES) {
      setError(`Ảnh quá lớn (${(file.size / 1024).toFixed(0)} KB). Tối đa 500 KB — hãy nén/resize ảnh trước khi tải lên.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === 'string' ? reader.result : undefined);
    reader.onerror = () => setError('Đọc file thất bại.');
    reader.readAsDataURL(file);
  };

  const isBase64 = !!value && value.startsWith('data:');
  const base64Bytes = isBase64 ? Math.round((value!.length * 3) / 4) : 0;
  const showSizeWarn = warnOnBase64 && isBase64 && base64Bytes > WARN_BYTES;

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
          <img src={value} alt={label} className={`w-full ${ASPECT_CLS[aspect]} object-cover`} />
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
          className={`border-2 border-dashed border-rule hover:border-brand-500 rounded-md ${ASPECT_CLS[aspect]} flex flex-col items-center justify-center cursor-pointer text-center px-3 transition-colors bg-soft hover:bg-brand-50/40`}
        >
          <Upload size={28} strokeWidth={1.4} className="text-mute mb-2" />
          <div className="text-xs font-medium text-ink">Bấm để chọn ảnh</div>
          <div className="text-[10px] text-mute mt-0.5">hoặc kéo thả vào đây · &lt;500KB</div>
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
      {showSizeWarn && !error && (
        <div className="text-[11px] text-amber-600 mt-1">
          Ảnh lớn (~{(base64Bytes / 1024).toFixed(0)} KB). Nên nén xuống &lt;500KB để tránh đầy bộ nhớ trình duyệt.
        </div>
      )}
    </div>
  );
}