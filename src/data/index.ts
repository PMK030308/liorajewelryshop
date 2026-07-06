import { Category, HeroCat, HeroSlide, NewsArticle, SiteContent } from '../types';

// Re-export rich product data from products.ts (with image URLs, descriptions, ratings)
export { PRODUCTS } from './products';
import { PRODUCTS } from './products';

export const CATEGORIES: Category[] = [
  { slug:'all',            label:'Tất Cả Sản Phẩm',     icon:'sparkle' },
  { slug:'bst',            label:'Bộ Sưu Tập (BST)',    icon:'sparkle' },
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
  { slug:'set-qua',        label:'Set Quà Tặng',        icon:'gift' },
  { slug:'bao-duong',      label:'Bảo Dưỡng',           icon:'spray' },
];

export const HERO_CATS: HeroCat[] = [
  { slug:'lac-tay',    label:'Lắc Tay / Vòng Tay', tint:'#fff8fa', accent:'#c96b8d' },
  { slug:'day-chuyen', label:'Dây Chuyền',         tint:'#fdeef3', accent:'#ad4f74' },
  { slug:'cap-doi',    label:'Nhẫn Đôi',           tint:'#fff1f6', accent:'#8f3f61' },
  { slug:'nhan-don',   label:'Nhẫn Đơn',           tint:'#fff8fa', accent:'#c96b8d' },
  { slug:'bong-tai',   label:'Bông Tai',           tint:'#fdeef3', accent:'#df8fa9' },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    plaque: 'Bộ Sưu Tập Mới\nHÀNH TRÌNH NỞ HOA',
    script: 'Mỗi khoảnh khắc đều rạng ngời',
    tint:   '#fff8fa',
    image:  '/product/BST _HÀNH TRÌNH NỞ HOA_ - NẮNG_Vòng tay hợp kim mạ bạc.jpg',
    imageAlt: 'Bộ sưu tập Hành Trình Nở Hoa Liora',
  },
  {
    plaque: 'Vòng Tay Charm\nThiết Kế Đa Dạng',
    script: 'Điệu đà từng nét vẽ',
    tint:   '#fdeef3',
    image:  '/product/Banner Vòng tay.png',
    imageAlt: 'Vòng tay Charm Liora',
  },
  {
    plaque: 'Vòng Trơn DIY\nSáng Tạo Cá Nhân',
    script: 'Ghi dấu ấn của riêng bạn',
    tint:   '#fff1f6',
    image:  '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY.jpg',
    imageAlt: 'Vòng trơn DIY Liora',
  },
];

/** Lifestyle / brand imagery for static sections (About teaser, etc.). */
export const BRAND_IMAGES = {
  aboutLifestyle:  '/product/BST _HÀNH TRÌNH NỞ HOA_ - HOA_Vòng tay hợp kim mạ bạc.jpg',
  aboutLifestyle2: '/product/BST _XUÂN HẠ THU ĐÔNG_ - XUÂN_Vòng tay hợp kim mạ bạc.jpg',
  storefront:      '/product/Vòng trơn hợp kim mạ bạc.png',
};

export const NEWS_ARTICLES: NewsArticle[] = [
  { date:'16/02/2026', title:'✨ CHÚC MỪNG NĂM MỚI 2026 – LIORA ✨', excerpt:'Cảm ơn bạn đã luôn đồng hành cùng Liorajewelry trong suốt năm qua 💙 Bước sang năm mới, chúc bạn An Khang – Hạnh Phúc…', tint:'#fff1f2', accent:'#c96b8d' },
  { date:'14/02/2026', title:'Happy Valentine!', excerpt:'Tình yêu luôn được tạo nên từ những điều tinh tế và chân thành ✨ là những khoảnh khắc nhỏ nhưng đủ làm trái tim rung động…', tint:'#fff8fa', accent:'#c96b8d' },
  { date:'09/02/2026', title:'Món quà bạn tặng nói lên điều gì?', excerpt:'Món quà bạn tặng đang "nói" gì với cô ấy? 💌 Ưu đãi nhỏ, yêu thương to: 🌷 Đơn từ 500K → Tặng kèm thiệp xinh…', tint:'#fff1f6', accent:'#8f3f61' },
  { date:'02/02/2026', title:'Cách bảo quản trang sức bạc bền đẹp', excerpt:'Mẹo nhỏ giúp món trang sức yêu thích của bạn luôn sáng bóng như mới...', tint:'#fff8fa', accent:'#c96b8d' },
  { date:'28/01/2026', title:'Hướng dẫn chọn size nhẫn chuẩn', excerpt:'Bí quyết đo size ngón tay tại nhà cực đơn giản với dây và thước...', tint:'#fff8fa', accent:'#df8fa9' },
  { date:'20/01/2026', title:'Kim cương Moissanite là gì?', excerpt:'Tìm hiểu về loại đá quý lấp lánh không kém kim cương thật với giá hợp lý...', tint:'#fff1f2', accent:'#c96b8d' },
];

export const fmt = (n: number): string => n.toLocaleString('vi-VN') + '₫';
export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroSlides: HERO_SLIDES,
  newsArticles: NEWS_ARTICLES.map((article, index) => ({
    ...article,
    id: `post-${index + 1}`,
  })),
  pages: [
    {
      id: 'page-kiem-dinh',
      slug: 'kiem-dinh',
      title: 'Kiem Dinh',
      visible: true,
      content: '<p>Tat ca nguyen lieu su dung trong san pham Liorajewelry deu duoc kiem dinh chat luong nghiem ngat, dam bao do ben mau, an toan cho da va khong gay kich ung trong qua trinh su dung lau dai.</p><p>Moi san pham di kem the bao hanh va phieu kiem dinh de khach hang yen tam su dung.</p>',
    },
    {
      id: 'page-feedback',
      slug: 'feedback',
      title: 'Feedback',
      visible: true,
      content: '<p>Cam on cac khach hang da tin tuong va dong hanh cung Liorajewelry. Moi feedback la dong luc de chung minh hoan thien hon moi ngay.</p><p>Theo doi fanpage Liorajewelry.shop de xem cac danh gia thuc te tu khach hang.</p>',
    },
    {
      id: 'page-huong-dan',
      slug: 'huong-dan',
      title: 'Huong Dan',
      visible: true,
      content: '<p><strong>Huong dan chon size nhan:</strong> Dung mot soi chi quan quanh ngon tay, do chieu dai doan chi roi doi chieu bang size.</p><p><strong>Huong dan bao quan:</strong> Tranh nuoc hoa, hoa chat; cat trong hop khi khong su dung; lau bang vai mem.</p><p><strong>Huong dan dat hang:</strong> Chon san pham, them vao gio, thanh toan, nhan hang va kiem tra truoc khi tra tien COD.</p>',
    },
  ],
  settings: {
    brandName: 'LIORAJEWELRY',
    tagline: 'Lap Lanh em xinh',
    address: '159 Ly Thuong Kiet, Quang Trung, Ha Dong, Ha Noi',
    openHours: 'Mo cua: 9:00 - 21:00 hang ngay',
    hotline: '0982 463 691',
    facebookUrl: 'https://www.facebook.com/liorajewelry.vn',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.facebook.com/liorajewelry.vn&color=8e3051&bgcolor=FDF4F6',
  },
};

export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);
