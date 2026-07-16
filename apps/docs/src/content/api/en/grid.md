---
title: Grid API
routeSlug: grid
locale: en
docs: /en/components/grid/spec
designOrder: 110
developOrder: 30
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RGrid } from "@ripple-design/rui"
```

## Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `cols` | `number \| string` | no | Defines the grid columns. Numbers become `repeat(n, 1fr)`, while strings pass through as native CSS Grid templates. |
| `gap` | `CSSProperties["gap"]` | no | Sets both row and column gaps between grid items. |
| `columnGap` | `CSSProperties["columnGap"]` | no | Sets the horizontal gap between grid items. |
| `rowGap` | `CSSProperties["rowGap"]` | no | Sets the vertical gap between grid items. |
| `alignItems` | `CSSProperties["alignItems"]` | no | Controls how grid items align within their grid areas on the block axis. |
| `justifyItems` | `CSSProperties["justifyItems"]` | no | Controls how grid items align within their grid areas on the inline axis. |
| `alignContent` | `CSSProperties["alignContent"]` | no | Controls how grid tracks align within the container on the block axis. |
| `justifyContent` | `CSSProperties["justifyContent"]` | no | Controls how grid tracks align within the container on the inline axis. |
| `autoFlow` | `CSSProperties["gridAutoFlow"]` | no | Controls the automatic placement algorithm for grid items. |
| `dense` | `boolean` | no | Appends `dense` to the automatic placement mode so the browser can backfill gaps. |

Generated from `packages/rui/src/components/grid/types.ts`.

<!-- AUTO-GENERATED:END -->
