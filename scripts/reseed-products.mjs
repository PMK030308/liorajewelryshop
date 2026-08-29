#!/usr/bin/env node
/**
 * Xóa toàn bộ sản phẩm cũ trong Supabase (demo/mock) và seed lại từ
 * public/api/products.json (sản phẩm folder thật, mới được gen-api tạo).
 *
 * Chạy: node scripts/reseed-products.mjs
 * Cần .env có VITE_SUPABASE_URL + SUPABASE_SERVICE_KEY.
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
    if (!m) continue;
    if (line.trim().startsWith('#')) continue;
    if (process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}
loadEnv(path.join(__dirname, '..', '.env'));

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;
if (!url || !serviceKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong .env');
  process.exit(1);
}

const supa = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

// 1) Xóa toàn bộ sản phẩm cũ
const del = await supa.from('products').delete().neq('slug', '__never_match__');
console.log('[1] Xóa sản phẩm cũ -> error:', del.error ? JSON.stringify(del.error) : 'null');

// 2) Đọc products.json (folder thật)
const file = path.join(__dirname, '..', 'public', 'api', 'products.json');
const json = JSON.parse(fs.readFileSync(file, 'utf8'));
const items = Array.isArray(json) ? json : (json.data || []);
console.log('[2] products.json items:', items.length);

// 3) Upsert sản phẩm folder thật
const rows = items.map(p => ({ slug: p.slug, data: p }));
const up = await supa.from('products').upsert(rows, { onConflict: 'slug' });
console.log('[3] Upsert -> error:', up.error ? JSON.stringify(up.error) : 'null');

// 4) Đếm lại
const q = await supa.from('products').select('slug');
console.log('[4] Số sản phẩm trong Supabase:', q.data ? q.data.length : 0);
if (q.data && q.data.length) console.log('    slugs đầu:', q.data.slice(0, 5).map(x => x.slug));