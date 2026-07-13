import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, FileText, Image, Info, Plus, RefreshCw, Save, Settings2, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useStore } from '../../store/useStore';
import { DEFAULT_SITE_CONTENT, DEFAULT_ABOUT } from '../../data';
import { AboutContent, AboutStat, AboutStoryBlock, AboutValue, HeroSlide, NewsArticle, ShapeKey, SiteContent, SitePage } from '../../types';
import ImageInput from '../../components/admin/ImageInput';
import AboutEditor from './AboutEditor';
import { PageHeader, ConfirmDialog, inputCls, labelCls } from '../../components/admin/ui';

type TabKey = 'hero' | 'posts' | 'pages' | 'about' | 'settings';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'hero', label: 'Hero / Banner', icon: <Image size={16} /> },
  { key: 'posts', label: 'Bài viết', icon: <Edit3 size={16} /> },
  { key: 'pages', label: 'Trang tĩnh', icon: <FileText size={16} /> },
  { key: 'about', label: 'Giới thiệu', icon: <Info size={16} /> },
  { key: 'settings', label: 'Cài đặt', icon: <Settings2 size={16} /> },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function htmlExcerpt(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
}

export default function AdminContent() {
  const { state, dispatch, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [draft, setDraft] = useState<SiteContent>(state.siteContent);
  const [selectedPostId, setSelectedPostId] = useState<string>(draft.newsArticles[0]?.id || '');
  const [selectedPageId, setSelectedPageId] = useState<string>(draft.pages[0]?.id || '');
  const [pendingDelete, setPendingDelete] = useState<{ kind: 'post' | 'page'; id: string; title: string } | null>(null);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(state.siteContent), [draft, state.siteContent]);

  useEffect(() => {
    setDraft(state.siteContent);
  }, [state.siteContent]);

  const selectedPost = useMemo(
    () => draft.newsArticles.find(post => post.id === selectedPostId) || draft.newsArticles[0],
    [draft.newsArticles, selectedPostId],
  );
  const selectedPage = useMemo(
    () => draft.pages.find(page => page.id === selectedPageId) || draft.pages[0],
    [draft.pages, selectedPageId],
  );

  const updateHero = (index: number, patch: Partial<HeroSlide>) => {
    setDraft(current => ({
      ...current,
      heroSlides: current.heroSlides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
    }));
  };

  const updatePost = (id: string, patch: Partial<NewsArticle>) => {
    setDraft(current => ({
      ...current,
      newsArticles: current.newsArticles.map(post => (post.id === id ? { ...post, ...patch } : post)),
    }));
  };

  const updatePage = (id: string, patch: Partial<SitePage>) => {
    setDraft(current => ({
      ...current,
      pages: current.pages.map(page => (page.id === id ? { ...page, ...patch } : page)),
    }));
  };

  const updateAbout = (patch: Partial<AboutContent>) => {
    setDraft(current => ({ ...current, about: { ...(current.about ?? DEFAULT_ABOUT), ...patch } }));
  };

  const addPost = () => {
    const id = uid('post');
    const post: NewsArticle = {
      id,
      date: new Date().toLocaleDateString('vi-VN'),
      title: 'Bài viết mới',
      excerpt: 'Tóm tắt ngắn cho bài viết mới.',
      content: '<p>Nội dung bài viết mới...</p>',
      tint: '#fff7f9',
      accent: '#f472a0',
    };
    setDraft(current => ({ ...current, newsArticles: [post, ...current.newsArticles] }));
    setSelectedPostId(id);
  };

  const deletePost = (id: string) => {
    setDraft(current => {
      const nextPosts = current.newsArticles.filter(post => post.id !== id);
      setSelectedPostId(nextPosts[0]?.id || '');
      return { ...current, newsArticles: nextPosts };
    });
  };

  const addPage = () => {
    const id = uid('page');
    const page: SitePage = {
      id,
      slug: 'trang-moi',
      title: 'Trang mới',
      visible: true,
      content: '<p>Nội dung trang mới...</p>',
    };
    setDraft(current => ({ ...current, pages: [page, ...current.pages] }));
    setSelectedPageId(id);
  };

  const deletePage = (id: string) => {
    setDraft(current => {
      const nextPages = current.pages.filter(page => page.id !== id);
      setSelectedPageId(nextPages[0]?.id || '');
      return { ...current, pages: nextPages };
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'post') deletePost(pendingDelete.id);
    else deletePage(pendingDelete.id);
    showToast(pendingDelete.kind === 'post' ? 'Đã xóa bài viết' : 'Đã xóa trang');
    setPendingDelete(null);
  };

  const save = () => {
    dispatch({ type: 'SET_SITE_CONTENT', payload: draft });
    showToast('Đã lưu nội dung website');
  };

  const reset = () => {
    if (dirty && !confirm('Khôi phục nội dung mặc định sẽ mất các thay đổi hiện tại. Tiếp tục?')) return;
    setDraft(DEFAULT_SITE_CONTENT);
    dispatch({ type: 'RESET_SITE_CONTENT' });
    showToast('Đã khôi phục nội dung mặc định');
  };

  return (
    <AdminLayout active="content" dirty={dirty}>
      <PageHeader
        title="Quản trị nội dung"
        subtitle="Thêm, sửa, xoá banner, bài viết, trang tĩnh và thông tin website."
        dirty={dirty}
        actions={
          <>
            <button onClick={reset} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rule text-sm font-semibold hover:bg-soft">
              <RefreshCw size={16} /> Khôi phục mặc định
            </button>
            <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800">
              <Save size={16} /> Lưu thay đổi
            </button>
          </>
        }
      />

      <div className="grid lg:grid-cols-[220px_1fr] gap-5">
        <aside className="bg-white border border-rule rounded-lg p-2 h-max">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                activeTab === tab.key ? 'bg-brand-700 text-white' : 'text-ink2 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        <section className="bg-white border border-rule rounded-lg p-5">
          {activeTab === 'hero' && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-brand-700">Hero / Banner trang chủ</h2>
                <p className="text-xs text-mute mt-1">Các slide chạy trên cùng trang chủ. Nên dùng ảnh dọc tỉ lệ 4:5, nền sáng.</p>
              </div>
              {draft.heroSlides.map((slide, index) => (
                <div key={index} className="border border-rule rounded-lg p-4 grid lg:grid-cols-[200px_1fr] gap-4">
                  <ImageInput
                    label="Ảnh banner"
                    value={slide.image}
                    onChange={v => updateHero(index, { image: v })}
                    aspect="4/5"
                    hint="Tải lên từ máy hoặc dán link ảnh"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tiêu đề banner</label>
                      <textarea value={slide.plaque} onChange={e => updateHero(index, { plaque: e.target.value })} rows={3} className={inputCls} />
                      <p className="text-[11px] text-mute mt-1">Xuống dòng bằng \n để hiển thị nhiều dòng.</p>
                    </div>
                    <div>
                      <label className={labelCls}>Slogan</label>
                      <input value={slide.script} onChange={e => updateHero(index, { script: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Màu nền</label>
                      <input type="color" value={slide.tint} onChange={e => updateHero(index, { tint: e.target.value })} className="h-10 w-full border border-rule rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="grid xl:grid-cols-[260px_1fr] gap-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-brand-700">Bài viết</h2>
                  <button onClick={addPost} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Thêm bài viết">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {draft.newsArticles.map(post => (
                    <button
                      key={post.id || post.title}
                      onClick={() => setSelectedPostId(post.id || '')}
                      className={`w-full text-left p-3 rounded-lg border text-sm ${selectedPost?.id === post.id ? 'border-brand-500 bg-brand-50' : 'border-rule hover:bg-soft'}`}
                    >
                      <div className="font-semibold line-clamp-1">{post.title}</div>
                      <div className="text-xs text-mute">{post.date}</div>
                    </button>
                  ))}
                </div>
              </div>
              {selectedPost && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-brand-700">Sửa bài viết</h3>
                    <button onClick={() => selectedPost.id && setPendingDelete({ kind: 'post', id: selectedPost.id, title: selectedPost.title })} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                      <Trash2 size={16} /> Xoá
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tiêu đề</label>
                      <input value={selectedPost.title} onChange={e => updatePost(selectedPost.id || '', { title: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Ngày đăng</label>
                      <input value={selectedPost.date} onChange={e => updatePost(selectedPost.id || '', { date: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <ImageInput
                        label="Ảnh đại diện"
                        value={selectedPost.image}
                        onChange={v => updatePost(selectedPost.id || '', { image: v })}
                        hint="Hiển thị ngoài danh sách bài viết"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tóm tắt</label>
                      <textarea value={selectedPost.excerpt} onChange={e => updatePost(selectedPost.id || '', { excerpt: e.target.value })} rows={3} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Nội dung HTML</label>
                      <textarea value={selectedPost.content || ''} onChange={e => updatePost(selectedPost.id || '', { content: e.target.value, excerpt: selectedPost.excerpt || htmlExcerpt(e.target.value) })} rows={10} className={`${inputCls} font-mono`} />
                      <p className="text-[11px] text-mute mt-1">Hỗ trợ thẻ H2, H3, b, p. Viết chuẩn SEO với từ khoá chính.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="grid xl:grid-cols-[260px_1fr] gap-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-brand-700">Trang tĩnh</h2>
                  <button onClick={addPage} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Thêm trang">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {draft.pages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPageId(page.id)}
                      className={`w-full text-left p-3 rounded-lg border text-sm ${selectedPage?.id === page.id ? 'border-brand-500 bg-brand-50' : 'border-rule hover:bg-soft'}`}
                    >
                      <div className="font-semibold line-clamp-1">{page.title}</div>
                      <div className="text-xs text-mute">/{page.slug}</div>
                    </button>
                  ))}
                </div>
              </div>
              {selectedPage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-brand-700">Sửa trang</h3>
                    <button onClick={() => setPendingDelete({ kind: 'page', id: selectedPage.id, title: selectedPage.title })} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                      <Trash2 size={16} /> Xoá
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Tiêu đề</label>
                      <input value={selectedPage.title} onChange={e => updatePage(selectedPage.id, { title: e.target.value, slug: slugify(e.target.value) || selectedPage.slug })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Đường dẫn (slug)</label>
                      <input value={selectedPage.slug} onChange={e => updatePage(selectedPage.id, { slug: slugify(e.target.value) })} className={inputCls} />
                    </div>
                    <label className="md:col-span-2 flex items-center gap-2 text-sm font-semibold text-ink2">
                      <input type="checkbox" checked={selectedPage.visible} onChange={e => updatePage(selectedPage.id, { visible: e.target.checked })} />
                      Hiển thị trang này
                    </label>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Nội dung HTML</label>
                      <textarea value={selectedPage.content} onChange={e => updatePage(selectedPage.id, { content: e.target.value })} rows={12} className={`${inputCls} font-mono`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <AboutEditor draft={draft} updateAbout={updateAbout} />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="font-bold text-brand-700">Thông tin website</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {([
                  ['brandName', 'Tên thương hiệu'],
                  ['tagline', 'Slogan'],
                  ['address', 'Địa chỉ'],
                  ['openHours', 'Giờ mở cửa'],
                  ['hotline', 'Hotline'],
                  ['facebookUrl', 'Facebook URL'],
                  ['qrUrl', 'QR URL'],
                  ['shopeeUrl', 'Shopee URL'],
                  ['shopeeQrUrl', 'Shopee QR URL'],
                ] as const).map(([key, label]) => (
                  <div key={key} className={(key === 'qrUrl' || key === 'shopeeQrUrl') ? 'md:col-span-2' : ''}>
                    <label className={labelCls}>{label}</label>
                    <input
                      value={draft.settings[key]}
                      onChange={e => setDraft(current => ({
                        ...current,
                        settings: { ...current.settings, [key]: e.target.value },
                      }))}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title={pendingDelete?.kind === 'post' ? 'Xóa bài viết?' : 'Xóa trang?'}
        tone="red"
        message={<>Xóa <b>{pendingDelete?.title}</b>? Hành động này không thể hoàn tác (nhấn Lưu thay đổi để áp dụng).</>}
        confirmLabel="Xóa"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}
