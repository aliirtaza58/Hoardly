import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useWishlist } from '../contexts/WishlistContext.jsx';
import { ProductGrid } from '../components/product/ProductGrid.jsx';
import { Alert } from '../components/common/Alert.jsx';

export function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { items, isLoading, error } = useWishlist();

  if (!isAuthenticated) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="border-b border-ink pb-6"><h1 className="text-section">Keep your favorites close.</h1><p className="mt-3 text-lead text-ink-2">Sign in to save products and revisit them whenever you are ready.</p></div><Link to="/login" className="btn-primary mt-6">Sign in to continue</Link></div>;
  }

  const products = items.map((item) => item.products).filter(Boolean);
  const isEmpty = !isLoading && !error && !products.length;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-ink pb-6"><h1 className="text-section">Saved items</h1><p className="mt-3 text-lead text-ink-2">A personal list of products worth coming back to.</p></div>
      {error && <Alert variant="error" title="Could not load saved items" className="mt-6">{error}</Alert>}
      <div className="mt-8">
        {isEmpty
          ? <div className="max-w-xl"><h2 className="text-title">No saved items yet</h2><p className="mt-2 text-ink-2">Browse the catalog and use the heart on any product you want to revisit.</p><Link to="/products" className="link mt-4 inline-flex min-h-touch items-center">Browse products</Link></div>
          : <ProductGrid products={products} isLoading={isLoading} error={error} emptyTitle="No saved items yet" emptyDescription="Browse the catalog and use the heart on any product you want to revisit." />}
      </div>
    </div>
  );
}
