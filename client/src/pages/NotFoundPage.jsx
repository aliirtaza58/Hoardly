import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-xl border-t border-ink pt-6">
        <h1 className="text-section font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-ink-2">
          The resource you requested could not be located. It may have moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="inline-flex min-h-touch items-center justify-center rounded-control border border-ink bg-ink px-6 py-3 font-semibold text-paper no-underline transition-colors duration-fast hover:border-ink-2 hover:bg-ink-2">Return to homepage</Link>
          <Link to="/products" className="inline-flex min-h-touch items-center justify-center rounded-control border border-rule bg-paper-2 px-6 py-3 font-semibold text-ink no-underline transition-colors duration-fast hover:bg-paper-3">Browse products</Link>
        </div>
      </div>
    </div>
  );
}
