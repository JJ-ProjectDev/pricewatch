
# Iteration 7 Review

## Objectives

Deliver the remaining core pages needed for a demoable product: product
detail states, the watchlist page, login/register, and the homepage. Also
close out a UX bug on product cards, remove a background effect causing
performance issues, and add a small UI polish feature (animated search
placeholder).

## Design System Decisions

- Confirmed dark-only theme; no light mode planned for the current design
  system.
- DM Mono formalized as the typeface for headings, prices, product names,
  and the wordmark; Geist Variable for body text. Enforced globally via a
  base-layer `h1` rule so headings don't need manual font classes.
- Established reusable visual patterns: corner-overlay badges (category
  tags), large faint background "watermark" numbers for numbered steps,
  and a consistent skeleton-loading pattern per page.

## Component Changes

- `ProductDetailPage`: loading (skeleton), 404, error, and loaded states;
  two-column responsive layout; price history placeholder card.
- `WatchlistPage`: empty state and populated grid, using `ProductCard`.
- `LoginPage` / `RegisterPage`: built out with proper button/link
  semantics (fixed accidental form-submit risk on secondary buttons).
- `HomePage`: hero section, retailers section, "How it works" section,
  CTA banner — all built section by section against the sandbox reference.
- Extracted shared utilities (`getCategory`, `getPrices`) and mock data
  (`mockData.ts`) out of `ProductCard` for reuse across pages.
- Fixed a bug where clicking the watch/bookmark button on a `ProductCard`
  navigated to the product detail page instead of toggling watch state —
  root cause was a nested `<button>` inside a `<Link>` (`<a>`): stopping
  event propagation blocked the router's click handler, but not the
  anchor's native default navigation. Fixed by also calling
  `preventDefault()`.

## Animation Approach

- Framer Motion used throughout for entrance transitions: per-section
  fade/slide-in on mount (`opacity` + `x`/`y` offset), plus a page-level
  fade wrapping the whole `HomePage`.
- Added `useTypewriterPlaceholder`, a custom hook driving a cycling
  typewriter effect on the product search input's placeholder text
  (typing/pausing/deleting/waiting phases via chained `setTimeout`s). It
  only touches the `placeholder` prop, so it doesn't interfere with the
  input's actual value or functionality.
- Removed `BackgroundWave.tsx` — its blur-filter-heavy CSS was causing
  performance issues. No animated background currently in place.

## Known Issues

- Search input is not wired to any real search/filter logic yet — the
  typewriter placeholder is cosmetic only.
- Several pages (`ProductDetailPage`, `WatchlistPage`, `HomePage`) use
  hardcoded `MOCK_PRODUCTS` instead of real API calls, marked with
  `// TODO(revert)` comments.
- Retailers section uses a divider line under the "Prices tracked from
  retailers like:" heading that's a minor stylistic deviation from the
  sandbox reference (flagged, not fixed).
- Login/Register wordmark is text-only — no icon — pending a custom
  logomark.

## Technical Debt

- Real API integration needs to replace all mock data usage before this
  can be considered feature-complete.
- No background/decorative treatment for the homepage currently — was
  removed for performance and needs a proper redesign.
- Google OAuth was discussed as a login option but not implemented or
  tracked as an issue yet.

## Next Steps

- Full visual redesign of the app in a lighter, Apple-inspired style,
  including landing page product demo videos — deferred until core
  functionality is complete.
- Wire up real search functionality on the Products page.
- Revert mock data usage back to live API calls across all pages.
- Design and implement a custom logomark (distinct from the navbar icon)
  for the login/register wordmark.
- Revisit the homepage background treatment with a performance-first
  approach.
- Evaluate adding Google OAuth as a login option.
