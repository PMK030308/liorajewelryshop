import { AboutContent, Category, FooterContent, HeroCat, HeroSlide, NewsArticle, SiteContent } from '../types';

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
  { date:'06/07/2026', title:'BST Hành Trình Nở Hoa: Khởi Đầu Mới Cùng Liora', excerpt:'Bộ sưu tập Hành Trình Nở Hoa mang đến nguồn cảm hứng bất tận, đại diện cho những khởi đầu tươi sáng và sức sống mãnh liệt. Khám phá ngay những thiết kế độc quyền chỉ có tại Liora Jewelry.', tint:'#fff1f2', accent:'#f472a0', image: BRAND_IMAGES.aboutLifestyle },

  // ============================================================
  // 5 BÀI VIẾT SEO SẢN PHẨM
  // ============================================================

  // ---- Bài 1: Vòng tay Rose Quartz ----
  {
    date: '07/07/2026',
    title: 'Vòng Tay Rose Quartz (Thạch Anh Hồng): Ý Nghĩa, Cách Chọn Và Bảo Quản',
    excerpt: 'Vòng tay Rose Quartz (thạch anh hồng) là biểu tượng của tình yêu thương và sự chữa lành. Tìm hiểu ý nghĩa phong thuỷ, cách chọn vòng hợp mệnh và bảo quản đá luôn sáng đẹp tại LIORA Jewelry.',
    tint: '#fdf4f6',
    accent: '#c2537a',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Hoa Hồng Ngọc.png',
    content: `
      <p><strong>Vòng tay Rose Quartz</strong> (hay còn gọi là <em>thạch anh hồng</em>) là một trong những loại đá năng lượng được yêu thích nhất tại LIORA Jewelry. Với sắc hồng dịu dàng và nguồn năng lượng ấm áp, chiếc vòng này không chỉ là món trang sức đẹp mắt mà còn là "người bạn" đồng hành giúp bạn thu hút tình duyên, chữa lành cảm xúc và nuôi dưỡng tình yêu thương. Bài viết dưới đây sẽ giúp bạn hiểu rõ ý nghĩa, cách chọn vòng hợp mệnh và bảo quản Rose Quartz luôn sáng đẹp.</p>

      <h2>Vòng tay Rose Quartz là gì?</h2>
      <p>Rose Quartz là một biến thể của thạch anh mang sắc hồng, được hình thành từ các khoáng chất titanium, iron hoặc manganese có trong đá. Trong phong thuỷ, thạch anh hồng được mệnh danh là "đá của tình yêu" — đại diện cho tình yêu đôi lứa, tình cảm gia đình, bạn bè và cả tình yêu thương bản thân. Vòng tay Rose Quartz thường được chế tác từ hạt đá tự nhiên 8–10mm, kết hợp dây hợp kim mạ bạc và charm Titan tạo nên một thiết kế thanh lịch, nữ tính, hợp với nhiều độ tuổi.</p>

      <h2>Ý nghĩa phong thuỷ của vòng tay thạch anh hồng</h2>
      <ul>
        <li><strong>Thu hút tình duyên:</strong> Rose Quartz giúp mở rộng tim, khơi dậy sự dịu dàng và tăng khả năng kết nối với người khác, rất hợp cho những ai đang tìm kiếm một mối quan hệ ý nghĩa.</li>
        <li><strong>Chữa lành cảm xúc:</strong> Năng lượng nhẹ nhàng của đá giúp xoa dịu tổn thương, giảm căng thẳng và mang lại cảm giác bình an trong tâm hồn.</li>
        <li><strong>Yêu thương bản thân:</strong> Nuôi dưỡng lòng trắc ẩn và sự tự tin, giúp bạn học cách trân trọng chính mình.</li>
        <li><strong>Cân bằng cảm xúc:</strong> Hỗ trợ điều hoà tâm trạng, rất phù hợp cho người dễ nổi nóng hay hay lo âu.</li>
      </ul>

      <h2>Vòng tay Rose Quartz hợp mệnh nào?</h2>
      <p>Theo ngũ hành, thạch anh hồng thuộc mệnh <strong>Hỏa</strong> (do sắc hồng ấm nóng) và cũng rất hợp với người mệnh <strong>Thổ</strong> (Hỏa sinh Thổ). Đặc biệt, người mệnh Thổ khi đeo Rose Quartz thường nhận được thêm năng lượng tích cực, sự hanh thông trong các mối quan hệ. Nếu bạn muốn tăng hiệu quả, có thể kết hợp Rose Quartz cùng Morganite — loại đá mang sắc hồng đào, giúp cân bằng cảm xúc và tăng thêm vẻ đẹp dịu dàng.</p>

      <h2>Cách chọn vòng tay thạch anh hồng chuẩn</h2>
      <ol>
        <li><strong>Chọn đá tự nhiên:</strong> Hạt đá nên trong, có vân mây nhẹ và màu hồng đều, tránh đá quá bóng bẩy, đều đặn bất thường (dấu hiệu đá nhân tạo).</li>
        <li><strong>Kích thước hạt:</strong> Hạt 8–10mm là cỡ phổ biến, vừa vặn cổ tay nữ, không quá nặng khi đeo lâu.</li>
        <li><strong>Chất liệu dây:</strong> Nên chọn dây hợp kim mạ bạc sáng bóng, bền màu, ít gây kích ứng da.</li>
        <li><strong>Charm đi kèm:</strong> Charm Titan (như charm nơ, charm Hello Kitty, charm hoa) giúp cá nhân hoè chiếc vòng theo phong cách riêng.</li>
      </ol>

      <p>Bạn có thể tham khảo các mẫu vòng Rose Quartz bán chạy tại LIORA như <a href="#/san-pham/vong-tay-nang-hong">Vòng Tay Nắng Hồng</a> hoặc <a href="#/san-pham/vong-tay-hoa-hong-ngoc">Vòng Tay Hoa Hồng Ngọc</a> (kết hợp Rose Quartz + Morganite).</p>

      <h2>Hướng dẫn bảo quản vòng tay Rose Quartz</h2>
      <ul>
        <li>Tránh tiếp xúc với nước hoa, hoá chất và nước nóng lâu.</li>
        <li>Tháo vòng khi tắm, vận động mạnh hoặc đi ngủ để giữ độ bền của dây và đá.</li>
        <li>Lau nhẹ bằng vải mềm, cất trong hộp có lớp lót khi không sử dụng.</li>
        <li>Định kỳ thanh tẩy năng lượng bằng cách để vòng dưới ánh trăng hoặc рядом với Clear Quartz.</li>
      </ul>

      <h2>Câu hỏi thường gặp</h2>
      <h3>Vòng tay Rose Quartz giá bao nhiêu?</h3>
      <p>Tại LIORA, các mẫu vòng tay Rose Quartz kết hợp charm Titan có mức giá khoảng 300.000₫, đầy đủ phiếu kiểm định và bảo hành.</p>
      <h3>Đeo thạch anh hồng tay nào thì tốt?</h3>
      <p>Thông thường nên đeo ở tay trái để đón nhận năng lượng tình duyên; tay phải hợp hơn cho người muốn xả năng lượng tiêu cực. Tuy nhiên bạn có thể đeo theo cảm giác thoải mái nhất.</p>
      <p>Hy vọng bài viết giúp bạn chọn được chiếc vòng tay Rose Quartz ưng ý. Khám phá thêm <a href="#/shop">cửa hàng LIORA</a> để tìm mẫu phù hợp với câu chuyện của riêng mình.</p>
    `,
  },

  // ---- Bài 2: Vòng tay Clear Quartz ----
  {
    date: '07/07/2026',
    title: 'Vòng Tay Clear Quartz (Thạch Anh Trắng): Đá Vua Của Sự Minh Mẫn',
    excerpt: 'Clear Quartz (thạch anh trắng) được mệnh danh là "đá vua" giúp thanh lọc năng lượng và tăng sự minh mẫn. Tìm hiểu ý nghĩa, công năng và cách chọn vòng tay Clear Quartz hợp mệnh Kim tại LIORA Jewelry.',
    tint: '#f8fafc',
    accent: '#64748b',
    image: '/product/Vòng tay hợp kim mạ bạc - Charm Giấc Mơ Bạc.png',
    content: `
      <p><strong>Vòng tay Clear Quartz</strong>, hay <em>thạch anh trắng</em>, được giới phong thuỷ gọi là "đá vua" nhờ khả năng thanh lọc năng lượng tiêu cực, khuếch đại năng lượng tích cực và tăng sự minh mẫn. Đây là loại đá nền tảng — vừa đẹp mắt, vừa dễ phối, lại hợp với mọi mệnh khi đi kèm các đá khác. Hãy cùng LIORA tìm hiểu chi tiết về loại đá năng lượng đặc biệt này.</p>

      <h2>Clear Quartz là đá gì?</h2>
      <p>Clear Quartz (Thạch Anh Trắng) là một khoáng chất silicon dioxide trong suốt, phổ biến trong tự nhiên nhưng luôn giữ sức hấp dẫn riêng nhờ độ trong vắt và khả năng tán sắc ánh sáng. Trong phong thuỷ, Clear Quartz được xem như "bộ khuếch đại" — nó khuếch đại năng lượng và ý định của người đeo, đồng thời thanh lọc các nguồn năng lượng tiêu cực xung quanh.</p>

      <h2>Ý nghĩa và công năng của vòng tay thạch anh trắng</h2>
      <ul>
        <li><strong>Thanh lọc năng lượng:</strong> Giúp gột rửa những năng lượng tiêu cực, mang lại sự minh mẫn và khởi đầu tích cực.</li>
        <li><strong>Khuếch đại ý định:</strong> Khi đeo Clear Quartz cùng các đá khác, nó sẽ khuếch đại công năng của đá chính.</li>
        <li><strong>Tăng sự tập trung:</strong> Rất hợp cho người làm việc trí óc, học sinh – sinh viên cần minh mẫn, sáng suốt.</li>
        <li><strong>Thu hút may mắn:</strong> Được xem là biểu tượng của hy vọng, niềm tin và những khởi đầu mới.</li>
      </ul>

      <h2>Vòng tay Clear Quartz hợp mệnh nào?</h2>
      <p>Theo ngũ hành, thạch anh trắng thuộc mệnh <strong>Kim</strong> (sắc trắng kim loại). Người mệnh Kim khi đeo Clear Quartz sẽ nhận được sự hanh thông, may mắn và cơ hội mới. Đặc biệt, vì Clear Quartz có tính "trung tính" cao, bạn có thể kết hợp nó với gần như mọi loại đá khác — ví dụ Blue Quartz để cân bằng cảm xúc, hoặc Rose Quartz để thu hút tình duyên.</p>

      <h2>Gợi ý các mẫu vòng Clear Quartz tại LIORA</h2>
      <ul>
        <li><a href="#/san-pham/vong-tay-tinh-khoi">Vòng Tay Tinh Khôi</a> — Clear Quartz thuần khiết, nhẹ nhàng, thanh lọc năng lượng.</li>
        <li><a href="#/san-pham/vong-tay-tinh-tu-bac">Vòng Tay Tinh Tú Bạc</a> — charm sao lấp lánh, tượng trưng cho hy vọng và may mắn.</li>
        <li><a href="#/san-pham/vong-tay-khuc-ha-paris">Vòng Tay Khúc Hạ Paris</a> — charm Eiffel lãng mạn, tăng sự minh mẫn và thanh lịch.</li>
      </ul>

      <h2>Cách bảo quản và thanh tẩy Clear Quartz</h2>
      <p>Vì là đá "khuếch đại", Clear Quartz cần được thanh tẩy định kỳ để giữ cho năng lượng luôn trong sạch. Bạn có thể đặt vòng dưới ánh trăng đêm rằm, hoặc ngâm cạnh một cụm thạch anh phôi lớn khoảng vài tiếng. Về bảo quản vật lý, tránh va đập mạnh để không xước hạt đá, lau bằng vải mềm và cất trong hộp kín khi không dùng.</p>

      <h2>Câu hỏi thường gặp</h2>
      <h3>Clear Quartz có hợp với mọi mệnh không?</h3>
      <p>Clear Quartz là đá trung tính, có thể đeo cùng mọi mệnh. Tuy nhiên người mệnh Kim sẽ cảm nhận công năng rõ nhất.</p>
      <h3>Đeo Clear Quartz tay nào?</h3>
      <p>Tay trái để đón nhận năng lượng, tay phải để xả năng lượng tiêu cực. Tuỳ mục đích mà bạn chọn bên phù hợp.</p>
      <p>Khám phá ngay bộ sưu tập <a href="#/shop">vòng tay đá năng lượng LIORA</a> để chọn chiếc vòng hợp với mệnh và câu chuyện của bạn.</p>
    `,
  },

  // ---- Bài 3: Vòng tay Aquamarine ----
  {
    date: '08/07/2026',
    title: 'Vòng Tay Aquamarine: Đá Bình An Cho Người Mệnh Thủy',
    excerpt: 'Aquamarine (hải lam ngọc) mang năng lượng bình an, giúp cân bằng cảm xúc và tăng tự tin giao tiếp. Tìm hiểu ý nghĩa, cách chọn và phối vòng tay Aquamarine hợp mệnh Thủy tại LIORA Jewelry.',
    tint: '#eff6ff',
    accent: '#3b82f6',
    image: '/product/Vòng tay hợp kim mạ bạc - Thanh Lam.png',
    content: `
      <p><strong>Vòng tay Aquamarine</strong> (còn gọi là <em>hải lam ngọc</em>) sở hữu sắc xanh dương trong trẻo gợi nhớ đến biển cả — nơi của sự bình yên và bao dung. Trong phong thuỷ, Aquamarine là đá đại diện cho mệnh Thủy, giúp người đeo giảm căng thẳng, cân bằng cảm xúc và tự tin hơn trong giao tiếp. Cùng LIORA tìm hiểu chi tiết về loại đá năng lượng nhẹ nhàng này.</p>

      <h2>Aquamarine là đá gì?</h2>
      <p>Aquamarine thuộc họ beryl, mang sắc xanh nhạt đến xanh dương đậm, được hình thành trong điều kiện pegmatit. Tên gọi "hải lam ngọc" xuất phát từ tiếng Latinh <em>aqua marina</em> — "nước biển". Người xưa tin rằng mang theo Aquamarine khi ra biển sẽ được che chở khỏi bão tố, và viên đá cũng biểu tượng cho sự thanh khiết của tâm hồn.</p>

      <h2>Ý nghĩa phong thuỷ của vòng tay Aquamarine</h2>
      <ul>
        <li><strong>Mang lại bình an:</strong> Năng lượng dịu nhẹ giúp xoa dịu căng thẳng, làm dịu tâm hồn đang bất ổn.</li>
        <li><strong>Cân bằng cảm xúc:</strong> Hỗ trợ người hay lo âu, dễ mất bình tĩnh tìm lại sự ổn định.</li>
        <li><strong>Tăng tự tin giao tiếp:</strong> Rất hợp cho người làm công việc cần giao tiếp nhiều — sale, giáo viên, MC.</li>
        <li><strong>Chữa lành cảm xúc:</strong> Giúp buông bỏ tổn thương, mở lòng đón nhận những điều tốt đẹp.</li>
      </ul>

      <h2>Vòng tay Aquamarine hợp mệnh nào?</h2>
      <p>Aquamarine thuộc mệnh <strong>Thủy</strong> nhờ sắc xanh dương. Người mệnh Thủy khi đeo sẽ nhận được năng lượng tương hợp, giúp sự hanh thông, dễ dàng thích nghi với hoàn cảnh. Người mệnh Mộc (Thủy sinh Mộc) cũng có thể đeo để tăng thêm sự sinh trưởng và phát triển. Nếu bạn thích sắc xanh thanh tao, có thể tham khảo thêm <a href="#/san-pham/vong-tay-luu-ly">Vòng Tay Lưu Ly (Blue Quartz)</a> cùng tông màu.</p>

      <h2>Gợi ý mẫu vòng Aquamarine tại LIORA</h2>
      <ul>
        <li><a href="#/san-pham/vong-tay-thanh-lam">Vòng Tay Thanh Lam</a> — Aquamarine thuần, giảm căng thẳng, tăng tự tin giao tiếp.</li>
        <li><a href="#/san-pham/bst-xuan-ha-thu-dong-no">Vòng Tay NỞ – BST Xuân Hạ Thu Đông</a> — Aquamarine kết hợp Rose Quartz, bình an và tình yêu thương.</li>
      </ul>

      <h2>Cách phối vòng Aquamarine với outfit</h2>
      <p>Sắc xanh dương thanh tao của Aquamarine rất dễ phối: hợp với trang phục trắng, pastel, denim hoặc váy mùa hè. Bạn có thể đeo đơn vòng thanh lịch hoặc stack cùng vòng charm Titan để tạo điểm nhấn cá tính. Đeo ở tay trái giúp đón năng lượng bình an.</p>

      <h2>Bảo quản vòng Aquamarine</h2>
      <ul>
        <li>Tránh ánh nắng gay gắt lâu để không làm phai màu đá.</li>
        <li>Không tiếp xúc với hoá chất, nước hoa hay nước nóng.</li>
        <li>Lau bằng vải mềm, cất trong hộp lót mềm khi không đeo.</li>
      </ul>

      <h2>Câu hỏi thường gặp</h2>
      <h3>Aquamarine có đắt không?</h3>
      <p>Tại LIORA, vòng tay Aquamarine kết hợp charm Titan có mức giá khoảng 300.000₫ — mức hợp lý cho một món trang sức đá tự nhiên có ý nghĩa phong thuỷ.</p>
      <h3>Aquamarine và Blue Quartz khác nhau thế nào?</h3>
      <p>Aquamarine thuộc họ beryl, sắc xanh sáng hơn; Blue Quartz là thạch anh xanh, sắc đậm hơn và thiên về cân bằng cảm xúc. Cả hai đều hợp mệnh Thủy.</p>
      <p>Đừng quên tham khảo <a href="#/shop">toàn bộ vòng tay đá năng lượng LIORA</a> để chọn chiếc vòng phù hợp với mệnh và tâm trạng của bạn.</p>
    `,
  },

  // ---- Bài 4: Chọn vòng theo mệnh (BST Hành Trình Nở Hoa) ----
  {
    date: '08/07/2026',
    title: 'Cách Chọn Vòng Tay Đá Năng Lượng Theo Mệnh Kim Mộc Thủy Hỏa Thổ',
    excerpt: 'Chọn vòng tay đá năng lượng hợp mệnh giúp tăng công năng phong thuỷ. Hướng dẫn chi tiết chọn đá theo ngũ hành Kim–Mộc–Thủy–Hỏa–Thổ cùng BST Hành Trình Nở Hoa tại LIORA Jewelry.',
    tint: '#fff1f2',
    accent: '#f472a0',
    image: '/product/BST _HÀNH TRÌNH NỞ HOA_ - HOA_Vòng tay hợp kim mạ bạc.jpg',
    content: `
      <p>Đeo vòng tay đá năng lượng không chỉ vì đẹp mà còn vì mong muốn đón nhận nguồn năng lượng tích cực. Tuy nhiên, để vòng phát huy tối đa công năng, bạn cần chọn <strong>đá hợp mệnh</strong> theo ngũ hành (Kim – Mộc – Thủy – Hỏa – Thổ). Bài viết này sẽ hướng dẫn bạn cách chọn vòng tay đá năng lượng theo từng mệnh, kèm gợi ý từ BST <strong>Hành Trình Nở Hoa</strong> của LIORA Jewelry.</p>

      <h2>Ngũ hành và quy luật tương sinh</h2>
      <p>Ngũ hành vận hành theo quy luật tương sinh: <em>Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim</em>. Khi chọn đá, ngoài đá cùng mệnh, bạn có thể chọn đá ở mệnh "sinh ra" mệnh mình để tăng thêm sự hỗ trợ. Tránh chọn đá ở mệnh bị mình khắc trừ khi có lý do riêng.</p>

      <h2>Chọn vòng theo từng mệnh</h2>

      <h3>🌸 Mệnh Kim</h3>
      <p>Mệnh Kim hợp với sắc trắng, ánh kim và các đá trong suốt. Đá đại diện: <strong>Clear Quartz (Thạch Anh Trắng)</strong>. Clear Quartz giúp thanh lọc năng lượng, tăng sự minh mẫn và thu hút may mắn. Mẫu gợi ý: <a href="#/san-pham/bst-hanh-trinh-no-hoa-cham">Vòng Tay CHẠM</a> — Clear Quartz, ý nghĩa "mọi hành trình đều bắt đầu từ một lần chạm".</p>

      <h3>🌱 Mệnh Mộc</h3>
      <p>Mệnh Mộc hợp với sắc xanh lá, tượng trưng cho sinh trưởng và phát triển. Đá đại diện: <strong>Amazonite, Aventurine</strong>. Amazonite mang hy vọng, lòng dũng cảm để bắt đầu những hành trình mới. Mẫu gợi ý: <a href="#/san-pham/bst-hanh-trinh-no-hoa-mam">Vòng Tay MẦM</a> — "mỗi ước mơ đều bắt đầu từ một mầm xanh".</p>

      <h3>💧 Mệnh Thủy</h3>
      <p>Mệnh Thủy hợp với sắc xanh dương, đen, tượng trưng cho sự uyển chuyển và thích nghi. Đá đại diện: <strong>Aquamarine, Blue Quartz, Blue Topaz</strong>. Aquamarine mang bình an, cân bằng cảm xúc và tăng tự tin giao tiếp. Mẫu gợi ý: <a href="#/san-pham/bst-hanh-trinh-no-hoa-diu">Vòng Tay DỊU</a> — "sự dịu dàng luôn có sức mạnh riêng".</p>

      <h3>🔥 Mệnh Hỏa</h3>
      <p>Mệnh Hỏa hợp với sắc đỏ, cam, hồng, tượng trưng cho nhiệt huyết và sự tỏa sáng. Đá đại diện: <strong>Sunstone, Carnelian, Rose Quartz</strong>. Sunstone mang lạc quan và năng lượng tích cực. Mẫu gợi ý: <a href="#/san-pham/bst-hanh-trinh-no-hoa-nang">Vòng Tay NẮNG</a> — "nắng không chỉ tỏa sáng mà còn nuôi dưỡng".</p>

      <h3>⛰️ Mệnh Thổ</h3>
      <p>Mệnh Thổ hợp với sắc vàng, nâu đất, tượng trưng cho sự ổn định và thành quả. Đá đại diện: <strong>Morganite, Citrine</strong>. Morganite đại diện cho tình yêu thương, sự bình an và thành quả sau nỗ lực. Mẫu gợi ý: <a href="#/san-pham/bst-hanh-trinh-no-hoa-hoa">Vòng Tay HOA</a> — "hoa là món quà của sự kiên nhẫn".</p>

      <h2>BST Hành Trình Nở Hoa — Một bộ sưu tập, năm mệnh</h2>
      <p>Đặc biệt, BST <strong>Hành Trình Nở Hoa</strong> của LIORA được thiết kế trọn vẹn cho cả năm mệnh: CHẠM (Kim), MẦM (Mộc), DỊU (Thủy), NẮNG (Hỏa), HOA (Thổ). Mỗi vòng là một câu chuyện riêng, giúp bạn không chỉ chọn đá hợp mệnh mà còn chọn được thông điệp phù hợp với giai đoạn cuộc đời hiện tại.</p>

      <h2>Mẹo nhỏ khi chọn vòng</h2>
      <ul>
        <li>Đeo vòng ở tay trái để đón nhận năng lượng, tay phải để xả năng lượng tiêu cực.</li>
        <li>Nên thanh tẩy đá định kỳ (ánh trăng, cạnh cụm Clear Quartz) để giữ năng lượng trong sạch.</li>
        <li>Có thể kết hợp 2–3 đá tương hợp để tăng công năng, ví dụ Rose Quartz + Morganite.</li>
        <li>Chọn vòng theo cả cảm xúc — chiếc vòng khiến bạn cảm thấy thoải mái thường là chiếc "dành cho bạn".</p>
      </ul>

      <p>Khám phá ngay <a href="#/shop">cửa hàng LIORA</a> để tìm vòng tay đá năng lượng hợp mệnh và hợp tâm hồn của bạn.</p>
    `,
  },

  // ---- Bài 5: Charm Titan DIY ----
  {
    date: '09/07/2026',
    title: 'Charm Titan Là Gì? Hướng Dẫn Mix Vòng Tay Charm DIY Đẹp & Cá Tính',
    excerpt: 'Charm Titan là phụ kiện DIY không oxy hóa, giúp bạn tự mix vòng tay charm cá tính. Hướng dẫn cách chọn charm, phối màu và mix vòng tay đá năng lượng DIY độc bản tại LIORA Jewelry.',
    tint: '#fffbeb',
    accent: '#d97706',
    image: '/product/Vòng trơn hợp kim mạ bạc - Vòng trơn DIY.jpg',
    content: `
      <p><strong>Charm Titan</strong> đang là xu hướng được giới trẻ đặc biệt yêu thích nhờ khả năng tự "mix & match" vòng tay theo phong cách riêng. Khác với charm hợp kim thông thường, charm Titan siêu nhẹ, sáng bóng và gần như không bị oxy hóa, bền màu theo thời gian. Bài viết này sẽ giúp bạn hiểu charm Titan là gì và cách mix vòng tay charm DIY thật đẹp, cá tính tại LIORA Jewelry.</p>

      <h2>Charm Titan là gì?</h2>
      <p>Charm Titan là phụ kiện trang sức làm từ chất liệu <strong>titan</strong> — kim loại siêu nhẹ, có độ bền cao và khả năng chống oxy hóa vượt trội. Titan ít gây kích ứng da, an toàn cho cả người có da nhạy cảm, và giữ được độ sáng bóng lâu dài. Kích cỡ charm Titan thông thường 2–3cm, dễ lắp vào vòng tay dây rút hoặc vòng trơn nền.</p>

      <h2>Vì sao charm Titan được ưa chuộng?</h2>
      <ul>
        <li><strong>Không oxy hóa:</strong> Khác với hợp kim mạ bạc hay mạ vàng, Titan gần như không bị xỉn màu.</li>
        <li><strong>Siêu nhẹ:</strong> Đeo nhiều charm vẫn cảm thấy thoải mái, không nặng tay.</li>
        <li><strong>Bền màu:</strong> Màu sắc giữ vững qua thời gian, kể cả khi tiếp xúc mồ hôi.</li>
        <li><strong>Đa dạng màu:</strong> Có nhiều màu: Yellow, Blue, Red, Green, Pink, White dễ phối.</li>
      </ul>

      <h2>Cách mix vòng tay charm DIY cá tính</h2>
      <ol>
        <li><strong>Chọn nền vòng:</strong> Bắt đầu với <a href="#/san-pham/day-hop-kim-ma-bac">dây vòng hợp kim mạ bạc</a> hoặc <a href="#/san-pham/vong-tron-hop-kim-ma-bac-diy">vòng trơn DIY</a> làm nền.</li>
        <li><strong>Chọn charm theo chủ đề:</strong> Hello Kitty đáng yêu, nơ nữ tính, hoa ngọc quý phái, sao lấp lánh… tuỳ phong cách của bạn.</li>
        <li><strong>Phối màu:</strong> Chọn 1 charm chủ đạo + 1–2 charm phụ cùng tông. Ví dụ charm Pink + charm White + đá Rose Quartz cho set nữ tính.</li>
        <li><strong>Thêm đá năng lượng:</strong> Gắn thêm <a href="#/san-pham/charm-da-rose-quartz">charm đá Rose Quartz</a> hoặc <a href="#/san-pham/charm-da-clear-quartz">charm đá Clear Quartz</a> để tăng công năng phong thuỷ.</li>
      </ol>

      <h2>Gợi ý set charm theo mệnh</h2>
      <ul>
        <li><strong>Mệnh Kim:</strong> Charm White + Clear Quartz — thanh lọc, minh mẫn.</li>
        <li><strong>Mệnh Mộc:</strong> Charm Green + Aventurine — sinh trưởng, may mắn.</li>
        <li><strong>Mệnh Thủy:</strong> Charm Blue + Aquamarine — bình an, cân bằng.</li>
        <li><strong>Mệnh Hỏa:</strong> Charm Red/Yellow + Carnelian — nhiệt huyết, tự tin.</li>
        <li><strong>Mệnh Thổ:</strong> Charm Yellow + Citrine/Morganite — ổn định, thành quả.</li>
      </ul>

      <h2>Bảo quản charm Titan và vòng DIY</h2>
      <p>Dù Titan rất bền, bạn vẫn nên lau nhẹ charm và dây bằng vải mềm sau khi đeo, tránh hoá chất mạnh. Nếu dùng vòng dây rút, điều chỉnh nhẹ nhàng để giữ độ bền của dây. Cất vòng trong hộp có ngăn riêng để charm không bị xước lẫn nhau.</p>

      <h2>Câu hỏi thường gặp</h2>
      <h3>Charm Titan giá bao nhiêu?</h3>
      <p>Charm Titan tại LIORA có giá chỉ 30.000₫/charm, charm đá năng lượng 150.000₫ — mức rất hợp lý để tự sáng tạo chiếc vòng mang dấu ấn riêng.</p>
      <h3>Có thể tự lắp charm ở nhà không?</h3>
      <p>Có. Vòng trơn DIY và dây rút của LIORA được thiết kế để bạn dễ tự mix charm tại nhà mà không cần công cụ chuyên dụng.</p>
      <p>Bắt đầu tự sáng tạo chiếc vòng tay của riêng bạn với các mẫu <a href="#/shop">phụ kiện DIY LIORA</a> ngay hôm nay!</p>
    `,
  },
];

export const fmt = (n: number): string => n.toLocaleString('vi-VN') + '₫';

/** Nội dung mặc định cho trang Giới thiệu (chỉnh sửa được qua Admin). */
export const DEFAULT_ABOUT: AboutContent = {
  title: 'Về LIORA Jewelry',
  tagline: 'Trang Sức Bạc Cao Cấp Dành Cho Giới Trẻ',
  heroImage: BRAND_IMAGES.aboutLifestyle,
  intro: `<p><strong>LIORA Jewelry</strong> ra đời với sứ mệnh mang đến những món trang sức bạc cao cấp mang tinh thần <em>đẹp – sang – độc – lạ</em> dành riêng cho giới trẻ Việt Nam. Chúng mình tin rằng mỗi chiếc vòng tay không chỉ là món trang sức, mà còn là một câu chuyện cá nhân — về mệnh, về cảm xúc, về những khởi đầu mới.</p>
  <p>Tại LIORA, mỗi sản phẩm được chế tác từ hợp kim mạ bạc cao cấp, kết hợp đá năng lượng tự nhiên và charm Titan tinh xảo. Chúng mình luôn cập nhật những xu hướng mới nhất, thiết kế những mẫu vòng tinh tế, nữ tính và cá tính, giúp bạn luôn tự tin và toả sáng trong chính câu chuyện của mình.</p>`,
  story: [
    {
      id: 'story-1',
      image: BRAND_IMAGES.aboutLifestyle,
      title: 'Câu chuyện của từng viên đá',
      text: 'Mỗi viên đá năng lượng tại LIORA đều mang một ý nghĩa riêng — Clear Quartz thanh lọc, Rose Quartz thu hút tình duyên, Aquamarine mang bình an. Chúng mình chọn đá tự nhiên, kiểm định kỹ lưỡng và ghép chúng vào những thiết kế mang dấu ấn cá nhân, để chiếc vòng tay trở thành "người bạn" đồng hành cùng bạn.',
    },
    {
      id: 'story-2',
      image: BRAND_IMAGES.aboutLifestyle2,
      title: 'Charm Titan – dấu ấn của riêng bạn',
      text: 'Với dòng charm Titan không oxy hóa, siêu nhẹ và bền màu, LIORA mở ra không gian DIY để bạn tự mix & match chiếc vòng tay theo phong cách riêng. Từ charm nơ nữ tính, Hello Kitty đáng yêu, đến charm Eiffel lãng mạn — mỗi chiếc vòng là một phiên bản độc bản của chính bạn.',
    },
  ],
  mission: `<p>Sứ mệnh của LIORA là <strong>kiến tạo niềm vui</strong> — thông qua những món trang sức đẹp, an toàn cho da, bền màu theo thời gian và mang ý nghĩa phong thuỷ tích cực. Chúng mình cam kết minh bạch về chất liệu, đi kèm phiếu kiểm định và chính sách bảo hành, để mỗi khách hàng đều an tâm khi sở hữu và đeo sản phẩm mỗi ngày.</p>`,
  stats: [
    { value: '5+', label: 'Năm kinh nghiệm' },
    { value: '10K+', label: 'Khách hàng yêu thương' },
    { value: '500+', label: 'Mẫu sản phẩm' },
    { value: '4.9★', label: 'Đánh giá trung bình' },
  ],
  values: [
    { id: 'val-1', icon: 'gem', title: 'Chất lượng cao cấp', text: 'Hợp kim mạ bạc, đá tự nhiên, xi phủ chống xỉn màu bền lâu.' },
    { id: 'val-2', icon: 'sparkle', title: 'Thiết kế độc bản', text: 'Mỗi BST là một câu chuyện riêng, không đụng hàng với thị trường.' },
    { id: 'val-3', icon: 'flower', title: 'Đá năng lượng thật', text: 'Đá tự nhiên được kiểm định, mang ý nghĩa phong thuỷ tích cực.' },
    { id: 'val-4', icon: 'heart', title: 'Phục vụ tận tâm', text: 'Tư vấn chọn mệnh, bảo hành tận nơi, đồng hành cùng khách hàng.' },
  ],
  ctaTitle: 'Đã sẵn sàng tìm chiếc vòng thuộc về bạn?',
  ctaText: 'Khám phá bộ sưu tập vòng tay đá năng lượng và charm Titan DIY — chọn cho mình một món quà mang dấu ấn câu chuyện của riêng bạn.',
};

export const DEFAULT_FOOTER: FooterContent = {
  logo: '/logotrang.jpg',
  brandDescription:
    'Trang sức bạc cao cấp dành cho giới trẻ — luôn cập nhật những xu hướng thời trang mới nhất.',
  policyLinks: [
    { label: 'Giới thiệu', nav: '/about' },
    { label: 'Bảo hành, Đổi trả' },
    { label: 'Chính sách kiểm hàng' },
    { label: 'Chính sách giao hàng' },
    { label: 'Bảo mật thông tin' },
  ],
  supportLinks: [
    { label: 'Tra cứu đơn hàng', nav: '/track-order' },
    { label: 'Hướng dẫn chọn size', nav: '/huong-dan' },
    { label: 'Hướng dẫn bảo quản', nav: '/huong-dan' },
    { label: 'Kiểm định GRA', nav: '/kiem-dinh' },
    { label: 'Feedback', nav: '/feedback' },
    { label: 'Liên hệ', nav: '/lien-he' },
  ],
  newsletterTitle: 'Đăng ký nhận tin',
  newsletterText: 'Nhận ưu đãi sớm và sản phẩm mới',
  facebookUrl: 'https://www.facebook.com/liorajewelry.vn',
  shopeeUrl: 'https://shopee.vn/liora.jewelry',
  copyright: 'Copyright © 2026 Liorajewelry.shop — All rights reserved',
};

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
    tagline: 'Own Your Shine',
    address: 'Tổ 19, KP Miễu, Phường Phước Tân, TP. Biên Hòa, Tỉnh Đồng Nai',
    openHours: 'Thứ 2 – CN: 9:00 – 22:00',
    hotline: '0985048952',
    email: 'liorajewelry10@gmail.com',
    facebookUrl: 'https://www.facebook.com/liorajewelry.vn',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.facebook.com/liorajewelry.vn&color=8e3051&bgcolor=FDF4F6',
    shopeeUrl: 'https://shopee.vn/liora.jewelry',
    shopeeQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://shopee.vn/liora.jewelry&color=8e3051&bgcolor=FDF4F6',
    mapUrl: 'https://maps.google.com/?q=Tổ+19+KP+Miễu+Phước+Tân+Biên+Hòa+Đồng+Nai',
    messengerUrl: 'https://m.me/liorajewelry.vn',
    taxId: '8662980683-001',
    invoiceLogo: '/logoliora2.jpg',
  },
  about: DEFAULT_ABOUT,
  footer: DEFAULT_FOOTER,
};

export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);
