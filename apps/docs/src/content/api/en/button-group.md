---
title: Button group API
routeSlug: button-group
locale: en
docs: /en/components/button-group/spec
designOrder: 141
developOrder: 71
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RButtonGroup } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `RButtonGroupVariant` | `"outlined"` | no | Applies a shared button variant to grouped `RButton` children that do not set their own variant. |
| `fullWidth` | `boolean` | `false` | no | Expands the group to fill the available inline size and evenly distribute child buttons. |
| `disabled` | `boolean` | `false` | no | Disables every button in the group. |
| `selection` | `RButtonGroupSelection` | — | no | Enables single or multiple selection behavior for grouped buttons. |
| `required` | `boolean` | — | no | Prevents the selection from becoming empty while selection mode is enabled. |
| `modelValue` | `RButtonGroupModelValue` | — | no | Controls the selected value or values when selection mode is enabled. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: RButtonGroupModelValue` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/button/types.ts` and `packages/rui/src/components/button/RButtonGroup.vue`.

<!-- AUTO-GENERATED:END -->
