# UI/UX Design Plan — E-Commerce Website

> **MANDATORY**: Read this entire document before doing any UI work on this project.
> This plan governs all visual, interaction, and copy decisions.

---

## House Rules (Non-Negotiable)

### The 5 Non-Negotiables
1. **Token by intent** — Every value comes from a token. Destructive actions use `action.destructive`, never `action.primary`. No hardcoded hex, px, or timing.
2. **One theme, one source of truth** — Single `theme.css` with CSS variables, imported once at app root. No per-page palettes.
3. **Every interactive element ships 8 states** — Default, Hover, Focus, Active, Disabled, Loading (if async), Error (if input), Selected (if selectable).
4. **One thing leads** — Every screen has a primary focal point. Display type >= 2.5x body size.
5. **Output completeness** — Full files, never placeholders.

### Absolute Rules
- Zero emoji in any output (UI, code, JSON, copy, comments, commits). Use Lucide icons or plain words.
- Never claim a contrast ratio or WCAG pass not actually measured.
- Decision priority: User needs > Accessibility > Consistency > Aesthetics > DX.

---

## Visual Direction

**Aesthetic**: Soft-SaaS + Stripe-inspired
- Clean, airy layouts with generous whitespace
- Subtle shadows and rounded corners
- Strong typographic hierarchy
- Restrained palette (one primary, one accent, neutrals)
- Smooth, purposeful animations

**Brief Inference**:
- Industry: E-commerce / online retail
- Audience: General consumers, 18-45
- Tone: Trustworthy, modern, approachable
- Mood: Polished
- Motion: Medium depth

---

## Design Token System

### Color Tokens (Semantic Layer)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-surface-page` | neutral-50 | neutral-950 | Page background |
| `--color-surface-card` | white | neutral-900 | Cards, panels |
| `--color-surface-raised` | white | neutral-850 | Modals, dropdowns |
| `--color-text-primary` | neutral-900 | neutral-50 | Body text |
| `--color-text-secondary` | neutral-600 | neutral-400 | Supporting text |
| `--color-text-on-action` | white | white | Text on primary buttons |
| `--color-text-link` | primary-600 | primary-400 | Links |
| `--color-action-primary` | primary-600 | primary-500 | Primary CTAs |
| `--color-action-primary-hover` | primary-700 | primary-400 | Primary hover |
| `--color-action-destructive` | red-600 | red-500 | Delete, remove |
| `--color-action-destructive-hover` | red-700 | red-400 | Destructive hover |
| `--color-border-default` | neutral-200 | neutral-800 | Subtle borders |
| `--color-border-strong` | neutral-400 | neutral-600 | Emphasized (>= 3:1) |
| `--color-feedback-success` | green-600 | green-400 | Success |
| `--color-feedback-warning` | amber-600 | amber-400 | Warning |
| `--color-feedback-error` | red-600 | red-400 | Error |
| `--color-feedback-info` | blue-600 | blue-400 | Info |

### Typography Scale (Major Third 1.25)

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `--text-xs` | 12px | 16px | Captions, badges |
| `--text-sm` | 14px | 20px | Labels, secondary |
| `--text-base` | 16px | 24px | Body |
| `--text-lg` | 20px | 28px | Card titles |
| `--text-xl` | 24px | 32px | Section headings |
| `--text-2xl` | 30px | 36px | Page titles |
| `--text-3xl` | 36px | 40px | Hero headings |
| `--text-4xl` | 48px | 52px | Display hero |

Font: Inter via `<link rel="preconnect">` + `<link rel="preload">` + `font-display: swap`. Referenced as `--font-sans`.

### Spacing (4px base)
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Radius
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, chips |
| `--radius-md` | 8px | Inputs, cards |
| `--radius-lg` | 12px | Modals, panels |
| `--radius-xl` | 16px | Large cards |
| `--radius-full` | 9999px | Avatars, pills |

### Shadows
| Token | Usage |
|---|---|
| `--shadow-xs` | Subtle card separation |
| `--shadow-sm` | Cards, dropdowns resting |
| `--shadow-md` | Hovered cards, popovers |
| `--shadow-lg` | Modals, floating panels |
| `--shadow-xl` | Toast notifications |

### Motion
| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 100ms | Hover, toggle |
| `--duration-normal` | 200ms | Expand, collapse |
| `--duration-slow` | 300ms | Page transitions, modals |
| `--ease-out` | cubic-bezier(0.16,1,0.3,1) | Elements entering |
| `--ease-in` | cubic-bezier(0.7,0,0.84,0) | Elements exiting |
| `--ease-emphasized` | cubic-bezier(0.2,0,0,1) | Expand/collapse |

All motion respects `@media(prefers-reduced-motion: reduce)`.

---

## Component Inventory

### Atoms
| Component | Variants | States |
|---|---|---|
| Button | primary, secondary, destructive, ghost, link | All 8 |
| Input | text, email, password, number, search | default, focus, error, disabled |
| Select | single | default, focus, error, disabled |
| Checkbox | default, indeterminate | default, checked, focus, disabled |
| Radio | default | default, selected, focus, disabled |
| Badge | neutral, success, warning, error, info | default |
| Avatar | image, initials | default |
| Icon | Lucide SVG set | n/a |
| Spinner | sm, md, lg | n/a |
| Skeleton | text, card, image | n/a |

### Molecules
| Component | Usage |
|---|---|
| ProductCard | Product grid items |
| CartItem | Cart page rows |
| SearchBar | Navbar search |
| FormField | All forms (label + input + error) |
| StarRating | Reviews |
| PriceDisplay | Products |
| QuantitySelector | Cart, product detail |
| AddressCard | Profile addresses |

### Organisms
| Component | Usage |
|---|---|
| Navbar | App shell |
| ProductGrid | Listing page |
| ProductFilter | Listing sidebar |
| CartSummary | Cart page sidebar |
| CheckoutForm | Checkout |
| ReviewSection | Product detail |
| OrderTable | Order history |
| AdminSidebar | Admin layout |

### Templates
| Template | Usage |
|---|---|
| MainLayout | Public pages (Navbar + main + Footer) |
| AdminLayout | Admin pages (Sidebar + content) |
| AuthLayout | Login, register (centered card) |

---

## UX Writing Standards

### Voice: Clear, concise, useful, human, honest

| Element | Formula | Example |
|---|---|---|
| Buttons | Verb + object | "Add to cart", "Place order" |
| Destructive confirms | Restate action + object | "Delete account", "Remove from cart" |
| Errors | What + why + how | "Could not place order. Items are out of stock. [Review cart]" |
| Empty states | Value + first action | "Your cart is empty. [Start shopping]" |
| Loading | Context verb-ing | "Placing your order..." |
| Success | Confirm + next step | "Order placed. [View order details]" |

### Mechanics
- Sentence case (no ALL CAPS)
- Numerals (not written numbers)
- Labels above inputs (never placeholder-only)
- No blame on the user
- No emoji

---

## Accessibility (WCAG 2.2 AA)

| Check | Standard |
|---|---|
| Keyboard navigable | 2.1.1 |
| Focus visible (>= 3:1) | 2.4.7 |
| SR name/role/state | 4.1.2 |
| Text contrast >= 4.5:1 | 1.4.3 |
| UI contrast >= 3:1 | 1.4.11 |
| Target size >= 24px | 2.5.8 |
| No color-only signaling | 1.4.1 |
| Focus not obscured | 2.4.11 |
| Accessible auth | 3.3.8 |

### Modals: Focus trap, role="dialog", aria-modal, aria-labelledby, Escape closes, return focus.
### Reduced motion: `@media(prefers-reduced-motion: reduce)` disables transitions.

---

## Performance Targets

| Metric | Target |
|---|---|
| LCP | <= 2.5s |
| INP | <= 200ms |
| CLS | <= 0.1 |

- `loading="lazy"` on below-fold images
- `aspect-ratio` to reserve image space
- Code splitting per route with React.lazy()
- Animations: only `transform`/`opacity`
- Skeletons sized to final dimensions

---

## Dark Mode Strategy
- Implemented at semantic token layer
- Toggle via `[data-theme="dark"]` on `<html>`
- User preference in localStorage, respects `prefers-color-scheme`
- Every token pair verified for contrast

---

## Design Review (per page)

6 dimensions: Visual Hierarchy (20%), Consistency (20%), Accessibility (20%), Usability (20%), Responsiveness (10%), Performance (10%).

Anti-slop checklist:
- No generic colors
- No default system fonts
- No uniform repetition without hierarchy break
- No 80% whitespace pages
- auto-fit not auto-fill for grids
- No emoji
- Single theme only
- Destructive = danger tokens

---

## Icons
- Lucide icon set exclusively
- Inline SVG via symbol sprite (no network requests)
- `currentColor`, `stroke-width: 2`, `fill: none`
- `aria-hidden="true"` on decorative icons
- `aria-label` on icon-only buttons
