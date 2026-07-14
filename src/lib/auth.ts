import { supabase, hasSupabase } from './supabase';
import type { User, UserRole } from '../types';

interface ProfileRow {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: string | null;
}

/** Lấy app User từ session Supabase + dòng profiles. Trả null nếu chưa đăng nhập. */
async function mapUser(uid: string): Promise<User | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, phone, role')
    .eq('id', uid)
    .maybeSingle();
  if (error || !data) return null;
  const p = data as ProfileRow;
  return {
    id: p.id,
    email: p.email ?? '',
    name: p.name ?? '',
    phone: p.phone ?? undefined,
    role: (p.role as UserRole) ?? 'customer',
    createdAt: Date.now(),
  };
}

/** Đăng nhập email/password. Trả app User (đã có role). */
export async function signIn(email: string, password: string): Promise<User> {
  if (!supabase) throw new Error('Supabase chưa cấu hình — không thể đăng nhập.');
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) throw new Error('Đăng nhập thất bại.');
  // trigger handle_new_user có thể chưa kịp tạo profile → chờ rồi đọc lại
  let user = await mapUser(uid);
  if (!user) {
    await new Promise(r => setTimeout(r, 400));
    user = await mapUser(uid);
  }
  if (!user) throw new Error('Tài khoản chưa có profile. Liên hệ admin.');
  return user;
}

/** Đăng ký tài khoản khách hàng (role customer qua trigger). */
export async function signUp(name: string, email: string, password: string, phone?: string): Promise<User> {
  if (!supabase) throw new Error('Supabase chưa cấu hình — không thể đăng ký.');
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name, phone: phone || undefined } },
  });
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) throw new Error('Đăng ký thất bại (có thể cần xác nhận email).');
  // ghi phone vào profile nếu có (trigger chỉ set name/email/role)
  if (phone && supabase) {
    await supabase.from('profiles').update({ phone }).eq('id', uid);
  }
  let user = await mapUser(uid);
  if (!user) {
    await new Promise(r => setTimeout(r, 500));
    user = await mapUser(uid);
  }
  if (!user) {
    // session có nhưng profile chưa sẵn → trả user tối thiểu
    return { id: uid, email, name, phone, role: 'customer', createdAt: Date.now() };
  }
  return user;
}

/** Đăng xuất. */
export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Đăng nhập bằng OAuth (Google / Facebook).
 * Supabase sẽ redirect đến provider, sau khi xác thực redirect về `redirectTo`.
 * Session khôi phục tự động qua `onAuthChange`.
 */
export async function signInWithOAuth(
  provider: 'google' | 'facebook',
  redirectTo?: string,
): Promise<void> {
  if (!supabase) throw new Error('Supabase chưa cấu hình — không thể đăng nhập mạng xã hội.');
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${window.location.origin}${window.location.pathname}`,
    },
  });
  if (error) throw error;
}

/** Cập nhật profile (tên/SĐT) — khách tự sửa của mình. */
export async function updateProfile(uid: string, patch: { name?: string; phone?: string }): Promise<void> {
  if (!supabase) throw new Error('Supabase chưa cấu hình.');
  const { error } = await supabase.from('profiles').update(patch).eq('id', uid);
  if (error) throw error;
}

/** Lắng nghe thay đổi session Supabase → callback nhận app User (hoặc null khi đăng xuất). */
export function onAuthChange(cb: (user: User | null) => void): () => void {
  if (!supabase || !hasSupabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const uid = session?.user?.id;
    if (!uid) { cb(null); return; }
    // Trigger handle_new_user có thể chưa kịp tạo profile (đặc biệt sau OAuth redirect)
    // → retry vài lần trước khi báo đăng xuất.
    let user = await mapUser(uid);
    if (!user) {
      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 300));
        user = await mapUser(uid);
        if (user) break;
      }
    }
    if (!user) {
      // Profile vẫn chưa sẵn → tạo user tối thiểu từ session để user không bị đăng xuất ngay
      const sUser = session.user;
      cb({
        id: uid,
        email: sUser?.email ?? '',
        name: sUser?.user_metadata?.name || sUser?.user_metadata?.full_name || sUser?.user_metadata?.user_name || (sUser?.email ? sUser.email.split('@')[0] : 'Khách'),
        role: 'customer',
        createdAt: Date.now(),
      });
      return;
    }
    cb(user);
  });
  return () => data.subscription.unsubscribe();
}

/** Lấy user hiện tại lúc khởi động app (nếu còn session). */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user?.id;
  if (!uid) return null;
  // Trigger có thể chưa kịp tạo profile (sau OAuth redirect) → retry
  let user = await mapUser(uid);
  if (!user) {
    await new Promise(r => setTimeout(r, 400));
    user = await mapUser(uid);
  }
  return user;
}
