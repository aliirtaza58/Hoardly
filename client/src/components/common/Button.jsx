import React from 'react';
import { Spinner } from './Spinner.jsx';

/**
 * Universal Button atom supporting all 8 interactive states:
 * 1. Default
 * 2. Hover
 * 3. Focus (:focus-visible)
 * 4. Active (:active)
 * 5. Disabled (disabled attribute)
 * 6. Loading (isLoading prop with spinner + aria-busy)
 * 7. Error (hasError prop)
 * 8. Selected (isSelected prop / aria-pressed)
 */
export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  hasError = false,
  isSelected = false,
  disabled = false,
  onClick,
  className = '',
  id,
  'aria-label': ariaLabel,
  ...props
}) {
  const isInteractionDisabled = disabled || isLoading;

  // Base sizing tokens
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-control gap-1.5 font-semibold',
    md: 'min-h-touch px-4 py-2.5 text-sm rounded-control gap-2 font-semibold',
    lg: 'min-h-touch px-6 py-3 text-base rounded-control gap-2.5 font-semibold',
  }[size] || 'px-4 py-2.5 text-sm rounded-control gap-2 font-semibold';

  // Variant classes mapping to semantic tokens
  const variantClasses = {
    primary: [
      'bg-ink text-paper border border-ink',
      'hover:bg-ink-2 hover:border-ink-2',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
      'active:translate-y-px',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink',
    ].join(' '),

    secondary: [
      'bg-paper-2 text-ink border border-rule',
      'hover:bg-paper-3 hover:border-line-strong',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
      'active:translate-y-px',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-paper-2',
    ].join(' '),

    destructive: [
      'bg-destructive text-paper border border-destructive',
      'hover:bg-destructive-hover',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-error',
      'active:bg-destructive-active',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-destructive',
    ].join(' '),

    ghost: [
      'bg-transparent text-ink',
      'hover:bg-paper-2',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
      'active:bg-surface-muted',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' '),

    link: [
      'bg-transparent text-ink p-0 inline-flex items-center underline underline-offset-4 decoration-1',
      'hover:decoration-accent',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
      'active:opacity-80',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline',
    ].join(' '),
  }[variant] || '';

  // Error state modification
  const errorClasses = hasError ? 'ring-2 ring-feedback-error border-feedback-error' : '';

  // Selected state modification
  const selectedClasses = isSelected ? '!bg-ink !text-paper !border-ink' : '';

  return (
    <button
      id={id}
      type={type}
      disabled={isInteractionDisabled}
      onClick={onClick}
      aria-busy={isLoading}
      aria-pressed={isSelected ? true : undefined}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center transition-[background-color,border-color,color,transform] duration-fast cursor-pointer select-none ${sizeClasses} ${variantClasses} ${errorClasses} ${selectedClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size === 'lg' ? 'md' : 'sm'} />
          <span>Processing request...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
