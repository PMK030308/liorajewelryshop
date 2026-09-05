#!/usr/bin/env node
/**
 * Dump tất cả products từ Supabase + field hasSize/hasPackaging/name/price
 * để xác minh sửa của admin có thực sự ghi xuống Supabase không.
 * Chạy: node scripts/diag-dump-products.mjs
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
if (!URL || !ANON) { console.error('❌ Thiếu env'); process.exit(1); }
const supa = createClient(URL, ANON);

const { data, error } = await supa
  .from('products')
  .select('slug, updated_at, data')
  .order('updated_at', { ascending: false });
if (error) { console.error('❌ Lỗi:', error.message); process.exit(1); }

console.log(`Products trong Supabase: ${data.length}\n`);
console.log('slug | name | price | hasSize | hasPackaging | updated_at');
console.log('-'.repeat(110));
for (const row of data) {
  const p = row.data;
  if (!p) continue;
  console.log(
    `${p.slug} | ${p.name} | ${p.price} | hasSize=${p.hasSize} | hasPackaging=${p.hasPackaging} | ${row.updated_at}`,
  );
}
process.exit(0);