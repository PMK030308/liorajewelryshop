/**
 * Product seed data with real photography (Unsplash CDN).
 * - `image`        : flat product shot
 * - `imageHover`   : model / lifestyle shot (shown on hover)
 * - `gallery`      : extra angles for product detail page
 *
 * NOTE: Demo data only. Replace Unsplash URLs with your own CDN
 * (e.g. /uploads/sku-123/main.webp) before going to production.
 */
import { Product } from '../types';

/** Unsplash URL builder — `u('photo-id', 800)` → optimized image URL. */
const u = (id: string, w = 800): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Image pools per category. Reused across products for visual coherence. */
const IMG = {
  necklace: {
    flat: [
      u('photo-1599643478514-4a4204162810'),  // gold pendant
      u('photo-1602173574767-37ac01994b2a'),  // chain pendant
      u('photo-1535632787350-4e68ef0ac584'),  // pearl necklace
      u('photo-1611591437281-460bfbe1220a'),  // delicate chain
      u('photo-1599459183200-59c7687a1c20'),  // crystal necklace
    ],
    model: [
      u('photo-1611652022419-a9419f74343d'),  // woman wearing necklace
      u('photo-1622398925373-3f91b1e275f5'),  // necklace on neck
      u('photo-1623998021446-45cd9b269c95'),  // model side profile
      u('photo-1602173278125-15ddc94f80e3'),  // close-up neckline
    ],
  },
  ring: {
    flat: [
      u('photo-1605100804763-247f52bbfb77'),  // silver rings on stones
      u('photo-1583937443566-6fe1a1c6e400'),  // engagement ring box
      u('photo-1602751584552-8ba73aad10e1'),  // diamond ring closeup
      u('photo-1603561591411-07134e71a2a9'),  // gold ring
      u('photo-1631158325784-c5d4f60c33e2'),  // ring on velvet
    ],
    model: [
      u('photo-1572584642822-6f8de0243c93'),  // hand wearing rings
      u('photo-1543294001-f7cd5d7fb516'),     // hand showing ring
      u('photo-1556228720-195a672e8a03'),     // model with ring
      u('photo-1601121141461-9d6647bca1ed'),  // close-up ring on finger
    ],
  },
  earring: {
    flat: [
      u('photo-1535632066927-ab7c9ab60908'),  // silver earrings flat
      u('photo-1630019852942-f89202989a59'),  // drop earrings
      u('photo-1591214973517-fa5e8edd9023'),  // pearl earrings
      u('photo-1611652022419-a9419f74343d'),  // earrings styled
      u('photo-1635767582909-345c2c8e8c11'),  // earring set
    ],
    model: [
      u('photo-1515562141207-7a88fb7ce338'),  // woman with earrings
      u('photo-1573408301185-9146fe634ad0'),  // model showing earring
      u('photo-1469371670807-013ccf25f16a'),  // profile with earring
      u('photo-1495121605193-b116b5b9c5fe'),  // earring on woman
    ],
  },
  bracelet: {
    flat: [
      u('photo-1611591437281-460bfbe1220a'),  // silver bracelet
      u('photo-1606298855672-3efb63017be8'),  // chain bracelet
      u('photo-1573408301185-9146fe634ad0'),  // styled bracelet
      u('photo-1601121141461-9d6647bca1ed'),  // bracelet flat
    ],
    model: [
      u('photo-1561591113-cbc12bb6e2d6'),     // bracelet on hand
      u('photo-1620625515032-6ed0c1790c75'),  // wrist with bracelet
      u('photo-1602173278125-15ddc94f80e3'),  // model wearing bracelet
    ],
  },
  couple: {
    flat: [
      u('photo-1543294001-f7cd5d7fb516'),     // couple jewelry
      u('photo-1612371566062-5dc9a4cdb1d7'),  // diamond pair
    ],
    model: [
      u('photo-1606800052052-a08af7148866'),  // couple hands
      u('photo-1517677208171-0bc6725a3e60'),  // wedding rings
    ],
  },
};

/** Helper: pick image from pool by index (cycles). */
const pick = (pool: string[], i: number) => pool[i % pool.length];

/** Default review pool (rounded to 0.1). Cycles by index. */
const RATINGS = [4.9, 4.8, 5.0, 4.7, 4.9, 4.6, 5.0, 4.8];
const REVIEWS = [142, 89, 256, 67, 198, 320, 45, 174];

/**
 * Build a product entry — applies image pools + ratings automatically.
 *
 * @param withHover - When true, product gets `imageHover` (model wearing it) → hover swap.
 *                   When false, product is "flat only" (no hover model shot).
 */
function mk(
  base: Omit<Product, 'image' | 'imageHover' | 'gallery' | 'rating' | 'reviewCount' | 'material' | 'description' | 'inStock'>,
  idx: number,
  pool: keyof typeof IMG,
  withHover: boolean,
  extras: Partial<Product> = {}
): Product {
  const flatIdx = idx;
  const modelIdx = idx + 1;
  const image = pick(IMG[pool].flat, flatIdx);
  const gallery = withHover
    ? [
        pick(IMG[pool].flat, flatIdx + 2),
        pick(IMG[pool].model, modelIdx + 2),
        pick(IMG[pool].flat, flatIdx + 4),
      ]
    : [
        pick(IMG[pool].flat, flatIdx + 1),
        pick(IMG[pool].flat, flatIdx + 2),
        pick(IMG[pool].flat, flatIdx + 3),
      ];
  return {
    ...base,
    image,
    ...(withHover ? { imageHover: pick(IMG[pool].model, modelIdx) } : {}),
    gallery,
    rating: RATINGS[idx % RATINGS.length],
    reviewCount: REVIEWS[idx % REVIEWS.length],
    inStock: 50 - (idx * 3),
    ...extras,
  };
}

/** ============================== PRODUCTS ============================== */
/**
 * Each product belongs to one of two image groups:
 *   - withHover=true  → has `imageHover` (model wearing it) → product card swaps on hover
 *   - withHover=false → "flat product only" → product card just zooms, no swap
 *
 * Balance: 13 with hover + 13 flat-only = 26 total.
 */
export const PRODUCTS: Product[] = [
  // ============================ MOISSANITE ============================
  // ---- Bông tai (4) ----
  mk({
    slug:'btj5-bowtie', code:'BTJ5',
    name:'Bông Tai Bạc Gắn Kim Cương Moissanite Xi Bạch Kim "Bowtie" BTJ5',
    cat:'moissanite', subcat:'bong-tai', price:658000, originalPrice:828000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', hot:true, shape:'bow',
  }, 0, 'earring', true, {
    description:'Bông tai bạc S925 thiết kế nơ tinh xảo, đính kim cương Moissanite GRA — lấp lánh từng góc nhìn, hoàn hảo cho mọi outfit.',
    material:'Bạc S925 xi bạch kim · Kim cương Moissanite 5 ly GRA',
  }),
  mk({
    slug:'btj2-petal', code:'BTJ2',
    name:'Bông Tai Bạc Gắn Kim Cương Moissanite Xi Bạch Kim "Petal" BTJ2',
    cat:'moissanite', subcat:'bong-tai', price:518000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'flower',
  }, 1, 'earring', false, {
    description:'Cánh hoa nhỏ xinh đính đá Moissanite ôm sát dái tai — thiết kế minimalist sang trọng, đeo cả ngày không nặng tai.',
    material:'Bạc S925 xi bạch kim · Moissanite 3 ly',
  }),
  mk({
    slug:'btj1-crystal', code:'BTJ1',
    name:'Bông Tai Bạc Gắn Kim Cương Moissanite "Crystal Flower" BTJ1',
    cat:'moissanite', subcat:'bong-tai', price:428000,
    tint:'#f0fdfa', tint2:'#ccfbf1', accent:'#14b8a6', shape:'flower',
  }, 2, 'earring', true),
  mk({
    slug:'btj3-frostflake', code:'BTJ3',
    name:'Bông Tai Bạc Gắn Kim Cương Moissanite "Frostflake" BTJ3',
    cat:'moissanite', subcat:'bong-tai', price:398000,
    tint:'#f0f9ff', tint2:'#dbeafe', accent:'#3b82f6', shape:'snow',
  }, 3, 'earring', false),

  // ---- Dây chuyền (6) ----
  mk({
    slug:'vcj1-julia', code:'VCJ1',
    name:'Dây Chuyền Kim Cương Moissanite 5 Ly "Julia" VCJ1',
    cat:'moissanite', subcat:'day-chuyen', price:978000, originalPrice:1180000,
    tint:'#eef2f7', tint2:'#b3c0d8', accent:'#34507a', hot:true, shape:'gem',
  }, 0, 'necklace', true, {
    description:'Dây chuyền solitaire kinh điển với viên Moissanite 5 ly chính giữa — kiểm định GRA, độ chiết quang vượt cả kim cương thật.',
    material:'Bạc S925 xi bạch kim · Moissanite 5 ly · Chiều dài 40-45cm điều chỉnh',
  }),
  mk({
    slug:'vcj2-lilac', code:'VCJ2',
    name:'Dây Chuyền Kim Cương Moissanite 5 Ly "Lilac Soul" VCJ2',
    cat:'moissanite', subcat:'day-chuyen', price:1078000,
    tint:'#f3eaff', tint2:'#e9d8fd', accent:'#a855f7', shape:'gem',
  }, 1, 'necklace', false),
  mk({
    slug:'vcj-aurea', code:'VCBG0QYDQ',
    name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Aurea"',
    cat:'moissanite', subcat:'day-chuyen', price:818000,
    tint:'#fffbeb', tint2:'#fef3c7', accent:'#d97706', shape:'gem',
  }, 2, 'necklace', true),
  mk({
    slug:'vcj5-aurora', code:'VCJ5',
    name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Aurora" VCJ5',
    cat:'moissanite', subcat:'day-chuyen', price:848000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', sold:true, shape:'bow',
  }, 3, 'necklace', false),
  mk({
    slug:'vcj6-celestial', code:'VCJ6',
    name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Celestial Spark" VCJ6',
    cat:'moissanite', subcat:'day-chuyen', price:868000,
    tint:'#ecfeff', tint2:'#cffafe', accent:'#06b6d4', shape:'star',
  }, 4, 'necklace', true),
  mk({
    slug:'vcj4-kristal', code:'VCJ4',
    name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Kristal Ayna" VCJ4',
    cat:'moissanite', subcat:'day-chuyen', price:818000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'gem',
  }, 5, 'necklace', false),

  // ---- Lắc tay (4) ----
  mk({
    slug:'ltj4-frosted', code:'LTJ4',
    name:'Lắc Tay Bạc Gắn Kim Cương Moissanite 7 Ly "Frosted Aura" LTJ4',
    cat:'moissanite', subcat:'lac-tay', price:858000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bracelet',
  }, 0, 'bracelet', true, {
    description:'Lắc tay dây thanh mảnh, đính 7 viên Moissanite đều tăm tắp — lấp lánh mỗi lần chuyển động cổ tay.',
    material:'Bạc S925 · Moissanite 2 ly × 7 viên',
  }),
  mk({
    slug:'ltj6-lace', code:'LTJ6',
    name:'Lắc Tay Bạc Gắn Kim Cương Moissanite "Lace Bloom" LTJ6',
    cat:'moissanite', subcat:'lac-tay', price:748000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'bracelet',
  }, 1, 'bracelet', false),
  mk({
    slug:'ltj7-moonlit', code:'LTJ7',
    name:'Lắc Tay Bạc Gắn Kim Cương Moissanite "Moonlit Grace" LTJ7',
    cat:'moissanite', subcat:'lac-tay', price:1548000,
    tint:'#f3eaff', tint2:'#e9d8fd', accent:'#a855f7', sold:true, shape:'bracelet',
  }, 2, 'bracelet', false),
  mk({
    slug:'ltj5-sweet', code:'LTJ5',
    name:'Lắc Tay Bạc Kim Cương Moissanite 6 Ly "Sweet Gleam" LTJ5',
    cat:'moissanite', subcat:'lac-tay', price:928000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bracelet',
  }, 3, 'bracelet', true),

  // ---- Nhẫn (2) ----
  mk({
    slug:'nlj2-aliyah', code:'NLJ2',
    name:'Nhẫn Bạc Gắn Kim Cương Moissanite "Aliyah" NLJ2',
    cat:'moissanite', subcat:'nhan-don', price:728000, originalPrice:898000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'ring',
  }, 0, 'ring', true, {
    description:'Nhẫn solitaire cổ điển — ổ chấu vàng trắng nâng viên Moissanite 5 ly nổi bật, kiểm định GRA đi kèm.',
    material:'Bạc S925 xi bạch kim · Moissanite 5 ly GRA',
  }),
  mk({
    slug:'nljc5-balmy', code:'NLJC5',
    name:'Nhẫn Bạc Gắn Kim Cương Moissanite "Balmy" NLJC5',
    cat:'moissanite', subcat:'nhan-don', price:578000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'ring',
  }, 1, 'ring', false),

  // ============================ BEST SELLERS ============================
  mk({
    slug:'bttl1-monas', code:'BTTL1',
    name:'Bông Tai Bạc Nữ S925 LIORA Đính Đá Cao Cấp "Monas" BTTL1',
    cat:'best-seller', subcat:'bong-tai', price:508000, originalPrice:628000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', hot:true, shape:'butterfly',
  }, 4, 'earring', true, {
    description:'Phiên bản bán chạy nhất 2025 — bông tai cánh bướm đính đá CZ siêu lấp lánh, dáng nhẹ phù hợp đi làm + đi tiệc.',
    material:'Bạc S925 · Đính đá CZ Thuỵ Sĩ',
  }),
  mk({
    slug:'vctl9-dahlia', code:'VCTL9',
    name:'Dây Chuyền Bạc Nữ 925 LIORA Hình Nơ Siêu Xinh "Dahlia" VCTL9',
    cat:'best-seller', subcat:'day-chuyen', price:478000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bow',
  }, 6, 'necklace', false),
  mk({
    slug:'vctl2-fluffy', code:'VCTL2',
    name:'Dây Chuyền Bạc Nữ LIORA Dây Xù Đính Đá CZ "Fluffy Flow" VCTL2',
    cat:'best-seller', subcat:'day-chuyen', price:938000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'gem',
  }, 7, 'necklace', true),
  mk({
    slug:'vctl3-ribbonnie', code:'VCTL3',
    name:'Dây Chuyền Bạc Nữ LIORA Hot Trend "Ribbonnie" VCTL3',
    cat:'best-seller', subcat:'day-chuyen', price:548000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bow',
  }, 8, 'necklace', false),
  mk({
    slug:'vcard7952-kismet', code:'VCARD7952',
    name:'Dây Chuyền Bạc S925 LIORA Cỏ 4 Lá "KISMET" VCARD7952',
    cat:'best-seller', subcat:'day-chuyen', price:558000,
    tint:'#fff7e6', tint2:'#feeec0', accent:'#d97706', shape:'clover',
  }, 9, 'necklace', true, {
    description:'Biểu tượng cỏ 4 lá mang lại may mắn — món quà tặng ý nghĩa cho người thân yêu.',
    material:'Bạc S925 · Mạ vàng 18K · Đính CZ',
  }),
  mk({
    slug:'vcard7212-sana', code:'VCARD7212',
    name:'Dây Chuyền Bạc S925 LIORA Đính Đá CZ "SANA" VCARD7212',
    cat:'best-seller', subcat:'day-chuyen', price:498000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', hot:true, shape:'gem',
  }, 10, 'necklace', true),
  mk({
    slug:'vcdj1-couple', code:'VCDJ1',
    name:'Dây Chuyền Đôi Bạc S925 LIORA "Couple Ring" VCDJ1',
    cat:'best-seller', subcat:'cap-doi', price:858000, originalPrice:998000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'heart',
  }, 0, 'couple', true, {
    description:'Set 2 dây chuyền đôi mặt khoá trái tim — quà tặng valentine cực kỳ ý nghĩa cho cặp đôi.',
    material:'Bạc S925 × 2 chiếc · Khắc tên miễn phí',
  }),
  mk({
    slug:'ltars5983-audrey', code:'LTARS5983',
    name:'Lắc Tay Bạc Nữ LIORA Nơ Mix Đá Dây Rút "Audrey" LTARS5983',
    cat:'best-seller', subcat:'lac-tay', price:888000,
    tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'bracelet',
  }, 4, 'bracelet', false),
  mk({
    slug:'lttl5-serena', code:'LTTL5',
    name:'Lắc Tay Bạc Nữ Dây Xù LIORA "Serena" LTTL5',
    cat:'best-seller', subcat:'lac-tay', price:378000,
    tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bracelet',
  }, 5, 'bracelet', true),
  mk({
    slug:'lttl4-luena', code:'LTTL4',
    name:'Lắc Tay Bạc Nữ LIORA Đính Đá Đổi Màu "Luena" LTTL4',
    cat:'best-seller', subcat:'lac-tay', price:468000,
    tint:'#f3eaff', tint2:'#e9d8fd', accent:'#a855f7', shape:'bracelet',
  }, 6, 'bracelet', false),
];
