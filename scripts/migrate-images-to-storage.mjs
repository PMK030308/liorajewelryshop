#!/usr/bin/env node
/**
 * Phase 1 — Tạo Storage bucket + migrate ảnh base64 trong products.data lên Storage URL.
 * Giải quyết: data sản phẩm chứa base64 lớn (~563KB/sp, 1.13MB/list) → load chậm/timeout.
 * Sau migrate: image chỉ còn URL (~100 bytes) → list ~50KB → load nhanh.
 *
 * Chạy: node scripts/migrate-images-to-storage.mjs
 * Dùng SERVICE KEY (bypass RLS) → upload + update không cần policy.
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, 'utf8');
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    if (process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}
loadEnv(path.join(__dirname, '..', '.env'));

const URL = process.env.VITE_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!URL || !SERVICE) { console.error('❌ Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_KEY trong .env'); process.exit(1); }

const supa = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });
const BUCKET = 'product-images';

// 1) Tạo bucket (public)
console.log('=== 1) Tạo Storage bucket:', BUCKET, '===');
const { error: bErr } = await supa.storage.createBucket(BUCKET, {
  public: true,
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  fileSizeLimit: 5 * 1024 * 1024,
});
if (bErr) {
  if (/already exist/i.test(bErr.message)) console.log('  Bucket đã tồn tại — OK.');
  else { console.error('  ❌ Lỗi tạo bucket:', bErr.message); process.exit(1); }
} else {
  console.log('  ✅ Đã tạo bucket public');
}

// 2) Migrate ảnh base64 → Storage URL
console.log('\n=== 2) Migrate ảnh base64 → Storage URL ===');
const { data: rows, error: fErr } = await supa.from('products').select('slug, data');
if (fErr) { console.error('❌ Fetch products lỗi:', fErr.message); process.exit(1); }
console.log(`Tổng sản phẩm: ${rows.length}`);

let migrated = 0, skipped = 0, failed = 0;
for (const row of rows) {
  const p = row.data;
  const img = p?.image;
  if (typeof img !== 'string' || !img.startsWith('data:')) {
    skipped++;
    continue;
  }
  try {
    const m = img.match(/^data:(image\/[\w+.-]+);base64,(.*)$/);
    if (!m) { console.warn(`  ⚠ ${row.slug}: base64 không hợp lệ — bỏ qua`); skipped++; continue; }
    const mime = m[1];
    const ext = mime.split('/')[1].replace('+xml', '').replace('jpeg', 'jpg');
    const buf = Buffer.from(m[2], 'base64');
    const filePath = `${row.slug}.${ext}`;
    const { error: upErr } = await supa.storage.from(BUCKET).upload(filePath, buf, {
      contentType: mime,
      upsert: true,
    });
    if (upErr) throw upErr;
    const { data: pub } = supa.storage.from(BUCKET).getPublicUrl(filePath);
    const publicUrl = pub.publicUrl;
    // Update product data: image = URL, thêm images[] để sẵn cho multi-image (Phase 2)
    const newData = { ...p, image: publicUrl, images: [publicUrl] };
    const { error: up2 } = await supa
      .from('products')
      .update({ data: newData, updated_at: new Date().toISOString() })
      .eq('slug', row.slug);
    if (up2) throw up2;
    migrated++;
    console.log(`  ✅ ${row.slug} → ${publicUrl}`);
  } catch (e) {
    failed++;
    console.error(`  ❌ ${row.slug}:`, e.message);
  }
}

console.log(`\nKết quả: migrated=${migrated}, skipped=${skipped} (không phải base64), failed=${failed}`);

// 3) In SQL policy cho admin upload (Phase 2)
console.log('\n=== 3) SQL policy cho admin upload (chạy trong SQL Editor) ===');
console.log(`-- Cho phép ai cũng ĐỌC bucket product-images; chỉ admin upload/update/delete.
drop policy if exists "product-images: public read"  on storage.objects;
drop policy if exists "product-images: admin insert" on storage.objects;
drop policy if exists "product-images: admin update" on storage.objects;
drop policy if exists "product-images: admin delete" on storage.objects;
create policy "product-images: public read"  on storage.objects for select using (bucket_id = 'product-images');
create policy "product-images: admin insert" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin update" on storage.objects for update using  (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin delete" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());`);
console.log('\n✅ Xong Phase 1. Chạy SQL trên trong Supabase Dashboard → SQL Editor để admin upload được (Phase 2).');
process.exit(0);