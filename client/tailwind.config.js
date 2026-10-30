/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: { touch: 'var(--size-touch-target)' },
      maxWidth: { container: 'var(--container)' },
      colors: {
        paper: { DEFAULT: 'var(--color-paper)', 2: 'var(--color-paper-2)', 3: 'var(--color-paper-3)' },
        ink: { DEFAULT: 'var(--color-ink)', 2: 'var(--color-ink-2)' },
        muted: 'var(--color-muted)',
        rule: { DEFAULT: 'var(--color-rule)', 2: 'var(--color-rule-2)' },
        accent: { DEFAULT: 'var(--color-accent)', soft: 'var(--color-accent-soft)', 'soft-ink': 'var(--color-accent-soft-ink)' },
        surface: {
          page: 'var(--color-surface-page)',
          card: 'var(--color-surface-card)',
          raised: 'var(--color-surface-raised)',
          muted: 'var(--color-surface-muted)',
        },
        content: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          'on-action': 'var(--color-text-on-action)',
          link: 'var(--color-text-link)',
        },
        brand: {
          DEFAULT: 'var(--color-action-primary)',
          hover: 'var(--color-action-primary-hover)',
          active: 'var(--color-action-primary-active)',
        },
        destructive: {
          DEFAULT: 'var(--color-action-destructive)',
          hover: 'var(--color-action-destructive-hover)',
          active: 'var(--color-action-destructive-active)',
        },
        line: {
          DEFAULT: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
          focus: 'var(--color-border-focus)',
          error: 'var(--color-border-error)',
        },
        feedback: {
          success: 'var(--color-feedback-success)',
          warning: 'var(--color-feedback-warning)',
          error: 'var(--color-feedback-error)',
          info: 'var(--color-feedback-info)',
        },
      },
      fontFamily: {
        sans: ['Epilogue', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Epilogue', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'display-s': ['var(--text-display-s)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        section: ['var(--text-section)', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        title: ['var(--text-title)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        lead: ['var(--text-lead)', { lineHeight: '1.45' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
        card: 'var(--radius-card)',
        control: '10px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
};
