import { Category, HeroCat, HeroSlide, NewsArticle } from '../types';

// Re-export rich product data from products.ts (with image URLs, descriptions, ratings)
export { PRODUCTS } from './products';
import { PRODUCTS } from './products';

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

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const HERO_SLIDES: HeroSlide[] = [
  {
    plaque: 'Trang Sức Bạc\nDành Cho Giới Trẻ',
    script: 'Lấp lánh em xinh',
    tint:   '#c7d3e8',
    image:  unsplash('photo-1515562141207-7a88fb7ce338'),
    imageAlt: 'Người mẫu với bông tai LIORA',
  },
  {
    plaque: 'Kim Cương Moissanite\nKiểm Định GRA',
    script: 'Sang trọng tinh tế',
    tint:   '#d8d2e8',
    image:  unsplash('photo-1611652022419-a9419f74343d'),
    imageAlt: 'Người mẫu với dây chuyền Moissanite',
  },
  {
    plaque: 'Khắc Tên Cá Nhân Hoá\nQuà Tặng Yêu Thương',
    script: 'Ý nghĩa từng nét',
    tint:   '#dde0d8',
    image:  unsplash('photo-1573408301185-9146fe634ad0'),
    imageAlt: 'Người mẫu với trang sức khắc tên',
  },
];

/** Lifestyle / brand imagery for static sections (About teaser, etc.). */
export const BRAND_IMAGES = {
  aboutLifestyle:  unsplash('photo-1622398925373-3f91b1e275f5', 900),
  aboutLifestyle2: unsplash('photo-1469371670807-013ccf25f16a', 900),
  storefront:      unsplash('photo-1602173574767-37ac01994b2a', 1200),
};

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
