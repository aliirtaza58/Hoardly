import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '../common/Button.jsx';
import { ShoppingCart, Heart, User, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { SearchBar } from '../product/SearchBar.jsx';
import { useCart } from '../../contexts/CartContext.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';

const storeLinks = [['/products', 'Shop'], ['/categories', 'Categories']];
const navigationClass = ({ isActive }) => `flex min-h-touch items-center rounded-control px-3 text-[0.95rem] font-semibold text-ink underline-offset-[0.35em] decoration-1 transition-[text-decoration-color] duration-fast ${isActive ? 'underline' : 'hover:underline hover:decoration-accent'}`;

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
    <header className="sticky top-0 z-40 w-full border-b border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="flex min-h-touch shrink-0 items-center rounded-control" aria-label="Hoardly homepage">
          <Logo />
        </Link>
        <nav aria-label="Main navigation" className="hidden shrink-0 items-center gap-1 lg:flex">
          {storeLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={navigationClass}>{label}</NavLink>)}
        </nav>
        <SearchBar className="hidden min-w-0 max-w-sm flex-1 xl:flex" />
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Link to="/wishlist" onClick={closeMenu} className="relative inline-flex min-h-touch min-w-touch items-center justify-center rounded-control text-ink hover:bg-paper-2" aria-label={`Saved items${wishlistCount ? `, ${wishlistCount} saved` : ''}`}><Heart className="h-5 w-5" aria-hidden="true" />{wishlistCount > 0 && <span className="absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-ink px-1 text-xs font-semibold leading-4 text-paper">{wishlistCount}</span>}</Link>
          <Link to="/cart" onClick={closeMenu} className="relative inline-flex min-h-touch min-w-touch items-center justify-center rounded-control text-ink hover:bg-paper-2" aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}><ShoppingCart className="h-5 w-5" aria-hidden="true" />{cartCount > 0 && <span className="absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-ink px-1 text-xs font-semibold leading-4 text-paper">{cartCount}</span>}</Link>
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 lg:flex">
              {isAdmin && <Link to="/admin" className="inline-flex min-h-touch items-center gap-1 rounded-control px-2 text-sm font-semibold text-ink hover:bg-paper-2"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Admin</Link>}
              <Link to="/account" className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-control text-sm text-ink hover:bg-paper-2" aria-label="Open your account"><User className="h-5 w-5" aria-hidden="true" /><span className="hidden max-w-24 truncate font-semibold text-ink 2xl:inline-block">{profile?.full_name || user?.email?.split('@')[0]}</span></Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out of account"><LogOut className="h-4 w-4" aria-hidden="true" /><span className="hidden 2xl:inline">Sign out</span></Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/login" className="inline-flex min-h-touch items-center rounded-control px-3 text-sm font-semibold text-ink hover:bg-paper-2">Sign in</Link>
              <Link to="/register" className="inline-flex min-h-touch items-center rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-2">Create account</Link>
            </div>
          )}
          <button ref={menuButton} type="button" className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-control text-ink hover:bg-paper-2 lg:hidden" onClick={() => setMenuKey(isMenuOpen ? null : locationKey)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation">
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:px-8 xl:hidden"><SearchBar /></div>
      <div id="mobile-navigation" hidden={!isMenuOpen} className="mobile-navigation border-t border-rule bg-paper px-4 py-4 lg:hidden">
        <nav aria-label="Mobile navigation" className="grid gap-1">
          {[['/', 'Home'], ...storeLinks, ['/wishlist', 'Saved items'], ['/cart', 'Shopping cart'], ...(isAuthenticated ? [['/account', 'My account'], ['/orders', 'Order history']] : []), ...(isAdmin ? [['/admin', 'Admin dashboard']] : [])].map(([to, label]) => <NavLink key={to} to={to} end={to === '/' || to === '/admin'} onClick={closeMenu} className={navigationClass}>{label}</NavLink>)}
        </nav>
        <div className="mt-3 border-t border-rule pt-3">
          {isAuthenticated ? <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</Button> : <div className="grid grid-cols-2 gap-3"><Link to="/login" onClick={closeMenu} className="inline-flex min-h-touch items-center justify-center rounded-control border border-rule bg-paper-2 text-sm font-semibold text-ink hover:bg-paper-3">Sign in</Link><Link to="/register" onClick={closeMenu} className="inline-flex min-h-touch items-center justify-center rounded-control bg-ink px-3 text-sm font-semibold text-paper hover:bg-ink-2">Create account</Link></div>}
        </div>
      </div>
    </header>
  );
}
