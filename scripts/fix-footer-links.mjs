import fs from 'fs';
const f = 'src/data/index.ts';
let c = fs.readFileSync(f, 'utf8');
const oldBlock = `    { label: 'Bảo hành, Đổi trả' },
    { label: 'Chính sách kiểm hàng' },
    { label: 'Chính sách giao hàng' },
    { label: 'Bảo mật thông tin' },`;
const newBlock = `    { label: 'Bảo hành & Đổi trả', nav: '/chinh-sach' },
    { label: 'Chính sách giao hàng', nav: '/chinh-sach' },
    { label: 'Bảo mật thông tin', nav: '/chinh-sach' },`;
if (c.includes(oldBlock)) {
  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(f, c, 'utf8');
  console.log('Done: footer policyLinks updated');
} else {
  console.log('Old block not found — already replaced?');
}