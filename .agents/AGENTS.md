# E-Commerce Website — Project Rules

This is a full-stack e-commerce platform. ALL work on this project MUST follow the two governing plans documented in `.agents/rules/`. No deviations without explicit user approval.

## Governing Documents (MANDATORY reading before any work)

1. **Development Plan**: `.agents/rules/development-plan.md` — 10-phase build plan, tech stack, database schema, API endpoints, folder structure, git workflow.
2. **UI/UX Design Plan**: `.agents/rules/ui-ux-design-plan.md` — Token system, component specs, page layouts, accessibility protocol, UX writing standards, performance targets.

## Phase Tracking

Check `.agents/rules/phase-tracker.md` before starting any work to see which phases are complete and which is current.

## Critical Rules (Always enforced)

- Follow the phased approach. Never skip ahead or build features from a later phase.
- Push to GitHub periodically after review, never bulk-dump entire codebase.
- Zero emoji in any output — UI, code, JSON, copy, comments, commit messages.
- Every interactive component ships 8 states: default, hover, focus, active, disabled, loading, error, selected.
- All values come from design tokens. No hardcoded hex, px, timing, or font values.
- One theme, one source of truth (`theme.css`). No per-page palettes.
- Accessibility is not optional — WCAG 2.2 AA minimum.
- UX copy follows formulas: buttons = verb+object, errors = what/why/how, empty states = value+action.
- Destructive actions always use danger/destructive tokens, never primary.
- Icons: Lucide only, inline SVG, `currentColor`.
- Font loading: preconnect + preload + `font-display: swap`. Never `@import`.
- Decision priority: User needs > Accessibility > Consistency > Aesthetics > DX.
