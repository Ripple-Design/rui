---
title: Modal side sheet API
routeSlug: modal-side-sheet
locale: en
docs: /en/components/modal-side-sheet/spec
designOrder: 157
developOrder: 92
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RModalSideSheet } from "@ripple-design/rui"
```

## Props

| Name        | Type             | Default   | Required | Description                                                     |
| ----------- | ---------------- | --------- | -------- | --------------------------------------------------------------- |
| `title`     | `string`         | —         | no       | Sets a plain-text title when the title slot is not used.        |
| `side`      | `RSideSheetSide` | `"end"`   | no       | Attaches the sheet to the inline start or end edge.             |
| `elevation` | `number`         | —         | no       | Controls the surface elevation.                                 |
| `width`     | `string`         | `"320px"` | no       | Controls the sheet width using any valid CSS inline-size value. |

## Events

| Name                | Parameters                  | Description |
| ------------------- | --------------------------- | ----------- |
| `update:modelValue` | `value: boolean`            | —           |
| `before-open`       | —                           | —           |
| `open`              | —                           | —           |
| `before-close`      | `detail: RModalCloseDetail` | —           |
| `close`             | `detail: RModalCloseDetail` | —           |

Generated from `../../../../../../packages/rui/src/components/overlays/sideSheet/types.ts` and `../../../../../../packages/rui/src/components/overlays/sideSheet/RModalSideSheet.vue`.

<!-- AUTO-GENERATED:END -->
