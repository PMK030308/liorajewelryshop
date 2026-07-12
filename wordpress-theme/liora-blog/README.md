# Liora Blog — WordPress Theme

Theme blog SEO tối giản cho **Liora Jewelry**, khớp thương hiệu với web React (palette hồng, font *Be Vietnam Pro* + *Dancing Script*, logo, menu link về shop `liorajewelry.com`).

> Web chính (shop React) ở `liorajewelry.com`, blog ở `blog.liorajewelry.com`. Web React chỉ link sang blog — không fetch data runtime, không cần CORS.

## Cài đặt

### Cách 1 — nén zip và upload qua admin (khuyên dùng)
1. Nén **toàn bộ thư mục này** thành `liora-blog.zip` (mục tiêu: bên trong zip là thư mục `liora-blog/` chứa `style.css`).
   - PowerShell: `Compress-Archive -Path liora-blog -DestinationPath liora-blog.zip`
2. WordPress Admin → **Appearance (Giao diện) → Themes → Add New → Upload Theme** → chọn `liora-blog.zip` → **Install Now** → **Activate**.

### Cách 2 — copy qua FTP
Copy thư mục `liora-blog/` vào `/wp-content/themes/` rồi Admin → **Themes** → **Activate**.

## Cài đặt tiếp

1. **Permalinks** → Admin → **Settings → Permalinks** → chọn **Post name** → Save. (URL đẹp cho SEO.)
2. **Logo** → Admin → **Appearance → Customize → Site Identity → Logo** → upload logo Liora (lấy `public/logoliora.jpg` trong repo web React). Khuyến nghị PNG/Vuông ≥ 200×200.
3. **Menu** (tuỳ chọn): Admin → **Appearance → Menus** → tạo menu gán vào vị trí *Menu chính* nếu muốn thay link mặc định.
4. **Ảnh đại diện**: khi viết bài, luôn đặt **Featured Image** (ảnh đại diện) để card/hero hiển thị đẹp.
5. **Sidebar bài viết**: Admin → **Appearance → Widgets** → thêm widget vào khu *Sidebar bài viết* (mặc định đã có: Danh mục, Bài viết mới, Khám phá shop).

## Plugin nên cài (bắt buộc cho mục tiêu SEO + tracking)

- **Rank Math SEO** (miễn phí) — meta title/description, sitemap XML, schema, breadcrumb, phân tích từ khoá. *(Yoast SEO cũng được.)* Cài xong vào **Rank Math → Sitemap Settings** bật sitemap.
- **WP Statistics** (miễn phí) — theo dõi người dùng truy cập blog (lưu trong MySQL, riêng tư, không cần GA).

> Khi plugin SEO đã active, theme **tự ngừng** xuất meta description dự phòng để tránh trùng lặp (xem `functions.php` hàm `liora_fallback_meta_description`).

## Thay đổi domain shop

Mặc định menu link về `https://liorajewelry.com`. Nếu domain khác, sửa hằng số `LIORA_SHOP_URL` trong `functions.php`.

## Ghi chú

- Theme **không kèm `screenshot.png`** (ảnh preview trong giao diện Themes). WordPress vẫn chạy theme bình thường, chỉ thiếu ảnh thumbnail preview. Muốn có, thêm ảnh `screenshot.png` 1200×900 vào thư mục theme.
- Theme không sinh meta SEO riêng — giao hoàn toàn cho plugin SEO qua `wp_head()`.
- Không dùng WooCommerce; sản phẩm vẫn do web React + Supabase quản lý.

## Cấu trúc file

```
liora-blog/
├── style.css            // header theme + toàn bộ CSS thương hiệu
├── functions.php        // setup, enqueue font/style, fallback meta description, sidebar
├── header.php           // logo + menu link về shop
├── footer.php           // footer Liora
├── index.php            // danh sách bài (blog home/archive)
├── single.php           // trang bài viết
├── page.php             // trang tĩnh
├── search.php           // kết quả tìm kiếm
├── searchform.php       // form tìm kiếm
├── 404.php              // trang không tìm thấy
├── template-parts/
│   └── card.php         // thẻ bài (dùng trong index/search)
└── README.md
```