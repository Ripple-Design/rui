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

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `min` | `number` | `0` | no | — |
| `max` | `number` | `100` | no | — |
| `step` | `number` | `0` | no | — |
| `disabled` | `boolean` | `false` | no | — |
| `showTicks` | `boolean` | `false` | no | — |
| `formatValue` | `(value: number) => string` | — | no | — |
| `ariaLabel` | `string` | — | no | — |
| `ariaLabelledby` | `string` | — | no | — |
| `ariaDescribedby` | `string` | — | no | — |
| `startAriaLabel` | `string` | — | no | — |
| `endAriaLabel` | `string` | — | no | — |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `change` | `value: RSliderModelValue` | — |
| `update:modelValue` | `value: RSliderModelValue` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/slider/types.ts` and `packages/rui/src/components/slider/RSlider.vue`.

<!-- AUTO-GENERATED:END -->
