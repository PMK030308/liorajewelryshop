/**
 * Đăng nhập Google / Facebook trực tiếp bằng SDK client-side (KHÔNG cần Supabase).
 *
 * Yêu cầu 2 biến env (tùy chọn, chỉ cần khi không dùng Supabase):
 *   VITE_GOOGLE_CLIENT_ID  — Google OAuth Client ID
 *   VITE_FB_APP_ID         — Facebook App ID
 *
 * Khi đăng nhập thành công, trả về object User (role = customer) để dispatch LOGIN
 * và lưu vào localStorage như chế độ demo.
 */

import type { User } from '../types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const FB_APP_ID = import.meta.env.VITE_FB_APP_ID as string | undefined;

/* ---------- Google Identity Services ---------- */

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise((resolve, reject) => {
    if (document.getElementById('google-identity-script')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'google-identity-script';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Không tải được Google SDK.'));
    document.head.appendChild(s);
  });
  return googleScriptPromise;
}

interface GoogleCredentialResponse {
  credential: string;
}

/** Giải mã JWT credential của Google (không cần thư viện ngoài). */
function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

/**
 * Đăng nhập Google bằng popup (Google Identity Services).
 * Trả về app User khi thành công.
 */
export async function loginWithGoogle(): Promise<User> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Chưa cấu hình VITE_GOOGLE_CLIENT_ID. Xem .env.example để bật đăng nhập Google.');
  }
  await loadGoogleScript();

  const google = (window as any).google;
  if (!google?.accounts?.id) {
    throw new Error('Google SDK chưa sẵn sàng.');
  }

  return new Promise<User>((resolve, reject) => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: GoogleCredentialResponse) => {
        const data = decodeJwt(response.credential);
        const email = (data.email as string) || '';
        const name = (data.name as string) || (data.given_name as string) || (email ? email.split('@')[0] : 'Khách Google');
        const picture = (data.picture as string) || undefined;
        const sub = (data.sub as string) || email;
        resolve({
          id: `google-${sub}`,
          email,
          name,
          role: 'customer',
          createdAt: Date.now(),
          // lưu avatar tùy chọn — User type không có field, bỏ qua
          password: undefined,
        });
      },
    });

    // Hiển thị popup OneTap / credential prompt
    google.accounts.id.prompt((notification: any) => {
      if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
        // Fallback: dùng nút RenderButton ẩn để user click
        reject(new Error('Đăng nhập Google bị huỷ hoặc không hiển thị.'));
      }
    });
  });
}

/* ---------- Facebook JavaScript SDK ---------- */

let fbScriptPromise: Promise<void> | null = null;

function loadFbScript(): Promise<void> {
  if (fbScriptPromise) return fbScriptPromise;
  fbScriptPromise = new Promise((resolve, reject) => {
    if (document.getElementById('facebook-jssdk')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'facebook-jssdk';
    s.src = 'https://connect.facebook.net/en_US/sdk.js';
    s.async = true;
    s.defer = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Không tải được Facebook SDK.'));
    document.head.appendChild(s);
  });
  return fbScriptPromise;
}

/** Đăng nhập Facebook bằng FB.login popup. Trả về app User. */
export async function loginWithFacebook(): Promise<User> {
  if (!FB_APP_ID) {
    throw new Error('Chưa cấu hình VITE_FB_APP_ID. Xem .env.example để bật đăng nhập Facebook.');
  }
  await loadFbScript();

  const FB = (window as any).FB;
  if (!FB) throw new Error('Facebook SDK chưa sẵn sàng.');

  FB.init({ appId: FB_APP_ID, cookie: true, xfbml: true, version: 'v18.0' });

  return new Promise<User>((resolve, reject) => {
    FB.login((response: any) => {
      if (response.status !== 'connected') {
        reject(new Error('Đăng nhập Facebook bị huỷ.'));
        return;
      }
      const fbId = response.authResponse?.userID as string;
      FB.api('/me', { fields: 'id,name,email' }, (me: any) => {
        const email = me.email || '';
        const name = me.name || (email ? email.split('@')[0] : 'Khách Facebook');
        resolve({
          id: `facebook-${fbId}`,
          email,
          name,
          role: 'customer',
          createdAt: Date.now(),
          password: undefined,
        });
      });
    }, { scope: 'email,public_profile' });
  });
}

/** true khi có Google client id. */
export const hasGoogleOAuth = !!GOOGLE_CLIENT_ID;
/** true khi có Facebook app id. */
export const hasFacebookOAuth = !!FB_APP_ID;