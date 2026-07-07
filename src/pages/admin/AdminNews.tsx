import React, { useMemo, useState } from 'react';
import { Edit3, Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useStore } from '../../store/useStore';
import { NewsArticle } from '../../types';

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function htmlExcerpt(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
}

const inputCls = 'w-full text-sm px-3 py-2 border border-rule rounded-lg focus:outline-none focus:border-brand-500 bg-white';
const labelCls = 'block text-xs font-bold uppercase text-mute mb-1.5';

export default function AdminNews() {
  const { state, dispatch, showToast } = useStore();
  const [draft, setDraft] = useState(state.siteContent.newsArticles);
  const [selectedId, setSelectedId] = useState<string>(draft[0]?.id || '');

  const selectedPost = useMemo(
    () => draft.find(post => post.id === selectedId) || draft[0],
    [draft, selectedId]
  );

  const updatePost = (id: string, patch: Partial<NewsArticle>) => {
    setDraft(current => current.map(post => (post.id === id ? { ...post, ...patch } : post)));
  };

  const addPost = () => {
    const id = uid('post');
    const post: NewsArticle = {
      id,
      date: new Date().toLocaleDateString('vi-VN'),
      title: 'Bài Viết Mới',
      excerpt: 'Tóm tắt bài viết...',
      content: '<p>Nội dung chuẩn SEO...</p>',
      tint: '#fff8fa',
      accent: '#c96b8d',
    };
    setDraft(current => [post, ...current]);
    setSelectedId(id);
  };

  const deletePost = (id: string) => {
    setDraft(current => {
      const next = current.filter(post => post.id !== id);
      setSelectedId(next[0]?.id || '');
      return next;
    });
  };

  const save = () => {
    dispatch({
      type: 'SET_SITE_CONTENT',
      payload: { ...state.siteContent, newsArticles: draft }
    });
    showToast('Đã lưu bài viết (SEO)');
  };

  return (
    <AdminLayout active="news">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Trang Viết SEO (Tin Tức)</h1>
          <p className="text-sm text-mute">Quản lý các bài viết Tin tức & Blog, hỗ trợ SEO dễ dàng hơn.</p>
        </div>
        <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-850">
          <Save size={16} /> Lưu thay đổi
        </button>
      </header>

      <div className="bg-white border border-rule rounded-lg p-5">
        <div className="grid xl:grid-cols-[280px_1fr] gap-6">
          <div className="border-r border-rule pr-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Danh sách bài viết</h2>
              <button onClick={addPost} className="w-8 h-8 rounded bg-brand-50 text-brand-700 hover:bg-brand-100 flex items-center justify-center">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {draft.map(post => (
                <button
                  key={post.id || post.title}
                  onClick={() => setSelectedId(post.id || '')}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                    selectedPost?.id === post.id ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:bg-soft'
                  }`}
                >
                  <div className="font-semibold text-brand-700 line-clamp-1">{post.title}</div>
                  <div className="text-xs text-mute mt-1">{post.date}</div>
                </button>
              ))}
              {draft.length === 0 && <div className="text-sm text-mute">Chưa có bài viết.</div>}
            </div>
          </div>

          {selectedPost ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <h3 className="font-bold text-lg text-ink flex items-center gap-2">
                  <Edit3 size={18} className="text-brand-500" />
                  Chỉnh sửa bài viết
                </h3>
                <button onClick={() => selectedPost.id && deletePost(selectedPost.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700">
                  <Trash2 size={16} /> Xóa bài này
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelCls}>Tiêu đề bài viết (Heading 1 - Tốt cho SEO)</label>
                  <input
                    value={selectedPost.title}
                    onChange={e => updatePost(selectedPost.id || '', { title: e.target.value })}
                    className={inputCls}
                    placeholder="Nhập tiêu đề hấp dẫn..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Ngày xuất bản</label>
                  <input
                    value={selectedPost.date}
                    onChange={e => updatePost(selectedPost.id || '', { date: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>URL Ảnh Đại Diện (Thumbnail)</label>
                  <input
                    value={selectedPost.image || ''}
                    onChange={e => updatePost(selectedPost.id || '', { image: e.target.value })}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Đoạn mô tả ngắn (Meta Description - Tốt cho SEO)</label>
                  <textarea
                    value={selectedPost.excerpt}
                    onChange={e => updatePost(selectedPost.id || '', { excerpt: e.target.value })}
                    rows={2}
                    className={inputCls}
                    placeholder="Viết một đoạn ngắn giới thiệu thu hút người đọc..."
                  />
                  <p className="text-[11px] text-mute mt-1">Đoạn text này sẽ xuất hiện ở ngoài danh sách và làm thẻ meta description.</p>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Nội dung chính (HTML - Hỗ trợ H2, H3, b, thẻ p)</label>
                  <textarea
                    value={selectedPost.content || ''}
                    onChange={e => updatePost(selectedPost.id || '', {
                      content: e.target.value,
                      excerpt: selectedPost.excerpt || htmlExcerpt(e.target.value)
                    })}
                    rows={12}
                    className={`${inputCls} font-mono`}
                    placeholder="<p>Bắt đầu viết bài chuẩn SEO...</p>"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-mute">
              <Edit3 size={40} className="mb-4 opacity-50" />
              <p>Chọn bài viết để chỉnh sửa hoặc tạo mới</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
