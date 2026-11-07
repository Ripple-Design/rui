---
title: Grid
docSlug: components/grid
tab: guidelines
locale: en
designOrder: 30
developOrder: 30
api: /en/api/grid
---

## Usage

Use Grid when content needs two-dimensional layout across both rows and columns.

### Good fits

- Card collections
- Dashboard sections
- Form groups with multiple columns
- Responsive layouts using `minmax()` or `auto-fit`

### Prefer simpler layout when possible

If content only needs a single axis, prefer a simpler flow or flex-based arrangement over Grid.

### Responsive behavior

Start with mobile-first track definitions. For equal columns, numeric `cols` is usually enough. For more adaptive layouts, pass a native CSS Grid template string such as `repeat(auto-fit, minmax(12rem, 1fr))`.
