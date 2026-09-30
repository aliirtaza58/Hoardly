import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

/**
 * Debounced search bar for the navbar.
 * Fires a navigation to /products?search=<query> after a delay.
 */
export function SearchBar({ className = '' }) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const executeSearch = useCallback(
    (value) => {
      const trimmed = value.trim();
      if (trimmed) {
        navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      } else {
        navigate('/products');
      }
    },
    [navigate]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      executeSearch(value);
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    navigate('/products');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    executeSearch(query);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search products"
      className={`relative flex items-center ${className}`}
    >
      <div className="absolute left-3 pointer-events-none text-content-muted">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="search"
        name="search"
        value={query}
        onChange={handleChange}
        placeholder="Search products..."
        aria-label="Search products by name or description"
        className="w-full pl-9 pr-8 py-2 text-sm bg-surface-muted border border-line rounded-md placeholder:text-content-muted text-content-primary focus:border-line-focus focus:ring-2 focus:ring-brand/20 outline-none transition-all duration-fast"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-0.5 rounded-sm text-content-muted hover:text-content-primary cursor-pointer"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
