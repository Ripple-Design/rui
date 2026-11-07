---
title: Dialog API
routeSlug: dialog
locale: en
docs: /en/components/dialog/spec
designOrder: 155
developOrder: 90
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RDialog } from "@ripple-design/rui"
```

## Props

| Name      | Type               | Default  | Required | Description                                                                                                    |
| --------- | ------------------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `width`   | `number \| "auto"` | `"auto"` | no       | Sets the dialog width as a 56dp multiplier, or automatically selects a width increment that fits the viewport. |
| `height`  | `number \| "auto"` | `"auto"` | no       | Sets the dialog height as a 56dp multiplier, or lets content determine the height.                             |
| `message` | `string`           | —        | no       | Sets a plain-text message when the message slot is not used.                                                   |
| `title`   | `string`           | —        | no       | Sets a plain-text title when the title slot is not used.                                                       |

## Events

| Name                | Parameters                                                                                  | Description |
| ------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| `update:modelValue` | `value: boolean`                                                                            | —           |
| `before-open`       | —                                                                                           | —           |
| `open`              | —                                                                                           | —           |
| `before-close`      | `detail: { reason: "cancel" \| "backdrop" \| "action" \| "programmatic"; action?: string }` | —           |
| `close`             | `detail: { reason: "cancel" \| "backdrop" \| "action" \| "programmatic"; action?: string }` | —           |

Generated from `../../../../../../packages/rui/src/components/overlays/dialog/types.ts` and `../../../../../../packages/rui/src/components/overlays/dialog/RDialog.vue`.

<!-- AUTO-GENERATED:END -->
