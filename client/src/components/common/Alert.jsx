import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Accessible Alert notification banner with semantic status tokens.
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) {
  const config = {
    info: {
      container: 'bg-paper-2 border-rule text-ink',
      icon: <Info className="w-5 h-5 text-ink shrink-0" aria-hidden="true" />,
    },
    success: {
      container: 'bg-paper-2 border-rule text-ink',
      icon: <CheckCircle2 className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />,
    },
    warning: {
      container: 'bg-paper-2 border-ink text-ink',
      icon: <AlertTriangle className="w-5 h-5 text-ink shrink-0" aria-hidden="true" />,
    },
    error: {
      container: 'bg-paper border-feedback-error text-ink',
      icon: <AlertCircle className="w-5 h-5 text-feedback-error shrink-0" aria-hidden="true" />,
    },
  }[variant] || config.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-card border text-sm ${config.container} ${className}`}
    >
      {config.icon}
      <div className="flex-1">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="-m-2 inline-flex min-h-touch min-w-touch items-center justify-center rounded-control hover:bg-paper-3 cursor-pointer text-current"
          aria-label="Dismiss alert notification"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
