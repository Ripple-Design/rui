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

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | `RIconResolvableSource` | yes | Renders the icon-only button glyph using the shared icon renderer. |
| `label` | `string` | yes | Sets the accessible name announced for the icon-only button. |
| `disabled` | `boolean` | no | Disables the icon button and all interactive feedback. |
| `type` | `RButtonType` | no | Sets the native button type when rendering a `<button>`. |
| `href` | `string` | no | Renders the icon button as a link when provided. |
| `target` | `string` | no | Sets the link target when rendering an anchor. |
| `rel` | `string` | no | Sets the link relationship when rendering an anchor. |
| `ripple` | `boolean \| RippleOptions` | no | Controls ripple behavior or disables it entirely. |
| `pressed` | `boolean` | no | Exposes a toggle state for icon-only buttons that stay pressed. |

Generated from `packages/rui/src/components/button/types.ts`.

<!-- AUTO-GENERATED:END -->
