---
title: Chip
routeSlug: chip
locale: en
docs: /en/components/chip/spec
designOrder: 143
developOrder: 73
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RChip } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `RChipVariant` | — | no | Controls the visual chip treatment. |
| `value` | `unknown` | — | no | Identifies the chip inside a selectable `RChipGroup`. |
| `disabled` | `boolean` | `false` | no | Disables the primary and remove actions. |
| `type` | `RChipType` | — | no | Controls the Material chip family and its interaction behavior. |
| `icon` | `RIconResolvableSource` | — | no | Renders a leading icon using the shared icon renderer. |
| `endIcon` | `RIconResolvableSource` | — | no | Renders a trailing icon using the shared icon renderer. |
| `removable` | `boolean` | `false` | no | Shows a separate trailing remove button. |
| `removeIcon` | `RIconResolvableSource` | — | no | Overrides the default trailing remove icon. |
| `removeLabel` | `string` | `"Remove"` | no | Sets the accessible name announced for the remove button. |
| `ripple` | `boolean \| RippleOptions` | `true` | no | Controls ripple behavior or disables it entirely. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `remove` | `event: MouseEvent` | — |
| `update:modelValue` | `value: boolean` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/chip/types.ts` and `packages/rui/src/components/chip/RChip.vue`.

<!-- AUTO-GENERATED:END -->
