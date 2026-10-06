import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '../common/Button.jsx';
import { ShoppingBag, ShoppingCart, Heart, User, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { SearchBar } from '../product/SearchBar.jsx';
import { useCart } from '../../contexts/CartContext.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';

const storeLinks = [['/', 'Home'], ['/products', 'Products'], ['/categories', 'Categories']];
const navigationClass = ({ isActive }) => `flex min-h-touch items-center rounded-md px-3 text-sm font-medium transition-colors ${isActive ? 'bg-brand/10 text-brand' : 'text-content-secondary hover:bg-surface-muted hover:text-content-primary'}`;

export function Navbar() {
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { key: locationKey } = useLocation();
  const [menuKey, setMenuKey] = React.useState(null);
  const isMenuOpen = menuKey === locationKey;
  const menuButton = React.useRef(null);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  React.useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuKey(null);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setMenuKey(null);
  const handleSignOut = async () => {
    await logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-surface-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-content-primary transition-opacity hover:opacity-90" aria-label="Hoardly homepage">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-content-on-action shadow-xs"><ShoppingBag className="h-4 w-4" aria-hidden="true" /></span>
          <span>Hoardly</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden shrink-0 items-center gap-2 lg:flex">
          {storeLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={navigationClass}>{label}</NavLink>)}
        </nav>
        <SearchBar className="hidden min-w-0 max-w-md flex-1 xl:flex" />
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Link to="/wishlist" onClick={closeMenu} className="relative inline-flex min-h-touch min-w-touch items-center justify-center rounded-md text-content-primary hover:bg-surface-muted" aria-label={`Saved items${wishlistCount ? `, ${wishlistCount} saved` : ''}`}><Heart className="h-5 w-5" aria-hidden="true" />{wishlistCount > 0 && <span className="absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-content-on-action">{wishlistCount}</span>}</Link>
          <Link to="/cart" onClick={closeMenu} className="relative inline-flex min-h-touch min-w-touch items-center justify-center rounded-md text-content-primary hover:bg-surface-muted" aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}><ShoppingCart className="h-5 w-5" aria-hidden="true" />{cartCount > 0 && <span className="absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-content-on-action">{cartCount}</span>}</Link>
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 lg:flex">
              {isAdmin && <Link to="/admin" className="inline-flex min-h-touch items-center gap-1 rounded-md px-2 text-xs font-semibold text-brand hover:bg-brand/10"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Admin</Link>}
              <Link to="/account" className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-md text-sm text-content-secondary hover:bg-surface-muted" aria-label="Open your account"><User className="h-5 w-5" aria-hidden="true" /><span className="hidden max-w-24 truncate font-medium text-content-primary 2xl:inline-block">{profile?.full_name || user?.email?.split('@')[0]}</span></Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out of account"><LogOut className="h-4 w-4" aria-hidden="true" /><span className="hidden 2xl:inline">Sign out</span></Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/login" className="inline-flex min-h-touch items-center rounded-md px-3 text-sm font-medium text-content-primary hover:bg-surface-muted">Sign in</Link>
              <Link to="/register" className="inline-flex min-h-touch items-center rounded-md bg-brand px-3 text-sm font-medium text-content-on-action hover:bg-brand-hover">Create account</Link>
            </div>
          )}
          <button ref={menuButton} type="button" className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-md text-content-primary hover:bg-surface-muted lg:hidden" onClick={() => setMenuKey(isMenuOpen ? null : locationKey)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation">
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:px-8 xl:hidden"><SearchBar /></div>
      <div id="mobile-navigation" hidden={!isMenuOpen} className="mobile-navigation border-t border-line bg-surface-card px-4 py-4 shadow-sm lg:hidden">
        <nav aria-label="Mobile navigation" className="grid gap-1">
          {[...storeLinks, ['/wishlist', 'Saved items'], ['/cart', 'Shopping cart'], ...(isAuthenticated ? [['/account', 'My account'], ['/orders', 'Order history']] : []), ...(isAdmin ? [['/admin', 'Admin dashboard']] : [])].map(([to, label]) => <NavLink key={to} to={to} end={to === '/' || to === '/admin'} onClick={closeMenu} className={navigationClass}>{label}</NavLink>)}
        </nav>
        <div className="mt-3 border-t border-line pt-3">
          {isAuthenticated ? <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</Button> : <div className="grid grid-cols-2 gap-3"><Link to="/login" onClick={closeMenu} className="inline-flex min-h-touch items-center justify-center rounded-md border border-line text-sm font-semibold text-content-primary hover:bg-surface-muted">Sign in</Link><Link to="/register" onClick={closeMenu} className="inline-flex min-h-touch items-center justify-center rounded-md bg-brand px-3 text-sm font-semibold text-content-on-action hover:bg-brand-hover">Create account</Link></div>}
        </div>
      </div>
    </header>
  );
}
