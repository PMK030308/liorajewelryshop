import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Dispatch } from 'react';
import { CartItem, Order, OrderStatus, Product, SiteContent, SortOption, User } from '../types';
import { DEFAULT_SITE_CONTENT, PRODUCTS as SEED_PRODUCTS } from '../data';
import { hasSupabase } from '../lib/supabase';
import { fetchProducts, fetchSiteContent, syncProducts, syncSiteContent } from '../lib/repo';
import { getCurrentUser, onAuthChange } from '../lib/auth';

export interface State {
  route: string;
  cart: CartItem[];
  wishlist: string[];
  filter: string;
  sort: SortOption;
  pdpImageIdx: number;
  pdpQty: number;
  pdpSize: string | null;
  slide: number;
  cartOpen: boolean;
  searchOpen: boolean;
  voucherOpen: boolean;
  toast: string;
  /** Logged-in user (null = guest). */
  user: User | null;
  /** All registered users. */
  users: User[];
  /** All orders. */
  orders: Order[];
  /** Products list (seeded from data on first run, mutable by admin). */
  products: Product[];
  /** WordPress-like editable site content. */
  siteContent: SiteContent;
}

export type Action =
  | { type: 'NAVIGATE'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_SLIDE'; payload: number }
  | { type: 'SET_PDP_IMAGE'; payload: number }
  | { type: 'SET_PDP_QTY'; payload: number }
  | { type: 'SET_PDP_SIZE'; payload: string }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_QTY'; payload: { cartId: string; qty: number } }
  | { type: 'REMOVE_CART_ITEM'; payload: string }
  | { type: 'TOGGLE_WISH'; payload: string }
  | { type: 'OPEN_CART' }
  | { type: 'OPEN_SEARCH' }
  | { type: 'OPEN_VOUCHER' }
  | { type: 'CLOSE_ALL' }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'CLEAR_CART' }
  | { type: 'RESET_PDP' }
  // ---- Auth ----
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> & { id: string } }
  // ---- Orders ----
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus } }
  | { type: 'DELETE_ORDER'; payload: string }
  // ---- Products CRUD (admin) ----
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'RESET_PRODUCTS' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  // ---- Site CMS ----
  | { type: 'SET_SITE_CONTENT'; payload: SiteContent }
  | { type: 'RESET_SITE_CONTENT' };

export const parseHash = (): string =>
  window.location.hash.replace(/^#/, '') || '/';

const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
};

const DEFAULT_ADMIN: User = {
  id: 'admin-seed',
  email: 'admin@liora.com',
  password: 'admin123',
  name: 'Admin LIORA',
  role: 'admin',
  createdAt: Date.now(),
};

const initUsers = (): User[] => {
  const stored = safeParse<User[]>('liora_users', []);
  // Ensure default admin always exists
  if (!stored.find(u => u.email === DEFAULT_ADMIN.email)) {
    return [DEFAULT_ADMIN, ...stored];
  }
  return stored;
};

const initProducts = (): Product[] => {
  const stored = safeParse<Product[] | null>('liora_products_v2', null);
  return stored && stored.length ? stored : SEED_PRODUCTS;
};

// Bump khi thay đổi nội dung seed (bài viết SEO, hero, pages...).
// Khi version khác cache, các trường seed sẽ được làm mới từ default
// (giữ nguyên tuỳ chỉnh admin ở các trường khác).
const CONTENT_SEED_VERSION = 2;
const SEED_VERSION_KEY = 'liora_content_seed_v';
// Key lưu trữ nội dung site (bump khi cần ép làm mới toàn bộ cache).
const SITE_CONTENT_KEY = 'liora_site_content_v3';

const initSiteContent = (): SiteContent => {
  // Ưu tiên cache v3; nếu chưa có thì migrate các tuỳ chỉnh từ v2 cũ.
  let stored = safeParse<Partial<SiteContent> | null>(SITE_CONTENT_KEY, null);
  if (!stored) {
    const legacy = safeParse<Partial<SiteContent> | null>('liora_site_content_v2', null);
    if (legacy) stored = legacy;
  }

  const storedVersion = (() => {
    try {
      return Number(localStorage.getItem(SEED_VERSION_KEY)) || 0;
    } catch { return 0; }
  })();
  const seedChanged = storedVersion !== CONTENT_SEED_VERSION;

  // Khi seed thay đổi (hoặc chưa có bài nào), làm mới newsArticles từ default
  // nhưng vẫn giữ các tuỳ chỉnh khác (settings, hero, pages) của admin.
  const newsArticles =
    seedChanged || !stored?.newsArticles?.length
      ? DEFAULT_SITE_CONTENT.newsArticles
      : stored.newsArticles;

  const result: SiteContent = {
    ...DEFAULT_SITE_CONTENT,
    ...(stored || {}),
    settings: { ...DEFAULT_SITE_CONTENT.settings, ...(stored?.settings || {}) },
    heroSlides: stored?.heroSlides?.length ? stored.heroSlides : DEFAULT_SITE_CONTENT.heroSlides,
    newsArticles,
    pages: stored?.pages?.length ? stored.pages : DEFAULT_SITE_CONTENT.pages,
  };

  if (seedChanged) {
    try { localStorage.setItem(SEED_VERSION_KEY, String(CONTENT_SEED_VERSION)); } catch { /* noop */ }
  }
  return result;
};

export const initialState: State = {
  route: parseHash(),
  cart: safeParse<CartItem[]>('liora_cart', []),
  wishlist: safeParse<string[]>('liora_wishlist', []),
  filter: 'all',
  sort: 'default',
  pdpImageIdx: 0,
  pdpQty: 1,
  pdpSize: null,
  slide: 0,
  cartOpen: false,
  searchOpen: false,
  voucherOpen: false,
  toast: '',
  user: safeParse<User | null>('liora_user', null),
  users: initUsers(),
  orders: safeParse<Order[]>('liora_orders', []),
  products: initProducts(),
  siteContent: initSiteContent(),
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, route: action.payload, pdpImageIdx: 0, pdpQty: 1, pdpSize: null };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_SLIDE':
      return { ...state, slide: ((action.payload % 3) + 3) % 3 };
    case 'SET_PDP_IMAGE':
      return { ...state, pdpImageIdx: action.payload };
    case 'SET_PDP_QTY':
      return { ...state, pdpQty: Math.max(1, Math.min(20, action.payload)) };
    case 'SET_PDP_SIZE':
      return { ...state, pdpSize: action.payload };
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.cartId === action.payload.cartId);
      const cart = existing
        ? state.cart.map(i =>
            i.cartId === action.payload.cartId
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          )
        : [...state.cart, action.payload];
      return { ...state, cart };
    }
    case 'UPDATE_CART_QTY': {
      if (action.payload.qty < 1) {
        return { ...state, cart: state.cart.filter(i => i.cartId !== action.payload.cartId) };
      }
      return {
        ...state,
        cart: state.cart.map(i =>
          i.cartId === action.payload.cartId
            ? { ...i, qty: Math.min(20, action.payload.qty) }
            : i
        ),
      };
    }
    case 'REMOVE_CART_ITEM':
      return { ...state, cart: state.cart.filter(i => i.cartId !== action.payload) };
    case 'TOGGLE_WISH': {
      const idx = state.wishlist.indexOf(action.payload);
      const wishlist =
        idx >= 0
          ? state.wishlist.filter(s => s !== action.payload)
          : [...state.wishlist, action.payload];
      return { ...state, wishlist };
    }
    case 'OPEN_CART':    return { ...state, cartOpen: true,  searchOpen: false, voucherOpen: false };
    case 'OPEN_SEARCH':  return { ...state, searchOpen: true, cartOpen: false,  voucherOpen: false };
    case 'OPEN_VOUCHER': return { ...state, voucherOpen: true };
    case 'CLOSE_ALL':    return { ...state, cartOpen: false, searchOpen: false, voucherOpen: false };
    case 'SHOW_TOAST':   return { ...state, toast: action.payload };
    case 'HIDE_TOAST':   return { ...state, toast: '' };
    case 'CLEAR_CART':   return { ...state, cart: [] };
    case 'RESET_PDP':    return { ...state, pdpImageIdx: 0, pdpQty: 1, pdpSize: null };

    // ---- Auth ----
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'REGISTER':
      return { ...state, users: [...state.users, action.payload], user: action.payload };
    case 'UPDATE_USER': {
      const users = state.users.map(u =>
        u.id === action.payload.id ? { ...u, ...action.payload } : u
      );
      const user = state.user?.id === action.payload.id
        ? { ...state.user, ...action.payload }
        : state.user;
      return { ...state, users, user };
    }

    // ---- Orders ----
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        ),
      };
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };

    // ---- Products CRUD ----
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.slug === action.payload.slug ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.slug !== action.payload) };
    case 'RESET_PRODUCTS':
      return { ...state, products: SEED_PRODUCTS };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_SITE_CONTENT':
      return { ...state, siteContent: action.payload };
    case 'RESET_SITE_CONTENT':
      return { ...state, siteContent: DEFAULT_SITE_CONTENT };

    default: return state;
  }
}

export interface StoreContextType {
  state: State;
  dispatch: Dispatch<Action>;
  navigate: (path: string) => void;
  showToast: (msg: string) => void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

import { getWordPressConfig, fetchWooCommerceProducts } from '../utils/wordpressService';

/** Hook that wires up all side-effects — used inside StoreProvider.tsx */
export function useStoreSetup() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load products from WooCommerce if WordPress is enabled
  useEffect(() => {
    const config = getWordPressConfig();
    if (config.useWordPress && config.apiUrl) {
      fetchWooCommerceProducts(config)
        .then(products => {
          if (products && products.length > 0) {
            dispatch({ type: 'SET_PRODUCTS', payload: products });
          }
        })
        .catch(err => {
          console.error('Failed to sync products from WooCommerce:', err);
        });
    }
  }, []);

  // ---- Bootstrap từ Supabase (sản phẩm + nội dung site) ----
  useEffect(() => {
    if (!hasSupabase) return; // chưa cấu hình → giữ seed/offline
    fetchProducts()
      .then(list => { if (list.length) dispatch({ type: 'SET_PRODUCTS', payload: list }); })
      .catch(err => console.error('[Liora] load products từ Supabase thất bại, giữ seed:', err));
    fetchSiteContent()
      .then(sc => dispatch({ type: 'SET_SITE_CONTENT', payload: sc }))
      .catch(err => console.error('[Liora] load site_content từ Supabase thất bại, giữ mặc định:', err));
  }, []);

  // ---- Auth: khôi phục session + lắng nghe thay đổi ----
  useEffect(() => {
    if (!hasSupabase) return;
    getCurrentUser().then(u => { if (u) dispatch({ type: 'LOGIN', payload: u }); });
    const unsub = onAuthChange(u => {
      if (u) dispatch({ type: 'LOGIN', payload: u });
      else dispatch({ type: 'LOGOUT' });
    });
    return unsub;
  }, []);

  useEffect(() => {
    localStorage.setItem('liora_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('liora_wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem('liora_user', JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('liora_users', JSON.stringify(state.users));
  }, [state.users]);

  useEffect(() => {
    localStorage.setItem('liora_orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    // Cache offline (luôn giữ để app chạy được khi Supabase chưa xong)
    const config = getWordPressConfig();
    if (!config.useWordPress) {
      localStorage.setItem('liora_products_v2', JSON.stringify(state.products));
    }
    // Sync lên Supabase: chỉ admin mới có quyền ghi (RLS)
    if (hasSupabase && state.user?.role === 'admin') {
      syncProducts(state.products);
    }
  }, [state.products, state.user]);

  useEffect(() => {
    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(state.siteContent));
    if (hasSupabase && state.user?.role === 'admin') {
      syncSiteContent(state.siteContent);
    }
  }, [state.siteContent, state.user]);

  useEffect(() => {
    document.body.style.overflow =
      state.cartOpen || state.searchOpen || state.voucherOpen ? 'hidden' : '';
  }, [state.cartOpen, state.searchOpen, state.voucherOpen]);

  useEffect(() => {
    const onHash = () => {
      dispatch({ type: 'NAVIGATE', payload: parseHash() });
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'CLOSE_ALL' });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2500);
    return () => clearTimeout(t);
  }, [state.toast]);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  const showToast = useCallback((msg: string) => {
    dispatch({ type: 'SHOW_TOAST', payload: msg });
  }, []);

  return { state, dispatch, navigate, showToast };
}
