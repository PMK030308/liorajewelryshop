#!/usr/bin/env node
/**
 * Test cuối cùng: realtime publication đã bật cho bảng products chưa?
 * Cách: dùng anon key subscribe realtime, rồi dùng service key UPDATE 1 product
 * (chỉ đổi updated_at — không đổi data). Nếu event đến → publication đã bật.
 * Chạy: node scripts/diag-realtime-write.mjs
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
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!URL || !ANON || !SERVICE) {
  console.error('❌ Thiếu env (cần VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY + SUPABASE_SERVICE_KEY)');
  process.exit(1);
}

const supaAnon = createClient(URL, ANON);
const supaService = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

// Chọn 1 product để "chạm" updated_at
const { data: rows, error: e1 } = await supaService.from('products').select('slug').limit(1);
if (e1 || !rows?.length) { console.error('❌ Không đọc được products:', e1?.message); process.exit(1); }
const slug = rows[0].slug;
console.log('Sản phẩm test:', slug);

let gotEvent = false;
let statusSeen = '';
console.log('Đang subscribe realtime (anon key)...');
const ch = supaAnon
  .channel('diag-write:products')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
    gotEvent = true;
    console.log('🔔 NHẬN event realtime:', payload.eventType, 'slug=', payload.new?.slug ?? payload.old?.slug);
  })
  .subscribe(async (status) => {
    statusSeen = status;
    console.log('   channel status:', status);
    if (status === 'SUBSCRIBED') {
      // Chạm updated_at để phát event (không đổi data khách thấy)
      const { error: eUp } = await supaService
        .from('products')
        .update({ updated_at: new Date().toISOString() })
        .eq('slug', slug);
      if (eUp) console.error('   update lỗi:', eUp.message);
      else console.log('   ✓ Đã UPDATE updated_at trên Supabase — chờ event...');
    }
  });

await new Promise(r => setTimeout(r, 8000));
supaAnon.removeChannel(ch);
if (gotEvent) {
  console.log('\n✅ Realtime publication ĐÃ BẬT cho products. Sau khi redeploy Vercel, sửa sản phẩm sẽ hiện ngay cho người khác (không cần F5).');
} else {
  console.log(`\n❌ Realtime KHÔNG nhận event (status=${statusSeen}). Bảng products CHƯA được bật trong publication supabase_realtime.`);
  console.log('   → Vào Supabase Dashboard → Database → Publications → supabase_realtime');
  console.log('     → TÍCH bảng products (và site_content, orders, user_carts) → Save.');
  console.log('   → Hoặc chạy lại supabase/schema.sql trong SQL Editor (đã có lệnh add publication).');
}
process.exit(0);