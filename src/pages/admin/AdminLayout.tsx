import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';

interface Props { children: React.ReactNode; active: 'dashboard' | 'products' | 'orders'; }

export default function AdminLayout({ children, active }: Props) {
  const { state, dispatch, navigate, showToast } = useStore();
  const user = state.user;
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('Đã đăng xuất');
    setTimeout(() => navigate('/'), 200);
  };

  const items: { key: typeof active; label: string; path: string; icon: React.ReactNode }[] = [
    {
      key: 'dashboard', label: 'Bảng điều khiển', path: '/admin/dashboard',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
    },
    {
      key: 'products', label: 'Sản phẩm', path: '/admin/products',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Z"/><path d="m3.3 7 8.7 4.5L20.7 7"/><path d="M12 21V11.5"/></svg>,
    },
    {
      key: 'orders', label: 'Đơn hàng', path: '/admin/orders',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    },
  ];

  const activeItem = items.find(it => it.key === active);

  const Sidebar = (
    <>
      <div className="flex items-center gap-2 mb-5 text-brand-700">
        <svg width="32" height="32" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="30" cy="30" r="22"/>
          <path d="M18 32 C 22 22, 38 22, 42 32"/>
          <path d="M21 34 C 24 27, 36 27, 39 34"/>
          <path d="M24 36 C 27 31, 33 31, 36 36"/>
        </svg>
        <div>
          <div className="font-bold tracking-[0.2em] text-sm">LIORA</div>
          <div className="text-[10px] text-mute uppercase tracking-wider">Admin</div>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map(it => (
          <a
            key={it.key}
            href={`#${it.path}`}
            onClick={(e) => { e.preventDefault(); navigate(it.path); setDrawerOpen(false); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              active === it.key
                ? 'bg-brand-700 text-white'
                : 'text-ink2 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {it.icon}
            <span>{it.label}</span>
          </a>
        ))}
      </nav>

      <div className="border-t border-rule mt-5 pt-4 space-y-2">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}
          className="flex items-center gap-2 text-xs text-mute hover:text-brand-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7M19 12H5"/></svg>
          Về trang chính
        </a>
        <button onClick={logout} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <main className="bg-[#f5f7fb] min-h-screen">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-rule flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-md hover:bg-soft flex items-center justify-center text-brand-700"
          aria-label="Mở menu admin"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <div className="flex-1 flex items-center gap-2 text-brand-700">
          <span className="font-bold tracking-[0.18em] text-sm">LIORA</span>
          <span className="text-xs text-mute">/ Admin</span>
          {activeItem && (
            <>
              <span className="text-xs text-mute">/</span>
              <span className="text-sm font-semibold">{activeItem.label}</span>
            </>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-md hover:bg-soft flex items-center justify-center text-mute"
          aria-label="Về trang chính"
          title="Về trang chính"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
              {Sidebar}
            </aside>
          </div>

          {/* Content */}
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
