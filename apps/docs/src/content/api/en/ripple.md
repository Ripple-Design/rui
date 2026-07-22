---
title: Ripple API
routeSlug: ripple
locale: en
docs: /en/components/ripple/spec
designOrder: 160
developOrder: 60
---

## Import

```ts
import { vRipple } from "@ripple-design/rui"
```

## Binding

```ts
type RippleOptions = {
  disabled?: boolean
  unbounded?: boolean
  color?: string | null
  contrast?: "low" | "high"
}
```

- `v-ripple` enables bounded pointer-origin ripple
- use `v-ripple="{ disabled: true }"` to disable the effect
- keyboard-triggered ripples launch from the center automatically
- `v-ripple.unbounded` allows the ripple to extend beyond the host bounds
- `contrast` defaults to `"low"`; use `"high"` for ripple drawn on top of filled / high-emphasis backgrounds
- `:focus-visible` applies a focus state layer using `--rui-ripple-focus-opacity`
