import { Category, HeroCat, HeroSlide, NewsArticle, SiteContent } from '../types';

// Re-export rich product data from products.ts (with image URLs, descriptions, ratings)
export { PRODUCTS } from './products';
import { PRODUCTS } from './products';

export const CATEGORIES: Category[] = [
  { slug:'all',       label:'Tất Cả Sản Phẩm',  icon:'sparkle' },
  { slug:'bst',       label:'Bộ Sưu Tập (BST)', icon:'flower',
    sub: [
      { slug:'bst-hanh-trinh', label:'Hành Trình Nở Hoa' },
      { slug:'bst-xuan-ha-thu-dong', label:'Xuân Hạ Thu Đông' },
    ]
  },
  { slug:'diy',       label:'Phụ Kiện DIY',     icon:'star',
    sub: [
      { slug:'charm-titan', label:'Charm Titan' },
      { slug:'charm-da',    label:'Charm Đá Năng Lượng' },
      { slug:'day-vong',    label:'Dây Vòng' },
      { slug:'phu-kien-khac', label:'Phụ Kiện Khác' },
    ]
  },
  { slug:'vong-tay',  label:'Vòng Tay',          icon:'bracelet',
    sub: [
      { slug:'vong-tay-da',    label:'Vòng Tay Đá Năng Lượng' },
      { slug:'vong-tay-charm', label:'Vòng Tay Charm' },
    ]
  },
];

export const HERO_CATS: HeroCat[] = [
  { slug:'bst',      label:'Bộ Sưu Tập',       tint:'#fff7f9', accent:'#f472a0' },
  { slug:'vong-tay', label:'Vòng Tay',          tint:'#fdeef3', accent:'#ad4f74' },
  { slug:'diy',      label:'Phụ Kiện DIY',      tint:'#fff1f6', accent:'#b23a68' },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    plaque: 'Bộ Sưu Tập Mới\nHÀNH TRÌNH NỞ HOA',
    script: 'Mỗi khoảnh khắc đều rạng ngời',
    tint:   '#fff7f9',
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
  { date:'06/07/2026', title:'BST Hành Trình Nở Hoa: Khởi Đầu Mới Cùng Liora', excerpt:'Bộ sưu tập Hành Trình Nở Hoa mang đến nguồn cảm hứng bất tận, đại diện cho những khởi đầu tươi sáng và sức sống mãnh liệt. Khám phá ngay những thiết kế độc quyền chỉ có tại Liora Jewelry.', tint:'#fff1f2', accent:'#f472a0' },
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
