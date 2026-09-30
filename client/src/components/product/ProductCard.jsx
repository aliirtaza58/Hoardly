import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { StarRating } from './StarRating.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function ProductCard({ product }) {
  const image = product.images?.[0] || product.image_url;
  const discount = product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
    ? Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100)
    : null;

  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-surface-card shadow-xs transition-shadow duration-normal hover:shadow-md">
      <Link to={`/products/${product.slug}`} className="block focus-visible:outline-none" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-content-muted">Image unavailable</div>
          )}
          {discount && <span className="absolute left-3 top-3 rounded-sm bg-surface-card px-2 py-1 text-xs font-semibold text-feedback-success shadow-xs">Save {discount}%</span>}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-content-muted">{product.category_name || 'Hoardly collection'}</p>
            <Link to={`/products/${product.slug}`} className="mt-1 block text-base font-semibold leading-snug text-content-primary hover:text-content-link">
              {product.name}
            </Link>
          </div>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-content-muted transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
        <StarRating rating={product.avg_rating} reviewCount={product.review_count} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-content-primary">{formatCurrency(product.price)}</span>
          {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
            <span className="text-sm text-content-muted line-through">{formatCurrency(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
