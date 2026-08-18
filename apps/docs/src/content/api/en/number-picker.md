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

| Name              | Type                        | Default | Required | Description                                                                  |
| ----------------- | --------------------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `min`             | `number`                    | —       | yes      | Sets the minimum selectable value.                                           |
| `max`             | `number`                    | —       | yes      | Sets the maximum selectable value.                                           |
| `step`            | `number`                    | `1`     | no       | Sets the increment between selectable values.                                |
| `disabled`        | `boolean`                   | `false` | no       | Prevents pointer and keyboard interaction.                                   |
| `wrap`            | `boolean`                   | `true`  | no       | Cycles from the maximum value to the minimum value and vice versa.           |
| `formatValue`     | `(value: number) => string` | —       | no       | Formats values displayed in the wheel and announced to assistive technology. |
| `ariaLabel`       | `string`                    | —       | no       | Provides an accessible name for the spinbutton.                              |
| `ariaLabelledby`  | `string`                    | —       | no       | Identifies elements that label the spinbutton.                               |
| `ariaDescribedby` | `string`                    | —       | no       | Identifies elements that describe the spinbutton.                            |

## Events

| Name                | Parameters      | Description                           |
| ------------------- | --------------- | ------------------------------------- |
| `change`            | `value: number` | —                                     |
| `update:modelValue` | `value: number` | Emitted when the model value changes. |

Generated from `../../../../../../packages/rui/src/components/input/numberPicker/types.ts` and `../../../../../../packages/rui/src/components/input/numberPicker/RNumberPicker.vue`.

<!-- AUTO-GENERATED:END -->
