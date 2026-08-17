---
title: Form API
routeSlug: form
locale: en
docs: /en/components/form/implementation
designOrder: 154
developOrder: 154
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RForm } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `form` | `RFormController<TValues>` | — | yes | Form controller returned from . |
| `requiredIndicator` | `RFormRequiredIndicator` | — | no | Controls how required or optional fields are marked by future field adapters. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `invalidSubmit` | `event: RFormInvalidSubmitEvent<TValues>` | — |
| `submit` | `event: RFormSubmitEvent<TValues>` | — |

Generated from `packages/rui/src/components/form/types.ts` and `packages/rui/src/components/form/RForm.vue`.

<!-- AUTO-GENERATED:END -->
