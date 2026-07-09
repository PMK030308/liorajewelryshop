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

## Bước 6 — Chạy & kiểm tra
```bash
npm run dev
```
- Vào `http://localhost:5173/#/admin` → đăng nhập `admin@liora.com` / `admin123`.
- Sửa tên 1 sản phẩm (Lưu) → mở tab ẩn danh `/#/shop` → thấy thay đổi ngay.
- Mở `/#/admin` ở trình duyệt/máy khác (cùng đăng nhập admin) → cũng thấy dữ liệu mới.
- **Đổi mật khẩu admin** ngay sau lần đầu (Supabase Dashboard → Authentication → Users).

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

## Ghi chú
- Nếu chưa cấu hình Supabase (thiếu env), app vẫn chạy ở chế độ offline/seed như cũ — không crash.
- Ảnh upload từ admin hiện lưu base64 trong `products.data` (Phase 3 sẽ chuyển sang Supabase Storage cho nhẹ).
- Đơn hàng vẫn đang `localStorage` (Phase 2 mới đưa lên Supabase).
- Lần đầu tiên admin Lưu một mục nội dung (banner/menu/trang…), row `site_content` mới được tạo. Trước đó khách xem dùng dữ liệu mặc định.