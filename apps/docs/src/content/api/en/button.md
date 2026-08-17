---
title: Button API
routeSlug: button
locale: en
docs: /en/components/button/spec
designOrder: 140
developOrder: 70
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RButton } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `RButtonVariant` | — | no | Controls the button’s visual treatment. |
| `disabled` | `boolean` | `false` | no | Disables the button and all interactive feedback. |
| `fullWidth` | `boolean` | `false` | no | Expands the button to fill the available inline size. |
| `fullHeight` | `boolean` | — | no | Expands the button to fill the available block size. |
| `sentenceCase` | `boolean` | `false` | no | Allows the label to remain in sentence case instead of uppercase. |
| `type` | `RButtonType` | `"button"` | no | Sets the native button type when rendering a `<button>`. |
| `href` | `string` | — | no | Renders the button as a link when provided. |
| `target` | `string` | — | no | Sets the link target when rendering an anchor. |
| `rel` | `string` | — | no | Sets the link relationship when rendering an anchor. |
| `value` | `unknown` | — | no | Identifies the button inside a selectable `RButtonGroup`. |
| `icon` | `RIconResolvableSource` | — | no | Renders a leading icon using the shared icon renderer. |
| `endIcon` | `RIconResolvableSource` | — | no | Renders a trailing icon using the shared icon renderer. |
| `topIcon` | `RIconResolvableSource` | — | no | Renders a top icon using the shared icon renderer. |
| `ripple` | `boolean \| RippleOptions` | `true` | no | Controls ripple behavior or disables it entirely. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `click` | `value: MouseEvent` | — |

Generated from `packages/rui/src/components/button/types.ts` and `packages/rui/src/components/button/RButton.vue`.

<!-- AUTO-GENERATED:END -->
