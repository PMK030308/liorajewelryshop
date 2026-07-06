import React from 'react';
import { useStore } from '../store/useStore';
import Shapes from '../data/shapes';

export default function AboutPage() {
  const { navigate } = useStore();
  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / Giới Thiệu
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Về Liorajewelry</h1>
      <div className="text-brand-500 font-medium mb-8">Trang Sức Bạc Cao Cấp Dành Cho Giới Trẻ</div>

      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <div className="rounded-2xl overflow-hidden photo aspect-[4/3]" style={{ backgroundImage:'radial-gradient(120% 80% at 50% 30%, #ffffff, #f9e5ea 75%, #f2c8d2)' } as React.CSSProperties}>
          <div className="sil" style={{ color:'#c2537a' }}>{Shapes.gem}</div>
        </div>
        <div className="space-y-4 text-ink2 leading-relaxed">
          <p>Liorajewelry được thành lập với sứ mệnh mang đến những món trang sức bạc cao cấp, đẹp – sang – độc – lạ dành cho giới trẻ Việt Nam.</p>
          <p>Tại Liorajewelry, chúng mình luôn cập nhật những xu hướng thời trang mới nhất, thiết kế những sản phẩm tinh tế giúp các bạn trẻ luôn tự tin và toả sáng.</p>
          <p>Mỗi sản phẩm Liorajewelry đều được chế tác từ hợp kim mạ bạc cao cấp, xi phủ chống xỉn màu bền lâu, đảm bảo độ sáng bóng và độ bền cao nhất.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 bg-soft rounded-2xl p-6">
        {[
          { n:'5+', l:'Năm kinh nghiệm' },
          { n:'10K+', l:'Khách hàng yêu thương' },
          { n:'500+', l:'Mẫu sản phẩm' },
        ].map(s => (
          <div key={s.l} className="text-center">
            <div className="text-4xl font-bold text-brand-500 mb-1">{s.n}</div>
            <div className="text-sm text-ink2">{s.l}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
