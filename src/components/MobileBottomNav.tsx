import React from 'react';
import { useStore } from '../store/useStore';

/**
 * Sticky bottom navigation bar for mobile.
 * 5 items: Home / Shop / Wishlist / Cart / Account.
 * Hidden on lg+ screens.
 */
export default function MobileBottomNav() {
  const { state, dispatch, navigate } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const wishCount = state.wishlist.length;

  const isActive = (path: string) =>
    path === '/' ? state.route === '/' || state.route === '' : state.route.startsWith(path);

  const items: Array<{
    label: string;
    path?: string;
    onClick?: () => void;
    icon: React.ReactNode;
    badge?: number;
    active: boolean;
  }> = [
    {
      label: 'Trang chủ',
      path: '/',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      active: isActive('/') && state.route !== '/shop',
    },
    {
      label: 'Cửa hàng',
      path: '/shop',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
      active: isActive('/shop'),
    },
    {
      label: 'Yêu thích',
      path: '/account',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      badge: wishCount,
      active: false,
    },
    {
      label: 'Giỏ hàng',
      onClick: () => dispatch({ type: 'OPEN_CART' }),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 7h14l-1.5 12h-11L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>
        </svg>
      ),
      badge: cartCount,
      active: false,
    },
    {
      label: state.user ? 'Tài khoản' : 'Đăng nhập',
      path: state.user ? '/account' : '/login',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>
        </svg>
      ),
      active: isActive('/account') || isActive('/login'),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-rule shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => {
              if (it.onClick) it.onClick();
              else if (it.path) navigate(it.path);
            }}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 transition-colors ${
              it.active ? 'text-brand-700' : 'text-mute hover:text-brand-700'
            }`}
            aria-label={it.label}
            aria-current={it.active ? 'page' : undefined}
          >
            <span className="relative">
              {it.icon}
              {!!it.badge && it.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-700 text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                  {it.badge > 9 ? '9+' : it.badge}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium leading-tight">{it.label}</span>
            {it.active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-700 rounded-b-sm" />}
          </button>
        ))}
      </div>
    </nav>
  );
}
