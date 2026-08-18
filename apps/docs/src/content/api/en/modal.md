---
title: Modal API
routeSlug: modal
locale: en
docs: /en/components/modal/spec
designOrder: 150
developOrder: 80
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RModal } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | no | Controls whether the modal is open. |
| `closeOnEscape` | `boolean` | `true` | no | Allows the Escape key / native cancel event to close the modal. |
| `closeOnBackdrop` | `boolean` | `true` | no | Allows clicking the backdrop area to close the modal. |
| `returnFocus` | `boolean` | `true` | no | Restores focus to the previously focused element after close. |
| `initialFocus` | `string \| HTMLElement` | — | no | Moves focus to a specific element after the modal opens. |
| `ariaLabel` | `string` | — | no | Sets an accessible label when no visible title is present. |
| `ariaLabelledBy` | `string` | — | no | Points to the element that labels the modal. |
| `ariaDescribedBy` | `string` | — | no | Points to the element that describes the modal. |
| `role` | `"dialog" \| "alertdialog"` | `"dialog"` | no | Controls the dialog role announced to assistive technology. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | — |
| `before-open` | — | — |
| `open` | — | — |
| `before-close` | `detail: RModalCloseDetail` | — |
| `close` | `detail: RModalCloseDetail` | — |

Generated from `../../../../../../packages/rui/src/primitives/modal/types.ts` and `../../../../../../packages/rui/src/primitives/modal/RModal.vue`.

<!-- AUTO-GENERATED:END -->
