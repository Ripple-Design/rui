---
title: Navigation drawer API
routeSlug: navigation-drawer
locale: en
docs: /en/components/navigation-drawer/spec
designOrder: 150
developOrder: 150
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RNavigationDrawer } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `unknown` | — | no | Controls the selected destination value. |
| `title` | `string` | — | no | Sets a plain-text title when the title slot is not used. |
| `side` | `RNavigationDrawerSide` | `"start"` | no | Attaches the drawer to the inline start or end edge. |
| `width` | `string` | `"280px"` | no | Controls the drawer width using any valid CSS inline-size value. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/navigationDrawer/types.ts` and `packages/rui/src/components/navigationDrawer/RNavigationDrawer.vue`.

<!-- AUTO-GENERATED:END -->
