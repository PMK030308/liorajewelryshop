import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { Dispatch } from 'react';
import { CartItem, ContactMessage, NewsletterSub, Order, OrderStatus, Product, Review, SiteContent, SortOption, User } from '../types';
import { DEFAULT_SITE_CONTENT, PRODUCTS as SEED_PRODUCTS } from '../data';
import { hasSupabase } from '../lib/supabase';
import { fetchProducts, fetchSiteContent, syncProducts, syncSiteContent, subscribeProducts, subscribeSiteContent } from '../lib/repo';
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
  /** User-submitted product reviews (persisted to localStorage). */
  reviews: Review[];
  /** Contact form submissions (persisted to localStorage). */
  contactMessages: ContactMessage[];
  /** Newsletter email subscriptions (persisted to localStorage). */
  newsletterSubs: NewsletterSub[];
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
  | { type: 'RESET_SITE_CONTENT' }
  // ---- Reviews ----
  | { type: 'ADD_REVIEW'; payload: Review }
  // ---- Contact Messages ----
  | { type: 'ADD_CONTACT_MESSAGE'; payload: ContactMessage }
  // ---- Newsletter ----
  | { type: 'ADD_NEWSLETTER_SUB'; payload: NewsletterSub };

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
const CONTENT_SEED_VERSION = 4;
const SEED_VERSION_KEY = 'liora_content_seed_v';
// Key lưu trữ nội dung site (bump khi cần ép làm mới toàn bộ cache).
// v4: force refresh newsArticles cho khách đang giữ cache stale bài cũ.
const SITE_CONTENT_KEY = 'liora_site_content_v4';

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

  // Khi WP headless đang ON → KHÔNG khôi phục newsArticles từ localStorage
  // (WP là nguồn bài; cache localStorage sẽ gây hiển thị bài cũ/stale).
  const wpEnabled = getWordPressConfig().useWordPress;
  const newsArticles =
    wpEnabled || seedChanged || !stored?.newsArticles?.length
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
  reviews: safeParse<Review[]>('liora_reviews', []),
  contactMessages: safeParse<ContactMessage[]>('liora_contact_messages', []),
  newsletterSubs: safeParse<NewsletterSub[]>('liora_newsletter_subs', []),
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

    // ---- Reviews ----
    case 'ADD_REVIEW':
      return { ...state, reviews: [action.payload, ...state.reviews] };

    // ---- Contact Messages ----
    case 'ADD_CONTACT_MESSAGE':
      return { ...state, contactMessages: [action.payload, ...state.contactMessages] };

    // ---- Newsletter ----
    case 'ADD_NEWSLETTER_SUB':
      return { ...state, newsletterSubs: [action.payload, ...state.newsletterSubs] };

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

import { getWordPressConfig, fetchWooCommerceProducts, fetchWordPressPosts, fetchWordPressSiteContent } from '../utils/wordpressService';

/** Hook that wires up all side-effects — used inside StoreProvider.tsx */
export function useStoreSetup() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Ref giữ state mới nhất cho các promise WP async dispatch (tránh stale state trong closure).
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Guard: khi cập nhật đến từ realtime (người khác thay đổi), KHÔNG sync ngược lên lại
  // (tránh vòng lặp: remote update → dispatch → sync → remote update → ...).
  const skipSyncRef = useRef(false);

  // ---- Bootstrap từ WordPress headless (sản phẩm + nội dung site + tin tức) ----
  // Khi useWordPress ON: WP là nguồn content. Mỗi nguồn fail độc lập (allSettled) → giữ seed/localStorage.
  useEffect(() => {
    const config = getWordPressConfig();
    if (!config.useWordPress || !config.apiUrl) return;

    const productsP = fetchWooCommerceProducts(config)
      .then(products => {
        if (products && products.length > 0) dispatch({ type: 'SET_PRODUCTS', payload: products });
      })
      .catch(err => { console.error('[Liora] load products từ WooCommerce thất bại, giữ seed:', err); });

    const contentP = fetchWordPressSiteContent(config)
      .then(partial => {
        if (!partial || Object.keys(partial).length === 0) return;
        const base = stateRef.current.siteContent;
        dispatch({
          type: 'SET_SITE_CONTENT',
          payload: {
            ...base,
            ...partial,
            settings: partial.settings ? { ...base.settings, ...partial.settings } : base.settings,
            footer: partial.footer ? { ...base.footer, ...partial.footer } : base.footer,
          },
        });
      })
      .catch(err => { console.error('[Liora] load site_content từ WP thất bại, giữ mặc định:', err); });

    const newsP = fetchWordPressPosts(config)
      .then(posts => {
        if (posts && posts.length > 0) {
          dispatch({ type: 'SET_SITE_CONTENT', payload: { ...stateRef.current.siteContent, newsArticles: posts } });
        }
      })
      .catch(err => { console.error('[Liora] load news từ WP thất bại, giữ seed:', err); });

    void Promise.allSettled([productsP, contentP, newsP]);
  }, []);

  // ---- Bootstrap từ Supabase (sản phẩm + nội dung site) ----
  // Bỏ qua khi WP đang ON (WP làm nguồn content). Auth/orders vẫn Supabase.
  useEffect(() => {
    if (!hasSupabase || getWordPressConfig().useWordPress) return; // chưa cấu hình / WP đang dùng → giữ seed/offline
    fetchProducts()
      .then(list => { if (list.length) dispatch({ type: 'SET_PRODUCTS', payload: list }); })
      .catch(err => console.error('[Liora] load products từ Supabase thất bại, giữ seed:', err));
    fetchSiteContent()
      .then(sc => dispatch({ type: 'SET_SITE_CONTENT', payload: sc }))
      .catch(err => console.error('[Liora] load site_content từ Supabase thất bại, giữ mặc định:', err));
  }, []);

  // ---- Realtime: lắng nghe thay đổi từ người khác/khác tab ----
  // Khi có thay đổi trên DB → fetch lại → dispatch (và đánh dấu skipSync để không sync ngược).
  useEffect(() => {
    if (!hasSupabase || getWordPressConfig().useWordPress) return;
    const unsubProducts = subscribeProducts(list => {
      skipSyncRef.current = true;
      dispatch({ type: 'SET_PRODUCTS', payload: list });
    });
    const unsubSite = subscribeSiteContent(sc => {
      skipSyncRef.current = true;
      dispatch({ type: 'SET_SITE_CONTENT', payload: sc });
    });
    return () => { unsubProducts(); unsubSite(); };
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
    localStorage.setItem('liora_reviews', JSON.stringify(state.reviews));
  }, [state.reviews]);

  useEffect(() => {
    localStorage.setItem('liora_contact_messages', JSON.stringify(state.contactMessages));
  }, [state.contactMessages]);

  useEffect(() => {
    localStorage.setItem('liora_newsletter_subs', JSON.stringify(state.newsletterSubs));
  }, [state.newsletterSubs]);

  useEffect(() => {
    // Cache offline (luôn giữ để app chạy được khi Supabase chưa xong)
    const config = getWordPressConfig();
    if (!config.useWordPress) {
      localStorage.setItem('liora_products_v2', JSON.stringify(state.products));
    }
    // Sync lên Supabase: chỉ admin mới có quyền ghi (RLS). Bỏ qua khi WP đang ON
    // và bỏ qua khi thay đổi đến từ realtime (tránh vòng lặp sync).
    if (hasSupabase && !config.useWordPress && state.user?.role === 'admin' && !skipSyncRef.current) {
      syncProducts(state.products);
    }
    // Reset cờ sau khi đã xử lý effect này
    skipSyncRef.current = false;
  }, [state.products, state.user]);

  useEffect(() => {
    const config = getWordPressConfig();
    // Khi WP headless đang ON → không persist siteContent vào localStorage
    // (WP là nguồn content; localStorage cache stale gây bài mới không hiển thị).
    if (!config.useWordPress) {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(state.siteContent));
    }
    // Sync lên Supabase: chỉ admin mới có quyền ghi (RLS). Bỏ qua khi WP đang ON
    // và bỏ qua khi thay đổi đến từ realtime (tránh vòng lặp sync).
    if (hasSupabase && !config.useWordPress && state.user?.role === 'admin' && !skipSyncRef.current) {
      syncSiteContent(state.siteContent);
    }
    // Reset cờ sau khi đã xử lý effect này
    skipSyncRef.current = false;
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
