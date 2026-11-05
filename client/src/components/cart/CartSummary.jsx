import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function CartSummary({ subtotal, itemCount, discountAmount = 0, showCheckout = true }) {
  const total = Math.max(0, subtotal - discountAmount);
  return (
    <aside className="well h-fit p-5 sm:p-6 lg:sticky lg:top-24" aria-label="Order summary">
      <h2 className="text-title">Order summary</h2>
      <dl className="mt-5 space-y-3 text-ink-2">
        <div className="flex justify-between gap-4"><dt>Items ({itemCount})</dt><dd className="tabular-nums">{formatCurrency(subtotal)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Shipping</dt><dd className="text-right">Calculated at checkout</dd></div>
        {discountAmount > 0 && <div className="flex justify-between gap-4"><dt>Discount</dt><dd className="tabular-nums">-{formatCurrency(discountAmount)}</dd></div>}
        <div className="flex items-baseline justify-between gap-4 border-t border-ink pt-4 text-ink"><dt className="font-semibold">{discountAmount > 0 ? 'Total' : 'Subtotal'}</dt><dd className="font-display text-xl font-bold tabular-nums">{formatCurrency(total)}</dd></div>
      </dl>
      {showCheckout && <Link to="/checkout" className="mt-6 block no-underline"><Button size="lg" className="w-full">Continue to checkout</Button></Link>}
      {showCheckout && <Link to="/products" className="link mt-4 flex min-h-touch items-center justify-center text-sm">Continue shopping</Link>}
    </aside>
  );
}
