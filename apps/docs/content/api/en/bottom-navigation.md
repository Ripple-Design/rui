---
title: Bottom navigation API
routeSlug: bottom-navigation
locale: en
docs: /en/components/bottom-navigation/spec
designOrder: 150
developOrder: 150
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RBottomNavigation } from "@ripple-design/rui"
```

## Props

| Name                    | Type                               | Default     | Required | Description                                                    |
| ----------------------- | ---------------------------------- | ----------- | -------- | -------------------------------------------------------------- |
| `modelValue`            | `unknown`                          | —           | no       | Controls the selected destination value.                       |
| `color`                 | `RBottomNavigationColor`           | `"surface"` | no       | Controls the bottom navigation surface color.                  |
| `labelVisibility`       | `RBottomNavigationLabelVisibility` | `"auto"`    | no       | Controls which destination labels are visible.                 |
| `horizontalTranslation` | `boolean`                          | `false`     | no       | Enables M2 shifting item widths when labels are selected-only. |

## Events

| Name                | Parameters       | Description                           |
| ------------------- | ---------------- | ------------------------------------- |
| `update:modelValue` | `value: unknown` | Emitted when the model value changes. |

Generated from `../../../../../../packages/rui/src/components/navigation/bottomNavigation/types.ts` and `../../../../../../packages/rui/src/components/navigation/bottomNavigation/RBottomNavigation.vue`.

<!-- AUTO-GENERATED:END -->
