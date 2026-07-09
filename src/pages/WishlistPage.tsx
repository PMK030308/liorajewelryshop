import React from 'react';
import { Heart, Share2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { state, dispatch, navigate, showToast } = useStore();
  const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.slug));

  const clearAll = () => {
    if (!confirm('Xóa tất cả sản phẩm yêu thích?')) return;
    state.wishlist.forEach(slug => dispatch({ type: 'TOGGLE_WISH', payload: slug }));
    showToast('Đã xóa danh sách yêu thích');
  };

  const shareWishlist = async () => {
    const url = window.location.origin + '/#/wishlist';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Danh sách yêu thích từ LIORA', url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast('Đã sao chép link wishlist vào clipboard');
      }
    } catch {/* user cancelled */}
  };

  return (
    <main className="page container-x py-10 md:py-14 min-h-[60vh]">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-700 flex items-center gap-2.5">
            <Heart size={28} strokeWidth={1.8} fill="#f472a0" stroke="#f472a0" />
            Sản phẩm yêu thích
          </h1>
          <p className="text-sm text-mute mt-1">
            {wishlistProducts.length > 0
              ? `${wishlistProducts.length} sản phẩm đang được lưu`
              : 'Lưu sản phẩm để xem lại sau hoặc chia sẻ cho người thân'}
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={shareWishlist}
              className="inline-flex items-center gap-1.5 text-sm font-semibold border border-rule text-ink2 hover:border-brand-500 hover:text-brand-700 px-4 py-2 rounded-md transition-colors"
            >
              <Share2 size={14} strokeWidth={2} />
              Chia sẻ
            </button>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md transition-colors"
            >
              <Trash2 size={14} strokeWidth={2} />
              Xóa tất cả
            </button>
          </div>
        )}
      </header>

      {wishlistProducts.length === 0 ? (
        <div className="bg-soft border border-rule rounded-lg p-10 md:p-14 text-center">
          <Heart size={48} strokeWidth={1.4} className="mx-auto text-brand-200 mb-4" />
          <h2 className="text-lg font-semibold mb-2 text-brand-700">Chưa có sản phẩm yêu thích</h2>
          <p className="text-sm text-ink2 mb-6 max-w-md mx-auto">
            Bấm vào biểu tượng trái tim <Heart size={13} strokeWidth={2} className="inline text-brand-500 align-middle" /> trên mỗi sản phẩm để lưu vào đây. Bạn có thể chia sẻ link wishlist cho người thân để được tặng đúng món bạn thích.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Khám phá sản phẩm →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {wishlistProducts.map(p => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
