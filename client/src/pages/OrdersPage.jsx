import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ordersService } from '../services/orders.js';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';

import { orderStatusTag } from '../utils/orderStatus.js';

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    ordersService.getOrders()
      .then((response) => { if (active) setOrders(response.orders || []); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Order history could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [isAuthenticated]);

  if (!isAuthenticated) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="border-b border-ink pb-6"><h1 className="text-section">Your orders</h1></div><Link to="/login" className="link mt-4 inline-flex min-h-touch items-center">Sign in to view orders</Link></div>;

  const cols = 'grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_5rem_minmax(0,1fr)_7rem] sm:items-center';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6"><h1 className="text-section">Order history</h1><Link to="/account" className="link inline-flex min-h-touch items-center text-sm">Profile and addresses</Link></div>
      <div className="mt-8">
        {isLoading && <div className="flex min-h-48 items-center justify-center" role="status"><Spinner size="lg" /><span className="sr-only">Loading orders</span></div>}
        {error && <Alert variant="error">{error}</Alert>}
        {!isLoading && !error && (!orders.length
          ? <div><p className="text-ink-2">No orders yet. Your completed purchases will appear here.</p><Link to="/products" className="link mt-3 inline-flex min-h-touch items-center">Browse products</Link></div>
          : <div role="table" aria-label="Orders">
              <div role="row" className={`${cols} hidden border-b border-ink pb-2 text-sm text-muted sm:grid`}><span role="columnheader">Order</span><span role="columnheader">Placed</span><span role="columnheader" className="text-right">Items</span><span role="columnheader" className="text-right">Total</span><span role="columnheader" className="text-right">Status</span></div>
              <div role="rowgroup" className="border-t border-ink sm:border-t-0">{orders.map((order) => <div role="row" key={order.id} className={`${cols} border-b border-rule py-4`}>
                <span role="cell" className="min-w-0"><Link to={`/orders/${order.id}`} className="link inline-flex min-h-touch items-center break-all font-mono text-sm">{order.order_number}</Link></span>
                <span role="cell" className="order-3 text-sm text-ink-2 sm:order-none"><span className="sm:hidden">Placed </span>{formatDate(order.created_at)}</span>
                <span role="cell" className="order-5 font-mono text-sm tabular-nums text-ink-2 sm:order-none sm:text-right">{order.order_items?.length || 0}<span className="sm:hidden"> items</span></span>
                <span role="cell" className="order-4 text-right font-display font-bold tabular-nums sm:order-none">{formatCurrency(order.total)}</span>
                <span role="cell" className="order-2 text-right sm:order-none"><span className={orderStatusTag(order.status)}>{order.status}</span></span>
              </div>)}</div>
            </div>)}
      </div>
    </div>
  );
}