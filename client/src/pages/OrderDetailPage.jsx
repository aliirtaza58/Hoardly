import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersService } from '../services/orders.js';
import { Alert } from '../components/common/Alert.jsx';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';

const orderSteps = ['pending', 'confirmed', 'shipped', 'delivered'];

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    ordersService.getOrder(id)
      .then((response) => { if (active) setOrder(response.order); })
      .catch((requestError) => { if (active) setError(requestError.message || 'This order could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (isLoading) return <div className="flex min-h-96 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-ink-2">Loading order...</span></div>;
  if (error || !order) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Alert variant="error" title="Could not load order">{error || 'The requested order is unavailable.'}</Alert><Link to="/orders" className="link mt-4 inline-flex min-h-touch items-center">Return to order history</Link></div>;

  const shippingAddress = order.shipping_address || {};
  const statusIndex = orderSteps.indexOf(order.status);
  const statusTag = order.status === 'cancelled' ? 'tag-out' : order.status === 'pending' ? '' : 'tag-in';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6"><h1 className="text-section">Order <span className="break-all font-mono font-normal tracking-normal">{order.order_number}</span></h1><Link to="/orders" className="no-underline"><Button variant="secondary">Back to orders</Button></Link></div>
      <dl className="mt-6 grid grid-cols-1 text-sm sm:grid-cols-3 sm:gap-x-8">
        <div className="flex justify-between gap-4 border-b border-rule py-3"><dt className="text-ink-2">Placed</dt><dd>{formatDate(order.created_at)}</dd></div>
        <div className="flex items-center justify-between gap-4 border-b border-rule py-3"><dt className="text-ink-2">Status</dt><dd><span className={`tag capitalize ${statusTag}`}>{order.status}</span></dd></div>
        <div className="flex justify-between gap-4 border-b border-rule py-3"><dt className="text-ink-2">Payment</dt><dd>Cash on delivery</dd></div>
      </dl>
      <section className="mt-8" aria-labelledby="status-heading"><h2 id="status-heading" className="text-title capitalize">{order.status}</h2>{order.status === 'cancelled' ? <p className="mt-3 text-ink-2">This order was cancelled.</p> : <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{orderSteps.map((step, index) => <li key={step} aria-current={index === statusIndex ? 'step' : undefined} className={`border-t-2 pt-3 text-sm capitalize ${index <= statusIndex ? 'border-ink font-semibold text-ink' : 'border-rule text-muted'}`}>{step}</li>)}</ol>}</section>
      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="items-heading"><h2 id="items-heading" className="text-title">Items</h2><div className="ruled mt-4">{(order.order_items || []).map((item) => <article key={item.id} className="flex gap-4 py-4"><div className="photo h-20 w-20 shrink-0 overflow-hidden bg-paper-2">{item.products?.images?.[0] && <img src={item.products.images[0]} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><Link to={`/products/${item.products?.slug}`} className="font-semibold text-ink no-underline hover:underline hover:decoration-accent">{item.products?.name || 'Product'}</Link><p className="mt-1 text-sm text-ink-2">Quantity: <span className="font-mono tabular-nums">{item.quantity}</span></p></div><p className="font-display font-bold tabular-nums">{formatCurrency(item.total_price)}</p></article>)}</div></section>
        <aside className="space-y-6"><section className="well p-5 sm:p-6"><h2 className="text-title">Order summary</h2><dl className="mt-4 space-y-3 text-ink-2"><div className="flex justify-between gap-3"><dt>Subtotal</dt><dd className="tabular-nums">{formatCurrency(order.subtotal)}</dd></div>{Number(order.discount_amount) > 0 && <div className="flex justify-between gap-3"><dt>Discount</dt><dd className="tabular-nums">-{formatCurrency(order.discount_amount)}</dd></div>}<div className="flex items-baseline justify-between gap-3 border-t border-ink pt-4 text-ink"><dt className="font-semibold">Total</dt><dd className="font-display text-xl font-bold tabular-nums">{formatCurrency(order.total)}</dd></div><div className="flex justify-between gap-3"><dt>Payment</dt><dd>Cash on delivery</dd></div></dl></section><section className="border-t border-ink pt-4"><h2 className="text-title">Delivery address</h2><address className="mt-3 not-italic leading-6 text-ink-2">{shippingAddress.full_name}<br />{shippingAddress.address_line1}{shippingAddress.address_line2 ? <><br />{shippingAddress.address_line2}</> : null}<br />{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />{shippingAddress.country}<br />{shippingAddress.phone}</address></section></aside>
      </div>
    </div>
  );
}