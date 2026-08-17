---
title: Chip group API
routeSlug: chip-group
locale: en
docs: /en/components/chip/spec
designOrder: 143
developOrder: 73
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RChipGroup } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `RChipVariant` | — | no | Controls the visual treatment for child chips. |
| `type` | `RChipType` | — | no | Controls the chip family and interaction behavior for child chips. |
| `selection` | `RChipGroupSelection` | — | no | Enables single or multiple selection behavior for child chips. |
| `name` | `string` | — | no | Binds this selection group to an RForm field path. |
| `required` | `boolean` | — | no | Prevents a selectable group from becoming empty. |
| `wrap` | `boolean` | `true` | no | Allows chips to wrap onto additional rows. |
| `modelValue` | `RChipGroupModelValue` | — | no | Controls the selected value or values when selection is enabled. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: RChipGroupModelValue` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/chip/types.ts` and `packages/rui/src/components/chip/RChipGroup.vue`.

<!-- AUTO-GENERATED:END -->
