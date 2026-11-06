import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Boxes, ClipboardList, FolderTree, Percent, Store } from 'lucide-react';

const sections = [
  { to: '/admin', label: 'Overview', icon: BarChart3, end: true },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/discounts', label: 'Discounts', icon: Percent },
];

export function AdminLayout() {
  return (
    <div className="mx-auto grid min-w-0 w-full max-w-7xl grid-cols-1 flex-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
      <aside className="min-w-0 border-b border-ink bg-paper pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6" aria-label="Admin navigation">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink"><Store className="h-4 w-4" aria-hidden="true" /> Store administration</div>
        <nav aria-label="Admin sections" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0">
          {sections.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `inline-flex min-h-touch shrink-0 items-center gap-2 rounded-control px-3 text-sm font-semibold transition-colors ${isActive ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2 hover:text-ink'}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</NavLink>)}
        </nav>
      </aside>
      <main className="min-w-0"><Outlet /></main>
    </div>
  );
}
