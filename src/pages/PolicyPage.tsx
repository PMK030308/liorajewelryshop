import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, Mail, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';

type Tab = 'bao-hanh' | 'giao-hang' | 'bao-mat';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'bao-hanh', label: 'Bảo hành & Đổi trả', icon: <RotateCcw size={16} strokeWidth={1.8} /> },
  { key: 'giao-hang', label: 'Giao hàng', icon: <Truck size={16} strokeWidth={1.8} /> },
  { key: 'bao-mat', label: 'Bảo mật thông tin', icon: <Lock size={16} strokeWidth={1.8} /> },
];

export default function PolicyPage() {
  const { navigate } = useStore();
  const [tab, setTab] = useState<Tab>('bao-hanh');

  return (
    <main className="page container-x py-10 md:py-14 max-w-4xl">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <span className="text-ink">Chính sách</span>
      </div>

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-700 mb-2 flex items-center gap-2">
          <ShieldCheck size={28} strokeWidth={1.8} />
          Chính sách Liora Jewelry
        </h1>
        <p className="text-sm text-ink2">
          Cam kết minh bạch và tận tâm — mọi quyền lợi của bạn được bảo đảm rõ ràng.
        </p>
      </header>

      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-rule pb-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              tab === t.key
                ? 'bg-brand-700 text-white'
                : 'bg-soft text-ink2 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-rule rounded-lg p-6 md:p-8 shadow-card">
        {tab === 'bao-hanh' && (
          <div className="space-y-5 text-sm text-ink2 leading-relaxed">
            <h2 className="text-lg font-bold text-brand-700 flex items-center gap-2">
              <RotateCcw size={18} strokeWidth={1.8} /> Chính sách Bảo hành & Đổi trả
            </h2>

            <section>
              <h3 className="font-semibold text-ink mb-2">1. Thời hạn bảo hành</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li><strong>Bảo hành 12 tháng</strong> kể từ ngày mua đối với mọi sản phẩm hợp kim mạ bạc.</li>
                <li>Bảo hành bao gồm: xi mạ lại (làm mới bề mặt), xi chống xỉn màu, sửa lỗi dây/clasp.</li>
                <li><strong>Bảo hành trọn đời</strong> việc vệ sinh/làm sáng sản phẩm tại cửa hàng.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">2. Điều kiện đổi trả (trong 7 ngày)</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li>Sản phẩm còn nguyên vẹn, không trầy xước, chưa qua sử dụng (còn tem/dán nhãn).</li>
                <li>Đầy đủ hộp, thẻ bảo hành, phiếu kiểm định và phụ kiện đi kèm.</li>
                <li>Có hóa đơn mua hàng (bản in hoặc email) hoặc mã đơn hàng.</li>
                <li>Đổi trả miễn phí cho sản phẩm bị lỗi do nhà sản xuất.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">3. Các trường hợp KHÔNG đổi trả</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li>Sản phẩm bị hư hỏng do sử dụng sai cách, va đập mạnh hoặc tiếp xúc hoá chất.</li>
                <li>Đã qua 7 ngày kể từ ngày nhận hàng.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">4. Cách thức đổi trả</h3>
              <ol className="space-y-1.5 pl-5 list-decimal">
                <li>Liên hệ hotline <a href="tel:0985048952" className="text-brand-500 font-semibold">0985 048 952</a> hoặc Messenger để báo tình trạng.</li>
                <li>Gửi sản phẩm về địa chỉ cửa hàng (hoặc gửi qua đơn vị vận chuyển).</li>
                <li>Shop kiểm tra và đổi/trả/bảo hành trong vòng 2–5 ngày làm việc.</li>
              </ol>
            </section>
          </div>
        )}

        {tab === 'giao-hang' && (
          <div className="space-y-5 text-sm text-ink2 leading-relaxed">
            <h2 className="text-lg font-bold text-brand-700 flex items-center gap-2">
              <Truck size={18} strokeWidth={1.8} /> Chính sách Giao hàng
            </h2>

            <section>
              <h3 className="font-semibold text-ink mb-2">1. Phí vận chuyển</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li><strong>Miễn phí giao hàng</strong> cho đơn từ 500.000₫ trở lên (toàn quốc).</li>
                <li>Đơn dưới 500.000₫: phí ship 30.000₫ (áp dụng khu vực nội thành).</li>
                <li>Khu vực xa/huyện: phí ship tuỳ thuộc đơn vị vận chuyển, shop báo trước khi xác nhận.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">2. Thời gian giao hàng</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li><strong>Nội thành (Biên Hòa, TP.HCM, Hà Nội):</strong> 1–2 ngày làm việc.</li>
                <li><strong>Các tỉnh thành khác:</strong> 2–4 ngày làm việc.</li>
                <li>Đơn đặt sau 18:00 sẽ được xử lý vào sáng hôm sau.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">3. Kiểm hàng trước khi nhận</h3>
              <p>Khách hàng được <strong>kiểm tra hàng trước khi thanh toán</strong> (COD). Nếu sản phẩm không đúng mô tả, bị lỗi hoặc thiếu phụ kiện, vui lòng từ chối nhận và liên hệ shop ngay.</p>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">4. Đóng gói</h3>
              <p>Tất cả sản phẩm được đóng gói trong hộp quà sang trọng, kèm thẻ bảo hành, phiếu kiểm định và thiệp lời chúc (nếu có yêu cầu).</p>
            </section>
          </div>
        )}

        {tab === 'bao-mat' && (
          <div className="space-y-5 text-sm text-ink2 leading-relaxed">
            <h2 className="text-lg font-bold text-brand-700 flex items-center gap-2">
              <Lock size={18} strokeWidth={1.8} /> Chính sách Bảo mật thông tin
            </h2>

            <section>
              <h3 className="font-semibold text-ink mb-2">1. Thông tin thu thập</h3>
              <p>Liora Jewelry chỉ thu thập thông tin cần thiết để xử lý đơn hàng: họ tên, số điện thoại, email, địa chỉ giao hàng. Chúng tôi không thu thập thông tin nhạy cảm không liên quan.</p>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">2. Mục đích sử dụng</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li>Xử lý đơn hàng, thanh toán và giao hàng.</li>
                <li>Thông báo trạng thái đơn hàng, voucher và sản phẩm mới (nếu khách đăng ký nhận tin).</li>
                <li>Hỗ trợ đổi trả, bảo hành và chăm sóc khách hàng.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">3. Cam kết bảo mật</h3>
              <ul className="space-y-1.5 pl-5 list-disc">
                <li>Không <strong>bán, chia sẻ hoặc cho thuê</strong> thông tin cá nhân khách hàng cho bên thứ ba.</li>
                <li>Dữ liệu được lưu trữ an toàn, chỉ nhân viên có thẩm quyền mới được truy cập.</li>
                <li>Mật khẩu được mã hoá, không hiển thị dưới dạng văn bản thuần.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">4. Quyền lợi của bạn</h3>
              <p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân bất kỳ lúc nào. Liên hệ chúng tôi qua email hoặc hotline để thực hiện.</p>
            </section>

            <section>
              <h3 className="font-semibold text-ink mb-2">5. Cookie</h3>
              <p>Website sử dụng cookie để ghi nhớ giỏ hàng, danh sách yêu thích và cải thiện trải nghiệm duyệt web. Bạn có thể tắt cookie trong trình duyệt, tuy nhiên một số tính năng có thể không hoạt động.</p>
            </section>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-8 pt-6 border-t border-rule bg-soft rounded-lg p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-ink2">
            Cần hỗ trợ thêm về chính sách? Liên hệ ngay:
          </div>
          <div className="flex gap-2">
            <a href="tel:0985048952" className="inline-flex items-center gap-1.5 text-sm font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2 rounded-md transition-colors">
              <Phone size={14} strokeWidth={2} /> Hotline
            </a>
            <a href="mailto:liorajewelry10@gmail.com" className="inline-flex items-center gap-1.5 text-sm font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2 rounded-md transition-colors">
              <Mail size={14} strokeWidth={2} /> Email
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}