import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client (frontend, dùng anon key + RLS).
 *
 * Yêu cầu 2 biến env trong .env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Nếu thiếu (chưa cấu hình backend), `supabase` = null và app chạy ở chế độ
 * seed/offline như cũ — mọi hàm trong repo/auth phải bắt lỗi và fallback.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

/** true khi đã cấu hình Supabase (có URL + anon key). */
export const hasSupabase = supabase !== null;

if (!hasSupabase) {
  // eslint-disable-next-line no-console
  console.info(
    '[Liora] Supabase chưa cấu hình (thiếu VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'App chạy ở chế độ offline/seed. Xem .env.example để bật backend.'
  );
}