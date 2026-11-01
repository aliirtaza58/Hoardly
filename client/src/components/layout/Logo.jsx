import React from 'react';

/** Hoardly mark: an ink bag carrying an H, drawn to match /favicon.svg. */
export function LogoMark({ className = 'h-7 w-7' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--color-ink)" />
      <path d="M11 11.5V10a5 5 0 0 1 10 0v1.5" fill="none" stroke="var(--color-paper)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7.5 12h17l-1.3 13.2a2 2 0 0 1-2 1.8H10.8a2 2 0 0 1-2-1.8z" fill="var(--color-paper)" />
      <path d="M12.6 15.5v8M19.4 15.5v8M12.6 19.5h6.8" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-bold tracking-[-0.04em] text-ink ${className}`}>
      <LogoMark />
      Hoardly
    </span>
  );
}
