import React from 'react';
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
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

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 h-full">
              <div className="text-6xl mb-5">🛒</div>
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
                      <button className="text-xs text-mute hover:text-brand-500 mt-2" onClick={() => removeItem(it.cartId)}>✕ Xoá</button>
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
