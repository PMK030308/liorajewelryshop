import React, { useEffect, useState, useRef } from 'react';
import { Search, ShoppingBag, User as UserIcon, Menu, ChevronDown, X, LogIn, UserPlus, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, fmt } from '../data';
import Shapes from '../data/shapes';
import LogoMark from './LogoMark';

export default function Header() {
  const { state, dispatch, navigate, showToast } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [bouncing, setBouncing] = useState(false);
  const prevCountRef = useRef(cartCount);
  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 650);
      return () => clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);
  useEffect(() => { prevCountRef.current = cartCount; }, [bouncing]);

  const setFilterNav = (slug: string) => {
    dispatch({ type: 'SET_FILTER', payload: slug });
    navigate('/shop');
    setMobileOpen(false);
  };

  const handleInlineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'OPEN_SEARCH' });
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const renderSearchResults = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return (
        <div>
          <div className="text-xs text-mute mb-3 uppercase tracking-wider">Tìm kiếm phổ biến</div>
          <div className="flex gap-2 flex-wrap">
            {['Moissanite','Bông tai','Dây chuyền','Lắc tay','Nhẫn đôi','Cỏ 4 lá'].map(t => (
              <button key={t} className="chip" onClick={() => setSearchQuery(t)}>{t}</button>
            ))}
          </div>
        </div>
      );
    }
    const results = state.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.subcat.includes(q)
    );
    if (results.length === 0) return <div className="text-center py-10 text-mute">Không tìm thấy "{searchQuery}"</div>;
    return (
      <div>
        <div className="text-xs text-mute mb-3 uppercase tracking-wider">{results.length} kết quả</div>
        <div className="divide-y divide-rule">
          {results.map(p => {
            const ShapeSvg = Shapes[p.shape] || Shapes['gem'];
            return (
              <a
                key={p.slug}
                href={`#/product/${p.slug}`}
                onClick={() => { dispatch({ type: 'CLOSE_ALL' }); navigate(`/product/${p.slug}`); }}
                className="flex items-center gap-3 py-3 hover:bg-brand-50 px-2 -mx-2 rounded-lg"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="photo h-full w-full" style={{ '--p-tint': p.tint, '--p-tint2': p.tint2, '--p-accent': p.accent, aspectRatio: 'auto', backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${p.tint} 75%, ${p.tint2})` } as React.CSSProperties}>
                    <div className="sil" style={{ color: p.accent }}>{ShapeSvg}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                  <div className="text-xs text-mute">Mã: {p.code}</div>
                </div>
                <div className="font-bold text-brand-500 text-sm whitespace-nowrap">{fmt(p.price)}</div>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  const isActive = (path: string) => state.route === path;

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white border-b border-rule transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_18px_-12px_rgba(26,48,80,0.25)]' : ''}`}>
        {/* Row 1 */}
        <div className={`container-x grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8 transition-[padding] duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
          <LogoMark
            href="#/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            size={scrolled ? 36 : 44}
            textClassName="hidden sm:block text-2xl md:text-3xl"
            className="text-brand-700 logo-link transition-all"
          />

          <form onSubmit={handleInlineSearch} className="flex items-stretch border border-rule rounded-md overflow-hidden focus-within:border-brand-400 transition h-11 max-w-[840px] w-full mx-auto">
            <input
              id="inlineSearch"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 px-4 text-sm outline-none placeholder-mute text-ink"
              onFocus={() => dispatch({ type: 'OPEN_SEARCH' })}
            />
            <button type="submit" className="bg-[#4682b4] hover:bg-[#3b6d96] w-11 flex-shrink-0 flex items-center justify-center text-white transition-colors" aria-label="Tìm">
              <Search size={18} strokeWidth={2.2} />
            </button>
          </form>

          <div className="flex items-center gap-5 md:gap-7">
            <UserMenu />
            <button className="flex items-center gap-2 text-brand-700 hover:text-brand-500 transition-colors" onClick={() => dispatch({ type: 'OPEN_CART' })} aria-label="Giỏ hàng">
              <span className="relative">
                <span className={`inline-block ${bouncing ? 'animate-cartBounce' : ''}`} style={{ transformOrigin: 'center' }}>
                  <ShoppingBag size={24} strokeWidth={1.6} />
                </span>
                <span key={cartCount} className="absolute -top-2 -right-2 bg-brand-400 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white animate-badgePop">{cartCount}</span>
              </span>
              <span className="hidden md:inline text-sm font-medium">Giỏ hàng</span>
            </button>
            <button className="w-10 h-10 rounded hover:bg-soft lg:hidden flex items-center justify-center text-ink2" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Row 2: Main nav */}
        <div className="border-t border-rule">
          <nav className={`container-x hidden lg:flex items-center justify-center text-[14px] font-light text-brand-700 transition-[padding] duration-300 ${scrolled ? 'py-1.5' : 'py-3'}`}>
            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={`px-6 py-1 hover:text-brand-500 transition-colors ${isActive('/') ? 'text-brand-500 font-medium' : ''}`}>Trang chủ</a>
            <div className="relative group has-drop">
              <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className={`nav-link px-6 py-1 hover:text-brand-500 flex items-center gap-1.5 ${isActive('/shop') ? 'active' : ''}`}>
                Sản phẩm
                <ChevronDown size={12} strokeWidth={1.6} />
              </a>
              <div className="absolute top-full left-0 pt-2 z-[1000] opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                <div className="w-[240px] bg-[#FFFFFF] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-[#E0E0E0] rounded-md overflow-hidden">
                  <ul className="flex flex-col text-[13.5px] text-[#555555] font-sans font-normal">
                    {[
                      { label: 'Tất Cả Sản Phẩm', slug: '' },
                      { label: 'Cặp Đôi', slug: 'cap-doi', sub: [
                        { label: 'Nhẫn Đôi', slug: 'nhan-doi' },
                        { label: 'Dây Chuyền Đôi', slug: 'day-chuyen-doi' },
                        { label: 'Lắc Tay Đôi', slug: 'lac-tay-doi' }
                      ]},
                      { label: 'Khắc Tên', slug: 'khac-ten', sub: [
                        { label: 'Nhẫn Khắc Tên', slug: 'nhan-khac-ten' },
                        { label: 'Dây Chuyền Khắc Tên', slug: 'day-chuyen-khac-ten' }
                      ]},
                      { label: 'Dây Chuyền Bạc', slug: 'day-chuyen-bac' },
                      { label: 'Lắc Tay Bạc', slug: 'lac-tay-bac' },
                      { label: 'Lắc Chân Bạc', slug: 'lac-chan-bac' },
                      { label: 'Nhẫn Đơn Bạc', slug: 'nhan-don-bac' },
                      { label: 'Bông Tai Bạc/ Khuyên Tai Bạc', slug: 'bong-tai-bac' },
                      { label: 'Kim Cương Mossanite', slug: 'kim-cuong-moissanite' },
                      { label: 'Set Quà Tặng', slug: 'set-qua-tang' },
                      { label: 'Bảo Dưỡng', slug: 'bao-duong' },
                    ].map((item, i, arr) => (
                      <li key={item.label} className={`relative group/sub ${i !== arr.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}>
                        <a 
                          href={`#/shop${item.slug ? `?cat=${item.slug}` : ''}`}
                          onClick={(e) => { e.preventDefault(); setFilterNav(item.slug || ''); }}
                          className="flex items-center justify-between px-[18px] py-[11px] hover:bg-[#F5F5F5] hover:text-[#333] hover:font-medium cursor-pointer transition-colors"
                        >
                          {item.label}
                          {item.sub && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                          )}
                        </a>
                        {item.sub && (
                          <div className="absolute top-0 left-full pl-1 z-[1001] opacity-0 invisible -translate-y-2 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-y-0 transition-all duration-200">
                            <div className="w-[200px] bg-[#FFFFFF] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-[#E0E0E0] rounded-md overflow-hidden">
                              <ul className="flex flex-col text-[13.5px] text-[#555555] font-sans font-normal">
                                {item.sub.map((subItem, j, subArr) => (
                                  <li key={subItem.label} className={j !== subArr.length - 1 ? 'border-b border-[#F0F0F0]' : ''}>
                                    <a 
                                      href={`#/shop?cat=${subItem.slug}`}
                                      onClick={(e) => { e.preventDefault(); setFilterNav(subItem.slug); }}
                                      className="flex items-center px-[18px] py-[11px] hover:bg-[#F5F5F5] hover:text-[#333] hover:font-medium cursor-pointer transition-colors"
                                    >
                                      {subItem.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="has-drop">
              <a href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className={`nav-link px-6 py-1 hover:text-brand-500 flex items-center gap-1.5 ${isActive('/about') ? 'active' : ''}`}>
                Giới thiệu
                <ChevronDown size={12} strokeWidth={1.6} />
              </a>
              <div className="drop">
                <a href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>Về Liorajewelry</a>
                <a href="#/lien-he" onClick={(e) => { e.preventDefault(); navigate('/lien-he'); }}>Liên hệ</a>
              </div>
            </div>
            {[
              { path:'/kiem-dinh', label:'Kiểm định' },
              { path:'/feedback',  label:'Feedback' },
              { path:'/huong-dan', label:'Hướng dẫn' },
              { path:'/news',      label:'Tin tức' },
              { path:'/lien-he',   label:'Liên hệ' },
            ].map(({ path, label }) => (
              <a key={path} href={`#${path}`} onClick={(e) => { e.preventDefault(); navigate(path); }} className={`nav-link px-6 py-1 hover:text-brand-500 ${isActive(path) ? 'active' : ''}`}>{label}</a>
            ))}
          </nav>
        </div>

      </header>

      {/* Mobile slide-in drawer menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <aside
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu chính"
        >
          {/* User section */}
          <div className="bg-brand-700 text-white p-5 pb-6">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
              aria-label="Đóng menu"
            >
              <X size={16} strokeWidth={2} />
            </button>
            {state.user ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white text-brand-700 flex items-center justify-center font-bold text-base">
                  {state.user.name.split(' ').slice(-2).map(s => s[0]).join('').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{state.user.name}</div>
                  <div className="text-xs text-white/70 truncate">{state.user.email}</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-semibold mb-3">Chào mừng đến LIORA 👋</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setMobileOpen(false); navigate('/login'); }}
                    className="flex-1 bg-white text-brand-700 text-sm font-semibold py-2 rounded-md hover:bg-brand-50"
                  >Đăng nhập</button>
                  <button
                    onClick={() => { setMobileOpen(false); navigate('/register'); }}
                    className="flex-1 border border-white/40 text-white text-sm font-semibold py-2 rounded-md hover:bg-white/10"
                  >Đăng ký</button>
                </div>
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {[
              { path: '/',          label: 'Trang chủ' },
              { path: '/shop',      label: 'Sản phẩm', accent: true },
              { path: '/about',     label: 'Giới thiệu' },
              { path: '/kiem-dinh', label: 'Kiểm định' },
              { path: '/feedback',  label: 'Feedback' },
              { path: '/huong-dan', label: 'Hướng dẫn' },
              { path: '/news',      label: 'Tin tức' },
              { path: '/lien-he',   label: 'Liên hệ' },
            ].map(({ path, label, accent }) => {
              const active = isActive(path);
              return (
                <a
                  key={path}
                  href={`#${path}`}
                  onClick={(e) => { e.preventDefault(); navigate(path); setMobileOpen(false); }}
                  className={`flex items-center justify-between px-5 py-3 text-[15px] border-l-[3px] transition-colors ${
                    active
                      ? 'border-brand-700 bg-brand-50 text-brand-700 font-semibold'
                      : 'border-transparent text-ink hover:bg-soft hover:text-brand-700'
                  }`}
                >
                  <span>{label}</span>
                  {accent && !active && <span className="text-xs text-brand-500 font-medium">{state.products.length} SP</span>}
                  <ChevronDown size={14} strokeWidth={2} className="text-mute -rotate-90" />
                </a>
              );
            })}
          </nav>

          {/* Bottom user actions */}
          {state.user && (
            <div className="border-t border-rule p-3 space-y-1">
              <button
                onClick={() => { setMobileOpen(false); navigate('/account'); }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-soft flex items-center gap-2"
              >
                <UserIcon size={16} strokeWidth={1.6} />
                Tài khoản của tôi
              </button>
              {state.user.role === 'admin' && (
                <button
                  onClick={() => { setMobileOpen(false); navigate('/admin/dashboard'); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-brand-50 flex items-center gap-2 text-brand-700 font-semibold"
                >
                  <LayoutDashboard size={16} strokeWidth={1.8} />
                  Trang quản trị
                </button>
              )}
              <button
                onClick={() => {
                  dispatch({ type: 'LOGOUT' });
                  setMobileOpen(false);
                  showToast('Đã đăng xuất');
                  setTimeout(() => navigate('/'), 200);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-500 flex items-center gap-2"
              >
                <LogOut size={16} strokeWidth={1.8} />
                Đăng xuất
              </button>
            </div>
          )}

          <div className="border-t border-rule px-5 py-3 text-[11px] text-mute">
            <div className="font-semibold text-brand-700 mb-1">Hotline 0982 463 691</div>
            <div>9:00 – 21:00 hàng ngày</div>
          </div>
        </aside>
      </div>

      {/* Search Panel */}
      <div className={`search-panel ${state.searchOpen ? 'open' : ''}`}>
        <div className="container-x">
          <div className="flex items-center gap-4 border-b border-rule pb-3">
            <Search size={20} strokeWidth={1.8} className="text-mute" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm sản phẩm, mã sản phẩm…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg outline-none placeholder-mute"
            />
            <button className="text-xs text-mute hover:text-brand-500 uppercase tracking-wider" onClick={() => { dispatch({ type: 'CLOSE_ALL' }); setSearchQuery(''); }}>ĐÓNG</button>
          </div>
          <div className="py-4 max-h-[60vh] overflow-y-auto">{renderSearchResults()}</div>
        </div>
      </div>
    </>
  );
}

function UserMenu() {
  const { state, dispatch, navigate, showToast } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = state.user;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const go = (path: string) => { setOpen(false); navigate(path); };
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('👋 Đã đăng xuất');
    setOpen(false);
    setTimeout(() => navigate('/'), 200);
  };

  const initials = user
    ? user.name.split(' ').slice(-2).map(s => s[0]).join('').toUpperCase()
    : '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center text-brand-700 hover:text-brand-500 transition-colors"
        aria-label="Tài khoản"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user ? (
          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold border-2 border-brand-200">
            {initials}
          </span>
        ) : (
          <UserIcon size={24} strokeWidth={1.6} />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 bg-white rounded-lg border border-rule shadow-card overflow-hidden animate-fadeUp z-40"
        >
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-rule bg-soft">
                <div className="font-semibold text-sm text-brand-700 truncate">{user.name}</div>
                <div className="text-xs text-mute truncate">{user.email}</div>
                <div className="text-[10px] inline-block bg-brand-100 text-brand-700 px-2 py-0.5 rounded mt-1 uppercase tracking-wider font-semibold">
                  {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                </div>
              </div>
              <button onClick={() => go('/account')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 flex items-center gap-2">
                <UserIcon size={16} strokeWidth={1.6} />
                Tài khoản của tôi
              </button>
              {user.role === 'admin' && (
                <button onClick={() => go('/admin/dashboard')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 flex items-center gap-2 text-brand-700 font-semibold">
                  <LayoutDashboard size={16} strokeWidth={1.8} />
                  Trang quản trị
                </button>
              )}
              <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 flex items-center gap-2 text-red-500 border-t border-rule">
                <LogOut size={16} strokeWidth={1.8} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button onClick={() => go('/login')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 flex items-center gap-2 font-medium">
                <LogIn size={16} strokeWidth={1.8} />
                Đăng nhập
              </button>
              <button onClick={() => go('/register')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 flex items-center gap-2 border-t border-rule">
                <UserPlus size={16} strokeWidth={1.8} />
                Đăng ký tài khoản
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
