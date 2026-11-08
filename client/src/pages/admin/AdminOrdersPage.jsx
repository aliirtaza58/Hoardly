import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.js';
import { Alert } from '../../components/common/Alert.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { AdminPagination } from '../../components/admin/AdminPagination.jsx';

const transitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const th = 'py-3 pr-4 text-sm font-normal text-muted';
import { orderStatusTag } from '../../utils/orderStatus.js';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async (filter = status, page = pagination.page) => {
    const response = await adminService.getOrders({ limit: 25, status: filter, page });
    setOrders(response.orders || []);
    setPagination(response.pagination || { page: 1, totalPages: 1 });
  };

  useEffect(() => {
    let active = true;
    adminService.getOrders({ limit: 25 })
      .then((response) => { if (active) { setOrders(response.orders || []); setPagination(response.pagination || { page: 1, totalPages: 1 }); } })
      .catch((requestError) => { if (active) setError(requestError.message || 'Orders could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const updateStatus = async (order, nextStatus) => {
    if (!window.confirm(`Change order ${order.order_number} from ${order.status} to ${nextStatus}?`)) return;
    setUpdatingId(order.id);
    setError('');
    setMessage('');
    try {
      await adminService.updateOrderStatus(order.id, nextStatus);
      await load();
      setMessage(`Order ${order.order_number} updated to ${nextStatus}.`);
    } catch (requestError) {
      setError(requestError.message || 'Order status could not be updated.');
    } finally {
      setUpdatingId(null);
    }
  };

  const changePage = async (page, filter = status) => {
    setIsLoading(true);
    setError('');
    try { await load(filter, page); }
    catch (requestError) { setError(requestError.message || 'Orders could not be loaded.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-5"><h1 className="text-section font-bold text-ink">Orders</h1><label className="flex items-center gap-2 text-sm font-semibold text-ink">Filter status<select value={status} disabled={isLoading} onChange={(event) => { const value = event.target.value; setStatus(value); changePage(1, value); }} className="min-h-touch rounded-control border border-line-strong bg-paper px-3 py-2 text-base font-normal text-ink transition-colors hover:border-ink focus:border-ink"><option value="">All statuses</option>{['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((value) => <option key={value}>{value}</option>)}</select></label></div>
      {error && <Alert variant="error" className="mt-5">{error}</Alert>}{message && <Alert variant="success" className="mt-5">{message}</Alert>}
      {isLoading ? <div className="flex min-h-52 items-center justify-center"><Spinner size="lg" /></div> : <div role="region" aria-label="Order table" tabIndex={0} className="relative mt-5 overflow-x-auto"><table className="w-full min-w-[58rem] text-left text-sm"><thead><tr className="border-b border-ink"><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Placed</th><th className={`${th} text-right`}>Items</th><th className={`${th} text-right`}>Total</th><th className={th}>Status</th><th className="py-3 text-sm font-normal text-muted">Update</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-rule"><td className="py-3 pr-4 font-mono text-ink">{order.order_number}</td><td className="py-3 pr-4 text-ink-2">{order.users?.full_name || order.users?.email || 'Customer'}</td><td className="py-3 pr-4 tabular-nums text-ink-2">{formatDate(order.created_at)}</td><td className="py-3 pr-4 text-right font-mono text-ink-2">{order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</td><td className="py-3 pr-4 text-right font-semibold tabular-nums text-ink">{formatCurrency(order.total)}</td><td className="py-3 pr-4"><span className={orderStatusTag(order.status)}>{order.status}</span></td><td className="py-2"><label className="sr-only" htmlFor={`status-${order.id}`}>Update status for {order.order_number}</label><select id={`status-${order.id}`} disabled={updatingId === order.id || transitions[order.status]?.length === 0} value="" onChange={(event) => updateStatus(order, event.target.value)} className="min-h-touch rounded-control border border-line-strong bg-paper px-2 py-1.5 text-sm text-ink transition-colors hover:border-ink focus:border-ink disabled:opacity-50"><option value="">Change to...</option>{(transitions[order.status] || []).map((nextStatus) => <option key={nextStatus} value={nextStatus}>{nextStatus}</option>)}</select></td></tr>)}{orders.length === 0 && <tr><td colSpan="7" className="py-8 text-center text-ink-2">No orders match this filter.</td></tr>}</tbody></table></div>}
      <AdminPagination pagination={pagination} isLoading={isLoading} onChange={changePage} />
    </div>
  );
}
