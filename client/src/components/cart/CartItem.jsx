import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function CartItem({ item, onUpdate, onRemove }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const product = item.products || {};

  const updateQuantity = async (quantity) => {
    if (quantity < 1 || quantity === item.quantity) return;
    setIsUpdating(true);
    setError('');
    try {
      await onUpdate(item.id, quantity);
    } catch (requestError) {
      setError(requestError.message || 'Could not update this item. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const remove = async () => {
    setIsUpdating(true);
    setError('');
    try {
      await onRemove(item.id);
    } catch (requestError) {
      setError(requestError.message || 'Could not remove this item. Please try again.');
      setIsUpdating(false);
    }
  };

  const stepper = 'inline-flex min-h-touch min-w-touch items-center justify-center text-ink transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <article className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 py-5 sm:grid-cols-[5rem_minmax(0,1fr)_auto]">
      <Link to={`/products/${product.slug}`} className="photo block aspect-square w-20 overflow-hidden bg-paper-2"><img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover" /></Link>
      <div className="min-w-0">
        <Link to={`/products/${product.slug}`} className="block font-semibold text-ink no-underline hover:underline hover:decoration-accent">{product.name}</Link>
        <p className="mt-1 text-sm text-ink-2">{formatCurrency(product.price)} each</p>
        <div className="mt-3 inline-flex items-center overflow-hidden rounded-control border border-rule bg-paper">
          <button type="button" disabled={isUpdating || item.quantity <= 1} onClick={() => updateQuantity(item.quantity - 1)} className={stepper} aria-label={`Decrease quantity of ${product.name}`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
          <span className="w-10 text-center font-mono text-sm tabular-nums" aria-live="polite">{item.quantity}</span>
          <button type="button" disabled={isUpdating || item.quantity >= product.stock_quantity} onClick={() => updateQuantity(item.quantity + 1)} className={stepper} aria-label={`Increase quantity of ${product.name}`}><Plus className="h-4 w-4" aria-hidden="true" /></button>
        </div>
        {error && <p className="mt-2 text-sm text-feedback-error" role="alert">{error}</p>}
      </div>
      <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end">
        <p className="font-display text-lg font-bold tabular-nums text-ink">{formatCurrency(Number(product.price || 0) * item.quantity)}</p>
        <Button variant="link" size="sm" isLoading={isUpdating} onClick={remove} className="min-h-touch text-ink-2">Remove</Button>
      </div>
    </article>
  );
}
