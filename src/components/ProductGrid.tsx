import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface Props { products: Product[]; }

export default function ProductGrid({ products }: Props) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-mute py-12">Chưa có sản phẩm nào trong danh mục này.</div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {products.map(p => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}
