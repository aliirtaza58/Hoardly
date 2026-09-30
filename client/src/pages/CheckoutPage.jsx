import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { ordersService } from '../services/orders.js';
import { CartSummary } from '../components/cart/CartSummary.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';

const initialAddress = { full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' };
const labels = { full_name: 'Full name', phone: 'Phone', address_line1: 'Address line 1', address_line2: 'Address line 2', city: 'City', state: 'State or province', postal_code: 'Postal code', country: 'Country' };

export function CheckoutPage() {
  const { isAuthenticated } = useAuth(); const { count, subtotal, items, refreshCart } = useCart(); const navigate = useNavigate();
  const [address, setAddress] = useState(initialAddress); const [error, setError] = useState(''); const [isPlacing, setIsPlacing] = useState(false);
  if (!isAuthenticated) { navigate('/login'); return null; }
  if (!items.length) { navigate('/cart'); return null; }
  const submit = async (event) => { event.preventDefault(); setError(''); setIsPlacing(true); try { const response = await ordersService.createOrder(address); await refreshCart(); navigate(`/orders/${response.order.id}/confirmation`, { state: { order: response.order } }); } catch (requestError) { setError(requestError.message || 'Could not place your order. Review your details and try again.'); } finally { setIsPlacing(false); } };
  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="border-b border-line pb-8"><p className="text-sm font-semibold text-content-link">Secure checkout</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-content-primary">Delivery details</h1></div><div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]"><form onSubmit={submit} className="rounded-lg border border-line bg-surface-card p-6"><h2 className="text-lg font-semibold text-content-primary">Where should we deliver?</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{Object.entries(labels).map(([name, label]) => <label key={name} className={`block text-sm font-medium text-content-primary ${name === 'address_line1' || name === 'address_line2' ? 'sm:col-span-2' : ''}`}>{label}<input required={name !== 'address_line2'} value={address[name]} onChange={(event) => setAddress((current) => ({ ...current, [name]: event.target.value }))} className="mt-2 block w-full rounded-md border border-line bg-surface-card px-3 py-2 text-sm" /></label>)}</div>{error && <Alert variant="error" className="mt-5">{error}</Alert>}<Button type="submit" size="lg" isLoading={isPlacing} className="mt-6">Place order</Button></form><CartSummary subtotal={subtotal} itemCount={count} /></div></div>;
}
