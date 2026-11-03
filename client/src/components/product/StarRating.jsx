import React from 'react';
import { Star } from 'lucide-react';

export function StarRating({ rating = 0, reviewCount, showValue = true, size = 'sm' }) {
  const iconClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const label = `${Number(rating).toFixed(1)} out of 5 stars${reviewCount !== undefined ? ` from ${reviewCount} reviews` : ''}`;
  const filled = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={label}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`${iconClass} ${star <= filled ? 'fill-ink text-ink' : 'fill-rule text-rule'}`} />
        ))}
      </span>
      {showValue && <span className="text-sm font-semibold tabular-nums text-ink" aria-hidden="true">{Number(rating).toFixed(1)}</span>}
      {reviewCount !== undefined && <span className="text-sm tabular-nums text-muted" aria-hidden="true">({reviewCount})</span>}
    </div>
  );
}
