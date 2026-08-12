---
title: Number Picker
routeSlug: number-picker
locale: en
docs: /en/components/number-picker/implementation
designOrder: 149
developOrder: 149
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RNumberPicker } from "@ripple-design/rui"
```

## Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Sets the minimum selectable value. |
| `max` | `number` | no | Sets the maximum selectable value. |
| `step` | `number` | no | Sets the increment between selectable values. |
| `disabled` | `boolean` | no | Prevents pointer and keyboard interaction. |
| `wrap` | `boolean` | no | Cycles from the maximum value to the minimum value and vice versa. |
| `formatValue` | `(value: number) => string` | no | Formats values displayed in the wheel and announced to assistive technology. |
| `ariaLabel` | `string` | no | Provides an accessible name for the spinbutton. |
| `ariaLabelledby` | `string` | no | Identifies elements that label the spinbutton. |
| `ariaDescribedby` | `string` | no | Identifies elements that describe the spinbutton. |

Generated from `packages/rui/src/components/numberPicker/types.ts`.

<!-- AUTO-GENERATED:END -->
