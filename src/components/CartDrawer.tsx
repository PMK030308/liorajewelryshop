import React from 'react';
import { ShoppingCart, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import Shapes from '../data/shapes';
import { fmt } from '../data';

export default function CartDrawer() {
  const { state, dispatch, navigate, showToast } = useStore();
  const { cart } = state;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const isOpen = state.cartOpen;

  const close = () => dispatch({ type: 'CLOSE_ALL' });

  const updateQty = (cartId: string, qty: number) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { cartId, qty } });
  };

  const removeItem = (cartId: string) => {
    dispatch({ type: 'REMOVE_CART_ITEM', payload: cartId });
  };

  return (
    <>
      <div className={`scrim ${isOpen ? 'open' : ''}`} onClick={close} />
      <aside className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="px-5 pt-4 pb-2 border-b border-rule">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-lg flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 7h14l-1.5 12h-11L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>
              </svg>
              Giỏ hàng {cart.length > 0 && <span className="text-brand-500">({cart.length})</span>}
            </div>
            <button className="w-8 h-8 rounded-full hover:bg-rule flex items-center justify-center" onClick={close} aria-label="Đóng">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </div>

          {/* Freeship progress bar */}
          {cart.length > 0 && (() => {
            const FREESHIP_MIN = 500000;
            const remaining = Math.max(0, FREESHIP_MIN - subtotal);
            const pct = Math.min(100, (subtotal / FREESHIP_MIN) * 100);
            return (
              <div className="text-xs">
                {remaining > 0 ? (
                  <div className="text-ink2 mb-1.5">
                    Mua thêm <b className="text-brand-700">{fmt(remaining)}</b> để được <b className="text-brand-700">miễn phí vận chuyển</b>
                  </div>
                ) : (
                  <div className="text-green-700 mb-1.5 font-semibold flex items-center gap-1"><Check size={14} strokeWidth={2.4} /> Đơn hàng của bạn được miễn phí vận chuyển!</div>
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
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 h-full">
              <ShoppingCart size={56} strokeWidth={1.2} className="mb-5 text-mute" />
              <h3 className="font-bold text-lg mb-2">Giỏ hàng trống</h3>
              <p className="text-ink2 mb-6 text-sm">Hãy chọn sản phẩm yêu thích nhé!</p>
              <button className="btn-pink" onClick={() => { close(); navigate('/shop'); }}>Khám phá →</button>
            </div>
          ) : (
            <div className="divide-y divide-rule">
              {cart.map(it => {
                const ShapeSvg = Shapes[it.shape] || Shapes['gem'];
                return (
                  <div key={it.cartId} className="p-4 flex gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <div
                        className="photo h-full w-full"
                        style={{
                          aspectRatio: 'auto',
                          backgroundImage: `radial-gradient(120% 80% at 50% 30%, #ffffff, ${it.tint} 75%, ${it.tint2})`,
                        } as React.CSSProperties}
                      >
                        <div className="sil" style={{ color: it.accent }}>{ShapeSvg}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-2 mb-1">{it.name}</div>
                      {it.size && <div className="text-xs text-mute mb-2">Size: {it.size}</div>}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-rule rounded-full overflow-hidden text-sm">
                          <button className="px-2 py-1 hover:bg-brand-50" onClick={() => updateQty(it.cartId, it.qty - 1)}>−</button>
                          <span className="px-2 min-w-[24px] text-center">{it.qty}</span>
                          <button className="px-2 py-1 hover:bg-brand-50" onClick={() => updateQty(it.cartId, it.qty + 1)}>+</button>
                        </div>
                        <div className="font-bold text-brand-500">{fmt(it.price * it.qty)}</div>
                      </div>
                      <button className="text-xs text-mute hover:text-brand-500 mt-2 inline-flex items-center gap-1" onClick={() => removeItem(it.cartId)}><X size={12} strokeWidth={2} /> Xoá</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-rule p-5">
            <div className="flex justify-between text-sm mb-1"><span className="text-ink2">Tạm tính</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between font-bold mb-4"><span>TỔNG TIỀN</span><span className="text-brand-500 text-xl">{fmt(subtotal)}</span></div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-outline justify-center" onClick={() => { close(); navigate('/cart-view'); }}>Xem giỏ hàng</button>
              <button className="btn-pink justify-center" onClick={() => { close(); navigate('/checkout'); }}>Thanh toán</button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
