import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsService } from '../services/products.js';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productsService.getCategories()
      .then((response) => setCategories(response.categories || []))
      .catch((requestError) => setError(requestError.message || 'Categories could not be loaded. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl"><h1 className="text-section font-bold text-ink">Shop by category</h1><p className="mt-3 text-ink-2">Explore the collections built around real routines, not endless scrolling.</p></div>
      <div className="mt-8">
        {isLoading && <div className="flex min-h-64 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-sm text-ink-2">Loading categories...</span></div>}
        {error && <Alert variant="error" title="Could not load categories">{error}</Alert>}
        {!isLoading && !error && (categories.length ? (
          <ul className="ruled">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/products?category=${category.slug}`} className="group grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-4 py-4 no-underline sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6">
                  <div className="photo aspect-[4/3] overflow-hidden bg-paper-3">{category.image_url && <img src={category.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />}</div>
                  <div className="min-w-0">
                    <h2 className="text-title font-bold text-ink group-hover:underline group-hover:decoration-accent">{category.name}</h2>
                    <p className="mt-1 text-sm font-normal text-ink-2">{category.description}</p>
                    <p className="mt-2 text-sm font-normal tabular-nums text-muted sm:hidden">{category.product_count} products</p>
                  </div>
                  <span className="tag hidden tabular-nums sm:inline-flex">{category.product_count} products</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="border-t border-ink py-6 text-ink-2">No categories yet.</p>)}
      </div>
    </div>
  );
}
