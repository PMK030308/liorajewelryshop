import React from 'react';
import { Home, Store, Heart, ShoppingBag, User as UserIcon } from 'lucide-react';
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
      icon: <Home size={22} strokeWidth={1.8} />,
      active: isActive('/') && state.route !== '/shop',
    },
    {
      label: 'Cửa hàng',
      path: '/shop',
      icon: <Store size={22} strokeWidth={1.8} />,
      active: isActive('/shop'),
    },
    {
      label: 'Yêu thích',
      path: '/account',
      icon: <Heart size={22} strokeWidth={1.8} />,
      badge: wishCount,
      active: false,
    },
    {
      label: 'Giỏ hàng',
      onClick: () => dispatch({ type: 'OPEN_CART' }),
      icon: <ShoppingBag size={22} strokeWidth={1.8} />,
      badge: cartCount,
      active: false,
    },
    {
      label: state.user ? 'Tài khoản' : 'Đăng nhập',
      path: state.user ? '/account' : '/login',
      icon: <UserIcon size={22} strokeWidth={1.8} />,
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
