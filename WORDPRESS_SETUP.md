# Hướng dẫn gắn WordPress (blog SEO + tracking) vào Liorajewelry

Tài liệu này hướng dẫn cài blog WordPress tại **`blog.liorajewelry.com`** để (1) viết bài **SEO** và (2) **theo dõi người dùng** bằng WP Statistics. Web chính (`liorajewelry.com`, React + Supabase) chỉ **link sang** blog — không trao đổi data runtime, không cần CORS.

> Theme WordPress đã làm sẵn trong `wordpress-theme/liora-blog/`. Web React đã có nút "Tin tức" link sang blog + redirect `/news` cũ.

---

## Kiến trúc

```
liorajewelry.com  (Vercel, React SPA)  ──link "Tin tức"──▶  blog.liorajewelry.com  (host PHP/MySQL, WordPress)
   sản phẩm / giỏ hàng / đơn hàng (Supabase)                     bài viết SEO (HTML) + WP Statistics
```

Vì web React dùng hash routing (`#/...`) nên Google không index được bài viết → blog **phải do WordPress tự render** ra HTML. Đó là lý do blog tách subdomain và dùng theme riêng.

---

## Bạn cần có trước

- 1 host hỗ trợ **PHP ≥ 7.4 + MySQL** (shared host Hostinger/Tenten/Mắt Óc, VPS, …).
- Quyền quản lý DNS domain `liorajewelry.com` để tạo subdomain `blog.*`.

---

## Bước 1 — Tạo subdomain & cài WordPress

1. Vào quản lý DNS domain `liorajewelry.com`, thêm record:
   - `blog` → trỏ về host PHP/MySQL (A record tới IP host, hoặc CNAME tới host). Chi tiết lấy trong dashboard host.
2. Trên host: tạo site/subdomain `blog.liorajewelry.com`, gắn database MySQL mới.
3. Cài WordPress: mở `https://blog.liorajewelry.com` trong trình duyệt → theo wizard cài đặt WP (chọn ngôn ngữ Việt, tạo tài khoản admin).
   - Hoặc dùng auto-installer của host (Softaculous / 1-click WP) nếu có.

## Bước 2 — Bật permalink "Post name" (URL đẹp cho SEO)

Admin WordPress → **Cài đặt (Settings) → Đường dẫn tĩnh (Permalinks)** → chọn **Tên bài (Post name)** → **Lưu thay đổi**.

> Bắt buộc. Không để mặc định `?p=123` — URL xấu, SEO yếu.

## Bước 3 — Cài theme Liora Blog

1. Nén thư mục theme thành zip. Trong repo, tại thư mục `wordpress-theme/`:
   ```powershell
   Compress-Archive -Path liora-blog -DestinationPath liora-blog.zip
   ```
   (Linux/mac: `cd wordpress-theme && zip -r liora-blog.zip liora-blog/`)
2. Admin WordPress → **Giao diện (Appearance) → Giao diện (Themes) → Thêm mới (Add New) → Tải giao diện lên (Upload Theme)** → chọn `liora-blog.zip` → **Cài ngay** → **Kích hoạt (Activate)**.
3. **Giao diện → Tùy biến (Customize) → Nhận diện trang (Site Identity) → Logo** → upload logo Liora (lấy file `public/logoliora.jpg` trong repo web React).
4. Kiểm tra mở `https://blog.liorajewelry.com` → thấy blog style Liora (hồng, Be Vietnam Pro, logo, menu link về shop).

> Chi tiết cấu hình theme xem `wordpress-theme/liora-blog/README.md`.

## Bước 4 — Cài plugin SEO (Rank Math hoặc Yoast)

1. Admin → **Plugin (Plugins) → Thêm mới (Add New)** → tìm **Rank Math SEO** → Cài → Kích hoạt. (Yoast SEO cũng được.)
2. Vào **Rank Math → General Settings → Sitemap** → bật sitemap XML.
3. Khi viết bài, dùng khung Rank Math ở cuối bài: điền **focus keyword**, meta title/description, xem điểm SEO (mục tiêu ≥ 80).
4. Bật **Schema** (Article) và **Breadcrumb** trong Rank Math nếu cần.

## Bước 5 — Cài plugin WP Statistics (theo dõi người dùng)

1. Admin → **Plugin → Thêm mới** → tìm **WP Statistics** → Cài → Kích hoạt.
2. Vào **Statistics → Settings** → bật các mục muốn theo dõi (lượt xem, người online, trình duyệt, nguồn truy cập, quốc gia…).
3. Xem dữ liệu tại **Statistics → Overview** (trong admin WP). Dữ liệu lưu trong MySQL của host, riêng tư, không cần Google Analytics.

> Phạm vi lần này: tracking **chỉ blog**. Nếu sau muốn tracking cả shop React, mở task riêng (chèn GA4/Plausible vào `index.html` + bắn event route-change).

## Bước 6 — Viết vài bài SEO mẫu

1. Admin → **Bài viết (Posts) → Thêm mới (Add New)**.
2. Đặt tiêu đề chứa từ khoá, nội dung dùng heading H2/H3, thêm ảnh (đặt **Ảnh nổi bật / Featured Image**), gán **Chuyên mục (Category)**.
3. Điền focus keyword + meta ở khung Rank Math, đạt điểm ≥ 80 rồi **Công bố (Publish)**.
4. Lặp lại vài bài (kiến thức bạc, đá quý, cách bảo quản, phối đồ…).

## Bước 7 — Cấu hình web React trỏ đúng blog

Trên **Vercel** (nơi host web React):

1. Vào project `liorajewelry` → **Settings → Environment Variables**.
2. Thêm:
   - `VITE_BLOG_URL` = `https://blog.liorajewelry.com`
3. (Tuỳ chọn) Nếu sau này muốn bật headless (lấy bài WP vào web React) thì thêm `VITE_USE_WORDPRESS=true` + `VITE_WP_API_URL=https://blog.liorajewelry.com` — nhưng **không khuyến nghị** cho SEO, vì hash route không index. Giữ `VITE_USE_WORDPRESS=false`.
4. **Redeploy** (Deployments → Redeploy) để env có hiệu lực.
5. Test: mở `liorajewelry.com` → click **Tin tức** ở header → mở tab mới tới blog. Gõ `liorajewelry.com/#/news` → tự redirect sang blog.

> Chạy local: tạo `.env.local` cùng thư mục repo với `VITE_BLOG_URL=https://blog.liorajewelry.com`, rồi `npm run dev`.

## Bước 8 — Submit sitemap lên Google Search Console

1. Mở **Google Search Console** → thêm property mới cho `https://blog.liorajewelry.com` (xác minh qua DNS TXT record hoặc file HTML).
2. Vào property blog → **Sitemaps** → nhập `sitemap_index.xml` (URL đầy đủ: `https://blog.liorajewelry.com/sitemap_index.xml`) → **Submit**.
3. Đợi Google index (vài ngày). Theo dõi ở **Coverage** và **Performance**.

## Bước 9 — Cross-link 2 chiều (tốt cho SEO + UX)

- Theme Liora Blog đã có menu link về `liorajewelry.com` (Trang chủ / Sản phẩm / Giới thiệu / Liên hệ) — kiểm tra lại sau khi cài.
- Web React header đã có nút "Tin tức" link sang blog.
- Khi viết bài, **chèn link nội bộ** giữa các bài và thỉnh thoảng link về sản phẩm liên quan trên shop (`liorajewelry.com/#/product/...`).

---

## Kiểm tra cuối (checklist)

- [ ] `https://blog.liorajewelry.com` mở được, style Liora, menu link về shop.
- [ ] Mở 1 bài → URL dạng `blog.liorajewelry.com/ten-bai` (đẹp), **View Page Source** thấy HTML đầy đủ (server-render) + thẻ meta SEO do Rank Math chèn.
- [ ] `blog.liorajewelry.com/sitemap_index.xml` truy cập được.
- [ ] WP Statistics dashboard hiển thị lượt xem sau khi bạn vào vài trang.
- [ ] `liorajewelry.com` → nút "Tin tức" mở blog; `liorajewelry.com/#/news` redirect sang blog.
- [ ] Search Console: submit sitemap thành công, báo "Success".

---

## Lỗi thường gặp

- **View source blog mà chỉ thấy HTML rỗng / JS nhiều**: chắc chắn bạn đang xem theme Liora Blog (server-render) chứ không phải theme block/theme builder render-by-JS. Bật theme đúng.
- **Sitemap 404**: vào **Cài đặt → Đường dẫn tĩnh** Save lại 1 lần (flush rewrite rules).
- **Ảnh bài không hiện**: mỗi bài phải có **Ảnh nổi bật (Featured Image)**.
- **Nút "Tin tức" trên web chưa trỏ đúng**: chưa set `VITE_BLOG_URL` trên Vercel, hoặc chưa redeploy. Kiểm tra `.env.local` local / env Vercel.
- **Menu theme link sai domain shop**: sửa hằng số `LIORA_SHOP_URL` trong `wordpress-theme/liora-blog/functions.php` rồi upload lại theme.

## Phạm vi ngoài (không làm lần này)

- Cài WordPress thay bạn (cần host + DNS, ngoài môi trường này).
- Tracking trên web React shop (chỉ làm blog theo chốt của bạn).
- Bật headless (lấy bài WP vào web React) — giữ ngủ đông vì SEO yếu trên hash route.