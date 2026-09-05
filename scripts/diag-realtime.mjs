#!/usr/bin/env node
/**
 * Chẩn đoán nhanh: đọc bảng products từ Supabase + test realtime 20s.
 * Chạy: node scripts/diag-realtime.mjs
 * Trong 20s lắng nghe, hãy mở admin và sửa 1 sản phẩm để xem realtime có nhận event không.
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

const URL = process.env.VITE_SUPABASE_URL;
const ANON = process.env.VITE_SUPABASE_ANON_KEY;
if (!URL || !ANON) {
  console.error('❌ Thiếu VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY trong .env');
  process.exit(1);
}
console.log('Project:', URL);

const supa = createClient(URL, ANON);

// 1) Đọc products
const { data, error } = await supa
  .from('products')
  .select('slug, updated_at, data')
  .order('updated_at', { ascending: false });
if (error) {
  console.error('❌ Fetch products lỗi:', error.message);
  process.exit(1);
}
const items = (data ?? []).map(r => r.data).filter(Boolean);
console.log(`\n✅ Products trong Supabase: ${items.length} dòng`);
console.log('   3 sản phẩm mới nhất (theo updated_at):');
items.slice(0, 3).forEach((p, i) =>
  console.log(`   [${i + 1}] slug=${p.slug} | name=${p.name} | price=${p.price}`)
);
if (data[0]) console.log('   updated_at gần nhất:', data[0].updated_at);

// 2) Test realtime 20s
console.log('\n⏳ Lắng nghe realtime products 20 giây...');
console.log('   👉 BÂY GIỜ hãy mở admin (npm run dev → /#/admin) và SỬA 1 sản phẩm (đổi tên/giá) rồi Lưu.');
let gotEvent = false;
const channel = supa
  .channel('diag:products')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      gotEvent = true;
      const slug = payload.new?.slug ?? payload.old?.slug;
      console.log('   🔔 NHẬN event:', payload.eventType, 'slug=', slug);
    },
  )
  .subscribe((status) => {
    console.log('   channel status:', status);
  });

await new Promise(r => setTimeout(r, 20000));
supa.removeChannel(channel);
if (gotEvent) {
  console.log('\n✅ Realtime HOẠT ĐỘNG — event đã đến client.');
} else {
  console.log('\n❌ Realtime KHÔNG nhận event nào trong 20s.');
  console.log('   Nguyên nhân có thể: bạn chưa sửa sản phẩm, HOẶC bảng products chưa được bật');
  console.log('   trong publication supabase_realtime.');
  console.log('   → Vào Supabase Dashboard → Database → Publications → supabase_realtime');
  console.log('     → đảm bảo bảng "products" (và site_content, orders, user_carts) được TÍCH.');
  console.log('   → Hoặc chạy lại supabase/schema.sql trong SQL Editor.');
}
process.exit(0);