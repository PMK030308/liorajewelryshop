import { Product, Category, HeroCat, HeroSlide, NewsArticle } from '../types';

export const PRODUCTS: Product[] = [
  // Kim Cương Moissanite — Bông tai
  { slug:'btj5-bowtie',     code:'BTJ5',  name:'Bông Tai Bạc Gắn Kim Cương Moissanite Xi Bạch Kim "Bowtie" BTJ5',           cat:'moissanite', subcat:'bong-tai', price:658000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', hot:true,  shape:'bow' },
  { slug:'btj2-petal',      code:'BTJ2',  name:'Bông Tai Bạc Gắn Kim Cương Moissanite Xi Bạch Kim "Petal" BTJ2',            cat:'moissanite', subcat:'bong-tai', price:518000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'flower' },
  { slug:'btj1-crystal',    code:'BTJ1',  name:'Bông Tai Bạc Gắn Kim Cương Moissanite "Crystal Flower" BTJ1',                cat:'moissanite', subcat:'bong-tai', price:428000, tint:'#f0fdfa', tint2:'#ccfbf1', accent:'#14b8a6', shape:'flower' },
  { slug:'btj3-frostflake', code:'BTJ3',  name:'Bông Tai Bạc Gắn Kim Cương Moissanite "Frostflake" BTJ3',                    cat:'moissanite', subcat:'bong-tai', price:398000, tint:'#f0f9ff', tint2:'#dbeafe', accent:'#3b82f6', shape:'snow' },
  // Moissanite — Dây chuyền
  { slug:'vcj1-julia',      code:'VCJ1',  name:'Dây Chuyền Kim Cương Moissanite 5 Ly "Julia" VCJ1 - Vòng Cổ Bạc Nữ',         cat:'moissanite', subcat:'day-chuyen', price:978000, tint:'#eef2f7', tint2:'#b3c0d8', accent:'#34507a', hot:true,  shape:'gem' },
  { slug:'vcj2-lilac',      code:'VCJ2',  name:'Dây Chuyền Kim Cương Moissanite 5 Ly "Lilac Soul" VCJ2 - Vòng Cổ Bạc',       cat:'moissanite', subcat:'day-chuyen', price:1078000, tint:'#f3eaff', tint2:'#e9d8fd', accent:'#a855f7', shape:'gem' },
  { slug:'vcj-aurea',       code:'VCBG0QYDQ', name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Aurea" - Vòng Cổ Bạc Nữ',         cat:'moissanite', subcat:'day-chuyen', price:818000, tint:'#fffbeb', tint2:'#fef3c7', accent:'#d97706', shape:'gem' },
  { slug:'vcj5-aurora',     code:'VCJ5',  name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Aurora" VCJ5 - Vòng Cổ Bạc',           cat:'moissanite', subcat:'day-chuyen', price:848000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', sold:true, shape:'bow' },
  { slug:'vcj6-celestial',  code:'VCJ6',  name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Celestial Spark" VCJ6',                cat:'moissanite', subcat:'day-chuyen', price:868000, tint:'#ecfeff', tint2:'#cffafe', accent:'#06b6d4', shape:'star' },
  { slug:'vcj4-kristal',    code:'VCJ4',  name:'Dây Chuyền Kim Cương Moissanite 7 Ly "Kristal Ayna" VCJ4',                   cat:'moissanite', subcat:'day-chuyen', price:818000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'gem' },
  // Moissanite — Lắc tay
  { slug:'ltj4-frosted',    code:'LTJ4',  name:'Lắc Tay Bạc Gắn Kim Cương Moissanite 7 Ly "Frosted Aura" LTJ4',              cat:'moissanite', subcat:'lac-tay', price:858000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bracelet' },
  { slug:'ltj6-lace',       code:'LTJ6',  name:'Lắc Tay Bạc Gắn Kim Cương Moissanite "Lace Bloom" LTJ6',                     cat:'moissanite', subcat:'lac-tay', price:748000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'bracelet' },
  { slug:'ltj7-moonlit',    code:'LTJ7',  name:'Lắc Tay Bạc Gắn Kim Cương Moissanite "Moonlit Grace" LTJ7',                  cat:'moissanite', subcat:'lac-tay', price:1548000, tint:'#f3eaff', tint2:'#e9d8fd', accent:'#a855f7', sold:true, shape:'bracelet' },
  { slug:'ltj5-sweet',      code:'LTJ5',  name:'Lắc Tay Bạc Kim Cương Moissanite 6 Ly "Sweet Gleam" LTJ5',                   cat:'moissanite', subcat:'lac-tay', price:928000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bracelet' },
  // Moissanite — Nhẫn
  { slug:'nlj2-aliyah',     code:'NLJ2',  name:'Nhẫn Bạc Gắn Kim Cương Moissanite "Aliyah" NLJ2',                            cat:'moissanite', subcat:'nhan-don', price:728000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'ring' },
  { slug:'nljc5-balmy',     code:'NLJC5', name:'Nhẫn Bạc Gắn Kim Cương Moissanite "Balmy" NLJC5',                            cat:'moissanite', subcat:'nhan-don', price:578000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'ring' },
  // Best Sellers
  { slug:'bttl1-monas',     code:'BTTL1', name:'Bông Tai Bạc Nữ S925 LIORA Đính Đá Cao Cấp "Monas" BTTL1',                   cat:'best-seller', subcat:'bong-tai', price:508000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', hot:true, shape:'butterfly' },
  { slug:'vctl9-dahlia',    code:'VCTL9', name:'Dây Chuyền Bạc Nữ 925 LIORA Hình Nơ Siêu Xinh "Dahlia" VCTL9',               cat:'best-seller', subcat:'day-chuyen', price:478000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bow' },
  { slug:'vctl2-fluffy',    code:'VCTL2', name:'Dây Chuyền Bạc Nữ LIORA Dây Xù Đính Đá CZ "Fluffy Flow" VCTL2',              cat:'best-seller', subcat:'day-chuyen', price:938000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'gem' },
  { slug:'vctl3-ribbonnie', code:'VCTL3', name:'Dây Chuyền Bạc Nữ LIORA Hot Trend "Ribbonnie" VCTL3',                        cat:'best-seller', subcat:'day-chuyen', price:548000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bow' },
  { slug:'vcard7952-kismet',code:'VCARD7952', name:'Dây Chuyền Bạc S925 LIORA Cỏ 4 Lá "KISMET" VCARD7952',                   cat:'best-seller', subcat:'day-chuyen', price:558000, tint:'#fff7e6', tint2:'#feeec0', accent:'#d97706', shape:'clover' },
  { slug:'vcard7212-sana',  code:'VCARD7212', name:'Dây Chuyền Bạc S925 LIORA Đính Đá CZ "SANA" VCARD7212',                  cat:'best-seller', subcat:'day-chuyen', price:498000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', hot:true, shape:'gem' },
  { slug:'vcdj1-couple',    code:'VCDJ1', name:'Dây Chuyền Đôi Bạc S925 LIORA "Couple Ring" VCDJ1',                          cat:'best-seller', subcat:'cap-doi', price:858000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'heart' },
  { slug:'ltars5983-audrey',code:'LTARS5983', name:'Lắc Tay Bạc Nữ LIORA Nơ Mix Đá Dây Rút "Audrey" LTARS5983',              cat:'best-seller', subcat:'lac-tay', price:888000, tint:'#eef2f7', tint2:'#d8e0ec', accent:'#34507a', shape:'bracelet' },
  { slug:'lttl5-serena',    code:'LTTL5', name:'Lắc Tay Bạc Nữ Dây Xù LIORA "Serena" LTTL5',                                 cat:'best-seller', subcat:'lac-tay', price:378000, tint:'#f0f9ff', tint2:'#e0f2fe', accent:'#0ea5e9', shape:'bracelet' },
  { slug:'lttl4-luena',     code:'LTTL4', name:'Lắc Tay Bạc Nữ LIORA Đính Đá Đổi Màu "Luena" LTTL4',                         cat:'best-seller', subcat:'lac-tay', price:468000, tint:'#f3eaff', tint2:'#e9d8fd', accent:'#a855f7', shape:'bracelet' },
];

export const CATEGORIES: Category[] = [
  { slug:'all',            label:'Tất Cả Sản Phẩm',     icon:'sparkle' },
  { slug:'cap-doi',        label:'Cặp Đôi',             icon:'heart',
    sub:[ { slug:'nhan-doi', label:'Nhẫn Đôi Bạc' }, { slug:'lac-doi', label:'Lắc Tay Đôi Bạc' }, { slug:'vc-doi', label:'Dây Chuyền Đôi' } ]
  },
  { slug:'khac-ten',       label:'Khắc Tên',            icon:'pen',
    sub:[ { slug:'lac-khac-ten', label:'Lắc Tay Khắc Tên' }, { slug:'nhan-khac-ten', label:'Nhẫn Khắc Tên' } ]
  },
  { slug:'day-chuyen',     label:'Dây Chuyền Bạc',      icon:'necklace' },
  { slug:'lac-tay',        label:'Lắc Tay Bạc',         icon:'bracelet' },
  { slug:'lac-chan',        label:'Lắc Chân Bạc',        icon:'anklet' },
  { slug:'nhan-don',       label:'Nhẫn Đơn Bạc',        icon:'ring' },
  { slug:'bong-tai',       label:'Bông Tai / Khuyên Tai', icon:'earring' },
  { slug:'moissanite',     label:'Kim Cương Moissanite', icon:'gem' },
  { slug:'set-qua',        label:'Set Quà Tặng',        icon:'gift' },
  { slug:'bao-duong',      label:'Bảo Dưỡng',           icon:'spray' },
];

export const HERO_CATS: HeroCat[] = [
  { slug:'lac-tay',    label:'Lắc Tay / Vòng Tay', tint:'#eef2f7', accent:'#34507a' },
  { slug:'day-chuyen', label:'Dây Chuyền',         tint:'#f0f9ff', accent:'#0ea5e9' },
  { slug:'cap-doi',    label:'Nhẫn Đôi',           tint:'#f3eaff', accent:'#a855f7' },
  { slug:'nhan-don',   label:'Nhẫn Đơn',           tint:'#fff7e6', accent:'#d97706' },
  { slug:'bong-tai',   label:'Bông Tai',           tint:'#ecfeff', accent:'#06b6d4' },
];

export const HERO_SLIDES: HeroSlide[] = [
  { plaque:'Trang Sức Bạc\nDành Cho Giới Trẻ', script:'Lấp lánh em xinh', tint:'#c7d3e8' },
  { plaque:'Kim Cương Moissanite\nKiểm Định GRA',  script:'Sang trọng tinh tế', tint:'#d8d2e8' },
  { plaque:'Khắc Tên Cá Nhân Hoá\nQuà Tặng Yêu Thương', script:'Ý nghĩa từng nét', tint:'#dde0d8' },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  { date:'16/02/2026', title:'✨ CHÚC MỪNG NĂM MỚI 2026 – LIORA ✨', excerpt:'Cảm ơn bạn đã luôn đồng hành cùng Liorajewelry trong suốt năm qua 💙 Bước sang năm mới, chúc bạn An Khang – Hạnh Phúc…', tint:'#eef2f7', accent:'#34507a' },
  { date:'14/02/2026', title:'Happy Valentine!', excerpt:'Tình yêu luôn được tạo nên từ những điều tinh tế và chân thành ✨ là những khoảnh khắc nhỏ nhưng đủ làm trái tim rung động…', tint:'#f0f9ff', accent:'#0ea5e9' },
  { date:'09/02/2026', title:'Món quà bạn tặng nói lên điều gì?', excerpt:'Món quà bạn tặng đang "nói" gì với cô ấy? 💌 Ưu đãi nhỏ, yêu thương to: 🌷 Đơn từ 500K → Tặng kèm thiệp xinh…', tint:'#f3eaff', accent:'#a855f7' },
  { date:'02/02/2026', title:'Cách bảo quản trang sức bạc bền đẹp', excerpt:'Mẹo nhỏ giúp món trang sức yêu thích của bạn luôn sáng bóng như mới...', tint:'#fff7e6', accent:'#d97706' },
  { date:'28/01/2026', title:'Hướng dẫn chọn size nhẫn chuẩn', excerpt:'Bí quyết đo size ngón tay tại nhà cực đơn giản với dây và thước...', tint:'#ecfeff', accent:'#06b6d4' },
  { date:'20/01/2026', title:'Kim cương Moissanite là gì?', excerpt:'Tìm hiểu về loại đá quý lấp lánh không kém kim cương thật với giá hợp lý...', tint:'#eef2f7', accent:'#34507a' },
];

export const fmt = (n: number): string => n.toLocaleString('vi-VN') + '₫';
export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);
