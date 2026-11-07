---
title: Icon button API
routeSlug: icon-button
locale: en
docs: /en/components/icon-button/spec
designOrder: 142
developOrder: 72
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RIconButton } from "@ripple-design/rui"
```

## Props

| Name          | Type                       | Default    | Required | Description                                                        |
| ------------- | -------------------------- | ---------- | -------- | ------------------------------------------------------------------ |
| `icon`        | `RIconResolvableSource`    | —          | yes      | Renders the icon-only button glyph using the shared icon renderer. |
| `activeIcon`  | `RIconResolvableSource`    | —          | no       | Renders the icon-only button glyph while the button is active.     |
| `label`       | `string`                   | —          | yes      | Sets the accessible name announced for the icon-only button.       |
| `activeLabel` | `string`                   | —          | no       | Sets the accessible name announced while the button is active.     |
| `emphasis`    | `RTextEmphasis`            | `"medium"` | no       | Controls the icon foreground emphasis level.                       |
| `disabled`    | `boolean`                  | `false`    | no       | Disables the icon button and all interactive feedback.             |
| `type`        | `RButtonType`              | `"button"` | no       | Sets the native button type when rendering a `<button>`.           |
| `href`        | `string`                   | —          | no       | Renders the icon button as a link when provided.                   |
| `target`      | `string`                   | —          | no       | Sets the link target when rendering an anchor.                     |
| `rel`         | `string`                   | —          | no       | Sets the link relationship when rendering an anchor.               |
| `ripple`      | `boolean \| RippleOptions` | `true`     | no       | Controls ripple behavior or disables it entirely.                  |

## Events

| Name                | Parameters          | Description                           |
| ------------------- | ------------------- | ------------------------------------- |
| `update:modelValue` | `value: boolean`    | Emitted when the model value changes. |
| `click`             | `value: MouseEvent` | —                                     |

Generated from `../../../../../../packages/rui/src/components/actions/button/types.ts` and `../../../../../../packages/rui/src/components/actions/button/RIconButton.vue`.

<!-- AUTO-GENERATED:END -->
