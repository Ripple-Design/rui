---
title: Navigation rail API
routeSlug: navigation-rail
locale: en
docs: /en/components/navigation-rail/spec
designOrder: 160
developOrder: 160
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RNavigationRail } from "@ripple-design/rui"
```

## Props

| Name              | Type                             | Default    | Required | Description                                        |
| ----------------- | -------------------------------- | ---------- | -------- | -------------------------------------------------- |
| `modelValue`      | `unknown`                        | —          | no       | Controls the selected destination value.           |
| `compact`         | `boolean`                        | `false`    | no       | Controls whether the rail uses compact 56px cells. |
| `labelVisibility` | `RNavigationRailLabelVisibility` | `"always"` | no       | Controls when destination labels are shown.        |

## Events

| Name                | Parameters       | Description                           |
| ------------------- | ---------------- | ------------------------------------- |
| `update:modelValue` | `value: unknown` | Emitted when the model value changes. |

Generated from `../../../../../../packages/rui/src/components/navigation/navigationRail/types.ts` and `../../../../../../packages/rui/src/components/navigation/navigationRail/RNavigationRail.vue`.

<!-- AUTO-GENERATED:END -->
