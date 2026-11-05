import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ordersService } from '../services/orders.js';
import { formatCurrency } from '../utils/formatters.js';

export function OrderConfirmationPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const [order, setOrder] = useState(state?.order || null);
  const [isLoading, setIsLoading] = useState(!state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state?.order) return undefined;
    let active = true;
    ordersService.getOrder(id)
      .then((response) => { if (active) setOrder(response.order); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Order details could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id, state]);

  if (isLoading) return <div className="flex min-h-96 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-ink-2">Loading confirmation...</span></div>;
  if (error || !order) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Alert variant="error" title="Could not load your confirmation">{error || 'The order is unavailable.'}</Alert><Link to="/orders" className="link mt-4 inline-flex min-h-touch items-center">View order history</Link></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <div className="border-b border-ink pb-6"><h1 className="text-section">Thanks for your order.</h1><p className="mt-3 text-lead text-ink-2">Order <span className="font-mono text-ink">{order.order_number}</span> has been placed. We will keep you updated as it is prepared.</p></div>
        <dl className="ruled mt-8">
          <div className="flex justify-between gap-4 py-3"><dt className="text-ink-2">Order number</dt><dd className="font-mono">{order.order_number}</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-ink-2">Order total</dt><dd className="font-display font-bold tabular-nums">{formatCurrency(order.total)}</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-ink-2">Payment</dt><dd>Cash on delivery</dd></div>
        </dl>
        <h2 className="mt-8 text-title">What happens next</h2>
        <p className="mt-2 text-ink-2">We prepare your order and update its status in your order history. Pay in cash when it is delivered.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to={`/orders/${order.id}`} className="no-underline"><Button variant="secondary">View order details</Button></Link><Link to="/products" className="no-underline"><Button>Continue shopping</Button></Link></div>
      </div>
    </div>
  );
}