import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { cartService } from '../services/cart.js';
import { ordersService } from '../services/orders.js';
import { CartSummary } from '../components/cart/CartSummary.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';

const initialAddress = { full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' };
const labels = { full_name: 'Full name', phone: 'Phone', address_line1: 'Address line 1', address_line2: 'Address line 2', city: 'City', state: 'State or province', postal_code: 'Postal code', country: 'Country' };

export function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { count, subtotal, items, isLoading: cartLoading, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(initialAddress);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [error, setError] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login', { replace: true, state: { from: { pathname: '/checkout' } } });
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    ordersService.getAddresses()
      .then((response) => {
        if (!active) return;
        const savedAddresses = response.addresses || [];
        setAddresses(savedAddresses);
        const preferred = savedAddresses.find((item) => item.is_default) || savedAddresses[0];
        if (preferred) {
          setSelectedAddress(String(preferred.id));
          setAddress(Object.fromEntries(Object.keys(initialAddress).map((key) => [key, preferred[key] || ''])));
        }
      })
      .catch((requestError) => { if (active) setAddressError(requestError.message); });
    return () => { active = false; };
  }, [isAuthenticated]);

  const selectAddress = (value) => {
    setSelectedAddress(value);
    const saved = addresses.find((item) => String(item.id) === value);
    setAddress(saved
      ? Object.fromEntries(Object.keys(initialAddress).map((key) => [key, saved[key] || '']))
      : initialAddress);
  };

  const applyCode = async (event) => {
    event.preventDefault();
    setDiscountError('');
    setIsApplyingDiscount(true);
    try {
      const response = await cartService.applyDiscount(discountCode);
      setDiscount({ ...response.discount, subtotal: response.subtotal });
      setDiscountCode(response.discount.code);
    } catch (requestError) {
      setDiscount(null);
      setDiscountError(requestError.message || 'This code could not be applied. Check it and try again.');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsPlacing(true);
    try {
      const response = await ordersService.createOrder(address, appliedDiscount > 0 ? discount.code : null);
      await refreshCart();
      navigate(`/orders/${response.order.id}/confirmation`, { state: { order: response.order } });
    } catch (requestError) {
      setError(requestError.message || 'Could not place your order. Review your delivery details and try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (authLoading || (isAuthenticated && cartLoading)) {
    return <div className="flex min-h-96 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-ink-2">Preparing checkout...</span></div>;
  }
  if (!isAuthenticated) return null;
  if (!items.length) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="border-b border-ink pb-6"><h1 className="text-section">Your cart is empty.</h1></div><Link to="/products" className="link mt-4 inline-flex min-h-touch items-center">Browse products</Link></div>;
  }

  const appliedDiscount = discount && Math.abs(Number(discount.subtotal || subtotal) - subtotal) < 0.01 ? Number(discount.amount) : 0;
  const autoCompleteFor = (name) => (name === 'full_name' ? 'name' : name === 'phone' ? 'tel' : name === 'address_line1' ? 'address-line1' : name === 'postal_code' ? 'postal-code' : 'on');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-ink pb-6"><h1 className="text-section">Checkout</h1><p className="mt-3 text-lead text-ink-2">Payment is cash on delivery.</p></div>
      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form onSubmit={submit} className="min-w-0">
          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="text-title">Delivery address</h2>
            {addresses.length > 0 && <label className="mt-5 block text-sm font-semibold text-ink">Saved address<select value={selectedAddress} onChange={(event) => selectAddress(event.target.value)} className="mt-1.5 block min-h-touch w-full rounded-control border border-line-strong bg-paper px-3.5 py-2.5 text-ink hover:border-ink"><option value="">Use a different address</option>{addresses.map((item) => <option key={item.id} value={item.id}>{item.label}: {item.address_line1}, {item.city}{item.is_default ? ' (default)' : ''}</option>)}</select></label>}
            {addressError && <Alert variant="warning" className="mt-4">Saved addresses could not be loaded. You can still enter a delivery address below.</Alert>}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{Object.entries(labels).map(([name, label]) => <FormField key={name} id={`checkout-${name}`} label={label} required={name !== 'address_line2'} className={name === 'address_line1' || name === 'address_line2' ? 'sm:col-span-2' : ''}><Input name={name} autoComplete={autoCompleteFor(name)} value={address[name]} onChange={(event) => { setSelectedAddress(''); setAddress((current) => ({ ...current, [name]: event.target.value })); }} /></FormField>)}</div>
            <Link to="/account" className="link mt-4 inline-flex min-h-touch items-center text-sm">Manage saved addresses</Link>
          </section>
          <section aria-labelledby="payment-heading" className="mt-8 border-t border-ink pt-6">
            <h2 id="payment-heading" className="text-title">Payment</h2>
            <p className="mt-2 text-ink-2">Cash on delivery. You pay when the order arrives.</p>
          </section>
          <section aria-labelledby="discount-heading" className="mt-8 border-t border-ink pt-6">
            <h2 id="discount-heading" className="text-title">Discount code</h2>
            <div className="mt-4 flex gap-2"><label className="sr-only" htmlFor="discount-code">Discount code</label><Input id="discount-code" value={discountCode} onChange={(event) => { setDiscountCode(event.target.value.toUpperCase()); setDiscount(null); }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyCode(event); } }} autoComplete="off" /><Button type="button" variant="secondary" isLoading={isApplyingDiscount} onClick={applyCode} className="min-h-touch shrink-0">Apply</Button></div>
            {discountError && <Alert variant="error" className="mt-3">{discountError}</Alert>}
            {appliedDiscount > 0 && <p className="mt-3 text-ink-2" role="status"><span className="tag tag-in">{discount.code}</span> applied: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(appliedDiscount)} off.</p>}
          </section>
          {error && <Alert variant="error" className="mt-6">{error}</Alert>}
          <Button type="submit" size="lg" isLoading={isPlacing} className="mt-8 w-full px-3 sm:w-auto sm:px-6">Place order (Cash on Delivery)</Button>
        </form>
        <CartSummary subtotal={subtotal} discountAmount={appliedDiscount} itemCount={count} showCheckout={false} />
      </div>
    </div>
  );
}
