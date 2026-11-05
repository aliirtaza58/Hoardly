import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { CartItem } from '../components/cart/CartItem.jsx';
import { CartSummary } from '../components/cart/CartSummary.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { Button } from '../components/common/Button.jsx';

export function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, count, subtotal, isLoading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  const head = (title, lead) => <div className="border-b border-ink pb-6"><h1 className="text-section">{title}</h1>{lead && <p className="mt-3 text-lead text-ink-2">{lead}</p>}</div>;

  if (!isAuthenticated) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{head('Your cart is waiting.', 'Sign in to keep the products you choose in one place.')}<Link to="/login" className="mt-6 inline-block no-underline"><Button>Sign in to continue</Button></Link></div>;
  }

  if (isLoading && !items.length) return <div className="flex min-h-96 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-ink-2">Loading your cart...</span></div>;

  if (!items.length) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{head('Your cart is empty.', 'Discover practical, well-made goods and add the ones that fit your day.')}<Link to="/products" className="mt-6 inline-block no-underline"><Button>Start shopping</Button></Link></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6"><h1 className="text-section">Shopping cart</h1><Button variant="link" size="sm" onClick={clearCart} className="min-h-touch text-ink-2">Clear cart</Button></div>
      {error && <Alert variant="error" title="Your cart needs attention" className="mt-6">{error}</Alert>}
      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]"><section aria-label="Cart items" className="ruled">{items.map((item) => <CartItem key={item.id} item={item} onUpdate={updateQuantity} onRemove={removeFromCart} />)}</section><CartSummary subtotal={subtotal} itemCount={count} /></div>
    </div>
  );
}
