import React from 'react';
import { ShoppingCart, Minus, Plus, X, Trash2, ShoppingBag, ArrowRight, Truck, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import Shapes from '../data/shapes';
import { fmt } from '../data';

export default function CartViewPage() {
  const { state, dispatch, navigate } = useStore();
  const { cart } = state;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + ship;

  const updateQty = (cartId: string, qty: number) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { cartId, qty } });
  };

  const removeItem = (cartId: string) => {
    dispatch({ type: 'REMOVE_CART_ITEM', payload: cartId });
  };

  const clearCart = () => {
    if (!confirm('Xoá toàn bộ giỏ hàng?')) return;
    dispatch({ type: 'CLEAR_CART' });
  };

  if (cart.length === 0) {
    return (
      <main className="page container-x py-20 text-center min-h-[50vh]">
        <ShoppingCart size={56} strokeWidth={1.2} className="mx-auto mb-4 text-mute" />
        <h1 className="text-2xl font-bold mb-3">Giỏ hàng trống</h1>
        <p className="text-ink2 mb-6">Hãy thêm sản phẩm vào giỏ trước khi thanh toán</p>
        <a className="btn-pink" href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>Khám phá sản phẩm →</a>
      </main>
    );
  }

  return (
    <main className="page">
      {/* Breadcrumb */}
      <div className="container-x py-3 md:py-4 text-xs text-mute">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a>
        <span className="mx-2">/</span>
        <span className="text-ink">Giỏ hàng</span>
      </div>

      <section className="container-x pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-700">Giỏ hàng ({cart.length})</h1>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md transition-colors"
          >
            <Trash2 size={14} strokeWidth={2} />
            Xoá tất cả
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map(it => {
              const ShapeSvg = Shapes[it.shape] || Shapes['gem'];
              return (
                <div key={it.cartId} className="bg-white border border-rule rounded-lg p-4 flex gap-4 shadow-card">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-soft">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="photo h-full w-full"
                        style={{ aspectRatio: 'auto', backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${it.tint} 75%, ${it.tint2})` } as React.CSSProperties}
                      >
                        <div className="sil" style={{ color: it.accent }}>{ShapeSvg}</div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={`#/product/${it.slug}`}
                        onClick={(e) => { e.preventDefault(); navigate(`/product/${it.slug}`); }}
                        className="text-sm font-medium line-clamp-2 hover:text-brand-500 transition-colors"
                      >
                        {it.name}
                      </a>
                      <button
                        onClick={() => removeItem(it.cartId)}
                        className="text-mute hover:text-red-500 flex-shrink-0"
                        aria-label="Xoá"
                      >
                        <X size={18} strokeWidth={2} />
                      </button>
                    </div>
                    {it.size && <div className="text-xs text-mute mt-1">Size: {it.size}</div>}
                    <div className="flex items-end justify-between mt-3">
                      {/* Qty selector */}
                      <div className="inline-flex items-center border border-rule rounded-full overflow-hidden text-sm">
                        <button
                          className="px-3 py-1.5 hover:bg-brand-50 transition-colors"
                          onClick={() => updateQty(it.cartId, it.qty - 1)}
                          aria-label="Giảm"
                        >
                          <Minus size={14} strokeWidth={2} />
                        </button>
                        <span className="px-3 min-w-[32px] text-center font-semibold">{it.qty}</span>
                        <button
                          className="px-3 py-1.5 hover:bg-brand-50 transition-colors"
                          onClick={() => updateQty(it.cartId, it.qty + 1)}
                          aria-label="Tăng"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right">
                        <div className="font-bold text-brand-700 text-lg">{fmt(it.price * it.qty)}</div>
                        <div className="text-xs text-mute">{fmt(it.price)} / sản phẩm</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <div className="pt-3">
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-700"
              >
                ← Tiếp tục mua sắm
              </button>
            </div>
          </div>

          {/* Order summary sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-soft rounded-lg p-5 lg:sticky lg:top-24">
              <h3 className="font-bold mb-4 text-lg">Tóm tắt đơn hàng</h3>

              {/* Freeship progress bar */}
              {(() => {
                const FREESHIP_MIN = 500000;
                const remaining = Math.max(0, FREESHIP_MIN - subtotal);
                const pct = Math.min(100, (subtotal / FREESHIP_MIN) * 100);
                return (
                  <div className="text-xs mb-4">
                    {remaining > 0 ? (
                      <div className="text-ink2 mb-1.5">
                        Mua thêm <b className="text-brand-700">{fmt(remaining)}</b> để được <b className="text-brand-700">miễn phí vận chuyển</b>
                      </div>
                    ) : (
                      <div className="text-green-700 mb-1.5 font-semibold flex items-center gap-1"><Check size={14} strokeWidth={2.4} /> Đã đạt miễn phí vận chuyển!</div>
                    )}
                    <div className="h-1.5 bg-rule rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${remaining > 0 ? 'bg-brand-500' : 'bg-green-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-2 text-sm border-t border-rule pt-3">
                <div className="flex justify-between"><span className="text-ink2">Tạm tính ({cart.length} SP)</span><span>{fmt(subtotal)}</span></div>
                <div className="flex justify-between">
                  <span className="text-ink2 inline-flex items-center gap-1"><Truck size={13} strokeWidth={1.6} /> Phí vận chuyển</span>
                  <span>{ship === 0 ? <span className="text-green-600">Miễn phí</span> : fmt(ship)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-rule pt-2 mt-2">
                  <span>Tổng tiền</span><span className="text-brand-700">{fmt(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3.5 rounded-md mt-5 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag size={18} strokeWidth={1.8} />
                Tiến hành thanh toán
                <ArrowRight size={16} strokeWidth={2} />
              </button>

              <p className="text-[11px] text-mute text-center mt-3">
                Bạn có thể áp dụng mã giảm giá ở bước thanh toán
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}