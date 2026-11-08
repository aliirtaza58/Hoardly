import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';
import { StarRating } from './StarRating.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleWishlist } = useWishlist();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const image = product.images?.[0] || product.image_url;
  const discount = product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
    ? Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100)
    : null;

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsSaving(true);
    setSaveError('');
    try {
      await toggleWishlist(product.id);
    } catch (requestError) {
      setSaveError(requestError.message || 'Could not update saved items. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link to={`/products/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
          <div className="photo aspect-[4/5] overflow-hidden bg-paper-3">
            {image ? (
              <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">Image unavailable</div>
            )}
          </div>
        </Link>
        <button type="button" disabled={isSaving} onClick={handleSave} className="absolute right-3 top-3 inline-flex min-h-touch min-w-touch items-center justify-center rounded-full border border-rule bg-paper text-ink transition-colors duration-fast hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-60" aria-label={isSaved(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} aria-pressed={isSaved(product.id)} aria-busy={isSaving}><Heart className={`h-4 w-4 ${isSaved(product.id) ? 'fill-current' : ''}`} aria-hidden="true" /></button>
      </div>
      <div className="mt-3 space-y-1.5">
        {saveError && <p role="alert" className="text-sm text-feedback-error">{saveError}</p>}
        <Link to={`/products/${product.slug}`} className="block font-semibold leading-snug text-ink no-underline hover:underline hover:decoration-accent">
          {product.name}
        </Link>
        <p className="truncate text-sm text-muted">{product.category_name || 'Hoardly collection'}</p>
        <StarRating rating={product.avg_rating} reviewCount={product.review_count} />
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          <span className="font-display text-2xl font-bold tabular-nums tracking-[-0.04em] text-ink">{formatCurrency(product.price)}</span>
          {discount !== null && <span className="text-sm tabular-nums text-muted line-through">{formatCurrency(product.compare_at_price)}</span>}
          {discount > 0 && <span className="tag">Save {discount}%</span>}
        </div>
      </div>
    </article>
  );
}
