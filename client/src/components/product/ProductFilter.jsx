import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button.jsx';

const fieldClass = 'mt-2 block w-full rounded-control border border-line-strong bg-paper px-3 py-2 text-base text-ink';

export function ProductFilter({ filters, categories, onChange, onClear }) {
  const update = (name, value) => onChange({ ...filters, [name]: value, page: 1 });

  return (
    <aside aria-label="Product filters">
      <div className="flex items-center justify-between gap-3 border-b border-ink pb-2">
        <h2 className="text-base font-bold tracking-normal text-ink">Filters</h2>
        <Button variant="link" size="sm" onClick={onClear} className="min-h-touch">Clear all</Button>
      </div>
      <div className="mt-5 space-y-6">
        <label className="block text-sm text-ink-2">
          Category
          <select value={filters.category} onChange={(event) => update('category', event.target.value)} className={fieldClass}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <div>
          <p className="text-sm text-ink-2">Price range</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="min-price">Minimum price</label>
            <input id="min-price" type="number" min="0" value={filters.minPrice} onChange={(event) => update('minPrice', event.target.value)} placeholder="Min" className="w-full rounded-control border border-line-strong bg-paper px-3 py-2 text-base text-ink placeholder:text-muted" />
            <label className="sr-only" htmlFor="max-price">Maximum price</label>
            <input id="max-price" type="number" min="0" value={filters.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} placeholder="Max" className="w-full rounded-control border border-line-strong bg-paper px-3 py-2 text-base text-ink placeholder:text-muted" />
          </div>
        </div>
        <label className="block text-sm text-ink-2">
          Minimum rating
          <select value={filters.rating} onChange={(event) => update('rating', event.target.value)} className={fieldClass}>
            <option value="">Any rating</option>
            {[4, 3, 2].map((rating) => <option key={rating} value={rating}>{rating} stars and up</option>)}
          </select>
        </label>
      </div>
      <Button variant="secondary" size="sm" onClick={onClear} className="mt-6 w-full md:hidden"><X className="h-4 w-4" aria-hidden="true" /> Reset filters</Button>
    </aside>
  );
}
