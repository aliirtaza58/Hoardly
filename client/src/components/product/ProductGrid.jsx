import React from 'react';
import { ProductCard } from './ProductCard.jsx';
import { Spinner } from '../common/Spinner.jsx';
import { Alert } from '../common/Alert.jsx';

export function ProductGrid({ products, isLoading, error, emptyTitle = 'No products found', emptyDescription = 'Try clearing a filter or exploring another category.' }) {
  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center" role="status">
        <Spinner size="lg" />
        <span className="ml-3 text-sm text-ink-2">Loading products...</span>
      </div>
    );
  }

  if (error) return <Alert variant="error" title="Could not load products">{error}</Alert>;

  if (!products.length) {
    return (
      <div className="well px-6 py-12">
        <h2 className="text-title font-bold text-ink">{emptyTitle}</h2>
        <p className="mt-2 text-ink-2">{emptyDescription}</p>
      </div>
    );
  }

  return <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-x-6 gap-y-10">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
