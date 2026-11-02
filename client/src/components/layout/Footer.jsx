import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo.jsx';

const columns = [
  ['Shop', [['/products', 'All products'], ['/categories', 'Categories'], ['/wishlist', 'Saved items']]],
  ['Account', [['/login', 'Sign in'], ['/register', 'Create account'], ['/orders', 'Order history']]],
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:px-8">
        <div className="max-w-xs">
          <Link to="/" className="inline-flex rounded-control" aria-label="Hoardly homepage"><Logo /></Link>
          <p className="mt-4 text-sm leading-6 text-ink-2">Thoughtfully selected goods for the spaces, routines, and people that matter.</p>
        </div>
        {columns.map(([title, links]) => (
          <div key={title}>
            <p className="border-b border-ink pb-2 text-sm font-semibold text-ink">{title}</p>
            <ul className="mt-1">
              {links.map(([to, label]) => (
                <li key={to} className="border-b border-rule"><Link className="flex min-h-touch items-center text-sm text-ink-2 hover:text-ink hover:underline hover:decoration-accent" to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="border-b border-ink pb-2 text-sm font-semibold text-ink">Support</p>
          <p className="mt-3 text-sm leading-6 text-ink-2">Questions about an item? Contact our support team before you order. Every order is paid in cash on delivery.</p>
        </div>
      </div>
      <div className="border-t border-rule"><div className="mx-auto max-w-7xl px-4 py-5 text-sm text-muted sm:px-6 lg:px-8">© 2026 Hoardly. All rights reserved.</div></div>
    </footer>
  );
}
