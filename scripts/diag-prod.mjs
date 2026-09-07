#!/usr/bin/env node
/**
 * Chẩn đoán production: (1) bundle có env Supabase không, (2) Supabase có bao nhiêu sp.
 * Chạy: node scripts/diag-prod.mjs
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

const PROD = 'https://www.liorajewelry.online/';
console.log('=== 1) Kiểm tra production bundle ===');
try {
  const html = await (await fetch(PROD)).text();
  const jsMatch = html.match(/\/assets\/index-[A-Za-z0-9_\-]+\.js/);
  const jsPath = jsMatch ? jsMatch[0] : null;
  console.log('JS bundle:', jsPath);
  if (jsPath) {
    const js = await (await fetch(PROD + jsPath.replace(/^\//, ''))).text();
    console.log('  Supabase URL trong bundle:', js.includes('qulrmsdhydspkfwmsqwf') ? 'YES' : 'NO');
    console.log('  Anon key trong bundle   :', js.includes('sb_publishable_') ? 'YES' : 'NO');
    if (!js.includes('qulrmsdhydspkfwmsqwf')) {
      console.log('  => PRODUCTION KHÔNG có env Supabase → app chạy offline/seed → sp thêm trên production KHÔNG xuống Supabase → máy khác không thấy.');
    }
  } else {
    console.log('  (không tìm thấy JS bundle trong HTML)');
  }
} catch (e) {
  console.error('Lỗi fetch production:', e.message);
}

console.log('\n=== 2) Sản phẩm trên Supabase ===');
const URL = process.env.VITE_SUPABASE_URL;
const ANON = process.env.VITE_SUPABASE_ANON_KEY;
if (!URL || !ANON) { console.error('Thiếu env Supabase locally'); process.exit(1); }
const supa = createClient(URL, ANON);
const { data, error } = await supa.from('products').select('slug, updated_at').order('updated_at', { ascending: false });
if (error) { console.error('Lỗi fetch products:', error.message); process.exit(1); }
console.log('Số sản phẩm trên Supabase:', data.length);
console.log('3 slug mới nhất (theo updated_at):', data.slice(0, 3).map(r => r.slug + ' @ ' + r.updated_at).join(' | '));
process.exit(0);