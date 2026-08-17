---
title: FAB
routeSlug: fab
locale: en
docs: /en/components/fab/spec
designOrder: 143
developOrder: 73
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RFab } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `RFabVariant` | `"standard"` | no | Selects the circular standard or pill-shaped extended FAB. |
| `size` | `RFabSize` | `"normal"` | no | Sets the standard FAB size; `auto` uses mini below the Material 470px viewport threshold. |
| `icon` | `RIconResolvableSource` | — | no | Renders the FAB icon. Required for standard and collapsed extended FABs. |
| `label` | `string` | — | no | Sets the accessible name when the action has no visible text label. |
| `visible` | `boolean` | `true` | no | Shows or hides the FAB with the Material motion specification. |
| `extended` | `boolean` | `true` | no | Expands or collapses an extended FAB. |
| `disabled` | `boolean` | `false` | no | Disables the FAB and all interactive feedback. |
| `type` | `RButtonType` | `"button"` | no | Sets the native button type when rendering a `<button>`. |
| `href` | `string` | — | no | Renders the FAB as a link when provided. |
| `target` | `string` | — | no | Sets the link target when rendering an anchor. |
| `rel` | `string` | — | no | Sets the link relationship when rendering an anchor. |
| `ripple` | `boolean \| RippleOptions` | `true` | no | Controls ripple behavior or disables it entirely. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `expanded` | — | — |
| `collapsed` | — | — |

Generated from `packages/rui/src/components/button/types.ts` and `packages/rui/src/components/button/RFab.vue`.

<!-- AUTO-GENERATED:END -->
