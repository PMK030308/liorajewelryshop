import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, Receipt, ArrowLeft, LogOut, Menu, X, Home, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Props { children: React.ReactNode; active: 'dashboard' | 'products' | 'orders' | 'wordpress'; }

export default function AdminLayout({ children, active }: Props) {
  const state = useStore().state;
  const dispatch = useStore().dispatch;
  const navigate = useStore().navigate;
  const showToast = useStore().showToast;
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
    { key: 'dashboard', label: 'Bảng điều khiển', path: '/admin/dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.8} /> },
    { key: 'products',  label: 'Sản phẩm',         path: '/admin/products',  icon: <Package size={18} strokeWidth={1.8} /> },
    { key: 'orders',    label: 'Đơn hàng',         path: '/admin/orders',    icon: <Receipt size={18} strokeWidth={1.8} /> },
    { key: 'wordpress', label: 'Cấu hình WP',     path: '/admin/wordpress', icon: <Settings size={18} strokeWidth={1.8} /> },
  ];

  const activeItem = items.find(it => it.key === active);

  const Sidebar = (
    <>
      <a
        href="#/"
        onClick={(e) => { e.preventDefault(); navigate('/'); }}
        className="flex items-center gap-2 mb-5 text-brand-700 hover:opacity-90 transition-opacity"
      >
        <img src="/logoliora.png" alt="LIORA" className="object-contain h-10 w-auto" />
        <div className="text-[10px] text-mute uppercase tracking-[0.18em] font-semibold">Admin</div>
      </a>

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
          <ArrowLeft size={14} strokeWidth={2} />
          Về trang chính
        </a>
        <button onClick={logout} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600">
          <LogOut size={14} strokeWidth={2} />
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
          <Menu size={20} strokeWidth={2} />
        </button>
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex-1 flex items-center gap-2 text-brand-700 hover:opacity-90 transition-opacity">
          <img src="/logoliora.png" alt="LIORA" className="object-contain h-8 w-auto" />
          <span className="text-xs text-mute">/ Admin</span>
          {activeItem && (
            <>
              <span className="text-xs text-mute">/</span>
              <span className="text-sm font-semibold">{activeItem.label}</span>
            </>
          )}
        </a>
        <button
          onClick={() => navigate('/')}
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
    </main>
  );
}
