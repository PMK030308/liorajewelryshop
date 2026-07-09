import React, { useMemo, useState } from 'react';
import { Star, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface Review {
  id: string;
  name: string;
  initials: string;
  tint: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
  images?: string[];
  size?: string;
}

// Mock pool — deterministic per product so demo feels stable.
const POOL: Omit<Review, 'id'>[] = [
  {
    name: 'Nguyễn Thu Hà', initials: 'TH', tint: '#f2c8d2',
    rating: 5, date: '12/03/2026',
    content: 'Sản phẩm đẹp hơn ảnh, đá lấp lánh cực kỳ. Hộp đựng sang trọng, có cả thẻ kiểm định GRA. Mình rất hài lòng, sẽ giới thiệu cho bạn bè.',
    verified: true, size: '#7',
  },
  {
    name: 'Trần Minh Anh', initials: 'MA', tint: '#ffe0e7',
    rating: 5, date: '08/03/2026',
    content: 'Đeo lên người rất sang chảnh. Lúc đầu sợ vòng tay mạ bạc nhanh xỉn, nhưng thực tế thì dùng mãi vẫn đẹp, ai cũng khen tinh tế!',
    verified: true,
  },
  {
    name: 'Phạm Quỳnh Anh', initials: 'QA', tint: '#e6f0e8',
    rating: 4, date: '02/03/2026',
    content: 'Chất lượng rất tốt, đóng gói cẩn thận. Mình trừ 1 sao vì giao hàng hơi chậm so với hẹn (giao trong 4 ngày thay vì 2-3 ngày).',
    verified: true, size: '#6',
  },
  {
    name: 'Lê Hoàng Nam', initials: 'HN', tint: '#fff1cf',
    rating: 5, date: '24/02/2026',
    content: 'Mua tặng vợ kỷ niệm cưới, nàng thích lắm! Shop tư vấn nhiệt tình, gói quà miễn phí kèm thiệp.',
    verified: true,
  },
  {
    name: 'Đỗ Thanh Vân', initials: 'TV', tint: '#e9d8fd',
    rating: 5, date: '18/02/2026',
    content: 'Cảm ơn shop đã hỗ trợ đổi size nhanh chóng. Sản phẩm đeo vừa khít, không bị tuột. Sẽ ủng hộ shop dài dài.',
    verified: true, size: '#5',
  },
  {
    name: 'Vũ Bích Ngọc', initials: 'BN', tint: '#f9e5ea',
    rating: 4, date: '10/02/2026',
    content: 'Thiết kế tinh tế. Đeo đi tiệc được khen rất nhiều. Có chăm chăm hơi xước nhẹ sau 1 tháng nhưng shop nói mang ra để bảo trì miễn phí.',
    verified: false,
  },
  {
    name: 'Hoàng Lan Anh', initials: 'LA', tint: '#fde2e4',
    rating: 5, date: '04/02/2026',
    content: 'Đặt làm quà valentine cho người yêu, đúng hẹn 14/2 luôn. Hộp gói rất đẹp, kèm thiệp khắc tên free 😍',
    verified: true,
  },
];

// Pick reviews deterministically based on product slug
function getReviewsFor(slug: string): Review[] {
  const offset = slug.length % 3; // rotate the pool slightly per product
  return POOL.slice(offset, offset + 5).map((r, i) => ({ ...r, id: `${slug}-${i}` }));
}

export default function ReviewsSection({ product }: { product: Product }) {
  const allReviews = useMemo(() => getReviewsFor(product.slug), [product.slug]);
  const [filter, setFilter] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ rating: 5, name: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  const reviews = filter ? allReviews.filter(r => r.rating === filter) : allReviews;
  const visible = showAll ? reviews : reviews.slice(0, 3);

  const avg = product.rating ?? 4.8;
  const total = product.reviewCount ?? allReviews.length;

  // Distribution from mock pool (proportional)
  const distribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => counts[r.rating]++);
    return counts;
  }, [allReviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ rating: 5, name: '', content: '' });
  };

  return (
    <section id="reviews" className="border-t border-rule mt-10 pt-10">
      <h2 className="text-xl md:text-2xl font-bold text-brand-700 mb-6">Đánh giá khách hàng</h2>

      <div className="grid md:grid-cols-[280px_1fr] gap-6 md:gap-10 mb-8">
        {/* Summary */}
        <div className="bg-soft rounded-lg p-5 text-center">
          <div className="text-5xl font-bold text-brand-700 mb-1">{avg.toFixed(1)}</div>
          <div className="flex justify-center text-yellow-400 mb-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={18} fill={i <= Math.round(avg) ? 'currentColor' : 'none'} stroke="currentColor" />
            ))}
          </div>
          <div className="text-xs text-mute mb-4">Dựa trên {total} đánh giá</div>

          {/* Distribution bars */}
          <div className="space-y-1.5 text-left">
            {[5, 4, 3, 2, 1].map(star => {
              const count = distribution[star] || 0;
              const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
              return (
                <button
                  key={star}
                  onClick={() => setFilter(filter === star ? null : star)}
                  className={`w-full flex items-center gap-2 text-xs hover:bg-white rounded px-1 py-0.5 ${filter === star ? 'bg-white' : ''}`}
                >
                  <span className="w-3 font-semibold">{star}</span>
                  <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                  <div className="flex-1 h-1.5 bg-rule rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-mute w-6 text-right">{count}</span>
                </button>
              );
            })}
          </div>
          {filter && (
            <button onClick={() => setFilter(null)} className="text-xs text-brand-500 hover:underline mt-3">
              Xoá lọc · Xem tất cả
            </button>
          )}
        </div>

        {/* Review list */}
        <div>
          {reviews.length === 0 ? (
            <p className="text-sm text-mute text-center py-10">Không có đánh giá nào với mức sao này.</p>
          ) : (
            <div className="space-y-5">
              {visible.map(r => (
                <article key={r.id} className="border-b border-rule pb-5 last:border-0">
                  <header className="flex items-start gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-brand-700 text-sm flex-shrink-0"
                      style={{ background: r.tint }}
                    >{r.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-semibold text-ink text-sm">{r.name}</span>
                        {r.verified && (
                          <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-semibold inline-flex items-center gap-1"><CheckCircle2 size={11} strokeWidth={2} /> Đã mua hàng</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} fill={i <= r.rating ? 'currentColor' : 'none'} stroke="currentColor" />
                          ))}
                        </div>
                        <span className="text-xs text-mute">{r.date}</span>
                        {r.size && <span className="text-xs text-mute">· Size {r.size}</span>}
                      </div>
                    </div>
                  </header>
                  <p className="text-sm text-ink2 leading-relaxed">{r.content}</p>
                </article>
              ))}
            </div>
          )}

          {!showAll && reviews.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700"
            >
              Xem thêm {reviews.length - 3} đánh giá <ChevronDown size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Write review */}
      <div className="bg-soft border border-rule rounded-lg p-5 md:p-6">
        <h3 className="font-bold text-brand-700 mb-3">Viết đánh giá của bạn</h3>
        {submitted ? (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-4">
            Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận và sẽ hiển thị sau khi duyệt.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-ink2 mb-1.5">Số sao</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setForm(f => ({ ...f, rating: i }))}
                    className="text-yellow-400 hover:scale-110 transition-transform"
                    aria-label={`${i} sao`}
                  >
                    <Star size={28} fill={i <= form.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.6} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink2 mb-1.5">Tên của bạn</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="VD: Nguyễn Thu Hà"
                className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink2 mb-1.5">Nội dung đánh giá</label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required
                rows={4}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                className="w-full border border-rule rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-md text-sm transition-colors"
            >
              Gửi đánh giá
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
