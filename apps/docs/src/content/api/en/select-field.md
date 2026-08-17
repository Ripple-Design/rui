---
title: Select Field API
routeSlug: select-field
locale: en
docs: /en/components/select-field/spec
designOrder: 101
developOrder: 21
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RSelectField } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | no | Sets the visible field label. |
| `placeholder` | `string` | — | no | Sets the text shown when no option is selected. |
| `disabled` | `boolean` | `false` | no | Prevents opening and selecting options. |
| `filterable` | `boolean` | `false` | no | — |
| `align` | `"start" \| "end"` | `"start"` | no | Aligns the popup to the logical inline start or end. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | Emitted when the model value changes. |

Generated from `packages/rui/src/components/selectField/types.ts` and `packages/rui/src/components/selectField/RSelectField.vue`.

<!-- AUTO-GENERATED:END -->
