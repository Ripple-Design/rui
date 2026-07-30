---
title: Grid
docSlug: components/grid
tab: spec
locale: en
designOrder: 30
developOrder: 30
api: /en/api/grid
---

## Structure

Grid is a layout primitive for arranging direct children in rows and columns.

A numeric `cols` value creates equal-width tracks using `repeat(n, minmax(0, 1fr))`.
A string `cols` value passes through native CSS Grid templates for more advanced layouts.
Grid item span directives also accept container-responsive objects such as `{ csm: 1, clg: 2 }` to change span placement across shared container breakpoints.
