import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, Receipt, ArrowLeft, LogOut, Menu, X, Home,
  Settings, PanelsTopLeft, FileText, Newspaper,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { hasSupabase } from '../../lib/supabase';
import { signOut } from '../../lib/auth';
import { ConfirmDialog } from '../../components/admin/ui';

interface Props {
  children: React.ReactNode;
  active: 'dashboard' | 'products' | 'orders' | 'content' | 'wordpress' | 'news' | 'frontend';
  /** When true, navigating away prompts a confirm ("Có thay đổi chưa lưu"). */
  dirty?: boolean;
}

type NavKey = Props['active'];

const SECTIONS: { label: string; items: { key: NavKey; label: string; path: string; icon: React.ReactNode }[] }[] = [
  {
    label: 'Tổng quan',
    items: [
      { key: 'dashboard', label: 'Bảng điều khiển', path: '/admin/dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.8} /> },
    ],
  },
  {
    label: 'Kinh doanh',
    items: [
      { key: 'products', label: 'Sản phẩm', path: '/admin/products', icon: <Package size={18} strokeWidth={1.8} /> },
      { key: 'orders', label: 'Đơn hàng', path: '/admin/orders', icon: <Receipt size={18} strokeWidth={1.8} /> },
    ],
  },
  {
    label: 'Nội dung',
    items: [
      { key: 'frontend', label: 'Tùy chỉnh giao diện', path: '/admin/frontend', icon: <PanelsTopLeft size={18} strokeWidth={1.8} /> },
      { key: 'content', label: 'Nội dung website', path: '/admin/content', icon: <FileText size={18} strokeWidth={1.8} /> },
      { key: 'news', label: 'Tin tức & SEO', path: '/admin/news', icon: <Newspaper size={18} strokeWidth={1.8} /> },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { key: 'wordpress', label: 'Cấu hình WP', path: '/admin/wordpress', icon: <Settings size={18} strokeWidth={1.8} /> },
    ],
  },
];

const ALL_ITEMS = SECTIONS.flatMap(s => s.items);

export default function AdminLayout({ children, active, dirty }: Props) {
  const state = useStore().state;
  const dispatch = useStore().dispatch;
  const navigate = useStore().navigate;
  const showToast = useStore().showToast;
  const user = state.user;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  // Warn before closing/refreshing tab while editing.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!user) {
      showToast('Vui lòng đăng nhập để truy cập trang quản trị');
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      showToast('Bạn không có quyền truy cập trang quản trị');
      navigate('/');
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <p className="text-mute">Đang chuyển hướng…</p>
      </main>
    );
  }

  const logout = async () => {
    if (hasSupabase) { try { await signOut(); } catch { /* ignore */ } }
    dispatch({ type: 'LOGOUT' });
    showToast('Đã đăng xuất');
    setTimeout(() => navigate('/'), 200);
  };

  const activeItem = ALL_ITEMS.find(it => it.key === active);

  /** Navigate with dirty guard. */
  const guardedNavigate = (path: string) => {
    setDrawerOpen(false);
    if (dirty && path !== `/admin/${active}` && path !== `/#/admin/${active}`) {
      setPendingNav(path);
      return;
    }
    navigate(path);
  };

  const confirmLeave = () => {
    const path = pendingNav;
    setPendingNav(null);
    if (path) navigate(path);
  };

  const Sidebar = (
    <>
      <a
        href="#/"
        onClick={(e) => { e.preventDefault(); guardedNavigate('/'); }}
        className="flex items-center gap-2 mb-5 text-brand-700 hover:opacity-90 transition-opacity"
      >
        <img src="/logoliora2.jpg" alt="LIORA" className="object-contain h-10 w-auto mix-blend-multiply" />
        <div className="text-[10px] text-mute uppercase tracking-[0.18em] font-semibold">Admin</div>
      </a>

      <nav className="space-y-4">
        {SECTIONS.map(section => (
          <div key={section.label}>
            <div className="text-[10px] uppercase tracking-wider text-mute font-bold px-3 mb-1.5">{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map(it => {
                const isActive = active === it.key;
                return (
                  <a
                    key={it.key}
                    href={`#${it.path}`}
                    onClick={(e) => { e.preventDefault(); guardedNavigate(it.path); }}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink2 hover:bg-brand-50/60 hover:text-brand-700'
                    }`}
                  >
                    {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-brand-700" />}
                    <span className={isActive ? 'text-brand-700' : 'text-mute'} style={{ marginLeft: 2 }}>{it.icon}</span>
                    <span>{it.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User chip + footer */}
      <div className="border-t border-rule mt-5 pt-4 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {(user.name || user.email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink truncate">{user.name}</div>
            <div className="text-[11px] text-mute truncate">
              {user.role === 'admin' ? 'Quản trị viên' : user.email}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="#/" onClick={(e) => { e.preventDefault(); guardedNavigate('/'); }}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs text-mute hover:text-brand-500 py-1.5 rounded-md hover:bg-soft">
            <ArrowLeft size={13} strokeWidth={2} />
            Về trang chính
          </a>
          <button onClick={logout} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-600 py-1.5 rounded-md hover:bg-red-50">
            <LogOut size={13} strokeWidth={2} />
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );

  return (
    <main className="bg-[#fff7f9] min-h-screen">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-rule flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-md hover:bg-soft flex items-center justify-center text-brand-700"
          aria-label="Mở menu admin"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
        <a href="#/" onClick={(e) => { e.preventDefault(); guardedNavigate('/'); }} className="flex-1 flex items-center gap-2 text-brand-700 hover:opacity-90 transition-opacity">
          <img src="/logoliora2.jpg" alt="LIORA" className="object-contain h-8 w-auto mix-blend-multiply" />
          <span className="text-xs text-mute">/ Admin</span>
          {activeItem && (
            <>
              <span className="text-xs text-mute">/</span>
              <span className="text-sm font-semibold">{activeItem.label}</span>
            </>
          )}
        </a>
        <button
          onClick={() => guardedNavigate('/')}
          className="w-9 h-9 rounded-md hover:bg-soft flex items-center justify-center text-mute"
          aria-label="Về trang chính"
          title="Về trang chính"
        >
          <Home size={18} strokeWidth={1.8} />
        </button>
      </header>

      <div className="container-x py-4 md:py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block bg-white border border-rule rounded-lg p-4 self-start lg:sticky lg:top-24">
            {Sidebar}
          </aside>

          {/* Mobile drawer */}
          <div
            className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!drawerOpen}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
            <aside
              className={`absolute top-0 left-0 bottom-0 w-[78%] max-w-[300px] bg-white shadow-2xl p-5 transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-soft flex items-center justify-center text-mute"
                aria-label="Đóng"
              >
                <X size={16} strokeWidth={2} />
              </button>
              {Sidebar}
            </aside>
          </div>

          {/* Content */}
          <section className="min-w-0">{children}</section>
        </div>
      </div>

      <ConfirmDialog
        open={pendingNav !== null}
        title="Rời trang mà chưa lưu?"
        tone="amber"
        message="Bạn có thay đổi chưa được lưu. Rời trang bây giờ sẽ mất các thay đổi đó."
        confirmLabel="Rời trang"
        onConfirm={confirmLeave}
        onClose={() => setPendingNav(null)}
      />
    </main>
  );
}