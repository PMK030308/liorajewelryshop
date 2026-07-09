#!/usr/bin/env node
/**
 * Seed Supabase cho Liorajewelry (Phase 1):
 *   1. Tạo user admin (admin@liora.com / admin123) qua Auth admin API.
 *   2. Đặt profiles.role = 'admin' cho user đó.
 *   3. Seed toàn bộ sản phẩm từ public/api/products.json vào bảng products.
 *
 * Cách chạy:
 *   1. Copy .env.example → .env, điền VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY + SUPABASE_SERVICE_KEY
 *   2. (Nếu chưa có public/api/products.json) chạy: npm run gen-api
 *   3. npm run seed-supabase
 *
 * Script dùng SERVICE KEY (bypass RLS) → CHỈ chạy trên máy bạn, KHÔNG deploy.
 * Idempotent: chạy lại không trùng lặp.
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- Đọc .env (không phụ thuộc dotenv) ----
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

const SUPA_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPA_URL || !SERVICE_KEY) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong .env.');
  console.error('   Tạo .env (copy .env.example) rồi điền Project URL + service_role key.');
  process.exit(1);
}

// Service-role client (bypass RLS)
const supa = createClient(SUPA_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const ADMIN_EMAIL = 'admin@liora.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin LIORA';

async function ensureAdmin() {
  let adminId = null;
  // Thử tạo mới
  const { data, error } = await supa.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { name: ADMIN_NAME },
  });
  if (error) {
    if (/already|exists/i.test(error.message)) {
      console.log('• Admin user đã tồn tại — tìm id...');
      const { data: list, error: le } = await supa.auth.admin.listUsers();
      if (le) throw le;
      const u = (list.users || []).find(x => x.email.toLowerCase() === ADMIN_EMAIL);
      if (!u) throw new Error('Không tìm thấy admin user tồn tại.');
      adminId = u.id;
      // đảm bảo email_confirm
      await supa.auth.admin.updateUserById(adminId, { email_confirm: true });
    } else {
      throw error;
    }
  } else {
    adminId = data.user.id;
  }
  if (!adminId) throw new Error('Không lấy được admin id.');
  console.log(`✓ Admin user sẵn sàng (id: ${adminId})`);

  // Set role admin trong profiles (upsert ghi đè role)
  const { error: pe } = await supa
    .from('profiles')
    .upsert({ id: adminId, email: ADMIN_EMAIL, name: ADMIN_NAME, role: 'admin' }, { onConflict: 'id' });
  if (pe) throw pe;
  console.log("✓ profiles.role = 'admin'");
  return adminId;
}

async function seedProducts() {
  const file = path.join(__dirname, '..', 'public', 'api', 'products.json');
  if (!fs.existsSync(file)) {
    console.warn('⚠ Không tìm thấy public/api/products.json — bỏ qua seed sản phẩm.');
    console.warn('  Chạy: npm run gen-api  rồi chạy lại seed.');
    return;
  }
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = Array.isArray(json) ? json : (json.data || []);
  if (!items.length) { console.warn('⚠ products.json rỗng.'); return; }
  const rows = items.map(p => ({ slug: p.slug, data: p }));
  const { error } = await supa.from('products').upsert(rows, { onConflict: 'slug' });
  if (error) throw error;
  console.log(`✓ Đã seed ${rows.length} sản phẩm vào bảng products.`);
}

async function main() {
  console.log('— Seed Liorajewelry → Supabase —');
  await ensureAdmin();
  await seedProducts();
  console.log('\n🎉 Xong! Đăng nhập admin: admin@liora.com / ' + ADMIN_PASSWORD);
  console.log('   (Đổi mật khẩu sau khi đăng nhập lần đầu.)');
  console.log('   Mở admin (/#/admin) → chỉnh sửa bất kỳ mục nào → lưu → toàn bộ khách sẽ thấy thay đổi.');
}
main().catch(e => { console.error('❌ Seed thất bại:', e.message || e); process.exit(1); });