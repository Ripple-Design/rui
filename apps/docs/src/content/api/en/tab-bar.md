---
title: Tab API
routeSlug: tab
locale: en
docs: /en/components/tab/spec
designOrder: 142
developOrder: 72
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RTabBar } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `RTabBarVariant` | `"secondary"` | no | Applies the primary or secondary tab bar treatment. |
| `fullWidth` | `boolean` | `false` | no | Expands the tab bar to fill the available inline size and evenly distribute child tabs. |
| `iconLayout` | `RTabIconLayout` | `"vertical"` | no | Controls the default icon and label layout inherited by child `RTab` items. |
| `color` | `RTabBarColor` | `"primary"` | no | Controls the semantic tab-bar color treatment. |
| `divider` | `boolean` | `true` | no | Controls whether the bottom divider is rendered. |
| `scrollable` | `boolean` | `false` | no | — |
| `modelValue` | `unknown` | — | no | Controls the selected tab value. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/tab/types.ts` and `packages/rui/src/components/tab/RTabBar.vue`.

<!-- AUTO-GENERATED:END -->
