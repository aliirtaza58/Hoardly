import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Heart, Minus, Plus, ShieldCheck } from 'lucide-react';
import { productsService } from '../services/products.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { StarRating } from '../components/product/StarRating.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { useCart } from '../contexts/CartContext.jsx';
import { useWishlist } from '../contexts/WishlistContext.jsx';

export function ProductPage() {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isSaved, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewEligibility, setReviewEligibility] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: '5', title: '', body: '' });
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState('');
  const [cartError, setCartError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError('');
    setActiveImage(0);

    productsService.getProductBySlug(slug)
      .then(async (response) => {
        const item = response.product;
        if (!item || !isActive) return;
        setProduct(item);
        try {
          const reviewsResponse = await productsService.getProductReviews(item.id);
          if (isActive) setReviews(reviewsResponse.reviews || []);
        } catch {
          if (isActive) setReviews([]);
        }
      })
      .catch((requestError) => {
        if (isActive) setError(requestError.message || 'This product could not be loaded. Please return to the catalog and try again.');
      })
      .finally(() => { if (isActive) setIsLoading(false); });

    return () => { isActive = false; };
  }, [slug]);

  useEffect(() => {
    if (!product || !isAuthenticated || !user?.id) return undefined;
    let isActive = true;
    const key = `${product.id}:${user.id}`;
    productsService.getReviewEligibility(product.id)
      .then((response) => { if (isActive) setReviewEligibility({ key, eligible: response.eligible }); })
      .catch((requestError) => { if (isActive) setReviewEligibility({ key, eligible: false, error: requestError.message || 'Purchase eligibility could not be checked.' }); });
    return () => { isActive = false; };
  }, [product, isAuthenticated, user?.id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!product) return;
    setIsSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      const response = await productsService.createReview(product.id, { ...reviewForm, rating: Number(reviewForm.rating) });
      setReviews((current) => [response.review, ...current]);
      productsService.getProductBySlug(product.slug).then((productResponse) => setProduct(productResponse.product)).catch(() => {});
      setReviewForm({ rating: '5', title: '', body: '' });
      setReviewSuccess('Your review has been submitted and is now visible with this product.');
    } catch (requestError) {
      setReviewError(requestError.message || 'Could not submit your review. Check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsAdding(true);
    setCartStatus('');
    setCartError('');
    try {
      await addToCart(product.id, quantity);
      setCartStatus('Added to your cart.');
    } catch (requestError) {
      setCartError(requestError.message || 'Could not add this item. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const saveItem = async () => {
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

  if (isLoading) return <div className="flex min-h-96 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-sm text-ink-2">Loading product...</span></div>;
  if (error) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Alert variant="error" title="Could not load product">{error}</Alert><Link to="/products" className="link mt-5 inline-flex min-h-touch items-center text-sm">Return to products</Link></div>;
  if (!product) return null;

  const reviewEligibilityKey = `${product.id}:${user?.id}`;
  const hasReviewEligibility = reviewEligibility?.key === reviewEligibilityKey;
  const canReview = hasReviewEligibility && reviewEligibility.eligible;
  const isCheckingReviewEligibility = isAuthenticated && !hasReviewEligibility;
  const reviewEligibilityError = hasReviewEligibility ? reviewEligibility.error : '';
  const images = product.images?.length ? product.images : [];
  const hasDiscount = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  const categoryUrl = `/products${product.category_slug ? `?category=${product.category_slug}` : ''}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={categoryUrl} className="link inline-flex min-h-touch items-center gap-1 text-sm"><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to products</Link>
      <div className="mt-4 grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <section aria-label="Product images" className="min-w-0">
          <div className="photo aspect-[4/5] overflow-hidden bg-paper-3">
            {images[activeImage] ? <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted">Image unavailable</div>}
          </div>
          {images.length > 1 && <div className="mt-4 grid grid-cols-[repeat(4,minmax(0,1fr))] gap-3">{images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden rounded-card bg-paper-3 outline -outline-offset-1 transition-[outline-color] duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${activeImage === index ? 'outline-2 outline-ink' : 'outline-1 outline-rule hover:outline-muted'}`} aria-label={`View image ${index + 1} of ${images.length}`} aria-pressed={activeImage === index}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </section>
        <section className="min-w-0">
          <Link to={categoryUrl} className="link text-sm">{product.category_name || 'Hoardly collection'}</Link>
          <h1 className="mt-3 text-section font-bold text-ink">{product.name}</h1>
          <div className="mt-4"><StarRating rating={product.avg_rating} reviewCount={product.review_count} size="lg" /></div>
          <div className="mt-6 flex flex-wrap items-baseline gap-3"><span className="font-display text-4xl font-bold tabular-nums tracking-[-0.04em] text-ink">{formatCurrency(product.price)}</span>{hasDiscount && <span className="tabular-nums text-muted line-through">{formatCurrency(product.compare_at_price)}</span>}</div>
          {hasDiscount && <p className="mt-2 text-sm text-ink-2">You save {formatCurrency(Number(product.compare_at_price) - Number(product.price))}.</p>}
          <p className="mt-4">{product.stock_quantity > 0 ? <span className="tag tag-in">{product.stock_quantity} currently available</span> : <span className="tag tag-out">Currently unavailable</span>}</p>
          <p className="mt-6 text-ink-2">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-3"><div className="inline-flex items-center rounded-control border border-rule bg-paper"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || isAdding} className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-control text-ink transition-colors duration-fast hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Decrease quantity"><Minus className="h-4 w-4" aria-hidden="true" /></button><span className="w-10 text-center font-mono text-sm" aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(product.stock_quantity || 1, value + 1))} disabled={!product.stock_quantity || quantity >= product.stock_quantity || isAdding} className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-control text-ink transition-colors duration-fast hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Increase quantity"><Plus className="h-4 w-4" aria-hidden="true" /></button></div><Button size="lg" isLoading={isAdding} disabled={!product.stock_quantity} onClick={addItem} className="order-first min-h-touch w-full sm:order-none sm:w-auto sm:flex-1">Add to cart</Button><Button variant="secondary" size="lg" isLoading={isSaving} onClick={saveItem} className="min-h-touch" aria-label={isSaved(product.id) ? 'Remove from saved items' : 'Save item'}><Heart className={`h-4 w-4 ${isSaved(product.id) ? 'fill-current' : ''}`} aria-hidden="true" />{isSaved(product.id) ? 'Saved' : 'Save'}</Button></div>
          {saveError && <Alert variant="error" className="mt-4">{saveError}</Alert>}{cartError && <Alert variant="error" className="mt-4">{cartError}</Alert>}{cartStatus && <Alert variant="success" className="mt-4">{cartStatus}</Alert>}
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-2"><ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> Secure delivery details are confirmed once an order is ready to place.</p>
          {product.attributes && <section aria-labelledby="details-heading" className="mt-10"><h2 id="details-heading" className="pb-3 text-title font-bold text-ink">Product details</h2><dl className="ruled">{Object.entries(product.attributes).map(([label, value]) => <div key={label} className="flex items-baseline justify-between gap-6 py-3 text-sm"><dt className="capitalize text-muted">{label.replace(/([A-Z])/g, ' $1')}</dt><dd className="min-w-0 break-words text-right text-ink">{value}</dd></div>)}</dl></section>}
          <div className="well mt-8 p-5"><p className="text-sm font-semibold text-ink">Good to know</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-2"><li>Product details are kept current with the catalog.</li><li>Need help deciding? Read customer reviews below.</li><li>Items ship according to the delivery options shown at checkout.</li></ul></div>
        </section>
      </div>
      <section className="mt-16" aria-labelledby="reviews-heading"><div className="flex flex-wrap items-end justify-between gap-4 pb-4"><h2 id="reviews-heading" className="text-section font-bold text-ink">Reviews for {product.name}</h2><StarRating rating={product.avg_rating} reviewCount={product.review_count} size="lg" /></div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]"><div className="min-w-0">{reviews.length ? <ul className="ruled">{reviews.map((review) => <li key={review.id} className="py-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-ink">{review.user_name || 'Verified customer'}</p><span className="text-sm text-muted">{formatDate(review.created_at)}</span></div><div className="mt-2"><StarRating rating={review.rating} showValue={false} /></div><h3 className="mt-3 text-base font-semibold tracking-normal text-ink">{review.title}</h3><p className="mt-1 text-ink-2">{review.body}</p></li>)}</ul> : <p className="border-t border-ink py-5 text-ink-2">No reviews yet. Be the first to share your experience.</p>}</div>
          <div className="well self-start p-5"><h3 className="text-title font-bold text-ink">Write a review</h3>{!isAuthenticated ? <div className="mt-3"><p className="text-sm text-ink-2">Sign in to share feedback after a delivered purchase.</p><Link to="/login" className="link mt-2 inline-flex min-h-touch items-center text-sm">Sign in to review</Link></div> : isCheckingReviewEligibility ? <div className="mt-5 flex items-center gap-3 text-sm text-ink-2" role="status"><Spinner size="sm" />Checking purchase eligibility...</div> : canReview ? reviews.some((review) => review.user_id === user?.id) ? <p className="mt-3 text-sm text-ink-2">You have already reviewed this product.</p> : <form className="mt-5 space-y-4" onSubmit={submitReview}><label className="block text-sm text-ink-2">Rating<select value={reviewForm.rating} onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))} className="mt-2 block w-full rounded-control border border-rule bg-paper px-3 py-2 text-base text-ink">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></label><label className="block text-sm text-ink-2">Review title<input required maxLength="120" value={reviewForm.title} onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 block w-full rounded-control border border-rule bg-paper px-3 py-2 text-base text-ink" /></label><label className="block text-sm text-ink-2">Your review<textarea required maxLength="3000" rows="4" value={reviewForm.body} onChange={(event) => setReviewForm((current) => ({ ...current, body: event.target.value }))} className="mt-2 block w-full rounded-control border border-rule bg-paper px-3 py-2 text-base text-ink resize-y" /></label>{reviewError && <Alert variant="error">{reviewError}</Alert>}{reviewSuccess && <Alert variant="success">{reviewSuccess}</Alert>}<Button type="submit" isLoading={isSubmitting} className="min-h-touch w-full">Submit review</Button></form> : <div className="mt-3"><p className="text-sm text-ink-2">A delivered purchase is required before you can review this product.</p>{reviewEligibilityError && <Alert variant="warning" className="mt-3">{reviewEligibilityError}</Alert>}</div>}</div>
        </div>
      </section>
    </div>
  );
}
