import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, FileText, Image, Plus, RefreshCw, Save, Settings2, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useStore } from '../../store/useStore';
import { DEFAULT_SITE_CONTENT } from '../../data';
import { HeroSlide, NewsArticle, SiteContent, SitePage } from '../../types';

type TabKey = 'hero' | 'posts' | 'pages' | 'settings';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'hero', label: 'Hero / Banner', icon: <Image size={16} /> },
  { key: 'posts', label: 'Bai viet', icon: <Edit3 size={16} /> },
  { key: 'pages', label: 'Trang tinh', icon: <FileText size={16} /> },
  { key: 'settings', label: 'Cai dat', icon: <Settings2 size={16} /> },
];

const inputCls = 'w-full text-sm px-3 py-2 border border-rule rounded-lg focus:outline-none focus:border-brand-500 bg-white';
const labelCls = 'block text-xs font-bold uppercase text-mute mb-1.5';

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

  const addPost = () => {
    const id = uid('post');
    const post: NewsArticle = {
      id,
      date: new Date().toLocaleDateString('vi-VN'),
      title: 'Bai viet moi',
      excerpt: 'Tom tat ngan cho bai viet moi.',
      content: '<p>Noi dung bai viet moi...</p>',
      tint: '#fff8fa',
      accent: '#c96b8d',
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
      title: 'Trang moi',
      visible: true,
      content: '<p>Noi dung trang moi...</p>',
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

  const save = () => {
    dispatch({ type: 'SET_SITE_CONTENT', payload: draft });
    showToast('Da luu noi dung website');
  };

  const reset = () => {
    setDraft(DEFAULT_SITE_CONTENT);
    dispatch({ type: 'RESET_SITE_CONTENT' });
    showToast('Da khoi phuc noi dung mac dinh');
  };

  return (
    <AdminLayout active="content">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Quan tri noi dung</h1>
          <p className="text-sm text-mute">Them, sua, xoa banner, bai viet, trang tinh va thong tin website.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rule text-sm font-semibold hover:bg-soft">
            <RefreshCw size={16} /> Reset
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-850">
            <Save size={16} /> Luu thay doi
          </button>
        </div>
      </header>

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
              <h2 className="font-bold text-brand-700">Hero / Banner trang chu</h2>
              {draft.heroSlides.map((slide, index) => (
                <div key={index} className="border border-rule rounded-lg p-4 grid lg:grid-cols-[180px_1fr] gap-4">
                  <div className="aspect-[4/5] rounded-lg bg-soft overflow-hidden">
                    {slide.image ? <img src={slide.image} alt={slide.imageAlt || slide.plaque} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tieu de banner</label>
                      <textarea value={slide.plaque} onChange={e => updateHero(index, { plaque: e.target.value })} rows={3} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Slogan</label>
                      <input value={slide.script} onChange={e => updateHero(index, { script: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Mau nen</label>
                      <input type="color" value={slide.tint} onChange={e => updateHero(index, { tint: e.target.value })} className="h-10 w-full border border-rule rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>URL hinh anh</label>
                      <input value={slide.image || ''} onChange={e => updateHero(index, { image: e.target.value })} className={inputCls} />
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
                  <h2 className="font-bold text-brand-700">Bai viet</h2>
                  <button onClick={addPost} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Them bai viet">
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
                    <h3 className="font-bold text-brand-700">Sua bai viet</h3>
                    <button onClick={() => selectedPost.id && deletePost(selectedPost.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                      <Trash2 size={16} /> Xoa
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tieu de</label>
                      <input value={selectedPost.title} onChange={e => updatePost(selectedPost.id || '', { title: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Ngay dang</label>
                      <input value={selectedPost.date} onChange={e => updatePost(selectedPost.id || '', { date: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>URL anh dai dien</label>
                      <input value={selectedPost.image || ''} onChange={e => updatePost(selectedPost.id || '', { image: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tom tat</label>
                      <textarea value={selectedPost.excerpt} onChange={e => updatePost(selectedPost.id || '', { excerpt: e.target.value })} rows={3} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Noi dung HTML</label>
                      <textarea value={selectedPost.content || ''} onChange={e => updatePost(selectedPost.id || '', { content: e.target.value, excerpt: selectedPost.excerpt || htmlExcerpt(e.target.value) })} rows={10} className={`${inputCls} font-mono`} />
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
                  <h2 className="font-bold text-brand-700">Trang tinh</h2>
                  <button onClick={addPage} className="w-9 h-9 rounded-lg bg-brand-700 text-white inline-flex items-center justify-center" title="Them trang">
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
                    <h3 className="font-bold text-brand-700">Sua trang</h3>
                    <button onClick={() => deletePage(selectedPage.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                      <Trash2 size={16} /> Xoa
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Tieu de</label>
                      <input value={selectedPage.title} onChange={e => updatePage(selectedPage.id, { title: e.target.value, slug: slugify(e.target.value) || selectedPage.slug })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Duong dan</label>
                      <input value={selectedPage.slug} onChange={e => updatePage(selectedPage.id, { slug: slugify(e.target.value) })} className={inputCls} />
                    </div>
                    <label className="md:col-span-2 flex items-center gap-2 text-sm font-semibold text-ink2">
                      <input type="checkbox" checked={selectedPage.visible} onChange={e => updatePage(selectedPage.id, { visible: e.target.checked })} />
                      Hien thi trang nay
                    </label>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Noi dung HTML</label>
                      <textarea value={selectedPage.content} onChange={e => updatePage(selectedPage.id, { content: e.target.value })} rows={12} className={`${inputCls} font-mono`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="font-bold text-brand-700">Thong tin website</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {([
                  ['brandName', 'Ten thuong hieu'],
                  ['tagline', 'Slogan'],
                  ['address', 'Dia chi'],
                  ['openHours', 'Gio mo cua'],
                  ['hotline', 'Hotline'],
                  ['facebookUrl', 'Facebook URL'],
                  ['qrUrl', 'QR URL'],
                ] as const).map(([key, label]) => (
                  <div key={key} className={key === 'qrUrl' ? 'md:col-span-2' : ''}>
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
    </AdminLayout>
  );
}
