import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // ============================ BỘ SƯU TẬP (BST) ============================
  // ---- BST Hành Trình Nở Hoa ----
  {
    slug: 'bst-hanh-trinh-no-hoa-cham',
    code: 'HTNH-CHAM',
    name: 'Vòng Tay Bạc "CHẠM" - BST Hành Trình Nở Hoa',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 380000,
    originalPrice: 480000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    hot: true,
    shape: 'bracelet',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - CHẠM_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _HÀNH TRÌNH NỞ HOA_ - CHẠM_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Vòng tay hợp kim mạ bạc nằm trong bộ sưu tập "Hành Trình Nở Hoa" của LIORA - thiết kế mang thông điệp của sự trưởng thành và toả sáng rực rỡ.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 5.0,
    reviewCount: 120,
    inStock: 50
  },
  {
    slug: 'bst-hanh-trinh-no-hoa-diu',
    code: 'HTNH-DIU',
    name: 'Vòng Tay Bạc "DỊU" - BST Hành Trình Nở Hoa',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 380000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - DỊU_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _HÀNH TRÌNH NỞ HOA_ - DỊU_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Thiết kế thanh lịch, dịu dàng gợi nên vẻ đẹp mềm mại của những đóa hoa xuân nở rộ.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 4.9,
    reviewCount: 94,
    inStock: 45
  },
  {
    slug: 'bst-hanh-trinh-no-hoa-hoa',
    code: 'HTNH-HOA',
    name: 'Vòng Tay Bạc "HOA" - BST Hành Trình Nở Hoa',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 380000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'flower',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - HOA_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _HÀNH TRÌNH NỞ HOA_ - HOA_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Họa tiết hoa tinh tế mang lại nét kiêu sa, lộng lẫy và tràn đầy sức sống mới.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 4.8,
    reviewCount: 86,
    inStock: 40
  },
  {
    slug: 'bst-hanh-trinh-no-hoa-mam',
    code: 'HTNH-MAM',
    name: 'Vòng Tay Bạc "MẦM" - BST Hành Trình Nở Hoa',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 380000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - MẦM_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _HÀNH TRÌNH NỞ HOA_ - MẦM_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Đại diện cho khởi đầu mới căng tràn nhựa sống, đâm chồi nảy lộc thuần khiết.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 5.0,
    reviewCount: 112,
    inStock: 35
  },
  {
    slug: 'bst-hanh-trinh-no-hoa-nang',
    code: 'HTNH-NANG',
    name: 'Vòng Tay Bạc "NẮNG" - BST Hành Trình Nở Hoa',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 380000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'sparkle',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - NẮNG_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _HÀNH TRÌNH NỞ HOA_ - NẮNG_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Lấp lánh tựa nắng mai ấm áp soi rọi mọi hành trình đầy hi vọng.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 4.7,
    reviewCount: 79,
    inStock: 30
  },

  // ---- BST Xuân Hạ Thu Đông ----
  {
    slug: 'bst-xuan-ha-thu-dong-lang',
    code: 'XHTD-LANG',
    name: 'Vòng Tay Bạc "LẶNG" - BST Xuân Hạ Thu Đông',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 420000,
    originalPrice: 520000,
    tint: '#e2f0fe',
    tint2: '#d0e5fb',
    accent: '#1e40af',
    shape: 'bracelet',
    image: '/product/BST _XUÂN HẠ THU ĐÔNG_ - LẶNG_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _XUÂN HẠ THU ĐÔNG_ - LẶNG_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Vẻ tĩnh lặng, lắng sâu của trời thu và ngày đông chuyển dịch yên bình.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 4.8,
    reviewCount: 145,
    inStock: 25
  },
  {
    slug: 'bst-xuan-ha-thu-dong-ruc',
    code: 'XHTD-RUC',
    name: 'Vòng Tay Bạc "RỰC" - BST Xuân Hạ Thu Đông',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 420000,
    tint: '#fff3cd',
    tint2: '#ffeeba',
    accent: '#856404',
    shape: 'sparkle',
    image: '/product/BST _XUÂN HẠ THU ĐÔNG_ - RỰC_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _XUÂN HẠ THU ĐÔNG_ - RỰC_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Rực rỡ tựa nắng hè chói chang đầy năng động và cá tính nhiệt huyết.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 5.0,
    reviewCount: 218,
    inStock: 20
  },
  {
    slug: 'bst-xuan-ha-thu-dong-xuan',
    code: 'XHTD-XUAN',
    name: 'Vòng Tay Bạc "XUÂN" - BST Xuân Hạ Thu Đông',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 420000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'flower',
    image: '/product/BST _XUÂN HẠ THU ĐÔNG_ - XUÂN_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _XUÂN HẠ THU ĐÔNG_ - XUÂN_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Sắc xuân căng tràn, khởi sinh vạn vật đầy tươi vui, may mắn.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 4.9,
    reviewCount: 196,
    inStock: 18
  },
  {
    slug: 'bst-xuan-ha-thu-dong-yen',
    code: 'XHTD-YEN',
    name: 'Vòng Tay Bạc "YÊN" - BST Xuân Hạ Thu Đông',
    cat: 'bst',
    subcat: 'lac-tay',
    price: 420000,
    tint: '#fdf4f6',
    tint2: '#f9e5ea',
    accent: '#d8728a',
    shape: 'bracelet',
    image: '/product/BST _XUÂN HẠ THU ĐÔNG_ - YÊN_Vòng tay hợp kim mạ bạc.jpg',
    gallery: [
      '/product/BST _XUÂN HẠ THU ĐÔNG_ - YÊN_Vòng tay hợp kim mạ bạc.jpg',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'An yên, thanh đạm như một chiều đông lộng gió thầm lặng.',
    material: 'Hợp kim cao cấp xi mạ bạc',
    rating: 4.9,
    reviewCount: 135,
    inStock: 15
  },

  // ============================ BÁN CHẠY (BEST SELLERS) ============================
  // ---- Vòng tay kiềng trơn & Basic ----
  {
    slug: 'vong-tay-hop-kim-ma-bac-co-ban',
    code: 'VTHK-CB',
    name: 'Vòng Tay Hợp Kim Mạ Bạc Liora (Cơ bản)',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 250000,
    originalPrice: 320000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc_.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc_.png',
      '/product/Banner Vòng tay.png'
    ],
    description: 'Vòng xích trơn hợp kim mạ bạc cao cấp làm nền cho sự sáng tạo charm cá nhân.',
    material: 'Hợp kim cao cấp phủ bạc nguyên chất',
    rating: 4.8,
    reviewCount: 157,
    inStock: 30
  },
  {
    slug: 'vong-tron-hop-kim-ma-bac-diy',
    code: 'VTHK-TRON',
    name: 'Vòng Kiềng Trơn Hợp Kim Mạ Bạc DIY',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 190000,
    originalPrice: 250000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'ring',
    image: '/product/Vòng trơn hợp kim mạ bạc.png',
    imageHover: '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY.jpg',
    gallery: [
      '/product/Vòng trơn hợp kim mạ bạc.png',
      '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY.jpg',
      '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY(1).jpg',
      '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY(2).jpg',
      '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY(3).jpg'
    ],
    description: 'Vòng cứng dạng kiềng trơn mạ bạc dày dặn, hỗ trợ xoáy chốt để tự phối hạt charm theo sở thích.',
    material: 'Hợp kim phủ bạc nguyên khối bóng bẩy',
    rating: 4.8,
    reviewCount: 125,
    inStock: 45
  },

  // ---- Vòng tay gắn charm khác nhau ----
  {
    slug: 'vong-tay-charm-giac-mo-bac',
    code: 'VTCM-GMB',
    name: 'Vòng Tay Charm "Giấc Mơ Bạc" Liora',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 350000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Giấc Mơ Bạc.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Giấc Mơ Bạc.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Charm tròn chạm trổ hoa văn cổ điển kết hợp tinh hoa lấp lánh của mạ bạc.',
    material: 'Hợp kim xi mạ bạc cao cấp phối charm',
    rating: 5.0,
    reviewCount: 240,
    inStock: 25
  },
  {
    slug: 'vong-tay-charm-gau-sao-bang',
    code: 'VTCM-GSB',
    name: 'Vòng Tay Charm "Gấu Sao Băng" Liora',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 360000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'star',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Gấu Sao Băng.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Gấu Sao Băng.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Thiết kế gấu trúc bé xinh kèm dây sao băng rơi mang tính biểu tượng ngộ nghĩnh.',
    material: 'Hợp kim xi bạc đính cườm, đá tạo hình',
    rating: 4.8,
    reviewCount: 189,
    inStock: 22
  },
  {
    slug: 'vong-tay-charm-hello-kitty',
    code: 'VTCM-HKT',
    name: 'Vòng Tay Charm "Hello Kitty" Cute',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 350000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Hello Kitty.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Hello Kitty.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Charm chú mèo Hello Kitty thắt nơ hồng dễ thương đốn tim mọi cô gái trẻ trung và ngọt ngào.',
    material: 'Hợp kim mạ bạc cao cấp phủ men màu',
    rating: 4.9,
    reviewCount: 215,
    inStock: 19
  },
  {
    slug: 'vong-tay-charm-hoa-hong-ngoc',
    code: 'VTCM-HHN',
    name: 'Vòng Tay Charm "Hoa Hồng Ngọc" Liora',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 360000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'flower',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Hoa Hồng Ngọc.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Hoa Hồng Ngọc.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Sự kết hợp giữa nhành hoa hồng rực rỡ đính đá ruby hồng lấp lánh kiêu sa.',
    material: 'Hợp kim mạ bạc cao cấp, đá ruby tổng hợp',
    rating: 5.0,
    reviewCount: 301,
    inStock: 15
  },
  {
    slug: 'vong-tay-charm-hoa-ngoc',
    code: 'VTCM-HN',
    name: 'Vòng Tay Charm "Hoa Ngọc Cát Tường"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 360000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'flower',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Hoa Ngọc.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Hoa Ngọc.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Hoa ngọc cát tường lục bảo tượng trưng cho bình an và sự thịnh vượng bền vững.',
    material: 'Hợp kim xi mạ bạc, đính đá ngọc lục bảo',
    rating: 4.7,
    reviewCount: 142,
    inStock: 10
  },
  {
    slug: 'vong-tay-charm-khuc-ha-paris',
    code: 'VTCM-KHP',
    name: 'Vòng Tay Charm "Khúc Hạ Paris"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 370000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Khúc Hạ Paris.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Khúc Hạ Paris.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Phong cách cổ điển kiểu Pháp lãng mạn với charm Tháp Eiffel xinh xắn và các chuỗi hạt sang trọng.',
    material: 'Hợp kim mạ bạc cao cấp, ngọc trai nhân tạo',
    rating: 5.0,
    reviewCount: 110,
    inStock: 12
  },
  {
    slug: 'vong-tay-charm-luu-ly',
    code: 'VTCM-LL',
    name: 'Vòng Tay Charm "Hạt Lưu Ly" Liora',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 350000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'gem',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Lưu Ly.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Lưu Ly.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Các hạt đá lưu ly thủy tinh màu trong suốt pha sắc hồng tím mang hơi thở huyền ảo lung linh.',
    material: 'Hợp kim mạ bạc, pha lê lưu ly màu',
    rating: 4.8,
    reviewCount: 144,
    inStock: 18
  },
  {
    slug: 'vong-tay-charm-may-xanh',
    code: 'VTCM-MX',
    name: 'Vòng Tay Charm "Mây Xanh Yên Ả"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 350000,
    tint: '#e0f2fe',
    tint2: '#bae6fd',
    accent: '#0284c7',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Mây Xanh.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Mây Xanh.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Charm hình cụm mây trôi thanh thoát vẽ men sứ xanh da trời đầy thanh tịnh và sảng khoái.',
    material: 'Hợp kim mạ bạc cao cấp vẽ men màu',
    rating: 4.9,
    reviewCount: 95,
    inStock: 25
  },
  {
    slug: 'vong-tay-charm-no-hong',
    code: 'VTCM-NH',
    name: 'Vòng Tay Charm "Nơ Hồng Tiểu Thư"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 340000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bow',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Nơ Hồng.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Nơ Hồng.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Điểm xuyết chiếc nơ hồng ngọt ngào duyên dáng dành cho các nàng thơ xinh xắn.',
    material: 'Hợp kim mạ bạc và charm nơ chất liệu resin cao cấp',
    rating: 5.0,
    reviewCount: 228,
    inStock: 14
  },
  {
    slug: 'vong-tay-charm-tinh-tu-bac',
    code: 'VTCM-TTB',
    name: 'Vòng Tay Charm "Tinh Tú Bạc"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 360000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'star',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Tinh Tú Bạc.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Tinh Tú Bạc.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Vầng trăng ôm trọn chòm sao đính chùm đá pha lê lấp lánh tựa tinh hà về đêm.',
    material: 'Hợp kim mạ bạc cao cấp đính đá cz tự nhiên',
    rating: 4.8,
    reviewCount: 167,
    inStock: 20
  },
  {
    slug: 'vong-tay-charm-vuong-mien-do',
    code: 'VTCM-VMD',
    name: 'Vòng Tay Charm "Vương Miện Đỏ"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 370000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Vương Miện Đỏ.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Vương Miện Đỏ.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Chiếc vương miện nhỏ ngự trị giữa khối chuỗi đính đá đỏ ấn tượng tôn vinh nét quyến rũ bậc nhất.',
    material: 'Hợp kim mạ bạc, zircon đỏ ruby cao cấp',
    rating: 4.9,
    reviewCount: 88,
    inStock: 12
  },
  {
    slug: 'vong-tay-charm-xuan-sac',
    code: 'VTCM-XS',
    name: 'Vòng Tay Charm "Xuân Sắc Cỏ Hoa"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 350000,
    tint: '#fdf4f6',
    tint2: '#f9e5ea',
    accent: '#d8728a',
    shape: 'clover',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Xuân Sắc.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Xuân Sắc.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Chùm hoa mai mạ sắc vàng cùng cỏ bốn lá thạch anh xanh mát mang ngàn sinh khí Tết lộc phát.',
    material: 'Hợp kim mạ bạc đính xà cừ đá trang sức',
    rating: 5.0,
    reviewCount: 174,
    inStock: 16
  },
  {
    slug: 'vong-tay-charm-anh-yeu',
    code: 'VTCM-AY',
    name: 'Vòng Tay Charm "Ánh Yêu Trái Tim"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 350000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'heart',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Ánh Yêu.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Charm Ánh Yêu.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Thiết kế trái tim lồng phối đá chuyển sắc dưới ánh sáng mặt trời cực kỳ bắt mắt.',
    material: 'Hợp kim mạ bạc, đá màu chuyển sắc',
    rating: 4.9,
    reviewCount: 202,
    inStock: 25
  },
  {
    slug: 'vong-tay-thanh-lam',
    code: 'VTCM-TL',
    name: 'Vòng Tay Bạc "Thanh Lam Nguyệt Cát"',
    cat: 'best-seller',
    subcat: 'lac-tay',
    price: 340000,
    tint: '#ecfeff',
    tint2: '#cffafe',
    accent: '#0891b2',
    shape: 'bracelet',
    image: '/product/Vòng tay hợp kim mạ bạc - Thanh Lam.png',
    gallery: [
      '/product/Vòng tay hợp kim mạ bạc - Thanh Lam.png',
      '/product/Vòng tay hợp kim mạ bạc_.png'
    ],
    description: 'Màu lam ngọc của ngọc bích hòa trong chuỗi bạc mang nét tĩnh lặng tự tại tuyệt vời.',
    material: 'Hợp kim mạ bạc phối ngọc lam lục thạch',
    rating: 4.7,
    reviewCount: 69,
    inStock: 30
  },

  // ---- Dây chuyền ----
  {
    slug: 'khung-mat-day-chuyen-dung-da-nang-luong',
    code: 'KMDC-DDNL',
    name: 'Khung Mặt Dây Chuyền Đựng Đá Năng Lượng',
    cat: 'best-seller',
    subcat: 'day-chuyen',
    price: 290000,
    originalPrice: 390000,
    tint: '#fdf4f6',
    tint2: '#f2c8d2',
    accent: '#c2537a',
    shape: 'gem',
    image: '/product/Khung mặt dây chuyền - Đựng đá năng lượng.jpg',
    gallery: [
      '/product/Khung mặt dây chuyền - Đựng đá năng lượng.jpg',
      '/product/Khung mặt dây chuyền - Đựng đá năng lượng(1).jpg'
    ],
    description: 'Thiết kế lồng rỗng xoắn ốc tinh tế làm bằng bạc S925, dùng để đựng và khuếch tán đá năng lượng thiên nhiên.',
    material: 'Bạc S925 xi mạ bạch kim cao cấp',
    rating: 4.9,
    reviewCount: 93,
    inStock: 40
  }
];
