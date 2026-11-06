import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.js';
import { Alert } from '../../components/common/Alert.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const cards = [
  { key: 'total_orders', label: 'Orders', format: (value) => value ?? 0 },
  { key: 'total_revenue', label: 'Revenue', format: (value) => formatCurrency(value ?? 0) },
  { key: 'active_products', label: 'Active products', format: (value) => value ?? 0 },
  { key: 'total_users', label: 'Customers', format: (value) => value ?? 0 },
];
const statusTag = { delivered: 'tag tag-in', cancelled: 'tag tag-out' };

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([adminService.getStats(), adminService.getOrders({ limit: 6 })])
      .then(([statsResponse, ordersResponse]) => {
        if (!active) return;
        setStats(statsResponse.stats);
        setOrders(ordersResponse.orders || []);
      })
      .catch((requestError) => { if (active) setError(requestError.message || 'Admin overview could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div>
      <div className="border-b border-ink pb-5"><h1 className="text-section font-bold text-ink">Overview</h1><p className="mt-2 text-ink-2">Current orders, sales, products, and customers.</p></div>
      {error && <Alert variant="error" className="mt-6">{error}</Alert>}
      {isLoading ? <div className="flex min-h-52 items-center justify-center"><Spinner size="lg" /></div> : <>
        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Store statistics">{cards.map(({ key, label, format }) => <article key={key} className="well p-5"><p className="font-display text-section font-bold tabular-nums text-ink">{format(stats?.[key])}</p><p className="mt-2 text-sm text-muted">{label}</p></article>)}</section>
        <section className="mt-10" aria-labelledby="recent-orders-heading"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="recent-orders-heading" className="text-title font-bold text-ink">Recent orders</h2><p className="mt-1 text-sm tabular-nums text-ink-2">{stats?.pending_orders ?? 0} awaiting confirmation</p></div><Link to="/admin/orders" className="link inline-flex min-h-touch items-center text-sm">Manage orders</Link></div>
          <ul className="ruled mt-4">{orders.map((order) => <li key={order.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)_7rem_7rem]"><span className="font-mono text-sm text-ink">{order.order_number}</span><span className="order-3 min-w-0 truncate text-sm text-ink-2 sm:order-none">{order.users?.full_name || order.users?.email || 'Customer'}</span><span className="order-4 justify-self-end sm:order-none sm:justify-self-start"><span className={`${statusTag[order.status] || 'tag'} capitalize`}>{order.status}</span></span><span className="order-2 text-right font-semibold tabular-nums text-ink sm:order-none">{formatCurrency(order.total)}</span></li>)}{orders.length === 0 && <li className="py-6 text-center text-ink-2">No orders yet.</li>}</ul>
        </section>
      </>}
    </div>
  );
}
