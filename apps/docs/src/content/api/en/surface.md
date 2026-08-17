---
title: Surface API
routeSlug: surface
locale: en
docs: /en/components/surface/spec
designOrder: 125
developOrder: 45
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RSurface } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"elevated" \| "outlined"` | `"elevated"` | no | Controls the surface treatment. |
| `elevation` | `number` | — | no | Chooses the shadow and stacking level for elevated surfaces. Supports 0 through 24. |
| `as` | `string` | `"div"` | no | Chooses which HTML element the surface should render as. |
| `color` | `RSurfaceColor` | `"surface"` | no | Chooses the semantic container background color. |
| `contentColor` | `string` | — | no | Overrides the inherited content color; emphasized descendants continue using the semantic color emphasis tokens. |

## CSS Variables

| Name | Default | Description |
| --- | --- | --- |
| `--rui-comp-surface-background` | `var(--rui-sys-color-surface)` | Surface background color. |
| `--rui-comp-surface-content-color` | `var(--rui-sys-color-on-surface)` | Default content color. The contentColor prop overrides this value. |
| `--rui-comp-surface-content-color-high` | `var(--rui-sys-color-on-surface-high)` | High-emphasis content color. |
| `--rui-comp-surface-content-color-medium` | `var(--rui-sys-color-on-surface-medium)` | Medium-emphasis content color. |
| `--rui-comp-surface-content-color-low` | `var(--rui-sys-color-on-surface-low)` | Low-emphasis content color. |
| `--rui-comp-surface-outline-color` | `var(--rui-sys-color-on-surface-outline)` | Outline color used by the outlined variant. |

Generated from `packages/rui/src/components/surface/types.ts` and `packages/rui/src/components/surface/RSurface.vue`.

<!-- AUTO-GENERATED:END -->
