#!/usr/bin/env node
/**
 * Kiểm tra kích thước data sản phẩm — phát hiện ảnh base64 lớn gây timeout khi fetch.
 * Chạy: node scripts/diag-image-size.mjs
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
const ANON = process.env.VITE_SUPABASE_ANON_KEY;
const supa = createClient(URL, ANON);

// Fetch 1 product (nhỏ hơn — ít khả năng timeout) để xem cấu trúc image
const t0 = Date.now();
const { data, error } = await supa.from('products').select('slug, data').limit(1).maybeSingle();
const ms = Date.now() - t0;
if (error) {
  console.error(`❌ Fetch 1 product lỗi (${ms}ms):`, error.message);
  // thử fetch chỉ slug (không data) để xem bảng respond không
  const { error: e2 } = await supa.from('products').select('slug').limit(1);
  console.error('   fetch chỉ slug:', e2 ? e2.message : 'OK');
  process.exit(1);
}
console.log(`✅ Fetch 1 product: ${ms}ms`);
const p = data?.data;
if (p) {
  const img = p.image;
  const imgLen = typeof img === 'string' ? img.length : 0;
  console.log('slug:', data.slug);
  console.log('image field length (chars):', imgLen, imgLen > 5000 ? '→ BASE64 LỚN (gây timeout)' : '→ URL ngắn hoặc nhỏ');
  console.log('image preview:', typeof img === 'string' ? img.slice(0, 60) : img);
  // tổng kích thước JSON của 1 product
  console.log('product JSON size (bytes):', JSON.stringify(p).length);
}

// Ước lượng tổng dung lượng tất cả products (chỉ select data, đếm ký tự)
console.log('\nĐang đo tổng dung lượng tất cả products...');
const t1 = Date.now();
const { data: all, error: eAll } = await supa.from('products').select('data');
const msAll = Date.now() - t1;
if (eAll) {
  console.error(`❌ Fetch all products lỗi (${msAll}ms):`, eAll.message, '→ confirm: data quá lớn gây timeout');
} else {
  const totalBytes = JSON.stringify(all).length;
  console.log(`✅ Fetch all: ${msAll}ms, ${all.length} sp, tổng ~${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  if (totalBytes > 2_000_000) console.log('   → DUNG LƯỢNG LỚN (>2MB) — nên chuyển ảnh sang Supabase Storage để fetch nhanh.');
}
process.exit(0);