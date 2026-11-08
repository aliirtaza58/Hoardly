import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ProductGrid } from '../components/product/ProductGrid.jsx';
import { productsService } from '../services/products.js';
import { formatCurrency } from '../utils/formatters.js';

// Links styled as the Button pair (a <button> inside a <Link> is invalid HTML).
const primaryAction = 'btn-primary px-6 py-3 text-base';
const secondaryAction = 'btn-secondary px-6 py-3 text-base';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    Promise.all([productsService.getProducts({ limit: 6 }), productsService.getCategories()])
      .then(([productsResponse, categoriesResponse]) => {
        if (!isActive) return;
        setProducts(productsResponse.products || []);
        setCategories(categoriesResponse.categories || []);
      })
      .catch((requestError) => {
        if (isActive) setError(requestError.message || 'The catalog is unavailable right now. Please try again shortly.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => { isActive = false; };
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-8" aria-labelledby="home-heading">
        <div className="min-w-0 lg:pt-6">
          <h1 id="home-heading" className="text-display-s font-bold text-ink lg:text-display">Useful things, plainly priced.</h1>
          <p className="mt-5 max-w-xl text-lead text-ink-2">Everyday goods, paid for in cash on delivery.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className={primaryAction}>Shop all products</Link>
            <Link to="/categories" className={secondaryAction}>Categories</Link>
          </div>
        </div>
        <div className="min-w-0" aria-labelledby="shelf-heading" role="region">
          <h2 id="shelf-heading" className="pb-3 text-title font-bold text-ink">The shelf</h2>
          {isLoading ? (
            <div className="flex items-center gap-3 border-t border-ink py-6 text-sm text-ink-2" role="status"><Spinner size="sm" />Loading the newest products...</div>
          ) : products.length ? (
            <ul className="ruled">
              {products.map((product) => {
                const image = product.images?.[0] || product.image_url;
                return (
                  <li key={product.id}>
                    <Link to={`/products/${product.slug}`} className="group flex min-h-touch items-center gap-4 py-3 no-underline">
                      <div className="photo h-14 w-14 shrink-0 overflow-hidden bg-paper-3">
                        {image && <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-ink group-hover:underline group-hover:decoration-accent">{product.name}</p>
                        <p className="truncate text-sm font-normal text-muted">{product.category_name || 'Hoardly collection'}, <span className="tabular-nums">{formatCurrency(product.price)}</span></p>
                      </div>
                      {product.stock_quantity > 0 ? <span className="tag tag-in">In stock</span> : <span className="tag tag-out">Out of stock</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="border-t border-ink py-6 text-sm text-ink-2">{error ? 'The shelf could not be loaded right now.' : 'Nothing on the shelf yet.'}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {error && <Alert variant="error" title="Could not load the home catalog">{error}</Alert>}
        <section aria-labelledby="categories-heading" className="pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
            <h2 id="categories-heading" className="text-section font-bold text-ink">Shop by category</h2>
            <Link to="/categories" className="link inline-flex min-h-touch items-center text-sm">View all categories</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[repeat(3,minmax(0,1fr))]">
            {categories.map((category) => (
              <Link to={`/products?category=${category.slug}`} key={category.id} className="group block no-underline">
                <div className="photo aspect-[4/3] overflow-hidden bg-paper-3">
                  {category.image_url && <img src={category.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </div>
                <p className="mt-3 font-semibold text-ink group-hover:underline group-hover:decoration-accent">{category.name}</p>
                <p className="text-sm font-normal text-muted">{category.product_count} products</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section aria-labelledby="featured-heading" className="border-y border-rule bg-paper-2">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
            <h2 id="featured-heading" className="text-section font-bold text-ink">New in the shop</h2>
            <Link to="/products" className="link inline-flex min-h-touch items-center text-sm">View all products</Link>
          </div>
          <div className="mt-6"><ProductGrid products={products} isLoading={isLoading} error={error} /></div>
        </div>
      </section>
    </div>
  );
}
