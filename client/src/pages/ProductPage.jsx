import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronLeft, ShieldCheck } from 'lucide-react';
import { productsService } from '../services/products.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { StarRating } from '../components/product/StarRating.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export function ProductPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: '5', title: '', body: '' });

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

  const submitReview = async (event) => {
    event.preventDefault();
    if (!product) return;
    setIsSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      const response = await productsService.createReview(product.id, { ...reviewForm, rating: Number(reviewForm.rating) });
      setReviews((current) => [response.review, ...current]);
      setReviewForm({ rating: '5', title: '', body: '' });
      setReviewSuccess('Your review has been submitted and is now visible with this product.');
    } catch (requestError) {
      setReviewError(requestError.message || 'Could not submit your review. Check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-96 items-center justify-center"><Spinner size="lg" /><span className="ml-3 text-sm text-content-secondary">Loading product...</span></div>;
  if (error) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Alert variant="error" title="Could not load product">{error}</Alert><Link to="/products" className="mt-5 inline-block text-sm font-semibold text-content-link hover:underline">Return to products</Link></div>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [];
  const hasDiscount = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/products${product.category_slug ? `?category=${product.category_slug}` : ''}`} className="inline-flex items-center gap-1 text-sm font-semibold text-content-link hover:underline"><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to products</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <section aria-label="Product images">
          <div className="aspect-square overflow-hidden rounded-lg border border-line bg-surface-muted">
            {images[activeImage] ? <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-content-muted">Image unavailable</div>}
          </div>
          {images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3">{images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden rounded-md border bg-surface-muted ${activeImage === index ? 'border-brand ring-2 ring-brand/20' : 'border-line hover:border-line-strong'}`} aria-label={`View image ${index + 1} of ${images.length}`} aria-pressed={activeImage === index}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </section>
        <section>
          <p className="text-sm font-semibold text-content-link">{product.category_name || 'Hoardly collection'}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">{product.name}</h1>
          <div className="mt-4"><StarRating rating={product.avg_rating} reviewCount={product.review_count} size="lg" /></div>
          <div className="mt-6 flex items-baseline gap-3"><span className="text-3xl font-bold text-content-primary">{formatCurrency(product.price)}</span>{hasDiscount && <span className="text-base text-content-muted line-through">{formatCurrency(product.compare_at_price)}</span>}</div>
          {hasDiscount && <p className="mt-2 text-sm font-medium text-feedback-success">You save {formatCurrency(Number(product.compare_at_price) - Number(product.price))}.</p>}
          <p className="mt-6 text-base leading-7 text-content-secondary">{product.description}</p>
          <div className="mt-8 border-y border-line py-6"><p className="text-sm font-semibold text-content-primary">Availability</p><p className="mt-2 flex items-center gap-2 text-sm text-feedback-success"><Check className="h-4 w-4" aria-hidden="true" /> {product.stock_quantity > 0 ? `${product.stock_quantity} currently available` : 'Currently unavailable'}</p></div>
          <p className="mt-6 flex items-center gap-2 text-sm text-content-secondary"><ShieldCheck className="h-4 w-4 text-feedback-success" aria-hidden="true" /> Secure delivery details are confirmed once an order is ready to place.</p>
        </section>
      </div>
      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="details-heading"><h2 id="details-heading" className="text-2xl font-bold text-content-primary">Product details</h2>{product.attributes && <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface-card">{Object.entries(product.attributes).map(([label, value]) => <div key={label} className="grid grid-cols-2 gap-4 px-5 py-4 text-sm"><dt className="font-medium capitalize text-content-secondary">{label.replace(/([A-Z])/g, ' $1')}</dt><dd className="text-content-primary">{value}</dd></div>)}</dl>}</section>
        <aside className="rounded-lg border border-line bg-surface-card p-5"><p className="text-sm font-semibold text-content-primary">Good to know</p><ul className="mt-4 space-y-3 text-sm leading-6 text-content-secondary"><li>Product details are kept current with the catalog.</li><li>Need help deciding? Read customer reviews below.</li><li>Items ship according to the delivery options shown at checkout.</li></ul></aside>
      </div>
      <section className="mt-16 border-t border-line pt-12" aria-labelledby="reviews-heading"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-content-link">Customer feedback</p><h2 id="reviews-heading" className="mt-2 text-2xl font-bold text-content-primary">Reviews for {product.name}</h2></div><StarRating rating={product.avg_rating} reviewCount={product.review_count} size="lg" /></div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]"><div className="space-y-5">{reviews.length ? reviews.map((review) => <article key={review.id} className="rounded-lg border border-line bg-surface-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-content-primary">{review.user_name || 'Verified customer'}</p><span className="text-xs text-content-muted">{formatDate(review.created_at)}</span></div><div className="mt-2"><StarRating rating={review.rating} showValue={false} /></div><h3 className="mt-3 font-semibold text-content-primary">{review.title}</h3><p className="mt-2 text-sm leading-6 text-content-secondary">{review.body}</p></article>) : <div className="rounded-lg border border-dashed border-line-strong p-6 text-sm text-content-secondary">No reviews yet. Be the first to share your experience.</div>}</div>
          <div className="rounded-lg border border-line bg-surface-card p-5"><h3 className="text-lg font-semibold text-content-primary">Write a review</h3>{isAuthenticated ? <form className="mt-5 space-y-4" onSubmit={submitReview}><label className="block text-sm font-medium text-content-primary">Rating<select value={reviewForm.rating} onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))} className="mt-2 block w-full rounded-md border border-line bg-surface-card px-3 py-2 text-sm">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></label><label className="block text-sm font-medium text-content-primary">Review title<input required value={reviewForm.title} onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 block w-full rounded-md border border-line bg-surface-card px-3 py-2 text-sm" /></label><label className="block text-sm font-medium text-content-primary">Your review<textarea required rows="4" value={reviewForm.body} onChange={(event) => setReviewForm((current) => ({ ...current, body: event.target.value }))} className="mt-2 block w-full resize-y rounded-md border border-line bg-surface-card px-3 py-2 text-sm" /></label>{reviewError && <Alert variant="error">{reviewError}</Alert>}{reviewSuccess && <Alert variant="success">{reviewSuccess}</Alert>}<Button type="submit" isLoading={isSubmitting} className="w-full">Submit review</Button></form> : <div className="mt-4"><p className="text-sm leading-6 text-content-secondary">Sign in to share feedback based on your experience with this product.</p><Link to="/login" className="mt-4 inline-block text-sm font-semibold text-content-link hover:underline">Sign in to review</Link></div>}</div>
        </div>
      </section>
    </div>
  );
}
