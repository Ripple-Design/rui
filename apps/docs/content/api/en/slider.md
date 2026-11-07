---
title: Slider API
routeSlug: slider
locale: en
docs: /en/components/slider/implementation
designOrder: 148
developOrder: 148
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RSlider } from "@ripple-design/rui"
```

## Props

| Name              | Type                        | Default | Required | Description                                                                    |
| ----------------- | --------------------------- | ------- | -------- | ------------------------------------------------------------------------------ |
| `min`             | `number`                    | `0`     | no       | Sets the lowest selectable value.                                              |
| `max`             | `number`                    | `100`   | no       | Sets the highest selectable value.                                             |
| `step`            | `number`                    | `0`     | no       | Sets the increment between selectable values. Use `0` for continuous movement. |
| `disabled`        | `boolean`                   | `false` | no       | Disables pointer, keyboard, and form interaction.                              |
| `showTicks`       | `boolean`                   | `false` | no       | Displays tick marks along the slider track.                                    |
| `formatValue`     | `(value: number) => string` | —       | no       | Formats a value for the slider value indicator.                                |
| `ariaLabel`       | `string`                    | —       | no       | Sets the accessible label for a single-value slider.                           |
| `ariaLabelledby`  | `string`                    | —       | no       | References elements that label a single-value slider.                          |
| `ariaDescribedby` | `string`                    | —       | no       | References elements that describe a single-value slider.                       |
| `startAriaLabel`  | `string`                    | —       | no       | Sets the accessible label for the start thumb of a range slider.               |
| `endAriaLabel`    | `string`                    | —       | no       | Sets the accessible label for the end thumb of a range slider.                 |

## Events

| Name                | Parameters                 | Description                           |
| ------------------- | -------------------------- | ------------------------------------- |
| `change`            | `value: RSliderModelValue` | —                                     |
| `update:modelValue` | `value: RSliderModelValue` | Emitted when the model value changes. |

Generated from `../../../../../../packages/rui/src/components/input/slider/types.ts` and `../../../../../../packages/rui/src/components/input/slider/RSlider.vue`.

<!-- AUTO-GENERATED:END -->
