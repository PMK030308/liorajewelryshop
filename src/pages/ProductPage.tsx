import React from 'react';
import { useStore } from '../store/useStore';
import { fmt } from '../data';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import ProductGrid from '../components/ProductGrid';
import { ShapeKey } from '../types';

const SIZES = ['#5', '#6', '#7', '#8', '#9'];

export default function ProductPage({ slug }: { slug: string }) {
  const { state, dispatch, navigate, showToast } = useStore();
  const p = state.products.find(x => x.slug === slug);

  if (!p) {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <a className="btn-primary" href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>← Quay lại Shop</a>
      </main>
    );
  }

  if (!state.pdpSize) dispatch({ type: 'SET_PDP_SIZE', payload: SIZES[2] });

  const gallery = [
    { ...p },
    { ...p, tint: p.tint2 },
    { ...p, tint: p.accent, tint2: p.tint2 },
    { ...p, tint: '#1f1f1f', tint2: p.accent },
  ];

  const main = gallery[state.pdpImageIdx];
  const related = state.products.filter(x => x.subcat === p.subcat && x.slug !== p.slug).slice(0, 4);

  const addToCart = () => {
    if (p.sold) { showToast('⚠ Sản phẩm tạm hết hàng'); return; }
    const cartId = `${p.slug}__${state.pdpSize}`;
    dispatch({
      type: 'ADD_TO_CART',
      payload: { cartId, slug: p.slug, name: p.name, price: p.price, qty: state.pdpQty, size: state.pdpSize || undefined, tint: p.tint, tint2: p.tint2, accent: p.accent, shape: p.shape },
    });
    showToast('✓ Đã thêm vào giỏ hàng');
    dispatch({ type: 'SET_PDP_QTY', payload: 1 });
    setTimeout(() => dispatch({ type: 'OPEN_CART' }), 250);
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => navigate('/checkout'), 200);
  };

  return (
    <main className="page">
      {/* Breadcrumb */}
      <div className="container-x py-4 text-xs text-mute">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="hover:text-brand-500">Sản Phẩm</a>
        <span className="mx-2">/</span>
        <span className="text-ink line-clamp-1">{p.name}</span>
      </div>

      <section className="container-x grid md:grid-cols-2 gap-8 md:gap-12 pb-12">
        {/* Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-card mb-3">
            <PhotoPlaceholder tint={main.tint} tint2={main.tint2} accent={main.accent} shape={main.shape as ShapeKey} ratio="1/1" hot={p.hot} sold={p.sold} />
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {gallery.map((g, i) => (
              <button key={i} className={`thumb ${state.pdpImageIdx === i ? 'active' : ''}`} onClick={() => dispatch({ type: 'SET_PDP_IMAGE', payload: i })}>
                <PhotoPlaceholder tint={g.tint} tint2={g.tint2} accent={g.accent} shape={g.shape as ShapeKey} ratio="1/1" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-xs text-mute mb-2">Mã SP: <span className="font-semibold text-ink">{p.code}</span></div>
          <h1 className="text-xl md:text-2xl font-bold leading-snug mb-3">{p.name}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex text-yellow-400">★★★★★</div>
            <span className="text-mute">(124 đánh giá)</span>
            <span className="text-mute">|</span>
            <span className="text-green-600">✓ Còn hàng</span>
          </div>

          {/* Price */}
          <div className="bg-brand-50 rounded-2xl p-5 mb-5">
            <div className="flex items-baseline gap-3 mb-1">
              <div className="text-3xl font-bold text-brand-500">{fmt(p.price)}</div>
              <div className="text-mute line-through text-sm">{fmt(Math.round(p.price * 1.3 / 1000) * 1000)}</div>
              <span className="bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-semibold">-23%</span>
            </div>
            <div className="text-xs text-ink2 mt-1">💰 Tiết kiệm {fmt(Math.round(p.price * 0.3 / 1000) * 1000)} hôm nay</div>
          </div>

          {/* Size */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-semibold">Kích thước:</span>
              <button className="text-xs text-brand-500 hover:underline" onClick={() => showToast('📏 Liên hệ Liorajewelry để được tư vấn chọn size')}>Hướng dẫn chọn size</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map(s => (
                <button key={s} className={`chip ${state.pdpSize === s ? 'active' : ''}`} onClick={() => dispatch({ type: 'SET_PDP_SIZE', payload: s })}>{s}</button>
              ))}
            </div>
          </div>

          {/* Qty + Buy */}
          <div className="flex items-stretch gap-3 mb-3">
            <div className="flex items-center border border-rule rounded-full overflow-hidden">
              <button className="qty-btn px-4 py-2.5" onClick={() => dispatch({ type: 'SET_PDP_QTY', payload: state.pdpQty - 1 })} aria-label="Giảm">−</button>
              <span className="px-3 min-w-[40px] text-center font-semibold">{state.pdpQty}</span>
              <button className="qty-btn px-4 py-2.5" onClick={() => dispatch({ type: 'SET_PDP_QTY', payload: state.pdpQty + 1 })} aria-label="Tăng">+</button>
            </div>
            <button className="btn-primary flex-1 justify-center" disabled={!!p.sold} onClick={addToCart}>
              {p.sold ? 'Hết hàng' : '🛒 Thêm vào giỏ'}
            </button>
          </div>
          <button className="btn-outline w-full justify-center mb-5" onClick={buyNow}>⚡ Mua ngay</button>

          {/* Trust */}
          <div className="border border-rule rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs mb-5">
            <div className="flex items-center gap-2"><span className="text-base">🚚</span><span>Miễn phí giao hàng từ 500K</span></div>
            <div className="flex items-center gap-2"><span className="text-base">↻</span><span>Đổi trả trong 7 ngày</span></div>
            <div className="flex items-center gap-2"><span className="text-base">✓</span><span>Kiểm định GRA chính hãng</span></div>
            <div className="flex items-center gap-2"><span className="text-base">🎁</span><span>Hộp quà sang trọng</span></div>
          </div>

          {/* Accordions */}
          {[
            { title:'Mô tả sản phẩm', open:true, content:(
              <div>
                <p className="mb-3">{p.name} là một trong những thiết kế cao cấp của Liorajewelry. Được chế tác tỉ mỉ từ bạc S925, đính kim cương Moissanite kiểm định GRA, xi bạch kim chống xỉn màu.</p>
                <ul className="space-y-1.5">
                  <li>✓ Chất liệu: Bạc S925 cao cấp</li>
                  <li>✓ Xi bạch kim chống xỉn màu, không gây dị ứng</li>
                  <li>✓ Đính kim cương Moissanite (nếu có) kiểm định GRA</li>
                  <li>✓ Tặng kèm hộp quà sang trọng + thẻ bảo hành</li>
                  <li>✓ Bảo hành trọn đời sản phẩm</li>
                </ul>
              </div>
            )},
            { title:'Bảo quản & Bảo hành', open:false, content:<p>Tránh tiếp xúc với nước hoa, hoá chất, nước biển. Cất trong hộp khi không sử dụng. Lau bằng vải mềm sau mỗi lần đeo. Đem đến cửa hàng Liorajewelry để được vệ sinh miễn phí trọn đời.</p> },
            { title:'Vận chuyển & Đổi trả', open:false, content:<p>Giao hàng toàn quốc 2–4 ngày. Miễn phí giao hàng cho đơn từ 500.000₫. Hỗ trợ kiểm hàng trước khi thanh toán. Đổi trả miễn phí trong 7 ngày với sản phẩm còn nguyên vẹn.</p> },
          ].map(({ title, open, content }) => (
            <details key={title} className="border-t border-rule" {...(open ? { open: true } : {})}>
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-semibold">
                <span>{title}</span><span className="text-mute">+</span>
              </summary>
              <div className="pb-4 text-sm text-ink2 leading-relaxed">{content}</div>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-10 border-t border-rule">
          <h2 className="sec-title text-center mb-8">Sản phẩm liên quan</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
