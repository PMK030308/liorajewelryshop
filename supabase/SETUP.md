# Hướng dẫn bật backend Supabase cho Liorajewelry (Phase 1)

Sau khi làm xong, chủ shop đăng nhập admin → sửa sản phẩm/banner/menu/SEO → **lưu Supabase** → toàn bộ khách truy cập thấy ngay trên mọi thiết bị.

## Bước 1 — Tạo project Supabase (free)
1. Vào https://supabase.com → đăng ký → **New project**.
2. Đặt tên project (vd `liorajewelry`), đặt database password, chọn region gần VN (Singapore).
3. Chờ ~2 phút project sẵn sàng.

## Bước 2 — Lấy 3 khoá
Dashboard → **Project Settings** → **API**:
- `Project URL` → điền vào `VITE_SUPABASE_URL`
- `anon public` key → điền vào `VITE_SUPABASE_ANON_KEY`
- `service_role` secret → điền vào `SUPABASE_SERVICE_KEY` (CHỈ dùng để seed, KHÔNG để vào biến `VITE_*`)

## Bước 3 — Tạo cấu trúc DB (bảng + RLS)
Dashboard → **SQL Editor** → **New query** → dán toàn bộ nội dung `supabase/schema.sql` → **Run**.
(Đảm bảo chạy hết không lỗi — tạo `profiles`, `products`, `site_content` + RLS + trigger.)

## Bước 4 — Cấu hình .env
Tạo file `.env` ở gốc project (copy từ `.env.example`), điền 3 giá trị ở Bước 2:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon...
SUPABASE_SERVICE_KEY=eyJ...service...
```

## Bước 5 — Seed dữ liệu + tạo admin
```bash
npm install
npm run gen-api        # tạo public/api/products.json nếu chưa có
npm run seed-supabase  # tạo admin admin@liora.com/admin123 + seed sản phẩm
```

## Bước 5b — Bật đăng nhập bằng Google & Facebook (OAuth)

Để nút "Đăng nhập bằng Google/Facebook" trên trang `/login` hoạt động, bạn cần bật
provider tương ứng trong Supabase Dashboard.

### Google
1. Vào **Google Cloud Console** → https://console.cloud.google.com
2. Tạo project (hoặc chọn project có sẵn) → **APIs & Services** → **Credentials**
   → **Create Credentials** → **OAuth client ID**.
3. Application type: **Web application**.
4. **Authorized redirect URIs** — thêm URL từ Supabase:
   `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   (xem đúng URL ở Supabase Dashboard → Authentication → Providers → Google).
5. Tạo xong → copy **Client ID** và **Client Secret**.
6. Vào Supabase Dashboard → **Authentication** → **Providers** → **Google** → bật ON
   → dán Client ID + Client Secret → **Save**.

### Facebook
1. Vào **Meta for Developers** → https://developers.facebook.com → **My Apps** → **Create App**.
2. Chọn loại **Consumer** (hoặc **Business**), đặt tên app.
3. Vào **Dashboard** của app → cuộn xuống **Add a Product** → thêm **Facebook Login**.
4. Vào **Facebook Login** → **Settings**:
   - **Valid OAuth Redirect URIs**: thêm
     `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - Lưu lại.
5. Vào **Settings** → **Basic** của app → copy **App ID** và **App Secret**.
6. Vào Supabase Dashboard → **Authentication** → **Providers** → **Facebook** → bật ON
   → dán App ID + App Secret → **Save**.

> Lưu ý: Facebook app ở chế độ **Development** chỉ cho phép test với tài khoản developer.
> Để khách hàng dùng được, hãy chuyển app sang **Live** (xem **App Review** trong Meta).

### Sau khi bật
- Không cần đổi code hay biến env — `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` đã đủ.
- Nút Google/Facebook trong `/#/login` sẽ redirect đến provider rồi quay về app và
  tự đăng nhập qua `onAuthStateChange`.

## Bước 6 — Chạy & kiểm tra
```bash
npm run dev
```
- Vào `http://localhost:5173/#/admin` → đăng nhập `admin@liora.com` / `admin123`.
- Sửa tên 1 sản phẩm (Lưu) → mở tab ẩn danh `/#/shop` → thấy thay đổi ngay.
- Mở `/#/admin` ở trình duyệt/máy khác (cùng đăng nhập admin) → cũng thấy dữ liệu mới.
- **Đổi mật khẩu admin** ngay sau lần đầu (Supabase Dashboard → Authentication → Users).
- Vào `/#/login` → bấm **Google** hoặc **Facebook** → đăng nhập → quay về app tự đăng nhập.

## Kiểm tra bảo mật (RLS)
Mở tab ẩn danh, dán vào Console:
```js
fetch('https://xxxx.supabase.co/rest/v1/products', {
  method:'POST',
  headers:{apikey:'<anon key>','Content-Type':'application/json'},
  body:'{"slug":"test","data":{}}'
}).then(r=>r.status).then(console.log)
```
→ phải trả **401/403** (chỉ admin ghi được). Đọc thì ai cũng được (200).

## Đăng nhập Google/Facebook KHÔNG cần Supabase

Nếu bạn **chưa muốn dùng Supabase**, vẫn có thể bật đăng nhập mạng xã hội bằng SDK
client-side (Google Identity Services + Facebook JavaScript SDK).

### 1. Tạo Google OAuth Client ID
1. Vào **Google Cloud Console** → https://console.cloud.google.com
2. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
3. Application type: **Web application**.
4. **Authorized JavaScript origins**: thêm `http://localhost:5173` (dev) + domain production.
5. Copy **Client ID** → điền vào `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
   ```

### 2. Tạo Facebook App ID
1. Vào **Meta for Developers** → https://developers.facebook.com → **Create App**.
2. Thêm product **Facebook Login**.
3. **Settings** → **Valid OAuth Redirect URIs**: thêm `http://localhost:5173` + domain production.
4. Copy **App ID** → điền vào `.env`:
   ```
   VITE_FB_APP_ID=1234567890
   ```

### 3. Chạy
```bash
npm run dev
```
- Vào `/#/login` → nút Google/Facebook sẽ hiển thị và hoạt động.
- User đăng nhập thành công được lưu vào localStorage (như chế độ demo).

> Khi đã cấu hình Supabase, bạn có thể bỏ 2 biến này — OAuth sẽ chuyển sang dùng
> Supabase Dashboard (bước 5b).

## Ghi chú
- Nếu chưa cấu hình Supabase (thiếu env), app vẫn chạy ở chế độ offline/seed như cũ — không crash.
- Ảnh upload từ admin hiện lưu base64 trong `products.data` (Phase 3 sẽ chuyển sang Supabase Storage cho nhẹ).
- Đơn hàng vẫn đang `localStorage` (Phase 2 mới đưa lên Supabase).
- Lần đầu tiên admin Lưu một mục nội dung (banner/menu/trang…), row `site_content` mới được tạo. Trước đó khách xem dùng dữ liệu mặc định.