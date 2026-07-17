import { supabase } from './supabase';
import type { Product, SiteContent, Order } from '../types';

/**
 * Repo — đọc/ghi sản phẩm, nội dung site & đơn hàng lên Supabase.
 * Tất cả hàm đều ném lỗi nếu Supabase chưa cấu hình; caller tự bắt và fallback seed/localStorage.
 */

// ---------------- Realtime subscriptions ----------------

/**
 * Lắng nghe thay đổi bảng products theo thời gian thực.
 * Trả về hàm unsubscribe (gọi khi cleanup).
 */
export function subscribeProducts(onChange: (products: Product[]) => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('realtime:products')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        // Lấy lại toàn bộ danh sách theo thứ tự updated_at
        try {
          const list = await fetchProducts();
          onChange(list);
        } catch (e) {
          console.error('[Liora] realtime products fetch thất bại:', e);
        }
      }
    )
    .subscribe();
  return () => {
    supabase?.removeChannel(channel);
  };
}

/**
 * Lắng nghe thay đổi bảng site_content theo thời gian thực.
 * Trả về hàm unsubscribe (gọi khi cleanup).
 */
export function subscribeSiteContent(onChange: (sc: SiteContent) => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('realtime:site_content')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_content' },
      async () => {
        try {
          const sc = await fetchSiteContent();
          onChange(sc);
        } catch (e) {
          console.error('[Liora] realtime site_content fetch thất bại:', e);
        }
      }
    )
    .subscribe();
  return () => {
    supabase?.removeChannel(channel);
  };
}

/**
 * Lắng nghe thay đổi bảng orders theo thời gian thực.
 * Trả về hàm unsubscribe (gọi khi cleanup).
 */
export function subscribeOrders(onChange: (orders: Order[]) => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('realtime:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async () => {
        try {
          const list = await fetchOrders();
          onChange(list);
        } catch (e) {
          console.error('[Liora] realtime orders fetch thất bại:', e);
        }
      }
    )
    .subscribe();
  return () => {
    supabase?.removeChannel(channel);
  };
}

// ---------------- Products ----------------
export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) throw new Error('Supabase chưa cấu hình');
  const { data, error } = await supabase
    .from('products')
    .select('data')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row: { data: unknown }) => row.data as Product)
    .filter(Boolean);
}

let syncProductsTimer: ReturnType<typeof setTimeout> | null = null;
let syncProductsLatest: Product[] | null = null;

/**
 * Đồng bộ toàn bộ danh sách sản phẩm lên Supabase (admin).
 * Debounce 800ms — gộp nhiều thay đổi liên tiếp (edit nhanh trong admin).
 * Upsert all + xoá các slug không còn trong list.
 */
export function syncProducts(list: Product[]): void {
  const sb = supabase;
  if (!sb) return;
  syncProductsLatest = list;
  if (syncProductsTimer) clearTimeout(syncProductsTimer);
  syncProductsTimer = setTimeout(async () => {
    const items = syncProductsLatest ?? [];
    try {
      const rows = items.map(p => ({ slug: p.slug, data: p as unknown as Record<string, unknown> }));
      // upsert tất cả
      const { error: upErr } = await sb
        .from('products')
        .upsert(rows, { onConflict: 'slug' });
      if (upErr) throw upErr;
      // xoá slug không còn
      const slugs = items.map(p => p.slug);
      const { error: delErr } = await sb
        .from('products')
        .delete()
        .not('slug', 'in', `(${slugs.map(s => `'${s.replace(/'/g, "''")}'`).join(',')})`);
      if (delErr) throw delErr;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[Liora] syncProducts thất bại:', e);
    }
  }, 800);
}

// ---------------- Site content ----------------
export async function fetchSiteContent(): Promise<SiteContent> {
  if (!supabase) throw new Error('Supabase chưa cấu hình');
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('site_content chưa có row (chạy seed-supabase)');
  return data.data as SiteContent;
}

let syncSiteTimer: ReturnType<typeof setTimeout> | null = null;
let syncSiteLatest: SiteContent | null = null;

/** Upsert nội dung site (singleton id=1). Debounce 800ms. */
export function syncSiteContent(sc: SiteContent): void {
  const sb = supabase;
  if (!sb) return;
  syncSiteLatest = sc;
  if (syncSiteTimer) clearTimeout(syncSiteTimer);
  syncSiteTimer = setTimeout(async () => {
    const payload = syncSiteLatest;
    if (!payload) return;
    try {
      const { error } = await sb
        .from('site_content')
        .upsert({ id: 1, data: payload as unknown as Record<string, unknown> }, { onConflict: 'id' });
      if (error) throw error;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[Liora] syncSiteContent thất bại:', e);
    }
  }, 800);
}

// ---------------- Orders ----------------

/**
 * Lấy danh sách đơn hàng.
 * - Admin: lấy tất cả (xem mọi đơn trong admin).
 * - Khách: chỉ lấy đơn của user_id = auth.uid() (RLS tự lọc).
 */
export async function fetchOrders(): Promise<Order[]> {
  if (!supabase) throw new Error('Supabase chưa cấu hình');
  const { data, error } = await supabase
    .from('orders')
    .select('data')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row: { data: unknown }) => row.data as Order)
    .filter(Boolean);
}

/**
 * Tạo đơn hàng mới lên Supabase.
 * - Khách: user_id = auth.uid() (RLS cho phép insert khi user_id = chính mình).
 * - Admin: có thể tạo đơn cho user khác.
 */
export async function createOrder(order: Order): Promise<void> {
  if (!supabase) throw new Error('Supabase chưa cấu hình');
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id ?? null;
  const { error } = await supabase
    .from('orders')
    .insert({
      id: order.id,
      user_id: order.userId ?? userId,
      data: order as unknown as Record<string, unknown>,
    });
  if (error) throw error;
}

/**
 * Cập nhật đơn hàng (admin đổi trạng thái, sửa đơn).
 */
export async function updateOrder(order: Order): Promise<void> {
  if (!supabase) throw new Error('Supabase chưa cấu hình');
  const { error } = await supabase
    .from('orders')
    .update({ data: order as unknown as Record<string, unknown> })
    .eq('id', order.id);
  if (error) throw error;
}

/**
 * Xóa đơn hàng (admin).
 */
export async function deleteOrder(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase chưa cấu hình');
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  if (error) throw error;
}